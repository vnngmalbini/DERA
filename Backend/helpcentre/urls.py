from rest_framework.routers import DefaultRouter

from .views import EscalationContactViewSet, HelpRequestViewSet

router = DefaultRouter()
router.register('escalation-contacts', EscalationContactViewSet, basename='escalation-contact')
router.register('help-requests', HelpRequestViewSet, basename='help-request')

urlpatterns = router.urls
