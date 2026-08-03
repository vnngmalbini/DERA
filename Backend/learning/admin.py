from django.contrib import admin

from .models import LearningResource


@admin.register(LearningResource)
class LearningResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'subtitle', 'tag', 'url')
    search_fields = ('title', 'subtitle')
