from rest_framework import viewsets

from common.permissions import IsAdminOrReadOnly

from .models import LearningResource
from .serializers import LearningResourceSerializer


class LearningResourceViewSet(viewsets.ModelViewSet):
    queryset = LearningResource.objects.all().order_by('title')
    serializer_class = LearningResourceSerializer
    permission_classes = [IsAdminOrReadOnly]
