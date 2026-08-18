import uuid

from django.db import models


class CareerPath(models.Model):
    class Trait(models.TextChoices):
        """Matches the 5 result buckets the client-side quiz already scores
        answers into (Frontend/src/pages/CareerQuiz.jsx RESULTS keys) — the
        quiz itself stays client-side, this just gives the backend a way to
        look up what to recommend for whichever trait a youth landed on.
        """

        TECH = 'TECH', 'Technology & Computing'
        PEOPLE = 'PEOPLE', 'Healthcare, Education & Social Services'
        CREATIVE = 'CREATIVE', 'Arts, Media & Design'
        BUSINESS = 'BUSINESS', 'Business, Finance & Entrepreneurship'
        PRACTICAL = 'PRACTICAL', 'Engineering, Construction & Agriculture'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    trait = models.CharField(max_length=20, choices=Trait.choices, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    earnings_range = models.CharField(max_length=100, blank=True, null=True)
    qualification_required = models.CharField(max_length=255, blank=True, null=True)
    institutions = models.ManyToManyField(
        'accounts.Institution', related_name='career_paths', blank=True
    )

    class Meta:
        db_table = 'career_paths'

    def __str__(self):
        return self.title


class Career(models.Model):
    """A specific job/role within a CareerPath field (e.g. "Software Engineer"
    under Technology & Computing) — what the quiz results screen counts and
    lists under "careers available in this field", each with its own
    read-more detail page.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    career_path = models.ForeignKey(CareerPath, on_delete=models.CASCADE, related_name='careers')
    title = models.CharField(max_length=255)
    summary = models.TextField(blank=True, null=True)
    day_to_day = models.TextField(blank=True, null=True)
    typical_earnings = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'career_roles'
        ordering = ['title']

    def __str__(self):
        return self.title


class Course(models.Model):
    """A real degree/diploma/certificate programme at a real institution that
    prepares a youth for one or more Careers — what the quiz results screen
    lists under "courses you can study to get there", each with its own
    read-more detail page.
    """

    class Level(models.TextChoices):
        CERTIFICATE = 'certificate', 'Certificate'
        DIPLOMA = 'diploma', 'Diploma'
        HND = 'hnd', 'HND'
        BACHELORS = 'bachelors', "Bachelor's Degree"
        MASTERS = 'masters', "Master's Degree"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    institution = models.ForeignKey('accounts.Institution', on_delete=models.CASCADE, related_name='courses')
    career_path = models.ForeignKey(CareerPath, on_delete=models.CASCADE, related_name='courses')
    careers = models.ManyToManyField(Career, related_name='courses', blank=True)
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.BACHELORS)
    duration = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    entry_requirements = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'courses'
        ordering = ['title']

    def __str__(self):
        return f'{self.title} — {self.institution}'


class QuizResponse(models.Model):
    """Records that a youth submitted the career-discovery quiz.

    The DBML schema stores no answer payload on this table — capturing raw
    quiz answers and the interest-to-career matching algorithm are explicit
    follow-up work, not invented here.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    youth = models.ForeignKey('accounts.YouthProfile', on_delete=models.CASCADE, related_name='quiz_responses')
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'quiz_responses'

    def __str__(self):
        return f'{self.youth} @ {self.submitted_at}'


class CareerMatch(models.Model):
    """Server/algorithm-generated match — not user-submitted via the API."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quiz_response = models.ForeignKey(QuizResponse, on_delete=models.CASCADE, related_name='matches')
    career_path = models.ForeignKey(CareerPath, on_delete=models.PROTECT, related_name='matches')
    match_score = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        db_table = 'career_matches'
        verbose_name_plural = 'career matches'

    def __str__(self):
        return f'{self.career_path} ({self.match_score})'


class CounsellorConversation(models.Model):
    """One ongoing AI career-counsellor thread per youth."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    youth = models.OneToOneField(
        'accounts.YouthProfile', on_delete=models.CASCADE, related_name='counsellor_conversation'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'counsellor_conversations'

    def __str__(self):
        return f'Counsellor conversation for {self.youth}'


class CounsellorMessage(models.Model):
    class Role(models.TextChoices):
        USER = 'user', 'User'
        ASSISTANT = 'assistant', 'Assistant'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(CounsellorConversation, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=20, choices=Role.choices)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'counsellor_messages'
        ordering = ['created_at']

    def __str__(self):
        return f'{self.role}: {self.content[:50]}'


class Opportunity(models.Model):
    """An internship, fellowship, or competition surfaced to youth — same
    content-card shape as Mentor/LearningResource so the frontend can render
    all three through the same ContentCard component.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    icon = models.CharField(max_length=50, blank=True, null=True)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    tag = models.CharField(max_length=50, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    deadline = models.DateField(blank=True, null=True)
    url = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'opportunities'
        ordering = ['deadline', 'title']
        verbose_name_plural = 'opportunities'

    def __str__(self):
        return self.title


class Scholarship(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    provider = models.CharField(max_length=255, blank=True, null=True)
    education_level = models.CharField(max_length=100, blank=True, null=True)
    deadline = models.DateField(blank=True, null=True)
    eligibility_criteria = models.TextField(blank=True, null=True)
    source_url = models.URLField(max_length=500, blank=True, null=True)
    career_path = models.ForeignKey(
        CareerPath, on_delete=models.SET_NULL, blank=True, null=True, related_name='scholarships'
    )

    class Meta:
        db_table = 'scholarships'

    def __str__(self):
        return self.title
