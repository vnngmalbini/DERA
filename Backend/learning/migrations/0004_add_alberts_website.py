from django.db import migrations

RESOURCES = [
    {
        'icon': 'language',
        'title': 'GWIT',
        'subtitle': 'Professional Tech Training & Services',
        'description': "Access GWIT's professional technology training programmes, apps, and services to build in-demand tech skills.",
        'tag': 'Recommended',
        'url': 'https://appsportal.gwitglobal.com/',
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
        ('learning', '0003_more_resources'),
    ]

    operations = [
        migrations.RunPython(seed_resources, remove_resources),
    ]
