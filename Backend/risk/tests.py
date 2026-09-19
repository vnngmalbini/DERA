from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

from accounts.models import CounselorProfile, YouthProfile

from .models import CounselingSession, RiskAssessment

User = get_user_model()


def _make_counselor(email):
    user = User.objects.create_user(email=email, password='StrongPass123', role='counselor')
    return CounselorProfile.objects.create(user=user, full_name=f'Counselor {email}')


def _make_youth(email, assigned_counselor=None):
    user = User.objects.create_user(email=email, password='StrongPass123', role='youth')
    return YouthProfile.objects.create(user=user, full_name=f'Youth {email}', assigned_counselor=assigned_counselor)


class RiskDataRosterScopingTests(APITestCase):
    """A counselor must never be able to read or write risk data for a
    youth outside their own roster just by knowing (or guessing) a UUID —
    see _ensure_youth_in_roster in risk/views.py.
    """

    def setUp(self):
        self.counselor_a = _make_counselor('counselor.a@example.com')
        self.counselor_b = _make_counselor('counselor.b@example.com')
        self.my_youth = _make_youth('my.youth@example.com', assigned_counselor=self.counselor_a)
        self.other_youth = _make_youth('other.youth@example.com', assigned_counselor=self.counselor_b)
        self.client.force_authenticate(user=self.counselor_a.user)

    def test_cannot_create_risk_assessment_for_other_counselors_youth(self):
        response = self.client.post(
            reverse('risk-assessment-list'), {'youth': str(self.other_youth.id), 'risk_score': '80.00'}
        )
        self.assertEqual(response.status_code, 403)
        self.assertFalse(RiskAssessment.objects.filter(youth=self.other_youth).exists())

    def test_can_create_risk_assessment_for_own_youth(self):
        response = self.client.post(
            reverse('risk-assessment-list'), {'youth': str(self.my_youth.id), 'risk_score': '80.00'}
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(RiskAssessment.objects.filter(youth=self.my_youth).exists())

    def test_cannot_create_risk_indicator_against_other_counselors_assessment(self):
        other_assessment = RiskAssessment.objects.create(
            youth=self.other_youth, counselor=self.counselor_b, risk_score='60.00'
        )
        response = self.client.post(
            reverse('risk-indicator-list'),
            {'assessment': str(other_assessment.id), 'category': 'absenteeism', 'weight': '10.00'},
        )
        self.assertEqual(response.status_code, 403)

    def test_cannot_create_intervention_against_other_counselors_assessment(self):
        other_assessment = RiskAssessment.objects.create(
            youth=self.other_youth, counselor=self.counselor_b, risk_score='60.00'
        )
        response = self.client.post(
            reverse('intervention-list'), {'assessment': str(other_assessment.id), 'recommendation': 'Check in.'}
        )
        self.assertEqual(response.status_code, 403)

    def test_cannot_create_attendance_record_for_other_counselors_youth(self):
        response = self.client.post(
            reverse('attendance-record-list'),
            {'youth': str(self.other_youth.id), 'date': '2026-01-01', 'present': True},
        )
        self.assertEqual(response.status_code, 403)

    def test_cannot_create_academic_record_for_other_counselors_youth(self):
        response = self.client.post(
            reverse('academic-record-list'),
            {'youth': str(self.other_youth.id), 'subject': 'Math', 'score': '75.00', 'recorded_at': '2026-01-01'},
        )
        self.assertEqual(response.status_code, 403)


class CounselingSessionAssignmentTests(APITestCase):
    """A counselor scheduling a session shouldn't be able to seize a youth
    who is already assigned to someone else, but should still be able to
    "claim" a genuinely unassigned youth via their first session with them.
    """

    def setUp(self):
        self.counselor_a = _make_counselor('counselor.a2@example.com')
        self.counselor_b = _make_counselor('counselor.b2@example.com')
        self.assigned_youth = _make_youth('assigned.youth@example.com', assigned_counselor=self.counselor_b)
        self.unassigned_youth = _make_youth('unassigned.youth@example.com', assigned_counselor=None)
        self.client.force_authenticate(user=self.counselor_a.user)

    def test_cannot_schedule_session_with_another_counselors_youth(self):
        response = self.client.post(
            reverse('counseling-session-list'),
            {
                'youth': str(self.assigned_youth.id),
                'session_type': 'academic_checkin',
                'scheduled_at': '2026-01-01T10:00:00Z',
            },
        )
        self.assertEqual(response.status_code, 403)
        self.assertFalse(CounselingSession.objects.filter(youth=self.assigned_youth).exists())
        self.assigned_youth.refresh_from_db()
        self.assertEqual(self.assigned_youth.assigned_counselor_id, self.counselor_b.id)

    def test_scheduling_with_unassigned_youth_claims_them(self):
        response = self.client.post(
            reverse('counseling-session-list'),
            {
                'youth': str(self.unassigned_youth.id),
                'session_type': 'academic_checkin',
                'scheduled_at': '2026-01-01T10:00:00Z',
            },
        )
        self.assertEqual(response.status_code, 201)
        self.unassigned_youth.refresh_from_db()
        self.assertEqual(self.unassigned_youth.assigned_counselor_id, self.counselor_a.id)
