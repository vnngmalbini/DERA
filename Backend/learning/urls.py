from rest_framework.routers import DefaultRouter

from .views import LearningResourceViewSet

router = DefaultRouter()
router.register('learning-resources', LearningResourceViewSet, basename='learning-resource')

urlpatterns = router.urls
