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


class CounselingSession(models.Model):
    class SessionType(models.TextChoices):
        ACADEMIC_CHECKIN = 'academic_checkin', 'Academic Check-in'
        HOME_VISIT = 'home_visit', 'Home Visit'
        MENTORSHIP_PAIRING = 'mentorship_pairing', 'Mentorship Pairing'
        CRISIS_SUPPORT = 'crisis_support', 'Crisis Support'
        OTHER = 'other', 'Other'

    class Status(models.TextChoices):
        UPCOMING = 'upcoming', 'Upcoming'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    youth = models.ForeignKey('accounts.YouthProfile', on_delete=models.CASCADE, related_name='counseling_sessions')
    counselor = models.ForeignKey(
        'accounts.CounselorProfile', on_delete=models.CASCADE, related_name='counseling_sessions'
    )
    session_type = models.CharField(max_length=30, choices=SessionType.choices)
    scheduled_at = models.DateTimeField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.UPCOMING)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'counseling_sessions'
        ordering = ['scheduled_at']

    def __str__(self):
        return f'{self.youth} — {self.get_session_type_display()} @ {self.scheduled_at}'


class AttendanceRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    youth = models.ForeignKey('accounts.YouthProfile', on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    present = models.BooleanField(default=True)
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'attendance_records'
        unique_together = ('youth', 'date')
        ordering = ['-date']

    def __str__(self):
        return f'{self.youth} — {self.date} ({"present" if self.present else "absent"})'


class AcademicRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    youth = models.ForeignKey('accounts.YouthProfile', on_delete=models.CASCADE, related_name='academic_records')
    subject = models.CharField(max_length=100)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    recorded_at = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'academic_records'
        ordering = ['-recorded_at']

    def __str__(self):
        return f'{self.youth} — {self.subject}: {self.score}'
