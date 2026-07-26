import uuid

from django.utils import timezone
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from common.permissions import IsAdmin, IsAdminOrReadOnly, IsOwnerDonorOrAdmin, IsOwnerYouthOrAdmin

from .models import ApplicationForm, FormOrder, Payment, Sponsorship
from .serializers import (
    ApplicationFormSerializer,
    FormOrderSerializer,
    PaymentSerializer,
    SponsorshipSerializer,
)


class ApplicationFormViewSet(viewsets.ModelViewSet):
    queryset = ApplicationForm.objects.all().order_by('title')
    serializer_class = ApplicationFormSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['institution']


class FormOrderViewSet(viewsets.ModelViewSet):
    serializer_class = FormOrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerYouthOrAdmin]
    filterset_fields = ['status', 'order_type', 'form']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return FormOrder.objects.all().order_by('-created_at')
        youth_profile = getattr(user, 'youth_profile', None)
        if youth_profile is None:
            return FormOrder.objects.none()
        return FormOrder.objects.filter(youth=youth_profile).order_by('-created_at')

    def perform_create(self, serializer):
        youth_profile = getattr(self.request.user, 'youth_profile', None)
        if youth_profile is None:
            raise PermissionDenied('Only youth accounts can place form orders.')
        serializer.save(youth=youth_profile)

    @action(detail=True, methods=['post'], url_path='simulate-payment')
    def simulate_payment(self, request, pk=None):
        """Stands in for a real MTN MoMo webhook/callback until real
        merchant credentials are available. Only reachable by the order's
        owner or an admin (same permission_classes as the rest of this
        viewset), keeping direct Payment writes admin-only everywhere else.
        """
        order = self.get_object()
        if order.order_type != FormOrder.OrderType.DIRECT_PURCHASE:
            return Response(
                {'detail': 'Only direct-purchase orders can be paid.'}, status=400
            )
        payment, _ = Payment.objects.update_or_create(
            order=order,
            defaults={
                'momo_reference': f'SIM-{uuid.uuid4().hex[:12].upper()}',
                'amount': order.form.price_ghs,
                'status': Payment.Status.SUCCESS,
                'paid_at': timezone.now(),
            },
        )
        order.status = FormOrder.Status.PAID
        order.save(update_fields=['status'])
        return Response(FormOrderSerializer(order).data)


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    filterset_fields = ['status', 'order']

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        return [IsAdmin()]

    def get_queryset(self):
        # Scoping happens entirely here (not via object-level permission
        # checks): Payment has no direct `youth` field to check against
        # (only via `order.youth`), so a non-owner's payment is excluded
        # from the queryset and yields a 404 rather than a 403 on retrieve.
        user = self.request.user
        if not user.is_authenticated:
            return Payment.objects.none()
        if user.role == 'admin':
            return Payment.objects.all().order_by('-paid_at')
        youth_profile = getattr(user, 'youth_profile', None)
        if youth_profile is None:
            return Payment.objects.none()
        return Payment.objects.filter(order__youth=youth_profile).order_by('-paid_at')


class SponsorshipViewSet(viewsets.ModelViewSet):
    serializer_class = SponsorshipSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerDonorOrAdmin]
    filterset_fields = ['order', 'donor']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Sponsorship.objects.all().order_by('-funded_at')
        donor_profile = getattr(user, 'donor_profile', None)
        if donor_profile is None:
            return Sponsorship.objects.none()
        return Sponsorship.objects.filter(donor=donor_profile).order_by('-funded_at')

    def perform_create(self, serializer):
        donor_profile = getattr(self.request.user, 'donor_profile', None)
        if donor_profile is None:
            raise PermissionDenied('Only donor accounts can create sponsorships.')
        serializer.save(donor=donor_profile)
