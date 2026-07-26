from rest_framework import permissions, viewsets

from common.permissions import IsCounselorOrAdmin

from .models import Story
from .serializers import StorySerializer


class StoryViewSet(viewsets.ModelViewSet):
    serializer_class = StorySerializer
    filterset_fields = ['region', 'career_path', 'consent_status']

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [IsCounselorOrAdmin()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and getattr(user, 'role', None) in ('counselor', 'admin'):
            return Story.objects.all().order_by('title')
        return Story.objects.filter(consent_status=Story.ConsentStatus.GRANTED).order_by('title')
