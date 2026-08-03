from django.db import migrations

MENTORS = [
    {
        'icon': 'engineering',
        'title': 'Ama Kusi',
        'subtitle': 'Software Engineer, Accra',
        'description': 'Matched on your Career Quiz results — Agri-Tech & Software track.',
        'tag': 'Matched',
    },
    {
        'icon': 'agriculture',
        'title': 'Kwabena Owusu',
        'subtitle': 'Agribusiness Founder, Kumasi',
        'description': 'Runs a farming cooperative; open to mentoring on entrepreneurship.',
        'tag': 'Suggested',
    },
    {
        'icon': 'health_and_safety',
        'title': 'Dr. Efua Boateng',
        'subtitle': 'Public Health Officer, Takoradi',
        'description': 'Mentors students interested in health sciences and community work.',
        'tag': 'Suggested',
    },
]


def seed_mentors(apps, schema_editor):
    Mentor = apps.get_model('mentorship', 'Mentor')
    for entry in MENTORS:
        Mentor.objects.get_or_create(title=entry['title'], defaults=entry)


def remove_mentors(apps, schema_editor):
    Mentor = apps.get_model('mentorship', 'Mentor')
    Mentor.objects.filter(title__in=[entry['title'] for entry in MENTORS]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('mentorship', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_mentors, remove_mentors),
    ]
