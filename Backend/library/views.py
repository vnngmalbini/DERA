from datetime import timedelta

from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import APIException, PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from .ai_librarian import LibrarianServiceError, build_welcome_message, get_librarian_reply
from .models import Book, LibrarianConversation, LibrarianMessage, ReadingChallenge, UserBook
from .serializers import (
    BookReviewSerializer,
    BookSerializer,
    LibrarianMessageSerializer,
    ReadingChallengeSerializer,
    UserBookSerializer,
)


class LibrarianUnavailable(APIException):
    status_code = 503
    default_detail = 'The Growth Librarian is temporarily unavailable. Please try again in a moment.'
    default_code = 'librarian_unavailable'


class LibrarianMessageViewSet(viewsets.ModelViewSet):
    serializer_class = LibrarianMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']
    pagination_class = None

    def get_queryset(self):
        youth_profile = getattr(self.request.user, 'youth_profile', None)
        if youth_profile is None:
            return LibrarianMessage.objects.none()
        return LibrarianMessage.objects.filter(conversation__youth=youth_profile)

    def list(self, request, *args, **kwargs):
        youth_profile = getattr(request.user, 'youth_profile', None)
        if youth_profile is not None:
            conversation, _ = LibrarianConversation.objects.get_or_create(youth=youth_profile)
            if not conversation.messages.exists():
                LibrarianMessage.objects.create(
                    conversation=conversation,
                    role=LibrarianMessage.Role.ASSISTANT,
                    content=build_welcome_message(youth_profile),
                )
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        youth_profile = getattr(request.user, 'youth_profile', None)
        if youth_profile is None:
            raise PermissionDenied('Only youth accounts can use the Growth Librarian.')

        content = str(request.data.get('content', '')).strip()
        if not content:
            raise ValidationError({'content': 'This field is required.'})

        conversation, _ = LibrarianConversation.objects.get_or_create(youth=youth_profile)
        user_message = LibrarianMessage.objects.create(
            conversation=conversation, role=LibrarianMessage.Role.USER, content=content
        )

        try:
            reply_text = get_librarian_reply(conversation.messages.all(), youth_profile)
        except LibrarianServiceError as exc:
            raise LibrarianUnavailable() from exc

        assistant_message = LibrarianMessage.objects.create(
            conversation=conversation, role=LibrarianMessage.Role.ASSISTANT, content=reply_text
        )

        serializer = self.get_serializer([user_message, assistant_message], many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BookViewSet(viewsets.ReadOnlyModelViewSet):
    """The real, curated book catalog (see seed_books) — public read for any
    authenticated user, never written to via the API.
    """

    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['category', 'reading_level']
    pagination_class = None

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        book = self.get_object()
        reviews = UserBook.objects.filter(book=book).exclude(review__isnull=True).exclude(review__exact='')
        serializer = BookReviewSerializer(reviews, many=True)
        return Response(serializer.data)


class UserBookViewSet(viewsets.ModelViewSet):
    """A youth's own reading tracker: want-to-read / currently-reading /
    completed, star rating, review, favorites, and AI Reading Coach
    reflections. Scoped entirely to the requesting youth.
    """

    serializer_class = UserBookSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    filterset_fields = ['status', 'is_favorite']

    def get_queryset(self):
        youth_profile = getattr(self.request.user, 'youth_profile', None)
        if youth_profile is None:
            return UserBook.objects.none()
        return UserBook.objects.filter(youth=youth_profile).select_related('book')

    def _youth_profile(self):
        youth_profile = getattr(self.request.user, 'youth_profile', None)
        if youth_profile is None:
            raise PermissionDenied('Only youth accounts can track reading.')
        return youth_profile

    def perform_create(self, serializer):
        youth_profile = self._youth_profile()
        status_value = serializer.validated_data.get('status', UserBook.Status.WANT_TO_READ)
        extra = self._timestamps_for_status(status_value)
        serializer.save(youth=youth_profile, **extra)

    def perform_update(self, serializer):
        instance = self.get_object()
        new_status = serializer.validated_data.get('status', instance.status)
        extra = {}
        if new_status != instance.status:
            extra = self._timestamps_for_status(new_status, instance)
        serializer.save(**extra)

    @staticmethod
    def _timestamps_for_status(new_status, instance=None):
        """Stamp started_at/completed_at the first time a book enters that
        status, without clobbering a value already set (e.g. re-saving the
        same status, or moving back to 'currently_reading' after 'completed').
        """
        now = timezone.now()
        extra = {}
        if new_status == UserBook.Status.CURRENTLY_READING and not (instance and instance.started_at):
            extra['started_at'] = now
        if new_status == UserBook.Status.COMPLETED and not (instance and instance.completed_at):
            extra['completed_at'] = now
            if not (instance and instance.started_at):
                extra['started_at'] = now
        return extra


def challenge_period_range(period):
    """Return (start, end) datetimes for 'this month/quarter/year', used both
    to score challenge progress and to compute the reading streak.
    """
    now = timezone.now()
    if period == ReadingChallenge.Period.MONTH:
        start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        next_month = (start.month % 12) + 1
        next_year = start.year + (1 if start.month == 12 else 0)
        end = start.replace(year=next_year, month=next_month)
    elif period == ReadingChallenge.Period.QUARTER:
        quarter_start_month = ((now.month - 1) // 3) * 3 + 1
        start = now.replace(month=quarter_start_month, day=1, hour=0, minute=0, second=0, microsecond=0)
        next_month = quarter_start_month + 3
        next_year = start.year + (1 if next_month > 12 else 0)
        end = start.replace(year=next_year, month=((next_month - 1) % 12) + 1)
    else:  # YEAR
        start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        end = start.replace(year=start.year + 1)
    return start, end


class ReadingChallengeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ReadingChallenge.objects.filter(is_active=True)
    serializer_class = ReadingChallengeSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None


def _reading_streak_weeks(youth_profile):
    """Consecutive ISO weeks, counting back from the current week, with at
    least one book completed. A youth who completes nothing this week but
    completed last week still shows a streak of 0 until they complete one
    this week — streaks measure an unbroken run, not lifetime activity.
    """
    completed_dates = UserBook.objects.filter(
        youth=youth_profile, status=UserBook.Status.COMPLETED, completed_at__isnull=False,
    ).values_list('completed_at', flat=True)
    weeks_with_activity = {d.isocalendar()[:2] for d in completed_dates}

    streak = 0
    cursor = timezone.now()
    while cursor.isocalendar()[:2] in weeks_with_activity:
        streak += 1
        cursor -= timedelta(weeks=1)
    return streak


def _badges_for(youth_profile):
    completed_qs = UserBook.objects.filter(youth=youth_profile, status=UserBook.Status.COMPLETED)
    completed_count = completed_qs.count()
    distinct_categories = completed_qs.values_list('book__category', flat=True).distinct().count()
    favorites_count = UserBook.objects.filter(youth=youth_profile, is_favorite=True).count()
    streak_weeks = _reading_streak_weeks(youth_profile)

    return [
        {
            'key': 'getting_started', 'label': 'Getting Started', 'icon': 'auto_stories',
            'description': 'Complete your first book.', 'earned': completed_count >= 1,
        },
        {
            'key': 'bookworm', 'label': 'Bookworm', 'icon': 'menu_book',
            'description': 'Complete 5 books.', 'earned': completed_count >= 5,
        },
        {
            'key': 'well_rounded', 'label': 'Well-Rounded Reader', 'icon': 'diversity_3',
            'description': 'Complete books from 3 different categories.', 'earned': distinct_categories >= 3,
        },
        {
            'key': 'consistent_reader', 'label': 'Consistent Reader', 'icon': 'local_fire_department',
            'description': 'Keep a 4-week reading streak going.', 'earned': streak_weeks >= 4,
        },
        {
            'key': 'favorite_finder', 'label': 'Favorite Finder', 'icon': 'favorite',
            'description': 'Save a book to your favorites.', 'earned': favorites_count >= 1,
        },
    ]


class ReadingStatsView(APIView):
    """Backs the Reading Tracker header: counts by status, streak, and
    badges — all computed live from UserBook so nothing can drift out of
    sync with what the youth actually did.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        youth_profile = getattr(request.user, 'youth_profile', None)
        if youth_profile is None:
            raise PermissionDenied('Only youth accounts have a reading tracker.')

        books = UserBook.objects.filter(youth=youth_profile)
        return Response({
            'books_completed': books.filter(status=UserBook.Status.COMPLETED).count(),
            'currently_reading': books.filter(status=UserBook.Status.CURRENTLY_READING).count(),
            'want_to_read': books.filter(status=UserBook.Status.WANT_TO_READ).count(),
            'favorites': books.filter(is_favorite=True).count(),
            'reading_streak_weeks': _reading_streak_weeks(youth_profile),
            'badges': _badges_for(youth_profile),
        })
