from rest_framework import permissions, viewsets

from common.permissions import IsAdminOrReadOnly, IsCounselorOrAdmin

from .models import EscalationContact, HelpRequest
from .serializers import EscalationContactSerializer, HelpRequestSerializer


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
