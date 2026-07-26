from django.contrib import admin

from .models import Story


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'region', 'consent_status')
    list_filter = ('consent_status', 'region')
    search_fields = ('title', 'narrative')
