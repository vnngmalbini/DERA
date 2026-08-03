from django.contrib import admin

from .models import AcademicRecord, AttendanceRecord, CounselingSession, Intervention, RiskAssessment, RiskIndicator


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


@admin.register(CounselingSession)
class CounselingSessionAdmin(admin.ModelAdmin):
    list_display = ('youth', 'counselor', 'session_type', 'scheduled_at', 'status')
    list_filter = ('session_type', 'status')
    search_fields = ('youth__full_name', 'counselor__full_name')


@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ('youth', 'date', 'present')
    list_filter = ('present', 'date')
    search_fields = ('youth__full_name',)


@admin.register(AcademicRecord)
class AcademicRecordAdmin(admin.ModelAdmin):
    list_display = ('youth', 'subject', 'score', 'recorded_at')
    list_filter = ('subject',)
    search_fields = ('youth__full_name', 'subject')
