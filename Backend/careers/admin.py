from django.contrib import admin

from .models import Career, CareerMatch, CareerPath, Course, Opportunity, QuizResponse, Scholarship


class CareerMatchInline(admin.TabularInline):
    model = CareerMatch
    extra = 0


class CareerInline(admin.TabularInline):
    model = Career
    extra = 0


@admin.register(CareerPath)
class CareerPathAdmin(admin.ModelAdmin):
    list_display = ('title', 'earnings_range', 'qualification_required')
    search_fields = ('title',)
    inlines = [CareerInline]


@admin.register(Career)
class CareerAdmin(admin.ModelAdmin):
    list_display = ('title', 'career_path', 'typical_earnings')
    list_filter = ('career_path',)
    search_fields = ('title',)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'institution', 'career_path', 'level')
    list_filter = ('career_path', 'level', 'institution__type')
    search_fields = ('title', 'institution__name')


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
