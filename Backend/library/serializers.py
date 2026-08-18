from urllib.parse import quote_plus

from rest_framework import serializers

from .models import Book, FreeBook, LibrarianMessage, ReadingChallenge, UserBook


class LibrarianMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibrarianMessage
        fields = ['id', 'role', 'content', 'created_at']
        read_only_fields = ['id', 'role', 'created_at']


class BookSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    reading_level_display = serializers.CharField(source='get_reading_level_display', read_only=True)
    external_link = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'category', 'category_display', 'reading_level', 'reading_level_display',
            'estimated_reading_time', 'why_recommended', 'key_lessons', 'who_should_read', 'difficulty_rating',
            'external_link',
        ]

    def get_external_link(self, obj):
        # Prefer the hand-verified direct book page seeded in seed_books.py
        # (see its docstring). Readers here are not tech-savvy, so a click
        # must land on the one specific book, never a list of search
        # results to sift through. Only fall back to a Goodreads *search*
        # link for a book that hasn't been hand-verified yet.
        if obj.external_link:
            return obj.external_link
        return f'https://www.goodreads.com/search?q={quote_plus(f"{obj.title} {obj.author}")}'


class FreeBookSerializer(serializers.ModelSerializer):
    """Catalog shape for the Self Development Library. `cached_text` is
    deliberately excluded — it can be large, and the reader view fetches it
    on demand via the dedicated `read` action instead of on every list load.
    """

    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = FreeBook
        fields = [
            'id', 'title', 'author', 'category', 'category_display', 'description',
            'cover_url', 'html_url', 'epub_url',
        ]


class BookReviewSerializer(serializers.ModelSerializer):
    """Public, community-facing shape of a UserBook — a first name and the
    review only. Never exposes the reflection fields (biggest_lesson,
    application_plan, habit_change), which are the youth's private AI
    Reading Coach journal, not a public review.
    """

    reviewer_first_name = serializers.SerializerMethodField()

    class Meta:
        model = UserBook
        fields = ['id', 'reviewer_first_name', 'rating', 'review', 'completed_at']

    def get_reviewer_first_name(self, obj):
        return (obj.youth.full_name or '').split(' ')[0] or 'A reader'


class UserBookSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all(), source='book', write_only=True)

    class Meta:
        model = UserBook
        fields = [
            'id', 'book', 'book_id', 'status', 'is_favorite', 'rating', 'review',
            'biggest_lesson', 'application_plan', 'habit_change', 'started_at', 'completed_at',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'started_at', 'completed_at', 'created_at', 'updated_at']

    def validate_rating(self, value):
        if value is not None and not (1 <= value <= 5):
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value


class ReadingChallengeSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    progress = serializers.SerializerMethodField()

    class Meta:
        model = ReadingChallenge
        fields = [
            'id', 'title', 'description', 'category', 'category_display',
            'target_count', 'period', 'icon', 'progress',
        ]

    def get_progress(self, obj):
        request = self.context.get('request')
        youth_profile = getattr(getattr(request, 'user', None), 'youth_profile', None) if request else None
        if youth_profile is None:
            return {'completed': 0, 'target': obj.target_count, 'is_met': False}

        from .views import challenge_period_range  # local import avoids a circular import at module load

        start, end = challenge_period_range(obj.period)
        qs = UserBook.objects.filter(
            youth=youth_profile, status=UserBook.Status.COMPLETED, completed_at__gte=start, completed_at__lt=end,
        )
        if obj.category:
            qs = qs.filter(book__category=obj.category)
        completed = qs.count()
        return {'completed': completed, 'target': obj.target_count, 'is_met': completed >= obj.target_count}
