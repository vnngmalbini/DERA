from rest_framework.permissions import SAFE_METHODS, BasePermission


def _role(request):
    user = request.user
    return getattr(user, 'role', None) if user and user.is_authenticated else None


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return _role(request) == 'admin'


class IsCounselor(BasePermission):
    def has_permission(self, request, view):
        return _role(request) == 'counselor'


class IsDonor(BasePermission):
    def has_permission(self, request, view):
        return _role(request) == 'donor'


class IsYouth(BasePermission):
    def has_permission(self, request, view):
        return _role(request) == 'youth'


class IsCounselorOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return _role(request) in ('counselor', 'admin')


class IsDonorOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return _role(request) in ('donor', 'admin')


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return _role(request) == 'admin'


class IsAuthenticatedCreateOrAdminWrite(BasePermission):
    """Public read; any authenticated user may create; only admin may edit/delete.

    Used where users legitimately need to add a missing lookup row on the
    fly (e.g. "my institution isn't in the dropdown") without being able to
    alter existing entries other admins/staff curate.
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        if request.method == 'POST':
            return request.user and request.user.is_authenticated
        return _role(request) == 'admin'

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return _role(request) == 'admin'


class IsOwnerYouthOrAdmin(BasePermission):
    """Object-level check for models with a `youth` FK to YouthProfile."""

    def has_object_permission(self, request, view, obj):
        role = _role(request)
        if role == 'admin':
            return True
        if role != 'youth':
            return False
        youth_profile = getattr(request.user, 'youth_profile', None)
        return youth_profile is not None and obj.youth_id == youth_profile.id


class IsOwnerDonorOrAdmin(BasePermission):
    """Object-level check for models with a `donor` FK to DonorProfile."""

    def has_object_permission(self, request, view, obj):
        role = _role(request)
        if role == 'admin':
            return True
        if role != 'donor':
            return False
        donor_profile = getattr(request.user, 'donor_profile', None)
        return donor_profile is not None and obj.donor_id == donor_profile.id


class IsSelfProfileOrCounselorOrAdmin(BasePermission):
    """For youth/counselor/donor profile objects: owner, counselor, or admin."""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        role = _role(request)
        if role in ('counselor', 'admin'):
            return True
        return obj.user_id == request.user.id
