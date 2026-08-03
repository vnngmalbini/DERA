import uuid
from decimal import Decimal, InvalidOperation

import requests
from django.conf import settings
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db.models import Count, OuterRef, Subquery, Sum
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import APIException, NotFound, ValidationError
from rest_framework.response import Response

from common.permissions import IsAdmin, IsAdminOrReadOnly

from .models import Donation, ImpactReport, Project
from .serializers import DonationSerializer, ImpactReportSerializer, ProjectSerializer

PAYSTACK_VERIFY_URL = 'https://api.paystack.co/transaction/verify/{reference}'


class PaystackUnavailable(APIException):
    status_code = 502
    default_detail = 'Could not reach Paystack right now. Please try again in a moment.'
    default_code = 'paystack_unavailable'


class DonationViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    """Public donation intake, wired to Paystack.

    `create` starts a pending Donation and hands back a reference + the
    Paystack public key for the frontend's inline checkout. `verify` is the
    server-side source of truth: it re-checks the transaction directly with
    Paystack using the secret key rather than trusting the client-side
    checkout callback alone.
    """

    serializer_class = DonationSerializer

    def get_permissions(self):
        if self.action in ('create', 'verify'):
            return [permissions.AllowAny()]
        if self.action in ('list', 'retrieve'):
            return [permissions.IsAuthenticated()]
        return [IsAdmin()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Donation.objects.none()
        base = Donation.objects.select_related('project')
        if user.role == 'admin':
            return base.all()
        donor_profile = getattr(user, 'donor_profile', None)
        if donor_profile is None:
            return Donation.objects.none()
        return base.filter(donor=donor_profile)

    def create(self, request, *args, **kwargs):
        donor_email = str(request.data.get('donor_email', '')).strip()
        donor_name = str(request.data.get('donor_name', '')).strip()

        if not donor_email:
            raise ValidationError({'donor_email': 'This field is required.'})

        try:
            amount = Decimal(str(request.data.get('amount', '')))
        except InvalidOperation:
            raise ValidationError({'amount': 'Enter a valid amount.'})
        if amount <= 0:
            raise ValidationError({'amount': 'Amount must be greater than zero.'})

        donor_profile = None
        if request.user.is_authenticated:
            donor_profile = getattr(request.user, 'donor_profile', None)

        project = None
        project_id = request.data.get('project')
        if project_id:
            try:
                project = Project.objects.get(id=project_id)
            except (Project.DoesNotExist, ValueError, DjangoValidationError):
                raise ValidationError({'project': 'Unknown project.'})

        donation = Donation.objects.create(
            donor=donor_profile,
            project=project,
            donor_name=donor_name or None,
            donor_email=donor_email,
            amount=amount,
            reference=f'DERA-{uuid.uuid4().hex[:20].upper()}',
        )
        data = self.get_serializer(donation).data
        data['public_key'] = settings.PAYSTACK_PUBLIC_KEY
        return Response(data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='(?P<reference>[^/.]+)/verify')
    def verify(self, request, reference=None):
        try:
            donation = Donation.objects.get(reference=reference)
        except Donation.DoesNotExist:
            raise NotFound('Unknown donation reference.')

        if donation.status != Donation.Status.SUCCESS:
            try:
                response = requests.get(
                    PAYSTACK_VERIFY_URL.format(reference=reference),
                    headers={'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}'},
                    timeout=15,
                )
                payload = response.json()
            except (requests.RequestException, ValueError) as exc:
                raise PaystackUnavailable() from exc

            transaction = payload.get('data') or {}
            if payload.get('status') and transaction.get('status') == 'success':
                donation.status = Donation.Status.SUCCESS
                donation.paid_at = timezone.now()
                # Paystack reports amount in the smallest currency unit (pesewas for GHS).
                donation.amount = Decimal(transaction.get('amount', 0)) / 100
                donation.save(update_fields=['status', 'paid_at', 'amount'])
            else:
                donation.status = Donation.Status.FAILED
                donation.save(update_fields=['status'])

        return Response(self.get_serializer(donation).data)


def _successful_donations_for(project_ref):
    return Donation.objects.filter(project=project_ref, status=Donation.Status.SUCCESS)


class ProjectViewSet(viewsets.ModelViewSet):
    """`raised_amount`/`donor_count` are annotated here via correlated
    subqueries — each is its own single-value query per project computed by
    the database, not a Python-level loop — so listing N projects costs a
    handful of queries total instead of 1 + 2N (ProjectSerializer previously
    ran a Sum and a distinct Count per project on every request).

    Plain `.annotate(Sum(...), Count(..., distinct=True))` in one call was
    deliberately avoided: combining two aggregates over the same joined
    `donations` table in a single annotate() causes join fan-out, silently
    inflating one of the two results — these stay real donor money, so
    correctness here isn't optional.
    """

    serializer_class = ProjectSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['status', 'region']

    def get_queryset(self):
        raised_subquery = (
            _successful_donations_for(OuterRef('pk')).values('project').annotate(total=Sum('amount')).values('total')
        )
        donor_count_subquery = (
            _successful_donations_for(OuterRef('pk'))
            .values('project')
            .annotate(count=Count('donor_email', distinct=True))
            .values('count')
        )
        return Project.objects.annotate(
            raised_amount_agg=Coalesce(Subquery(raised_subquery), Decimal('0')),
            donor_count_agg=Coalesce(Subquery(donor_count_subquery), 0),
        ).order_by('title')


class ImpactReportViewSet(viewsets.ModelViewSet):
    queryset = ImpactReport.objects.select_related('project').order_by('-published_at')
    serializer_class = ImpactReportSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['project']
