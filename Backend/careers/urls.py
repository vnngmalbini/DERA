from rest_framework.routers import DefaultRouter

from .views import (
    CareerMatchViewSet,
    CareerPathViewSet,
    CareerViewSet,
    CounsellorMessageViewSet,
    CourseViewSet,
    OpportunityViewSet,
    QuizResponseViewSet,
    ScholarshipViewSet,
)

router = DefaultRouter()
router.register('career-paths', CareerPathViewSet, basename='career-path')
router.register('careers', CareerViewSet, basename='career')
router.register('courses', CourseViewSet, basename='course')
router.register('scholarships', ScholarshipViewSet, basename='scholarship')
router.register('opportunities', OpportunityViewSet, basename='opportunity')
router.register('quiz-responses', QuizResponseViewSet, basename='quiz-response')
router.register('career-matches', CareerMatchViewSet, basename='career-match')
router.register('counsellor-messages', CounsellorMessageViewSet, basename='counsellor-message')

urlpatterns = router.urls
