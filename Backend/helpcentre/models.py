import uuid

from django.db import models


class EscalationContact(models.Model):
    class Type(models.TextChoices):
        NGO = 'ngo', 'NGO'
        HELPLINE = 'helpline', 'Helpline'
        SCHOOL_COUNSELOR = 'school_counselor', 'School Counselor'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=30, choices=Type.choices, blank=True, null=True)
    contact_info = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'escalation_contacts'

    def __str__(self):
        return self.name


class HelpRequest(models.Model):
    """Anonymous help-centre submission.

    SRS NFR-2.3: deliberately has NO link to users/youth_profiles to
    preserve anonymity. This model must NEVER gain a user/youth foreign
    key, and no view/serializer in this project may attach the requesting
    user's identity to a HelpRequest under any circumstance.
    """

    class Category(models.TextChoices):
        PREGNANCY = 'pregnancy', 'Pregnancy'
        FAMILY_PRESSURE = 'family_pressure', 'Family Pressure'
        FINANCIAL_HARDSHIP = 'financial_hardship', 'Financial Hardship'
        RE_ENROLMENT = 're_enrolment', 'Re-enrolment'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.CharField(max_length=30, choices=Category.choices, blank=True, null=True)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    escalation_contact = models.ForeignKey(
        EscalationContact, on_delete=models.SET_NULL, blank=True, null=True, related_name='help_requests'
    )

    class Meta:
        db_table = 'help_requests'

    def __str__(self):
        return f'{self.category} @ {self.submitted_at}'


class ContactMessage(models.Model):
    """A "Contact Us" submission — unlike HelpRequest, this one is meant to
    be followed up on directly, so it does carry the sender's name/email.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)

    class Meta:
        db_table = 'contact_messages'
        ordering = ['-submitted_at']

    def __str__(self):
        return f'{self.name} <{self.email}> @ {self.submitted_at}'
