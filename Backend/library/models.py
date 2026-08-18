import uuid

from django.db import models


class Book(models.Model):
    """Real, published books only — curated by hand (see seed_books), never
    invented by the AI persona. Categories mirror the 16 buckets from the
    Growth Librarian's system prompt so the chat and the tracker speak the
    same vocabulary.
    """

    class Category(models.TextChoices):
        PERSONAL_DEVELOPMENT = 'personal_development', 'Personal Development'
        FINANCIAL_LITERACY = 'financial_literacy', 'Financial Literacy'
        CAREER_DEVELOPMENT = 'career_development', 'Career Development'
        TECHNOLOGY = 'technology', 'Technology'
        ENTREPRENEURSHIP = 'entrepreneurship', 'Entrepreneurship'
        LEADERSHIP = 'leadership', 'Leadership'
        PRODUCTIVITY_STUDY_SKILLS = 'productivity_study_skills', 'Productivity & Study Skills'
        EMOTIONAL_INTELLIGENCE = 'emotional_intelligence', 'Emotional Intelligence'
        COMMUNICATION_PUBLIC_SPEAKING = 'communication_public_speaking', 'Communication & Public Speaking'
        ACADEMIC_SUCCESS = 'academic_success', 'Academic Success'
        GLOBAL_OPPORTUNITIES = 'global_opportunities', 'Global Opportunities'
        PROFESSIONAL_DEVELOPMENT = 'professional_development', 'Professional Development'
        SCHOLARSHIP_PREPARATION = 'scholarship_preparation', 'Scholarship Preparation'
        INNOVATION_CREATIVITY = 'innovation_creativity', 'Innovation & Creativity'
        WOMEN_IN_TECHNOLOGY = 'women_in_technology', 'Women in Technology'
        FAITH_CHARACTER_DEVELOPMENT = 'faith_character_development', 'Faith & Character Development'

    class ReadingLevel(models.TextChoices):
        BEGINNER = 'beginner', 'Beginner'
        INTERMEDIATE = 'intermediate', 'Intermediate'
        ADVANCED = 'advanced', 'Advanced'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    category = models.CharField(max_length=40, choices=Category.choices)
    reading_level = models.CharField(max_length=20, choices=ReadingLevel.choices)
    estimated_reading_time = models.CharField(max_length=50, blank=True, null=True)
    why_recommended = models.TextField(blank=True, null=True)
    key_lessons = models.JSONField(default=list, blank=True)
    who_should_read = models.CharField(max_length=255, blank=True, null=True)
    difficulty_rating = models.PositiveSmallIntegerField(default=1)
    external_link = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'library_books'
        ordering = ['category', 'title']

    def __str__(self):
        return f'{self.title} — {self.author}'


class UserBook(models.Model):
    """One youth's relationship to one book: tracker status, star rating,
    public review, favorite flag, and private AI-reading-coach reflection.
    Reviews are community-facing; the reflection fields are the youth's own
    coaching journal and are never surfaced to other users.
    """

    class Status(models.TextChoices):
        WANT_TO_READ = 'want_to_read', 'Want to Read'
        CURRENTLY_READING = 'currently_reading', 'Currently Reading'
        COMPLETED = 'completed', 'Completed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    youth = models.ForeignKey('accounts.YouthProfile', on_delete=models.CASCADE, related_name='books')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='user_books')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.WANT_TO_READ)
    is_favorite = models.BooleanField(default=False)
    rating = models.PositiveSmallIntegerField(blank=True, null=True)
    review = models.TextField(blank=True, null=True)
    biggest_lesson = models.TextField(blank=True, null=True)
    application_plan = models.TextField(blank=True, null=True)
    habit_change = models.TextField(blank=True, null=True)
    started_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'library_user_books'
        unique_together = ('youth', 'book')
        ordering = ['-updated_at']

    def __str__(self):
        return f'{self.youth} — {self.book.title} ({self.status})'


class ReadingChallenge(models.Model):
    """System-defined challenge, e.g. 'Read one finance book every quarter'.
    Progress is computed on demand from UserBook rather than stored, so it
    can never drift from what a youth actually completed.
    """

    class Period(models.TextChoices):
        MONTH = 'month', 'This month'
        QUARTER = 'quarter', 'This quarter'
        YEAR = 'year', 'This year'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=40, choices=Book.Category.choices, blank=True, null=True)
    target_count = models.PositiveSmallIntegerField(default=1)
    period = models.CharField(max_length=20, choices=Period.choices)
    icon = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'library_reading_challenges'

    def __str__(self):
        return self.title


class FreeBook(models.Model):
    """The 'Self Development Library' — real, public-domain classics sourced
    from Project Gutenberg, hand-verified (see seed_free_books) the same way
    Book/seed_books is. Unlike Book, these are legally free to read in full
    and download: Gutenberg only serves out-of-copyright works, so
    `text_url`/`html_url`/`epub_url` point straight at Gutenberg-hosted
    files rather than a search or storefront page. `cached_text` is filled
    in lazily the first time anyone reads a given book (see
    FreeBookViewSet.read), so Gutenberg is fetched once per book rather
    than on every read.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    gutenberg_id = models.PositiveIntegerField(unique=True)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    category = models.CharField(max_length=40, choices=Book.Category.choices, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    cover_url = models.URLField(max_length=500, blank=True, null=True)
    html_url = models.URLField(max_length=500, blank=True, null=True)
    text_url = models.URLField(max_length=500, blank=True, null=True)
    epub_url = models.URLField(max_length=500, blank=True, null=True)
    cached_text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'library_free_books'
        ordering = ['title']

    def __str__(self):
        return f'{self.title} — {self.author}'


class LibrarianConversation(models.Model):
    """One ongoing AI Growth Librarian thread per youth — same shape as
    careers.CounsellorConversation so the two AI features stay consistent.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    youth = models.OneToOneField(
        'accounts.YouthProfile', on_delete=models.CASCADE, related_name='librarian_conversation'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'librarian_conversations'

    def __str__(self):
        return f'Growth Librarian conversation for {self.youth}'


class LibrarianMessage(models.Model):
    class Role(models.TextChoices):
        USER = 'user', 'User'
        ASSISTANT = 'assistant', 'Assistant'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(LibrarianConversation, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=20, choices=Role.choices)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'librarian_messages'
        ordering = ['created_at']

    def __str__(self):
        return f'{self.role}: {self.content[:50]}'
