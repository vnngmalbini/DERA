from decimal import Decimal

from django.db.models import Sum
from rest_framework import serializers

from .models import Donation, ImpactReport, Project


class ProjectSerializer(serializers.ModelSerializer):
    # Computed from real linked Donations rather than stored, so it can
    # never drift from what donors actually gave. ProjectViewSet annotates
    # these as `raised_amount_agg`/`donor_count_agg` via correlated
    # subqueries (one query for the whole list, not two per project); the
    # per-object fallback below only runs for a Project fetched ad hoc
    # elsewhere (e.g. nested inside a single Donation) without that annotation.
    raised_amount = serializers.SerializerMethodField()
    donor_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'icon', 'title', 'region', 'status', 'description', 'target_amount',
            'raised_amount', 'donor_count', 'created_at',
        ]

    def get_raised_amount(self, obj):
        if hasattr(obj, 'raised_amount_agg'):
            return obj.raised_amount_agg
        total = obj.donations.filter(status=Donation.Status.SUCCESS).aggregate(total=Sum('amount'))['total']
        return total or Decimal('0')

    def get_donor_count(self, obj):
        if hasattr(obj, 'donor_count_agg'):
            return obj.donor_count_agg
        return obj.donations.filter(status=Donation.Status.SUCCESS).values('donor_email').distinct().count()


class ImpactReportSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(), source='project', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = ImpactReport
        fields = ['id', 'icon', 'title', 'tag', 'description', 'published_at', 'project', 'project_id', 'created_at']


class DonationSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)

    class Meta:
        model = Donation
        fields = [
            'id', 'donor_name', 'donor_email', 'amount', 'reference', 'status', 'created_at', 'paid_at', 'project',
        ]
        read_only_fields = ['id', 'reference', 'status', 'created_at', 'paid_at']
