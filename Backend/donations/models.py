import uuid

from django.db import models


class Project(models.Model):
    """A fund/project donors can direct a donation toward (e.g. "Rural Coding
    Bootcamp"). `raised_amount` is computed from real linked Donations rather
    than stored, so it can never drift from the truth.
    """

    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        COMPLETED = 'completed', 'Completed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    icon = models.CharField(max_length=50, blank=True, null=True)
    title = models.CharField(max_length=255)
    region = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    description = models.TextField(blank=True, null=True)
    target_amount = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'projects'
        ordering = ['title']

    def __str__(self):
        return self.title


class ImpactReport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(
        Project, on_delete=models.SET_NULL, blank=True, null=True, related_name='impact_reports'
    )
    icon = models.CharField(max_length=50, blank=True, null=True)
    title = models.CharField(max_length=255)
    tag = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    published_at = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'impact_reports'
        ordering = ['-published_at']

    def __str__(self):
        return self.title


class Donation(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        SUCCESS = 'success', 'Success'
        FAILED = 'failed', 'Failed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    donor = models.ForeignKey(
        'accounts.DonorProfile', on_delete=models.SET_NULL, blank=True, null=True, related_name='donations'
    )
    project = models.ForeignKey(
        Project, on_delete=models.SET_NULL, blank=True, null=True, related_name='donations'
    )
    donor_name = models.CharField(max_length=255, blank=True, null=True)
    donor_email = models.EmailField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reference = models.CharField(max_length=64, unique=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'donations'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.donor_email} — GHS {self.amount} ({self.status})'
