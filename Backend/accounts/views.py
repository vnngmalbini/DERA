from django.contrib import messages
from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from common.permissions import (
    IsAdmin,
    IsAdminOrReadOnly,
    IsAuthenticatedCreateOrAdminWrite,
    IsCounselorOrAdmin,
    IsSelfProfileOrCounselorOrAdmin,
)

from .models import CounselorProfile, District, DonorProfile, Institution, Notification, User, YouthProfile
from .serializers import (
    AdminUserSerializer,
    ChangePasswordSerializer,
    CounselorProfileSerializer,
    DistrictSerializer,
    DonorProfileSerializer,
    InstitutionSerializer,
    NotificationSerializer,
    RegisterSerializer,
    UserSerializer,
    YouthProfileSerializer,
)


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'detail': 'Account created successfully. Please log in to continue.',
            'user': UserSerializer(user).data,
        }, status=201)


class MeView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Password updated successfully.'})


class UserViewSet(viewsets.ModelViewSet):
    """Admin-only account roster. No create (registration already covers
    that) and no delete (deactivate via is_active instead of destroying
    account history/relations).
    """

    queryset = User.objects.select_related(
        'youth_profile', 'counselor_profile', 'donor_profile'
    ).all().order_by('-created_at')
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['role', 'is_active']
    http_method_names = ['get', 'patch', 'head', 'options']


class InstitutionViewSet(viewsets.ModelViewSet):
    queryset = Institution.objects.all().order_by('name')
    serializer_class = InstitutionSerializer
    permission_classes = [IsAuthenticatedCreateOrAdminWrite]
    filterset_fields = ['type', 'region']
    pagination_class = None  # frontend dropdowns need the complete filtered list, not one page of it


class DistrictViewSet(viewsets.ModelViewSet):
    queryset = District.objects.all().order_by('region', 'name')
    serializer_class = DistrictSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['region']
    pagination_class = None  # a region has at most ~43 districts; simplest for a dropdown data source


class _ProfileViewSet(viewsets.ModelViewSet):
    """Shared behaviour for the three 1-1 profile viewsets.

    Listing is staff-only (no public roster of any profile type); a single
    profile is retrievable/editable by its owner, a counselor, or an admin.
    """

    def get_permissions(self):
        if self.action == 'list':
            return [IsCounselorOrAdmin()]
        return [IsSelfProfileOrCounselorOrAdmin()]


class YouthProfileViewSet(_ProfileViewSet):
    queryset = YouthProfile.objects.select_related('institution', 'assigned_counselor').order_by('full_name')
    serializer_class = YouthProfileSerializer
    filterset_fields = ['education_level', 'region', 'institution', 'assigned_counselor']
    pagination_class = None  # counsellor-facing dropdowns (e.g. schedule-session) need the full list at once


class CounselorProfileViewSet(_ProfileViewSet):
    queryset = CounselorProfile.objects.select_related('institution').order_by('full_name')
    serializer_class = CounselorProfileSerializer
    filterset_fields = ['institution']


class DonorProfileViewSet(_ProfileViewSet):
    queryset = DonorProfile.objects.all().order_by('full_name')
    serializer_class = DonorProfileSerializer
    filterset_fields = ['donor_type']


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """A user's own in-app alerts (e.g. a scholarship deadline closing soon)."""

    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=['is_read'])
        return Response(self.get_serializer(notification).data)

    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_read(self, request):
        self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({'detail': 'All notifications marked as read.'})
