from django.contrib import admin

from .models import Mentor


@admin.register(Mentor)
class MentorAdmin(admin.ModelAdmin):
    list_display = ('title', 'subtitle', 'tag')
    search_fields = ('title', 'subtitle')
