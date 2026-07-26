from rest_framework import serializers

from .models import Intervention, RiskAssessment, RiskIndicator


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
        read_only_fields = ['id', 'assessed_at']
