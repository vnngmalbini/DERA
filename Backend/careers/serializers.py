from rest_framework import serializers

from accounts.serializers import InstitutionSerializer

from .models import CareerMatch, CareerPath, CounsellorMessage, Opportunity, QuizResponse, Scholarship


class ScholarshipMiniSerializer(serializers.ModelSerializer):
    """Scholarship fields only — no nested career_path — so CareerPathSerializer
    can list a career's scholarships without recursing back into itself.
    """

    class Meta:
        model = Scholarship
        fields = ['id', 'title', 'provider', 'education_level', 'deadline', 'eligibility_criteria', 'source_url']


class CareerPathSerializer(serializers.ModelSerializer):
    trait_display = serializers.CharField(source='get_trait_display', read_only=True)
    institutions = InstitutionSerializer(many=True, read_only=True)
    scholarships = ScholarshipMiniSerializer(many=True, read_only=True)

    class Meta:
        model = CareerPath
        fields = [
            'id', 'title', 'trait', 'trait_display', 'description', 'earnings_range',
            'qualification_required', 'institutions', 'scholarships',
        ]


class OpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = ['id', 'icon', 'title', 'subtitle', 'description', 'tag', 'region', 'deadline', 'url', 'created_at']


class CareerPathRefSerializer(serializers.ModelSerializer):
    """Slim reference used when nesting a career path inside a Scholarship —
    avoids re-nesting that scholarship back into itself via CareerPathSerializer.
    """

    class Meta:
        model = CareerPath
        fields = ['id', 'title', 'trait']


class ScholarshipSerializer(serializers.ModelSerializer):
    career_path = CareerPathRefSerializer(read_only=True)
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


class CounsellorMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CounsellorMessage
        fields = ['id', 'role', 'content', 'created_at']
        read_only_fields = ['id', 'role', 'created_at']


class QuizResponseSerializer(serializers.ModelSerializer):
    matches = CareerMatchSerializer(many=True, read_only=True)

    class Meta:
        model = QuizResponse
        fields = ['id', 'youth', 'submitted_at', 'matches']
        read_only_fields = ['id', 'youth', 'submitted_at']
