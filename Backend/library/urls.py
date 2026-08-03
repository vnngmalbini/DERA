from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    BookViewSet,
    LibrarianMessageViewSet,
    ReadingChallengeViewSet,
    ReadingStatsView,
    UserBookViewSet,
)

router = DefaultRouter()
router.register('librarian-messages', LibrarianMessageViewSet, basename='librarian-message')
router.register('books', BookViewSet, basename='book')
router.register('my-books', UserBookViewSet, basename='user-book')
router.register('reading-challenges', ReadingChallengeViewSet, basename='reading-challenge')

urlpatterns = [
    path('reading-stats/', ReadingStatsView.as_view(), name='reading-stats'),
] + router.urls
