from rest_framework.routers import DefaultRouter

from .views import DonationViewSet, ImpactReportViewSet, ProjectViewSet

router = DefaultRouter()
router.register('donations', DonationViewSet, basename='donation')
router.register('projects', ProjectViewSet, basename='project')
router.register('impact-reports', ImpactReportViewSet, basename='impact-report')

urlpatterns = router.urls
