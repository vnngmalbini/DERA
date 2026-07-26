from rest_framework.routers import DefaultRouter

from .views import InterventionViewSet, RiskAssessmentViewSet, RiskIndicatorViewSet

router = DefaultRouter()
router.register('risk-assessments', RiskAssessmentViewSet, basename='risk-assessment')
router.register('risk-indicators', RiskIndicatorViewSet, basename='risk-indicator')
router.register('interventions', InterventionViewSet, basename='intervention')

urlpatterns = router.urls
