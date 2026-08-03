from rest_framework import serializers

from .models import AcademicRecord, AttendanceRecord, CounselingSession, Intervention, RiskAssessment, RiskIndicator


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


class CounselingSessionSerializer(serializers.ModelSerializer):
    youth_name = serializers.CharField(source='youth.full_name', read_only=True)
    session_type_display = serializers.CharField(source='get_session_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = CounselingSession
        fields = [
            'id', 'youth', 'youth_name', 'counselor', 'session_type', 'session_type_display', 'scheduled_at',
            'status', 'status_display', 'notes', 'created_at',
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
