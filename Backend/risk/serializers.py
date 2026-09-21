from rest_framework import serializers

from .dropout_schema import EDUCATION_LEVELS, LEVEL_FIELDS
from .models import (
    AcademicRecord,
    AttendanceRecord,
    CounselingSession,
    DropoutRiskAssessment,
    Intervention,
    RiskAssessment,
    RiskIndicator,
)


class RiskIndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskIndicator
        fields = ['id', 'assessment', 'category', 'description', 'weight']


class InterventionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Intervention
        fields = ['id', 'assessment', 'recommendation', 'status']


class RiskAssessmentSerializer(serializers.ModelSerializer):
    indicators = RiskIndicatorSerializer(many=True, read_only=True)
    interventions = InterventionSerializer(many=True, read_only=True)

    class Meta:
        model = RiskAssessment
        fields = ['id', 'youth', 'counselor', 'risk_score', 'assessed_at', 'indicators', 'interventions']
        read_only_fields = ['id', 'counselor', 'assessed_at']


class DropoutRiskAssessmentSerializer(serializers.ModelSerializer):
    youth_name = serializers.CharField(source='youth.full_name', read_only=True)

    class Meta:
        model = DropoutRiskAssessment
        fields = [
            'id', 'youth', 'youth_name', 'counselor', 'education_level', 'input_data',
            'risk_probability', 'risk_level', 'risk_factors', 'recommendations',
            'model_version', 'assessed_at',
        ]
        read_only_fields = [
            'id', 'youth_name', 'counselor', 'risk_probability', 'risk_level',
            'risk_factors', 'recommendations', 'model_version', 'assessed_at',
        ]


class DropoutPredictionSerializer(serializers.Serializer):
    youth_id = serializers.UUIDField()
    education_level = serializers.ChoiceField(choices=EDUCATION_LEVELS)
    data = serializers.DictField()

    def validate(self, attrs):
        level = attrs['education_level']
        allowed = set(LEVEL_FIELDS[level])
        unknown = set(attrs['data']) - allowed
        if unknown:
            raise serializers.ValidationError({
                'data': f'Fields not supported for {level}: {", ".join(sorted(unknown))}.'
            })
        for field, field_type in LEVEL_FIELDS[level].items():
            if field not in attrs['data'] or attrs['data'][field] in ('', None):
                raise serializers.ValidationError({'data': f'{field} is required for {level}.'})
            if field_type == 'number':
                try:
                    float(attrs['data'][field])
                except (TypeError, ValueError):
                    raise serializers.ValidationError({'data': f'{field} must be a number.'})
        return attrs


class CounselingSessionSerializer(serializers.ModelSerializer):
    youth_name = serializers.CharField(source='youth.full_name', read_only=True)
    counselor_name = serializers.CharField(source='counselor.full_name', read_only=True)
    session_type_display = serializers.CharField(source='get_session_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = CounselingSession
        fields = [
            'id', 'youth', 'youth_name', 'counselor', 'counselor_name', 'session_type', 'session_type_display',
            'scheduled_at', 'status', 'status_display', 'notes', 'created_at',
        ]
        read_only_fields = ['id', 'counselor', 'created_at']


class AttendanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceRecord
        fields = ['id', 'youth', 'date', 'present', 'recorded_at']
        read_only_fields = ['id', 'recorded_at']


class AcademicRecordSerializer(serializers.ModelSerializer):
    youth_name = serializers.CharField(source='youth.full_name', read_only=True)

    class Meta:
        model = AcademicRecord
        fields = ['id', 'youth', 'youth_name', 'subject', 'score', 'recorded_at', 'created_at']
        read_only_fields = ['id', 'created_at']
