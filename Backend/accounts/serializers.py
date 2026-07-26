from django.db import transaction
from rest_framework import serializers

from .models import CounselorProfile, District, DonorProfile, Institution, User, YouthProfile


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ['id', 'name', 'type', 'region', 'created_at']


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ['id', 'name', 'region']


class YouthProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = YouthProfile
        fields = [
            'id', 'user', 'full_name', 'date_of_birth', 'region', 'district',
            'education_level', 'institution', 'gender', 'created_at',
        ]
        read_only_fields = ['id', 'user', 'created_at']


class CounselorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CounselorProfile
        fields = ['id', 'user', 'full_name', 'institution', 'role_title', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class DonorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonorProfile
        fields = ['id', 'user', 'full_name', 'organization', 'donor_type', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    youth_profile = YouthProfileSerializer(read_only=True)
    counselor_profile = CounselorProfileSerializer(read_only=True)
    donor_profile = DonorProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'phone', 'role', 'created_at', 'updated_at',
            'youth_profile', 'counselor_profile', 'donor_profile',
        ]
        read_only_fields = ['id', 'role', 'created_at', 'updated_at']


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    phone = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=User.Role.choices)
    full_name = serializers.CharField()

    # Youth-specific (optional)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    region = serializers.CharField(required=False, allow_blank=True)
    district = serializers.CharField(required=False, allow_blank=True)
    education_level = serializers.ChoiceField(
        choices=YouthProfile.EducationLevel.choices, required=False, allow_null=True
    )
    gender = serializers.CharField(required=False, allow_blank=True)
    institution = serializers.PrimaryKeyRelatedField(
        queryset=Institution.objects.all(), required=False, allow_null=True
    )

    # Counselor-specific (optional)
    role_title = serializers.CharField(required=False, allow_blank=True)

    # Donor-specific (optional)
    organization = serializers.CharField(required=False, allow_blank=True)
    donor_type = serializers.ChoiceField(
        choices=DonorProfile.DonorType.choices, required=False, allow_null=True
    )

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value

    @transaction.atomic
    def create(self, validated_data):
        role = validated_data['role']
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            phone=validated_data.get('phone') or None,
            role=role,
        )

        full_name = validated_data['full_name']
        if role == User.Role.YOUTH:
            YouthProfile.objects.create(
                user=user,
                full_name=full_name,
                date_of_birth=validated_data.get('date_of_birth'),
                region=validated_data.get('region') or None,
                district=validated_data.get('district') or None,
                education_level=validated_data.get('education_level') or None,
                institution=validated_data.get('institution'),
                gender=validated_data.get('gender') or None,
            )
        elif role == User.Role.COUNSELOR:
            CounselorProfile.objects.create(
                user=user,
                full_name=full_name,
                institution=validated_data.get('institution'),
                role_title=validated_data.get('role_title') or None,
            )
        elif role == User.Role.DONOR:
            DonorProfile.objects.create(
                user=user,
                full_name=full_name,
                organization=validated_data.get('organization') or None,
                donor_type=validated_data.get('donor_type') or None,
            )
        # role == ADMIN: no profile table in the schema; base User record is enough.

        return user
