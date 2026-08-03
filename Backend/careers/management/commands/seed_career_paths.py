"""
Seeds the 5 CareerPath "trait" buckets that Frontend/src/pages/CareerQuiz.jsx
scores its quiz into (TECH/PEOPLE/CREATIVE/BUSINESS/PRACTICAL), then links
each one to real institutions and to the scholarships in our data that
genuinely target that field — so the quiz results screen can show "who can
help you get there" without inventing anything.

Institution links use the exact names already seeded by
accounts.seed_ghana_data (run that first) and are limited to associations
verified via each institution's own site/Wikipedia (August 2026):
- KNUST: Dept. of Computer Science (cs.knust.edu.gh), College of Art and
  Built Environment (cabe.knust.edu.gh), College of Agriculture and Natural
  Resources.
- Ashesi University: B.Sc. Computer Science / Computer Engineering
  (admissions.ashesi.edu.gh).
- University of Ghana: Medical School (ugms.ug.edu.gh) and Business School
  (ugbs.ug.edu.gh) — a comprehensive public university, legitimately spans
  both.
- University of Health and Allied Sciences: School of Medicine (uhas.edu.gh).
- University of Education, Winneba: Ghana's primary teacher-training
  university.
- Ghana Institute of Management and Public Administration: Business School
  (gimpa.edu.gh).
- University of Mines and Technology / Kumasi Technical University:
  engineering and technical/TVET programmes.

Scholarship links only apply where the scholarship's own eligibility text
(see refresh_scholarships) names a specific field — general/any-field awards
(GETFund, Local Tertiary Scheme, Mastercard Ashesi, GREAT, ALA, CAMFED) are
left unlinked rather than force-fit into one trait.

Run with: python manage.py seed_career_paths (after seed_ghana_data and
refresh_scholarships).
"""

from django.core.management.base import BaseCommand

from accounts.models import Institution
from careers.models import CareerPath, Scholarship

CAREER_PATHS = [
    {
        'trait': CareerPath.Trait.TECH,
        'title': 'Technology & Computing Careers',
        'description': (
            'Software engineering, data science, cybersecurity, and AI-related roles for people who enjoy '
            'logical thinking and solving complex technical problems.'
        ),
        'qualification_required': "Bachelor's degree in Computer Science, Computer Engineering, IT, or related field",
        'institutions': [
            'Kwame Nkrumah University of Science and Technology',
            'Ashesi University',
        ],
        'scholarships': [
            'MTN Bright Scholarship',
            "Konson Aid Girls' STEM Scholarship",
        ],
    },
    {
        'trait': CareerPath.Trait.PEOPLE,
        'title': 'Healthcare, Education & Social Services',
        'description': (
            'Healthcare, teaching, counselling, and community/social work roles for people driven to '
            'support and uplift others.'
        ),
        'qualification_required': "Bachelor's degree in Medicine, Nursing, Education, Social Work, or related field",
        'institutions': [
            'University of Ghana',
            'University of Health and Allied Sciences',
            'University of Education, Winneba',
        ],
        'scholarships': [],
    },
    {
        'trait': CareerPath.Trait.CREATIVE,
        'title': 'Arts, Media & Design Careers',
        'description': (
            'Design, media production, writing, and fine/industrial arts roles for people who think '
            'imaginatively and enjoy creating.'
        ),
        'qualification_required': "Bachelor's degree or diploma in Fine Art, Communication Design, or a related field",
        'institutions': [
            'Kwame Nkrumah University of Science and Technology',
        ],
        'scholarships': [],
    },
    {
        'trait': CareerPath.Trait.BUSINESS,
        'title': 'Business, Finance & Entrepreneurship',
        'description': (
            'Entrepreneurship, business management, finance, and marketing roles for people motivated by '
            'leading, organizing, and building.'
        ),
        'qualification_required': "Bachelor's degree in Business Administration, Finance, Economics, or related field",
        'institutions': [
            'University of Ghana',
            'Ghana Institute of Management and Public Administration',
        ],
        'scholarships': [],
    },
    {
        'trait': CareerPath.Trait.PRACTICAL,
        'title': 'Engineering, Construction & Agriculture',
        'description': (
            'Engineering, construction trades, and agricultural careers for people who like hands-on, '
            'practical work building and fixing real things.'
        ),
        'qualification_required': "Bachelor's degree/HND in Engineering, Agriculture, or a technical trade",
        'institutions': [
            'University of Mines and Technology',
            'Kumasi Technical University',
            'Kwame Nkrumah University of Science and Technology',
        ],
        'scholarships': [
            'GNPC Foundation Scholarship',
            'Ghana Gas 2026 Local Scholarship Programme',
        ],
    },
]


class Command(BaseCommand):
    help = 'Seeds the 5 career-quiz trait buckets and links real institutions/scholarships to each.'

    def handle(self, *args, **options):
        created_count = 0
        for cp in CAREER_PATHS:
            career_path, created = CareerPath.objects.update_or_create(
                trait=cp['trait'],
                defaults={
                    'title': cp['title'],
                    'description': cp['description'],
                    'qualification_required': cp['qualification_required'],
                },
            )
            if created:
                created_count += 1

            institutions = Institution.objects.filter(name__in=cp['institutions'])
            missing = set(cp['institutions']) - set(institutions.values_list('name', flat=True))
            if missing:
                self.stdout.write(self.style.WARNING(
                    f'  {career_path.title}: institution(s) not found (run seed_ghana_data first?): {missing}'
                ))
            career_path.institutions.set(institutions)

            if cp['scholarships']:
                Scholarship.objects.filter(title__in=cp['scholarships']).update(career_path=career_path)

        self.stdout.write(
            f'Career paths created: {created_count} (total: {CareerPath.objects.count()})'
        )
