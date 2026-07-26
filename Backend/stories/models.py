import uuid

from django.db import models


class Story(models.Model):
    class ConsentStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        GRANTED = 'granted', 'Granted'
        REVOKED = 'revoked', 'Revoked'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    narrative = models.TextField()
    region = models.CharField(max_length=100, blank=True, null=True)
    career_path = models.ForeignKey(
        'careers.CareerPath', on_delete=models.SET_NULL, blank=True, null=True, related_name='stories'
    )
    consent_status = models.CharField(max_length=20, choices=ConsentStatus.choices, default=ConsentStatus.PENDING)

    class Meta:
        db_table = 'stories'
        verbose_name_plural = 'stories'

    def __str__(self):
        return self.title
