from django.contrib import admin

from .models import ApplicationForm, FormOrder, Payment, Sponsorship


class PaymentInline(admin.StackedInline):
    model = Payment
    extra = 0


class SponsorshipInline(admin.StackedInline):
    model = Sponsorship
    extra = 0


@admin.register(ApplicationForm)
class ApplicationFormAdmin(admin.ModelAdmin):
    list_display = ('title', 'institution', 'price_ghs')
    search_fields = ('title', 'institution__name')


@admin.register(FormOrder)
class FormOrderAdmin(admin.ModelAdmin):
    list_display = ('youth', 'form', 'order_type', 'status', 'created_at')
    list_filter = ('order_type', 'status')
    search_fields = ('youth__full_name', 'form__title')
    inlines = [PaymentInline, SponsorshipInline]
