import uuid

from django.db import models


class CareerPath(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    earnings_range = models.CharField(max_length=100, blank=True, null=True)
    qualification_required = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'career_paths'

    def __str__(self):
        return self.title


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

    def __str__(self):
        return f'{self.career_path} ({self.match_score})'


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
