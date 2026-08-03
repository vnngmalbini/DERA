from rest_framework import viewsets

from common.permissions import IsAdminOrReadOnly

from .models import Mentor
from .serializers import MentorSerializer


class MentorViewSet(viewsets.ModelViewSet):
    queryset = Mentor.objects.all().order_by('title')
    serializer_class = MentorSerializer
    permission_classes = [IsAdminOrReadOnly]
