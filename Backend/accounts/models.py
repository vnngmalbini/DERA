import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        if not extra_fields.get('role'):
            raise ValueError('Users must have a role')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('role', User.Role.ADMIN)
        extra_fields['is_staff'] = True
        extra_fields['is_superuser'] = True
        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Base account shared by every role.

    Uses AbstractBaseUser's built-in `password` field (hashed/verified via
    set_password/check_password) instead of a literal `password_hash` column
    from the DBML source schema, since a second field would duplicate and
    fight Django's built-in auth machinery.
    """

    class Role(models.TextChoices):
        YOUTH = 'youth', 'Youth'
        COUNSELOR = 'counselor', 'Counselor'
        DONOR = 'donor', 'Donor'
        ADMIN = 'admin', 'Admin'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=32, blank=True, null=True)
    role = models.CharField(max_length=20, choices=Role.choices)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['role']

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.email


class Institution(models.Model):
    class Type(models.TextChoices):
        SCHOOL = 'school', 'School'
        UNIVERSITY = 'university', 'University'
        TECHNICAL_UNIVERSITY = 'technical_university', 'Technical University'
        COLLEGE_OF_EDUCATION = 'college_of_education', 'College of Education'
        TVET_CENTRE = 'tvet_centre', 'TVET Centre'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=30, choices=Type.choices)
    region = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'institutions'

    def __str__(self):
        return self.name


class District(models.Model):
    """A district (MMDA) within one of Ghana's 16 regions.

    Kept as a simple lookup table (not an FK target from YouthProfile.region,
    which stays a free string for consistency with the existing design) so
    the frontend can query districts by region for a cascading dropdown.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    region = models.CharField(max_length=100)

    class Meta:
        db_table = 'districts'
        unique_together = ('name', 'region')
        ordering = ['region', 'name']

    def __str__(self):
        return f'{self.name} ({self.region})'


class YouthProfile(models.Model):
    """Profile for a young person using the platform (formerly "student")."""

    class EducationLevel(models.TextChoices):
        PRIMARY = 'primary', 'Primary'
        JHS = 'jhs', 'JHS'
        SHS = 'shs', 'SHS'
        SHS_GRADUATE = 'shs_graduate', 'SHS Graduate'
        TERTIARY = 'tertiary', 'Tertiary'
        DROPOUT_RE_ENTRY = 'dropout_re_entry', 'Dropout Re-entry'
        TEEN_MOTHER_PROGRAM = 'teen_mother_program', 'Teen Mother Program'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='youth_profile')
    full_name = models.CharField(max_length=255)
    date_of_birth = models.DateField(blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    education_level = models.CharField(max_length=30, choices=EducationLevel.choices, blank=True, null=True)
    institution = models.ForeignKey(
        Institution, on_delete=models.SET_NULL, blank=True, null=True, related_name='youth_profiles'
    )
    gender = models.CharField(max_length=20, blank=True, null=True)
    assigned_counselor = models.ForeignKey(
        'CounselorProfile', on_delete=models.SET_NULL, blank=True, null=True, related_name='assigned_youth'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'youth_profiles'

    def __str__(self):
        return self.full_name


class CounselorProfile(models.Model):
    """Profile for school/NGO staff who monitor and support youth (formerly "teacher")."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='counselor_profile')
    full_name = models.CharField(max_length=255)
    institution = models.ForeignKey(
        Institution, on_delete=models.SET_NULL, blank=True, null=True, related_name='counselor_profiles'
    )
    role_title = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'counselor_profiles'

    def __str__(self):
        return self.full_name


class Notification(models.Model):
    """In-app alert for a user (e.g. a scholarship deadline closing soon).

    `related_object_id` + `category` together let a management command
    re-run safely: `unique_together` makes creating the same alert twice a
    no-op instead of spamming duplicates.
    """

    class Category(models.TextChoices):
        SCHOLARSHIP_DEADLINE = 'scholarship_deadline', 'Scholarship deadline'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    category = models.CharField(max_length=30, choices=Category.choices)
    title = models.CharField(max_length=255)
    message = models.TextField(blank=True, null=True)
    link = models.CharField(max_length=255, blank=True, null=True)
    related_object_id = models.UUIDField(blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        unique_together = ('user', 'category', 'related_object_id')

    def __str__(self):
        return f'{self.title} -> {self.user}'


class DonorProfile(models.Model):
    class DonorType(models.TextChoices):
        INDIVIDUAL = 'individual', 'Individual'
        NGO = 'ngo', 'NGO'
        ALUMNI = 'alumni', 'Alumni'
        CORPORATE = 'corporate', 'Corporate'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='donor_profile')
    full_name = models.CharField(max_length=255)
    organization = models.CharField(max_length=255, blank=True, null=True)
    donor_type = models.CharField(max_length=20, choices=DonorType.choices, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'donor_profiles'

    def __str__(self):
        return self.full_name
