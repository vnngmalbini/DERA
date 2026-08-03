from rest_framework import serializers

from .models import LearningResource


class LearningResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningResource
        fields = ['id', 'icon', 'title', 'subtitle', 'description', 'tag', 'url']
