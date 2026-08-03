import uuid

from django.db import models


class Mentor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    icon = models.CharField(max_length=50, blank=True, null=True)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    tag = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'mentors'

    def __str__(self):
        return self.title
