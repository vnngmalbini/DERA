from rest_framework.routers import DefaultRouter

from .views import CareerMatchViewSet, CareerPathViewSet, QuizResponseViewSet, ScholarshipViewSet

router = DefaultRouter()
router.register('career-paths', CareerPathViewSet, basename='career-path')
router.register('scholarships', ScholarshipViewSet, basename='scholarship')
router.register('quiz-responses', QuizResponseViewSet, basename='quiz-response')
router.register('career-matches', CareerMatchViewSet, basename='career-match')

urlpatterns = router.urls
