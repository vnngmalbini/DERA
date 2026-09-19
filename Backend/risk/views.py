from datetime import timedelta

from django.db.models import Avg, Count, Q
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import YouthProfile
from common.permissions import IsCounselorOrAdmin

from .models import AcademicRecord, AttendanceRecord, CounselingSession, Intervention, RiskAssessment, RiskIndicator
from .serializers import (
    AcademicRecordSerializer,
    AttendanceRecordSerializer,
    CounselingSessionSerializer,
    InterventionSerializer,
    RiskAssessmentSerializer,
    RiskIndicatorSerializer,
)

# Score bands used to translate a RiskAssessment's numeric risk_score into
# the plain-language level the counselor dashboards display.
_RISK_LEVEL_BANDS = [(75, 'Critical'), (50, 'High'), (25, 'Moderate')]


def _risk_level_for_score(score):
    if score is None:
        return None
    score = float(score)
    for threshold, label in _RISK_LEVEL_BANDS:
        if score >= threshold:
            return label
    return 'Low'


def _attendance_rate(youth, since):
    records = AttendanceRecord.objects.filter(youth=youth, date__gte=since)
    total = records.count()
    if total == 0:
        return None
    present = records.filter(present=True).count()
    return round(present / total * 100, 1)


def _roster_entry(youth):
    latest_assessment = youth.risk_assessments.order_by('-assessed_at').first()
    since = timezone.now().date() - timedelta(days=30)
    return {
        'id': str(youth.id),
        'full_name': youth.full_name,
        'education_level': youth.education_level,
        'institution_name': youth.institution.name if youth.institution_id else None,
        'region': youth.region,
        'district': youth.district,
        'latest_risk_score': latest_assessment.risk_score if latest_assessment else None,
        'risk_level': _risk_level_for_score(latest_assessment.risk_score) if latest_assessment else None,
        'assessed_at': latest_assessment.assessed_at if latest_assessment else None,
        'attendance_rate_30d': _attendance_rate(youth, since),
        'open_interventions_count': Intervention.objects.filter(
            assessment__youth=youth, status__in=[Intervention.Status.PENDING, Intervention.Status.IN_PROGRESS]
        ).count(),
    }


def _roster_entries_bulk(youths):
    """Same shape as _roster_entry, but for a whole roster in ~4 queries
    total instead of ~4 per youth. _roster_entry did a fresh latest-
    assessment lookup + 2 attendance counts + an intervention count for
    every row, which meant a counselor with 50 assigned youth triggered
    ~200 queries just to load their overview page.
    """
    youths = list(youths)
    youth_ids = [y.id for y in youths]
    if not youth_ids:
        return []

    since = timezone.now().date() - timedelta(days=30)

    # Latest assessment per youth: one query for everything, ordered so the
    # first row seen per youth_id (via dict insertion) is the newest.
    latest_by_youth = {}
    for assessment in RiskAssessment.objects.filter(youth_id__in=youth_ids).order_by('-assessed_at').only(
        'youth_id', 'risk_score', 'assessed_at'
    ):
        latest_by_youth.setdefault(assessment.youth_id, assessment)

    attendance_by_youth = {
        row['youth_id']: row
        for row in AttendanceRecord.objects.filter(youth_id__in=youth_ids, date__gte=since)
        .values('youth_id')
        .annotate(total=Count('id'), present=Count('id', filter=Q(present=True)))
    }

    open_interventions_by_youth = {
        row['assessment__youth_id']: row['count']
        for row in Intervention.objects.filter(
            assessment__youth_id__in=youth_ids,
            status__in=[Intervention.Status.PENDING, Intervention.Status.IN_PROGRESS],
        )
        .values('assessment__youth_id')
        .annotate(count=Count('id'))
    }

    entries = []
    for youth in youths:
        latest_assessment = latest_by_youth.get(youth.id)
        attendance = attendance_by_youth.get(youth.id)
        attendance_rate = round(attendance['present'] / attendance['total'] * 100, 1) if attendance else None
        entries.append({
            'id': str(youth.id),
            'full_name': youth.full_name,
            'education_level': youth.education_level,
            'institution_name': youth.institution.name if youth.institution_id else None,
            'region': youth.region,
            'district': youth.district,
            'latest_risk_score': latest_assessment.risk_score if latest_assessment else None,
            'risk_level': _risk_level_for_score(latest_assessment.risk_score) if latest_assessment else None,
            'assessed_at': latest_assessment.assessed_at if latest_assessment else None,
            'attendance_rate_30d': attendance_rate,
            'open_interventions_count': open_interventions_by_youth.get(youth.id, 0),
        })
    return entries


def _roster_queryset(request):
    """Assigned youth for the requesting counselor, or everyone for an admin."""
    if request.user.role == 'admin':
        return YouthProfile.objects.all()
    counselor_profile = getattr(request.user, 'counselor_profile', None)
    if counselor_profile is None:
        return YouthProfile.objects.none()
    return counselor_profile.assigned_youth.all()


def _ensure_youth_in_roster(request, youth):
    """Guards every risk-data *write*. `get_queryset()` on these viewsets
    already scopes reads (and therefore retrieve/update/destroy, which go
    through it via get_object()) to `_roster_queryset()` — but `create` has
    no existing row to filter against, so without this a counselor could
    POST a risk_score/attendance/academic record, or a RiskIndicator/
    Intervention, against a youth (or a youth's assessment) outside their
    roster just by knowing the UUID.
    """
    if not _roster_queryset(request).filter(pk=youth.pk).exists():
        raise PermissionDenied("You don't have access to this youth's record.")


class CounselorRosterView(APIView):
    """A counselor's real assigned-youth roster, enriched with their latest
    risk level and attendance — backs the Counselor Overview and Assigned
    Youth pages, replacing what used to be hardcoded sample rows there.
    """

    permission_classes = [IsCounselorOrAdmin]

    def get(self, request):
        youths = _roster_queryset(request).select_related('institution').order_by('full_name')
        return Response(_roster_entries_bulk(youths))


class CounselorRosterDetailView(APIView):
    permission_classes = [IsCounselorOrAdmin]

    def get(self, request, youth_id):
        try:
            youth = YouthProfile.objects.select_related('institution').get(id=youth_id)
        except YouthProfile.DoesNotExist:
            raise NotFound('Youth not found.')

        if request.user.role != 'admin' and youth not in _roster_queryset(request):
            raise PermissionDenied("You don't have access to this youth's record.")

        entry = _roster_entry(youth)
        entry['risk_assessments'] = RiskAssessmentSerializer(
            youth.risk_assessments.order_by('-assessed_at'), many=True
        ).data
        entry['academic_records'] = AcademicRecordSerializer(
            youth.academic_records.order_by('-recorded_at')[:20], many=True
        ).data
        entry['attendance_records'] = AttendanceRecordSerializer(
            youth.attendance_records.order_by('-date')[:30], many=True
        ).data
        entry['interventions'] = InterventionSerializer(
            Intervention.objects.filter(assessment__youth=youth).order_by('-id'), many=True
        ).data
        return Response(entry)


class CounselorReportsView(APIView):
    """Aggregate, real numbers for the Counselor Reports page: subject-score
    averages, risk-indicator category counts, and a daily attendance rate —
    all computed from this counselor's assigned youth rather than invented.
    """

    permission_classes = [IsCounselorOrAdmin]

    def get(self, request):
        youth_ids = list(_roster_queryset(request).values_list('id', flat=True))

        academic_qs = AcademicRecord.objects.filter(youth_id__in=youth_ids)
        subject_averages = list(
            academic_qs.values('subject').annotate(avg_score=Avg('score')).order_by('-avg_score')
        )

        indicator_qs = RiskIndicator.objects.filter(assessment__youth_id__in=youth_ids)
        risk_indicator_categories = list(
            indicator_qs.values('category').annotate(count=Count('id')).order_by('-count')
        )

        since = timezone.now().date() - timedelta(days=30)
        daily = (
            AttendanceRecord.objects.filter(youth_id__in=youth_ids, date__gte=since)
            .values('date')
            .annotate(present=Count('id', filter=Q(present=True)), total=Count('id'))
            .order_by('date')
        )
        attendance_by_day = [
            {'date': row['date'].isoformat(), 'rate': round(row['present'] / row['total'] * 100, 1)}
            for row in daily
        ]

        return Response({
            'assigned_youth_count': len(youth_ids),
            'subject_averages': subject_averages,
            'risk_indicator_categories': risk_indicator_categories,
            'attendance_by_day': attendance_by_day,
            'recent_academic_records': AcademicRecordSerializer(
                academic_qs.order_by('-recorded_at')[:10], many=True
            ).data,
        })


class RiskAssessmentViewSet(viewsets.ModelViewSet):
    serializer_class = RiskAssessmentSerializer
    permission_classes = [IsCounselorOrAdmin]
    filterset_fields = ['youth', 'counselor']

    def get_queryset(self):
        return RiskAssessment.objects.filter(youth__in=_roster_queryset(self.request)).order_by('-assessed_at')

    def perform_create(self, serializer):
        counselor_profile = getattr(self.request.user, 'counselor_profile', None)
        if counselor_profile is None:
            raise PermissionDenied('Only counselor accounts can create risk assessments.')
        _ensure_youth_in_roster(self.request, serializer.validated_data['youth'])
        serializer.save(counselor=counselor_profile)


class RiskIndicatorViewSet(viewsets.ModelViewSet):
    serializer_class = RiskIndicatorSerializer
    permission_classes = [IsCounselorOrAdmin]
    filterset_fields = ['assessment', 'category']

    def get_queryset(self):
        return RiskIndicator.objects.filter(assessment__youth__in=_roster_queryset(self.request))

    def perform_create(self, serializer):
        _ensure_youth_in_roster(self.request, serializer.validated_data['assessment'].youth)
        serializer.save()


class InterventionViewSet(viewsets.ModelViewSet):
    serializer_class = InterventionSerializer
    permission_classes = [IsCounselorOrAdmin]
    filterset_fields = ['assessment', 'status']

    def get_queryset(self):
        return Intervention.objects.filter(assessment__youth__in=_roster_queryset(self.request))

    def perform_create(self, serializer):
        _ensure_youth_in_roster(self.request, serializer.validated_data['assessment'].youth)
        serializer.save()


class CounselingSessionViewSet(viewsets.ModelViewSet):
    serializer_class = CounselingSessionSerializer
    filterset_fields = ['youth', 'status', 'session_type']

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [IsAuthenticated()]
        return [IsCounselorOrAdmin()]

    def get_queryset(self):
        role = self.request.user.role
        if role == 'admin':
            return CounselingSession.objects.all()
        if role == 'counselor':
            counselor_profile = getattr(self.request.user, 'counselor_profile', None)
            if counselor_profile is None:
                return CounselingSession.objects.none()
            return CounselingSession.objects.filter(counselor=counselor_profile)
        if role == 'youth':
            return CounselingSession.objects.filter(youth__user=self.request.user)
        return CounselingSession.objects.none()

    def perform_create(self, serializer):
        counselor_profile = getattr(self.request.user, 'counselor_profile', None)
        if counselor_profile is None:
            raise PermissionDenied('Only counselor accounts can schedule sessions.')

        youth = serializer.validated_data['youth']
        # An unassigned youth may be legitimately "claimed" by whichever
        # counselor schedules their first session — that's the intended
        # onboarding path, so it isn't gated by _roster_queryset (which
        # would only ever contain youth already assigned to this counselor,
        # rejecting every first session). What must be blocked is scheduling
        # with — and thereby gaining standing access to — a youth who is
        # already assigned to a *different* counselor.
        if youth.assigned_counselor_id not in (None, counselor_profile.id):
            raise PermissionDenied('This youth is already assigned to another counselor.')

        session = serializer.save(counselor=counselor_profile)
        if youth.assigned_counselor_id is None:
            youth.assigned_counselor = counselor_profile
            youth.save(update_fields=['assigned_counselor'])


class AttendanceRecordViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceRecordSerializer
    permission_classes = [IsCounselorOrAdmin]
    filterset_fields = ['youth', 'date', 'present']

    def get_queryset(self):
        return AttendanceRecord.objects.filter(youth__in=_roster_queryset(self.request))

    def perform_create(self, serializer):
        _ensure_youth_in_roster(self.request, serializer.validated_data['youth'])
        serializer.save()


class AcademicRecordViewSet(viewsets.ModelViewSet):
    serializer_class = AcademicRecordSerializer
    permission_classes = [IsCounselorOrAdmin]
    filterset_fields = ['youth', 'subject']

    def get_queryset(self):
        return AcademicRecord.objects.filter(youth__in=_roster_queryset(self.request))

    def perform_create(self, serializer):
        _ensure_youth_in_roster(self.request, serializer.validated_data['youth'])
        serializer.save()
