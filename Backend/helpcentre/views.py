from django.conf import settings
from django.core.mail import send_mail
from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import APIException, ValidationError
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from common.permissions import IsAdminOrReadOnly, IsCounselorOrAdmin

from .ai_auntie import AuntieServiceError, get_auntie_reply
from .models import ContactMessage, EscalationContact, HelpRequest
from .serializers import ContactMessageSerializer, EscalationContactSerializer, HelpRequestSerializer


class AuntieUnavailable(APIException):
    status_code = 503
    default_detail = 'Auntie DERA is temporarily unavailable. Please try again in a moment.'
    default_code = 'auntie_unavailable'


class AuntieChatView(APIView):
    """Anonymous, stateless chat with Auntie DERA (SRS NFR-2.3: no identity attached or stored).

    The conversation lives entirely in the frontend's memory; each request sends the prior
    turns as `history` for context and nothing is persisted server-side.
    """

    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auntie_chat'

    def post(self, request, *args, **kwargs):
        message = str(request.data.get('message', '')).strip()
        if not message:
            raise ValidationError({'message': 'This field is required.'})

        history = request.data.get('history') or []
        if not isinstance(history, list):
            raise ValidationError({'history': 'Must be a list.'})

        try:
            reply = get_auntie_reply(history, message)
        except AuntieServiceError as exc:
            raise AuntieUnavailable() from exc

        return Response({'reply': reply}, status=status.HTTP_200_OK)


class EscalationContactViewSet(viewsets.ModelViewSet):
    queryset = EscalationContact.objects.all().order_by('name')
    serializer_class = EscalationContactSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['type']


class HelpRequestViewSet(viewsets.ModelViewSet):
    """Anonymous by design (SRS NFR-2.3): anyone can submit a request with
    no authentication and no identity ever recorded; only counselor/admin
    staff can list, read, or triage submitted requests.
    """

    queryset = HelpRequest.objects.all().order_by('-submitted_at')
    serializer_class = HelpRequestSerializer
    filterset_fields = ['category', 'escalation_contact']

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [IsCounselorOrAdmin()]


class ContactMessageViewSet(viewsets.ModelViewSet):
    """Public "Contact Us" submissions. Anyone can submit one; only staff
    can read the list back (the sender isn't shown any of it again).
    """

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'contact_message'

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [IsCounselorOrAdmin()]

    def perform_create(self, serializer):
        message = serializer.save()
        send_mail(
            subject=f'New DERA contact message from {message.name}',
            message=f'From: {message.name} <{message.email}>\n\n{message.message}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_TEAM_EMAIL],
            fail_silently=True,
        )
