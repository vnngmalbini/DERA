from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

User = get_user_model()


class RegistrationTests(TestCase):
    def test_register_creates_active_user_without_verification_email(self):
        payload = {
            'email': 'newuser@example.com',
            'phone': '0500000000',
            'password': 'StrongPass123',
            'role': 'youth',
            'full_name': 'New User',
            'date_of_birth': '2008-01-01',
            'region': 'Ashanti',
            'district': 'Kumasi',
            'education_level': 'shs',
            'gender': 'female',
        }

        response = self.client.post(reverse('auth-register'), payload, content_type='application/json')

        self.assertEqual(response.status_code, 201)
        user = User.objects.get(email='newuser@example.com')
        self.assertTrue(user.is_active)
