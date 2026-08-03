from django.contrib import admin

from .models import Donation, ImpactReport, Project


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('donor_email', 'project', 'amount', 'status', 'created_at', 'paid_at')
    list_filter = ('status',)
    search_fields = ('donor_email', 'donor_name', 'reference')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'region', 'status', 'target_amount', 'created_at')
    list_filter = ('status', 'region')
    search_fields = ('title',)


@admin.register(ImpactReport)
class ImpactReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'tag', 'published_at')
    list_filter = ('tag',)
    search_fields = ('title',)
