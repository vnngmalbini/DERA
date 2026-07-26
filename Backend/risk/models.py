import uuid

from django.db import models


class RiskAssessment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    youth = models.ForeignKey('accounts.YouthProfile', on_delete=models.CASCADE, related_name='risk_assessments')
    counselor = models.ForeignKey(
        'accounts.CounselorProfile', on_delete=models.PROTECT, related_name='risk_assessments'
    )
    risk_score = models.DecimalField(max_digits=5, decimal_places=2)
    assessed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'risk_assessments'

    def __str__(self):
        return f'{self.youth} @ {self.risk_score}'


class RiskIndicator(models.Model):
    class Category(models.TextChoices):
        ACADEMIC_DECLINE = 'academic_decline', 'Academic Decline'
        ABSENTEEISM = 'absenteeism', 'Absenteeism'
        FINANCIAL_DISTRESS = 'financial_distress', 'Financial Distress'
        BEHAVIOURAL_CHANGE = 'behavioural_change', 'Behavioural Change'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assessment = models.ForeignKey(RiskAssessment, on_delete=models.CASCADE, related_name='indicators')
    category = models.CharField(max_length=30, choices=Category.choices)
    description = models.TextField(blank=True, null=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        db_table = 'risk_indicators'

    def __str__(self):
        return f'{self.category} ({self.weight})'


class Intervention(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        IN_PROGRESS = 'in_progress', 'In Progress'
        RESOLVED = 'resolved', 'Resolved'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assessment = models.ForeignKey(RiskAssessment, on_delete=models.CASCADE, related_name='interventions')
    recommendation = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    class Meta:
        db_table = 'interventions'

    def __str__(self):
        return self.recommendation[:50]
