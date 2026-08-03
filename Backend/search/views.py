from django.db.models import Q
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from careers.models import CareerPath, Scholarship
from learning.models import LearningResource
from marketplace.models import ApplicationForm
from mentorship.models import Mentor
from stories.models import Story

RESULT_LIMIT = 8


def _as_results(queryset, type_name, url, subtitle_field=None):
    results = []
    for obj in queryset:
        subtitle = getattr(obj, subtitle_field, '') if subtitle_field else ''
        results.append({
            'id': str(obj.id),
            'type': type_name,
            'title': obj.title,
            'subtitle': subtitle or '',
            'url': url,
        })
    return results


class SearchView(APIView):
    """Public, read-only search across the site's public content types."""

    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        empty = {
            'career_paths': [], 'scholarships': [], 'stories': [],
            'forms': [], 'mentors': [], 'learning_resources': [],
        }
        if not query:
            return Response(empty)

        career_paths = CareerPath.objects.filter(
            Q(title__icontains=query) | Q(description__icontains=query)
        )[:RESULT_LIMIT]

        scholarships = Scholarship.objects.filter(
            Q(title__icontains=query) | Q(provider__icontains=query) | Q(education_level__icontains=query)
        )[:RESULT_LIMIT]

        # Only consent_status=GRANTED stories are ever public — matches
        # StoryViewSet.get_queryset for anonymous/non-staff requests.
        stories = Story.objects.filter(consent_status=Story.ConsentStatus.GRANTED).filter(
            Q(title__icontains=query) | Q(narrative__icontains=query) | Q(speaker_name__icontains=query)
        )[:RESULT_LIMIT]

        forms = ApplicationForm.objects.filter(
            Q(title__icontains=query) | Q(institution__name__icontains=query)
        )[:RESULT_LIMIT]

        mentors = Mentor.objects.filter(
            Q(title__icontains=query) | Q(subtitle__icontains=query) | Q(description__icontains=query)
        )[:RESULT_LIMIT]

        learning_resources = LearningResource.objects.filter(
            Q(title__icontains=query) | Q(subtitle__icontains=query) | Q(description__icontains=query)
        )[:RESULT_LIMIT]

        return Response({
            'career_paths': _as_results(career_paths, 'Career Path', '/career-quiz'),
            'scholarships': _as_results(scholarships, 'Scholarship', '/scholarships', 'provider'),
            'stories': _as_results(stories, 'Story', '/stories', 'speaker_name'),
            'forms': _as_results(forms, 'Form', '/forms'),
            'mentors': _as_results(mentors, 'Mentor', '/dashboard/youth/mentorship', 'subtitle'),
            'learning_resources': _as_results(
                learning_resources, 'Learning Resource', '/dashboard/youth/learning', 'subtitle'
            ),
        })
