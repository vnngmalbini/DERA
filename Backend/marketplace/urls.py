from rest_framework.routers import DefaultRouter

from .views import ApplicationFormViewSet, FormOrderViewSet, PaymentViewSet, SponsorshipViewSet

router = DefaultRouter()
router.register('application-forms', ApplicationFormViewSet, basename='application-form')
router.register('form-orders', FormOrderViewSet, basename='form-order')
router.register('payments', PaymentViewSet, basename='payment')
router.register('sponsorships', SponsorshipViewSet, basename='sponsorship')

urlpatterns = router.urls
