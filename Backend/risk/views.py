from rest_framework import viewsets

from common.permissions import IsCounselorOrAdmin

from .models import Intervention, RiskAssessment, RiskIndicator
from .serializers import InterventionSerializer, RiskAssessmentSerializer, RiskIndicatorSerializer


class RiskAssessmentViewSet(viewsets.ModelViewSet):
    queryset = RiskAssessment.objects.all().order_by('-assessed_at')
    serializer_class = RiskAssessmentSerializer
    permission_classes = [IsCounselorOrAdmin]
    filterset_fields = ['youth', 'counselor']


class RiskIndicatorViewSet(viewsets.ModelViewSet):
    queryset = RiskIndicator.objects.all()
    serializer_class = RiskIndicatorSerializer
    permission_classes = [IsCounselorOrAdmin]
    filterset_fields = ['assessment', 'category']


class InterventionViewSet(viewsets.ModelViewSet):
    queryset = Intervention.objects.all()
    serializer_class = InterventionSerializer
    permission_classes = [IsCounselorOrAdmin]
    filterset_fields = ['assessment', 'status']
