from rest_framework import serializers

from .models import CareerMatch, CareerPath, QuizResponse, Scholarship


class CareerPathSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerPath
        fields = ['id', 'title', 'description', 'earnings_range', 'qualification_required']


class ScholarshipSerializer(serializers.ModelSerializer):
    career_path = CareerPathSerializer(read_only=True)
    career_path_id = serializers.PrimaryKeyRelatedField(
        queryset=CareerPath.objects.all(), source='career_path', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Scholarship
        fields = [
            'id', 'title', 'provider', 'education_level', 'deadline',
            'eligibility_criteria', 'source_url', 'career_path', 'career_path_id',
        ]


class CareerMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerMatch
        fields = ['id', 'quiz_response', 'career_path', 'match_score']


class QuizResponseSerializer(serializers.ModelSerializer):
    matches = CareerMatchSerializer(many=True, read_only=True)

    class Meta:
        model = QuizResponse
        fields = ['id', 'youth', 'submitted_at', 'matches']
        read_only_fields = ['id', 'youth', 'submitted_at']
