from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from rest_framework import serializers

from .models import CounselorProfile, District, DonorProfile, Institution, Notification, User, YouthProfile


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ['id', 'name', 'type', 'region', 'application_url', 'created_at']


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ['id', 'name', 'region']


class YouthProfileSerializer(serializers.ModelSerializer):
    # `institution` stays the writable FK id (frontend forms already submit
    # it that way); this adds the display name alongside it so clients don't
    # have to render the raw id or make a second lookup just to show it.
    institution_name = serializers.SerializerMethodField()
    assigned_counselor_name = serializers.SerializerMethodField()

    class Meta:
        model = YouthProfile
        fields = [
            'id', 'user', 'full_name', 'date_of_birth', 'region', 'district',
            'education_level', 'institution', 'institution_name', 'gender',
            'assigned_counselor', 'assigned_counselor_name', 'created_at',
        ]
        read_only_fields = ['id', 'user', 'created_at']

    def get_institution_name(self, obj):
        return obj.institution.name if obj.institution_id else None

    def get_assigned_counselor_name(self, obj):
        return obj.assigned_counselor.full_name if obj.assigned_counselor_id else None


class CounselorProfileSerializer(serializers.ModelSerializer):
    institution_name = serializers.SerializerMethodField()

    class Meta:
        model = CounselorProfile
        fields = ['id', 'user', 'full_name', 'institution', 'institution_name', 'role_title', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def get_institution_name(self, obj):
        return obj.institution.name if obj.institution_id else None


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
            'id', 'email', 'phone', 'role', 'profile_picture', 'is_active', 'created_at', 'updated_at',
            'youth_profile', 'counselor_profile', 'donor_profile',
        ]
        read_only_fields = ['id', 'role', 'is_active', 'created_at', 'updated_at']


class AdminUserSerializer(UserSerializer):
    """Same shape as UserSerializer but lets an admin toggle is_active.

    Used only by the admin-only UserViewSet — never by MeView, so a user
    can never flip their own is_active flag through self-service /auth/me/.
    """

    class Meta(UserSerializer.Meta):
        read_only_fields = ['id', 'role', 'created_at', 'updated_at']


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    phone = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(
        choices=[c for c in User.Role.choices if c[0] != User.Role.ADMIN]
    )
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
    custom_institution_name = serializers.CharField(required=False, allow_blank=True)

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

    def validate_password(self, value):
        validate_password(value)
        return value

    @transaction.atomic
    def create(self, validated_data):
        role = validated_data['role']
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            phone=validated_data.get('phone') or None,
            role=role,
            is_active=True,
        )

        full_name = validated_data['full_name']
        if role == User.Role.YOUTH:
            institution = validated_data.get('institution')
            custom_institution_name = validated_data.get('custom_institution_name', '').strip()
            if institution is None and custom_institution_name:
                institution_type = (
                    Institution.Type.UNIVERSITY
                    if validated_data.get('education_level') in ('shs_graduate', 'tertiary')
                    else Institution.Type.SCHOOL
                )
                institution = Institution.objects.create(
                    name=custom_institution_name,
                    type=institution_type,
                    region=validated_data.get('region') or None,
                )
            YouthProfile.objects.create(
                user=user,
                full_name=full_name,
                date_of_birth=validated_data.get('date_of_birth'),
                region=validated_data.get('region') or None,
                district=validated_data.get('district') or None,
                education_level=validated_data.get('education_level') or None,
                institution=institution,
                gender=validated_data.get('gender') or None,
            )
        elif role == User.Role.COUNSELOR:
            institution = validated_data.get('institution')
            custom_institution_name = validated_data.get('custom_institution_name', '').strip()
            if institution is None and custom_institution_name:
                institution = Institution.objects.create(
                    name=custom_institution_name,
                    type=Institution.Type.SCHOOL,
                )
            CounselorProfile.objects.create(
                user=user,
                full_name=full_name,
                institution=institution,
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


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'category', 'title', 'message', 'link', 'related_object_id', 'is_read', 'created_at']
        read_only_fields = fields


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        from django.contrib.auth.tokens import PasswordResetTokenGenerator
        from django.utils.encoding import force_str
        from django.utils.http import urlsafe_base64_decode

        try:
            user_id = force_str(urlsafe_base64_decode(attrs['uid']))
            user = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError, DjangoValidationError):
            raise serializers.ValidationError('This reset link is invalid.')

        if not PasswordResetTokenGenerator().check_token(user, attrs['token']):
            raise serializers.ValidationError('This reset link is invalid or has expired.')

        validate_password(attrs['new_password'], user=user)
        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value

    def validate_new_password(self, value):
        validate_password(value, user=self.context['request'].user)
        return value

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])
        return user
