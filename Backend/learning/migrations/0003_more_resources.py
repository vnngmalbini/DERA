from django.db import migrations

# Every URL below was checked with a direct fetch (August 2026) before being
# added — same "hand-verified, no guessing" standard as
# accounts/management/commands/seed_institution_application_urls.py and
# library/management/commands/seed_books.py. Real, free (or clearly labeled
# sponsored/paid) programmes only, chosen to complement the three resources
# already seeded in 0002_seed_resources.py.
RESOURCES = [
    {
        'icon': 'workspace_premium',
        'title': 'Google Career Certificates',
        'subtitle': 'Certificate · Self-paced',
        'description': (
            'Free and low-cost, job-ready certificates from Google in IT support, data analytics, UX design, '
            'project management, and cybersecurity — no degree required.'
        ),
        'tag': 'Certificate',
        'url': 'https://grow.google/certificates/',
    },
    {
        'icon': 'computer',
        'title': 'Microsoft Learn',
        'subtitle': 'Course · Self-paced',
        'description': (
            'Free, self-paced technical courses and certification paths covering coding, cloud computing '
            '(Azure), and everyday tools like Excel and Power BI.'
        ),
        'tag': 'Free',
        'url': 'https://learn.microsoft.com',
    },
    {
        'icon': 'translate',
        'title': 'Duolingo',
        'subtitle': 'App · Self-paced',
        'description': (
            'Free, bite-sized daily lessons to build English or French fluency — useful for scholarship '
            'interviews and international opportunities.'
        ),
        'tag': 'Free',
        'url': 'https://www.duolingo.com',
    },
    {
        'icon': 'school',
        'title': 'Ghana Knowledge and Skills Bank',
        'subtitle': 'Platform · Government of Ghana',
        'description': (
            "Ghana's official government e-learning portal, offering free courses and career-planning tools "
            'for students from basic school through tertiary level, even in offline mode.'
        ),
        'tag': 'Ghana · Free',
        'url': 'https://www.gksb.gov.gh',
    },
    {
        'icon': 'terminal',
        'title': 'ALX Africa Software Engineering Programme',
        'subtitle': 'Programme · 6 months',
        'description': (
            'A hands-on software engineering programme for young Africans aged 18+, sponsored for accepted '
            'learners in partnership with the Mastercard Foundation.'
        ),
        'tag': 'Sponsored',
        'url': 'https://www.alxafrica.com',
    },
    {
        'icon': 'quiz',
        'title': 'Passco WASSCE & BECE Past Questions',
        'subtitle': 'Past Questions · Ghana',
        'description': (
            'Free downloadable WASSCE and BECE past questions and mock exams to help Ghanaian JHS and SHS '
            'students prepare for their final exams.'
        ),
        'tag': 'Ghana · Free',
        'url': 'https://passco.com.gh',
    },
    {
        'icon': 'explore',
        'title': 'Class Central',
        'subtitle': 'Course Directory',
        'description': (
            'A free directory that helps you find the best free online courses from top universities and '
            'platforms, all ranked and reviewed in one place.'
        ),
        'tag': 'Free',
        'url': 'https://www.classcentral.com',
    },
    {
        'icon': 'menu_book',
        'title': 'Coursera',
        'subtitle': 'Course · University-led',
        'description': (
            'University-led courses on business, technology, and personal development — audit most courses '
            'for free, or apply for financial aid on paid certificates.'
        ),
        'tag': 'Financial aid available',
        'url': 'https://www.coursera.org',
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
        ('learning', '0002_seed_resources'),
    ]

    operations = [
        migrations.RunPython(seed_resources, remove_resources),
    ]
