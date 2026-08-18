from rest_framework import serializers

from accounts.models import Institution
from accounts.serializers import InstitutionSerializer

from .models import CareerMatch, CareerPath, Career, Course, CounsellorMessage, Opportunity, QuizResponse, Scholarship


class ScholarshipMiniSerializer(serializers.ModelSerializer):
    """Scholarship fields only — no nested career_path — so CareerPathSerializer
    can list a career's scholarships without recursing back into itself.
    """

    class Meta:
        model = Scholarship
        fields = ['id', 'title', 'provider', 'education_level', 'deadline', 'eligibility_criteria', 'source_url']


class InstitutionMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ['id', 'name', 'type', 'region']


class CareerPathRefSerializer(serializers.ModelSerializer):
    """Slim reference used when nesting a career path inside a Career,
    Course, or Scholarship — avoids recursing back into itself.
    """

    class Meta:
        model = CareerPath
        fields = ['id', 'title', 'trait']


class CourseMiniSerializer(serializers.ModelSerializer):
    """Course fields plus a slim institution — used when nesting courses
    under a CareerPath or a Career, without the full read-more detail.
    """

    institution = InstitutionMiniSerializer(read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'institution', 'level', 'duration']


class CareerMiniSerializer(serializers.ModelSerializer):
    """Career fields only — used when nesting careers under a CareerPath,
    without the full read-more detail (day_to_day, courses).
    """

    class Meta:
        model = Career
        fields = ['id', 'title', 'summary', 'typical_earnings']


class CareerSerializer(serializers.ModelSerializer):
    career_path = CareerPathRefSerializer(read_only=True)
    career_path_id = serializers.PrimaryKeyRelatedField(
        queryset=CareerPath.objects.all(), source='career_path', write_only=True
    )
    courses = CourseMiniSerializer(many=True, read_only=True)

    class Meta:
        model = Career
        fields = [
            'id', 'title', 'career_path', 'career_path_id', 'summary', 'day_to_day',
            'typical_earnings', 'courses',
        ]


class CourseSerializer(serializers.ModelSerializer):
    institution = InstitutionSerializer(read_only=True)
    institution_id = serializers.PrimaryKeyRelatedField(
        queryset=Institution.objects.all(), source='institution', write_only=True
    )
    career_path = CareerPathRefSerializer(read_only=True)
    career_path_id = serializers.PrimaryKeyRelatedField(
        queryset=CareerPath.objects.all(), source='career_path', write_only=True
    )
    careers = CareerMiniSerializer(many=True, read_only=True)
    careers_ids = serializers.PrimaryKeyRelatedField(
        queryset=Career.objects.all(), source='careers', write_only=True, many=True, required=False
    )

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'institution', 'institution_id', 'career_path', 'career_path_id',
            'careers', 'careers_ids', 'level', 'duration', 'description', 'entry_requirements',
        ]


class CareerPathSerializer(serializers.ModelSerializer):
    trait_display = serializers.CharField(source='get_trait_display', read_only=True)
    institutions = InstitutionSerializer(many=True, read_only=True)
    scholarships = ScholarshipMiniSerializer(many=True, read_only=True)
    careers = CareerMiniSerializer(many=True, read_only=True)
    courses = CourseMiniSerializer(many=True, read_only=True)
    career_count = serializers.IntegerField(source='careers.count', read_only=True)
    course_count = serializers.IntegerField(source='courses.count', read_only=True)

    class Meta:
        model = CareerPath
        fields = [
            'id', 'title', 'trait', 'trait_display', 'description', 'earnings_range',
            'qualification_required', 'institutions', 'scholarships',
            'careers', 'courses', 'career_count', 'course_count',
        ]


class OpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = ['id', 'icon', 'title', 'subtitle', 'description', 'tag', 'region', 'deadline', 'url', 'created_at']


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
