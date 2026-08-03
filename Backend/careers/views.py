from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import APIException, PermissionDenied, ValidationError
from rest_framework.response import Response

from common.permissions import IsAdminOrReadOnly

from .ai_counsellor import WELCOME_MESSAGE, CounsellorServiceError, get_counsellor_reply
from .models import (
    CareerMatch,
    CareerPath,
    CounsellorConversation,
    CounsellorMessage,
    Opportunity,
    QuizResponse,
    Scholarship,
)
from .serializers import (
    CareerMatchSerializer,
    CareerPathSerializer,
    CounsellorMessageSerializer,
    OpportunitySerializer,
    QuizResponseSerializer,
    ScholarshipSerializer,
)


class CounsellorUnavailable(APIException):
    status_code = 503
    default_detail = 'The AI counsellor is temporarily unavailable. Please try again in a moment.'
    default_code = 'counsellor_unavailable'


class CounsellorMessageViewSet(viewsets.ModelViewSet):
    serializer_class = CounsellorMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']
    pagination_class = None

    def get_queryset(self):
        youth_profile = getattr(self.request.user, 'youth_profile', None)
        if youth_profile is None:
            return CounsellorMessage.objects.none()
        return CounsellorMessage.objects.filter(conversation__youth=youth_profile)

    def list(self, request, *args, **kwargs):
        youth_profile = getattr(request.user, 'youth_profile', None)
        if youth_profile is not None:
            conversation, _ = CounsellorConversation.objects.get_or_create(youth=youth_profile)
            if not conversation.messages.exists():
                CounsellorMessage.objects.create(
                    conversation=conversation, role=CounsellorMessage.Role.ASSISTANT, content=WELCOME_MESSAGE
                )
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        youth_profile = getattr(request.user, 'youth_profile', None)
        if youth_profile is None:
            raise PermissionDenied('Only youth accounts can use the career counsellor.')

        content = str(request.data.get('content', '')).strip()
        if not content:
            raise ValidationError({'content': 'This field is required.'})

        conversation, _ = CounsellorConversation.objects.get_or_create(youth=youth_profile)
        user_message = CounsellorMessage.objects.create(
            conversation=conversation, role=CounsellorMessage.Role.USER, content=content
        )

        try:
            reply_text = get_counsellor_reply(conversation.messages.all())
        except CounsellorServiceError as exc:
            raise CounsellorUnavailable() from exc

        assistant_message = CounsellorMessage.objects.create(
            conversation=conversation, role=CounsellorMessage.Role.ASSISTANT, content=reply_text
        )

        serializer = self.get_serializer([user_message, assistant_message], many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CareerPathViewSet(viewsets.ModelViewSet):
    queryset = CareerPath.objects.all().prefetch_related('institutions', 'scholarships').order_by('title')
    serializer_class = CareerPathSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['trait']
    pagination_class = None  # 5 trait buckets total; the quiz result screen needs the full filtered list at once


class ScholarshipViewSet(viewsets.ModelViewSet):
    queryset = Scholarship.objects.select_related('career_path').order_by('deadline')
    serializer_class = ScholarshipSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['education_level', 'career_path']


class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.all().order_by('deadline', 'title')
    serializer_class = OpportunitySerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['region', 'tag']


class QuizResponseViewSet(viewsets.ModelViewSet):
    serializer_class = QuizResponseSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        base = QuizResponse.objects.prefetch_related('matches')
        if user.role in ('counselor', 'admin'):
            return base.order_by('-submitted_at')
        youth_profile = getattr(user, 'youth_profile', None)
        if youth_profile is None:
            return QuizResponse.objects.none()
        return base.filter(youth=youth_profile).order_by('-submitted_at')

    def perform_create(self, serializer):
        youth_profile = getattr(self.request.user, 'youth_profile', None)
        if youth_profile is None:
            raise PermissionDenied('Only youth accounts can submit the career quiz.')
        serializer.save(youth=youth_profile)


class CareerMatchViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CareerMatchSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['quiz_response', 'career_path']

    def get_queryset(self):
        user = self.request.user
        if user.role in ('counselor', 'admin'):
            return CareerMatch.objects.all()
        youth_profile = getattr(user, 'youth_profile', None)
        if youth_profile is None:
            return CareerMatch.objects.none()
        return CareerMatch.objects.filter(quiz_response__youth=youth_profile)
