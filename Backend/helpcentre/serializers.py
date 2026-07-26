from rest_framework import serializers

from .models import EscalationContact, HelpRequest


class EscalationContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EscalationContact
        fields = ['id', 'name', 'type', 'contact_info']


class HelpRequestSerializer(serializers.ModelSerializer):
    """Deliberately exposes no identity field (SRS NFR-2.3).

    Only category/message are writable, and escalation_contact may be set
    by staff during triage. The view must never call
    serializer.save(user=...) or similar — there is no such field to set.
    """

    class Meta:
        model = HelpRequest
        fields = ['id', 'category', 'message', 'submitted_at', 'escalation_contact']
        read_only_fields = ['id', 'submitted_at']
