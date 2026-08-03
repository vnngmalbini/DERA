from django.contrib import admin

from .models import CareerMatch, CareerPath, Opportunity, QuizResponse, Scholarship


class CareerMatchInline(admin.TabularInline):
    model = CareerMatch
    extra = 0


@admin.register(CareerPath)
class CareerPathAdmin(admin.ModelAdmin):
    list_display = ('title', 'earnings_range', 'qualification_required')
    search_fields = ('title',)


@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = ('title', 'tag', 'region', 'deadline')
    list_filter = ('tag', 'region')
    search_fields = ('title', 'subtitle')


@admin.register(Scholarship)
class ScholarshipAdmin(admin.ModelAdmin):
    list_display = ('title', 'provider', 'education_level', 'deadline')
    list_filter = ('education_level',)
    search_fields = ('title', 'provider')


@admin.register(QuizResponse)
class QuizResponseAdmin(admin.ModelAdmin):
    list_display = ('youth', 'submitted_at')
    search_fields = ('youth__full_name',)
    inlines = [CareerMatchInline]
