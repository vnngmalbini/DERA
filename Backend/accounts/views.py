from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response

from common.permissions import (
    IsAdminOrReadOnly,
    IsAuthenticatedCreateOrAdminWrite,
    IsCounselorOrAdmin,
    IsSelfProfileOrCounselorOrAdmin,
)

from .models import CounselorProfile, District, DonorProfile, Institution, YouthProfile
from .serializers import (
    CounselorProfileSerializer,
    DistrictSerializer,
    DonorProfileSerializer,
    InstitutionSerializer,
    RegisterSerializer,
    UserSerializer,
    YouthProfileSerializer,
)


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=201)


class MeView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


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
    queryset = YouthProfile.objects.all().order_by('full_name')
    serializer_class = YouthProfileSerializer
    filterset_fields = ['education_level', 'region', 'institution']


class CounselorProfileViewSet(_ProfileViewSet):
    queryset = CounselorProfile.objects.all().order_by('full_name')
    serializer_class = CounselorProfileSerializer
    filterset_fields = ['institution']


class DonorProfileViewSet(_ProfileViewSet):
    queryset = DonorProfile.objects.all().order_by('full_name')
    serializer_class = DonorProfileSerializer
    filterset_fields = ['donor_type']
