from django.contrib import admin

from .models import Intervention, RiskAssessment, RiskIndicator


class RiskIndicatorInline(admin.TabularInline):
    model = RiskIndicator
    extra = 0


class InterventionInline(admin.TabularInline):
    model = Intervention
    extra = 0


@admin.register(RiskAssessment)
class RiskAssessmentAdmin(admin.ModelAdmin):
    list_display = ('youth', 'counselor', 'risk_score', 'assessed_at')
    list_filter = ('assessed_at',)
    search_fields = ('youth__full_name', 'counselor__full_name')
    inlines = [RiskIndicatorInline, InterventionInline]
