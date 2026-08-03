from rest_framework.routers import DefaultRouter

from .views import MentorViewSet

router = DefaultRouter()
router.register('mentors', MentorViewSet, basename='mentor')

urlpatterns = router.urls
