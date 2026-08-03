import uuid

from django.db import models


class LearningResource(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    icon = models.CharField(max_length=50, blank=True, null=True)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    tag = models.CharField(max_length=50, blank=True, null=True)
    url = models.URLField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = 'learning_resources'

    def __str__(self):
        return self.title
