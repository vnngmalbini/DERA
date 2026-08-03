from django.db import migrations

RESOURCES = [
    {
        'icon': 'calculate',
        'title': 'WASSCE Core Maths Prep',
        'subtitle': 'Course · Self-paced',
        'description': 'Video lessons and practice exercises covering core mathematics topics.',
        'tag': 'Popular',
        'url': 'https://www.khanacademy.org/math',
    },
    {
        'icon': 'menu_book',
        'title': 'English Comprehension Bootcamp',
        'subtitle': 'Course · Self-paced',
        'description': 'Build reading comprehension skills with free practice texts by level.',
        'tag': 'New',
        'url': 'https://learnenglish.britishcouncil.org/free-resources/reading',
    },
    {
        'icon': 'code',
        'title': 'Intro to Coding with Python',
        'subtitle': 'Course · Beginner',
        'description': 'A gentle introduction to programming fundamentals.',
        'tag': 'Popular',
        'url': 'https://www.freecodecamp.org/learn/learn-python-for-beginners',
    },
]


def seed_resources(apps, schema_editor):
    LearningResource = apps.get_model('learning', 'LearningResource')
    for entry in RESOURCES:
        LearningResource.objects.get_or_create(title=entry['title'], defaults=entry)


def remove_resources(apps, schema_editor):
    LearningResource = apps.get_model('learning', 'LearningResource')
    LearningResource.objects.filter(title__in=[entry['title'] for entry in RESOURCES]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('learning', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_resources, remove_resources),
    ]
