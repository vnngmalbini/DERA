"""
Alerts every youth account when a scholarship's deadline is closing soon.

Creates one accounts.Notification per (youth, scholarship) pair for any
scholarship whose deadline falls within the next WARNING_WINDOW_DAYS days
(inclusive of today, exclusive of already-past deadlines). Notification's
unique_together on (user, category, related_object_id) makes this idempotent
— re-running the command daily will not create duplicate alerts for a youth
who already has one for that scholarship.

Intended to be run on a recurring schedule (e.g. once a day) alongside
refresh_scholarships, so listings and alerts both stay current. There is no
scheduler wired up in this project yet — run manually or via your platform's
task scheduler / cron.

Run with: python manage.py check_scholarship_deadlines
"""

from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from accounts.models import Notification, YouthProfile
from careers.models import Scholarship

WARNING_WINDOW_DAYS = 7


class Command(BaseCommand):
    help = 'Notifies every youth account about scholarships closing within the next 7 days.'

    def handle(self, *args, **options):
        today = timezone.localdate()
        window_end = today + timedelta(days=WARNING_WINDOW_DAYS)

        closing_soon = Scholarship.objects.filter(deadline__gte=today, deadline__lte=window_end)
        youth_users = list(YouthProfile.objects.select_related('user').values_list('user_id', flat=True))

        if not closing_soon.exists() or not youth_users:
            self.stdout.write('No closing-soon scholarships or no youth accounts — nothing to notify.')
            return

        created_count = 0
        for scholarship in closing_soon:
            days_left = (scholarship.deadline - today).days
            when = 'today' if days_left == 0 else f'in {days_left} day{"s" if days_left != 1 else ""}'
            for user_id in youth_users:
                _, created = Notification.objects.get_or_create(
                    user_id=user_id,
                    category=Notification.Category.SCHOLARSHIP_DEADLINE,
                    related_object_id=scholarship.id,
                    defaults={
                        'title': f'{scholarship.title} closes {when}',
                        'message': (
                            f'The deadline for "{scholarship.title}" ({scholarship.provider or "see listing"}) '
                            f'is {scholarship.deadline.isoformat()}. Apply before it closes.'
                        ),
                        'link': '/scholarships',
                    },
                )
                if created:
                    created_count += 1

        self.stdout.write(
            f'Checked {closing_soon.count()} closing-soon scholarship(s) against {len(youth_users)} youth '
            f'account(s): {created_count} new notification(s) created.'
        )
