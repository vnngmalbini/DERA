from rest_framework import permissions, viewsets
from rest_framework.exceptions import PermissionDenied

from common.permissions import IsAdminOrReadOnly

from .models import CareerMatch, CareerPath, QuizResponse, Scholarship
from .serializers import (
    CareerMatchSerializer,
    CareerPathSerializer,
    QuizResponseSerializer,
    ScholarshipSerializer,
)


class CareerPathViewSet(viewsets.ModelViewSet):
    queryset = CareerPath.objects.all().order_by('title')
    serializer_class = CareerPathSerializer
    permission_classes = [IsAdminOrReadOnly]


class ScholarshipViewSet(viewsets.ModelViewSet):
    queryset = Scholarship.objects.all().order_by('deadline')
    serializer_class = ScholarshipSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['education_level', 'career_path']


class QuizResponseViewSet(viewsets.ModelViewSet):
    serializer_class = QuizResponseSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        if user.role in ('counselor', 'admin'):
            return QuizResponse.objects.all().order_by('-submitted_at')
        youth_profile = getattr(user, 'youth_profile', None)
        if youth_profile is None:
            return QuizResponse.objects.none()
        return QuizResponse.objects.filter(youth=youth_profile).order_by('-submitted_at')

    def perform_create(self, serializer):
        youth_profile = getattr(self.request.user, 'youth_profile', None)
        if youth_profile is None:
            raise PermissionDenied('Only youth accounts can submit the career quiz.')
        serializer.save(youth=youth_profile)


class CareerMatchViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CareerMatchSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['quiz_response', 'career_path']

    def get_queryset(self):
        user = self.request.user
        if user.role in ('counselor', 'admin'):
            return CareerMatch.objects.all()
        youth_profile = getattr(user, 'youth_profile', None)
        if youth_profile is None:
            return CareerMatch.objects.none()
        return CareerMatch.objects.filter(quiz_response__youth=youth_profile)
