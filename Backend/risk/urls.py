from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AcademicRecordViewSet,
    AttendanceRecordViewSet,
    CounselingSessionViewSet,
    CounselorReportsView,
    CounselorRosterDetailView,
    CounselorRosterView,
    InterventionViewSet,
    RiskAssessmentViewSet,
    RiskIndicatorViewSet,
)

router = DefaultRouter()
router.register('risk-assessments', RiskAssessmentViewSet, basename='risk-assessment')
router.register('risk-indicators', RiskIndicatorViewSet, basename='risk-indicator')
router.register('interventions', InterventionViewSet, basename='intervention')
router.register('counseling-sessions', CounselingSessionViewSet, basename='counseling-session')
router.register('attendance-records', AttendanceRecordViewSet, basename='attendance-record')
router.register('academic-records', AcademicRecordViewSet, basename='academic-record')

urlpatterns = [
    path('counselor-roster/', CounselorRosterView.as_view(), name='counselor-roster'),
    path('counselor-roster/<uuid:youth_id>/', CounselorRosterDetailView.as_view(), name='counselor-roster-detail'),
    path('counselor-reports/', CounselorReportsView.as_view(), name='counselor-reports'),
] + router.urls
