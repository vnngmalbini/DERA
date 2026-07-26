from django.contrib import admin

from .models import EscalationContact, HelpRequest


@admin.register(EscalationContact)
class EscalationContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'contact_info')
    list_filter = ('type',)
    search_fields = ('name',)


@admin.register(HelpRequest)
class HelpRequestAdmin(admin.ModelAdmin):
    """Staff can triage (assign escalation_contact) but never edit or
    attribute the anonymous submission's content (SRS NFR-2.3)."""

    list_display = ('category', 'submitted_at', 'escalation_contact')
    list_filter = ('category',)
    readonly_fields = ('category', 'message', 'submitted_at')

    def has_add_permission(self, request):
        return False
