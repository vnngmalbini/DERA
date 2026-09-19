from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

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
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
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


class PasswordResetRequestView(generics.GenericAPIView):
    """Starts a password reset. Always returns the same generic response
    regardless of whether the email matched an account, so this can't be
    used to enumerate registered emails.
    """

    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'password_reset'
    serializer_class = PasswordResetRequestSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.filter(email__iexact=serializer.validated_data['email'], is_active=True).first()
        if user is not None:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = PasswordResetTokenGenerator().make_token(user)
            reset_url = f'{settings.FRONTEND_URL}/reset-password/{uid}/{token}'
            send_mail(
                subject='Reset your DERA password',
                message=(
                    f'Someone (hopefully you) asked to reset the password for this DERA account.\n\n'
                    f'Reset it here: {reset_url}\n\n'
                    f"If you didn't request this, you can ignore this email."
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True,
            )

        return Response({'detail': "If that account exists, we've sent password reset instructions to it."})


class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'password_reset'
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Password updated successfully. Please log in with your new password.'})


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
