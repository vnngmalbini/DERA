from rest_framework import serializers

from accounts.models import DonorProfile, Institution
from accounts.serializers import InstitutionSerializer

from .models import ApplicationForm, FormOrder, Payment, Sponsorship


class ApplicationFormSerializer(serializers.ModelSerializer):
    institution = InstitutionSerializer(read_only=True)
    institution_id = serializers.PrimaryKeyRelatedField(
        queryset=Institution.objects.all(), source='institution', write_only=True
    )

    class Meta:
        model = ApplicationForm
        fields = ['id', 'institution', 'institution_id', 'title', 'price_ghs']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'order', 'momo_reference', 'amount', 'status', 'paid_at']
        read_only_fields = ['id']


class SponsorshipDonorSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonorProfile
        fields = ['id', 'full_name', 'organization']


class SponsorshipOrderSerializer(serializers.ModelSerializer):
    form = ApplicationFormSerializer(read_only=True)

    class Meta:
        model = FormOrder
        fields = ['id', 'form', 'status']


class SponsorshipSerializer(serializers.ModelSerializer):
    donor_detail = SponsorshipDonorSerializer(source='donor', read_only=True)
    order_detail = SponsorshipOrderSerializer(source='order', read_only=True)

    class Meta:
        model = Sponsorship
        fields = ['id', 'order', 'order_detail', 'donor', 'donor_detail', 'amount', 'funded_at']
        read_only_fields = ['id', 'donor', 'funded_at']

    def create(self, validated_data):
        sponsorship = super().create(validated_data)
        order = sponsorship.order
        order.status = FormOrder.Status.SPONSORED
        order.save(update_fields=['status'])
        return sponsorship


class FormOrderSerializer(serializers.ModelSerializer):
    payment = PaymentSerializer(read_only=True)
    sponsorship = SponsorshipSerializer(read_only=True)

    class Meta:
        model = FormOrder
        fields = ['id', 'youth', 'form', 'order_type', 'status', 'created_at', 'payment', 'sponsorship']
        read_only_fields = ['id', 'youth', 'status', 'created_at']
