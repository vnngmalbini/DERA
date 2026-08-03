from rest_framework.routers import DefaultRouter

from .views import (
    CounselorProfileViewSet,
    DistrictViewSet,
    DonorProfileViewSet,
    InstitutionViewSet,
    NotificationViewSet,
    UserViewSet,
    YouthProfileViewSet,
)

router = DefaultRouter()
router.register('users', UserViewSet, basename='user')
router.register('institutions', InstitutionViewSet, basename='institution')
router.register('districts', DistrictViewSet, basename='district')
router.register('youth-profiles', YouthProfileViewSet, basename='youth-profile')
router.register('counselor-profiles', CounselorProfileViewSet, basename='counselor-profile')
router.register('donor-profiles', DonorProfileViewSet, basename='donor-profile')
router.register('notifications', NotificationViewSet, basename='notification')

urlpatterns = router.urls
