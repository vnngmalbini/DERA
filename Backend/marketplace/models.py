import uuid

from django.db import models


class ApplicationForm(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    institution = models.ForeignKey(
        'accounts.Institution', on_delete=models.PROTECT, related_name='application_forms'
    )
    title = models.CharField(max_length=255)
    price_ghs = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'application_forms'

    def __str__(self):
        return self.title


class FormOrder(models.Model):
    class OrderType(models.TextChoices):
        DIRECT_PURCHASE = 'direct_purchase', 'Direct Purchase'
        SPONSORSHIP_REQUEST = 'sponsorship_request', 'Sponsorship Request'

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PAID = 'paid', 'Paid'
        FAILED = 'failed', 'Failed'
        SPONSORED = 'sponsored', 'Sponsored'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    youth = models.ForeignKey('accounts.YouthProfile', on_delete=models.PROTECT, related_name='form_orders')
    form = models.ForeignKey(ApplicationForm, on_delete=models.PROTECT, related_name='orders')
    order_type = models.CharField(max_length=30, choices=OrderType.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'form_orders'

    def __str__(self):
        return f'{self.youth} - {self.form} ({self.status})'


class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        SUCCESS = 'success', 'Success'
        FAILED = 'failed', 'Failed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.OneToOneField(FormOrder, on_delete=models.CASCADE, related_name='payment')
    momo_reference = models.CharField(max_length=100, unique=True, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, blank=True, null=True)
    paid_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'payments'

    def __str__(self):
        return f'{self.order} - {self.status}'


class Sponsorship(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.OneToOneField(FormOrder, on_delete=models.CASCADE, related_name='sponsorship')
    donor = models.ForeignKey('accounts.DonorProfile', on_delete=models.PROTECT, related_name='sponsorships')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    funded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sponsorships'

    def __str__(self):
        return f'{self.donor} -> {self.order}'
