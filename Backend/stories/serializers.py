from rest_framework import serializers

from careers.models import CareerPath
from careers.serializers import CareerPathSerializer

from .models import Story


class StorySerializer(serializers.ModelSerializer):
    career_path = CareerPathSerializer(read_only=True)
    career_path_id = serializers.PrimaryKeyRelatedField(
        queryset=CareerPath.objects.all(), source='career_path', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Story
        fields = [
            'id', 'title', 'speaker_name', 'narrative', 'photo', 'region', 'career_path', 'career_path_id',
            'consent_status',
        ]
