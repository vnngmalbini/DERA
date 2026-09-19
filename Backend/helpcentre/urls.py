from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import AuntieChatView, ContactMessageViewSet, EscalationContactViewSet, HelpRequestViewSet

router = DefaultRouter()
router.register('escalation-contacts', EscalationContactViewSet, basename='escalation-contact')
router.register('help-requests', HelpRequestViewSet, basename='help-request')
router.register('contact-messages', ContactMessageViewSet, basename='contact-message')

urlpatterns = [
    path('auntie-chat/', AuntieChatView.as_view(), name='auntie-chat'),
] + router.urls
