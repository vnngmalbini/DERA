"""
Refreshes the Scholarship table with real, currently-tracked programs for
Ghanaian students (JHS through Tertiary/Postgraduate).

Unlike accounts.seed_ghana_data (a one-time get_or_create seed), this command
uses update_or_create keyed on title, so re-running it after checking each
program's official page updates deadlines/links in place instead of only
adding new rows. That's what makes it a "refresh" — run it periodically (or
after manually re-checking sources) to keep listings and the closing-soon
notifications in check_scholarship_deadlines current.

Run with: python manage.py refresh_scholarships

Sources (verified via web search, August 2026) — see each entry's source_url
for the authoritative page. Deadlines are the specific 2026/2027 cycle dates
found on those pages, not estimates.
"""

from datetime import date

from django.core.management.base import BaseCommand

from careers.models import Scholarship

SCHOLARSHIPS = [
    {
        # Already seeded by seed_ghana_data with deadline=None; this refresh
        # fills in the real 2026/2027 window once it was announced.
        'title': 'Local Tertiary Scholarship Scheme',
        'provider': 'Ghana Scholarships Secretariat',
        'education_level': 'Tertiary',
        'deadline': date(2026, 5, 20),
        'eligibility_criteria': (
            'Ghanaian citizen with a valid Ghana Card, wrote WASSCE in 2024, and has gained admission or '
            'applied for admission into an accredited local tertiary institution. Application window for '
            'the 2026/2027 cycle ran 20 April - 20 May 2026 via the official portal; late submissions were '
            'not accepted. Both full and partial awards for undergraduate and postgraduate study.'
        ),
        'source_url': 'https://scholarships.gov.gh/local-information',
    },
    {
        'title': 'Mastercard Foundation Scholars Program at Ashesi University',
        'provider': 'Mastercard Foundation / Ashesi University',
        'education_level': 'Tertiary',
        'deadline': date(2026, 11, 16),
        'eligibility_criteria': (
            'African citizens with excellent academic records, demonstrated financial need, and '
            'leadership potential with a commitment to giving back. Deadline shown is for the 2027 intake '
            "(combined undergraduate + master's accelerated pathway, ~5 years); no IELTS required. Fully "
            'funded: tuition, accommodation, laptop, and travel support. Each Mastercard Foundation partner '
            'university sets its own deadline — this one is Ashesi-specific.'
        ),
        'source_url': 'https://mastercardfdn.org/en/what-we-do/our-programs/mastercard-foundation-scholars-program/',
    },
    {
        'title': 'GETFund Local Tertiary Scholarship',
        'provider': 'Ghana Education Trust Fund (GETFund)',
        'education_level': 'Tertiary',
        'deadline': date(2026, 2, 20),
        'eligibility_criteria': (
            'Ghanaian students enrolled in undergraduate diploma, HND, or degree programmes, and '
            "postgraduate master's/PhD programmes, at accredited Ghanaian universities. 2026 window ran "
            '20 January - 20 February 2026.'
        ),
        'source_url': 'https://www.getfund.gov.gh/scholarships/how-to-apply',
    },
    {
        'title': 'GETFund Foreign Postgraduate Scholarship',
        'provider': 'Ghana Education Trust Fund (GETFund)',
        'education_level': 'Postgraduate',
        'deadline': date(2026, 4, 30),
        'eligibility_criteria': (
            'Ghanaian citizens with a relevant undergraduate degree and good grades, holding admission to '
            'a recognized foreign postgraduate programme in a field linked to national development '
            'priorities. Fully funded: tuition, housing, return airfare, visa fees, and medical cover. '
            '2026/2027 cycle applications ran 13-30 April 2026.'
        ),
        'source_url': 'https://www.getfund.gov.gh/scholarships/how-to-apply',
    },
    {
        'title': 'GREAT Scholarships — University of Manchester Award',
        'provider': 'British Council / University of Manchester',
        'education_level': 'Postgraduate',
        'deadline': date(2026, 4, 23),
        'eligibility_criteria': (
            'Ghanaian nationals holding an unconditional offer for a one-year taught master’s course '
            'starting September 2026 at the University of Manchester. Award value: £18,000 toward tuition. '
            'Other UK universities run their own GREAT Scholarship rounds with separate deadlines — check '
            'study-uk.britishcouncil.org for the full list.'
        ),
        'source_url': 'https://study-uk.britishcouncil.org/scholarships-funding/great-scholarships/ghana',
    },
    {
        'title': 'African Leadership Academy — Class of 2027',
        'provider': 'African Leadership Academy',
        'education_level': 'SHS',
        'deadline': date(2027, 1, 15),
        'eligibility_criteria': (
            'Pan-African pre-university programme; applicants must be born on or after 1 September 2007. '
            'Early Decision deadline is 15 October 2026, Regular Decision (shown here) is 15 January 2027. '
            'About 97% of admitted students receive need-based financial aid or a full scholarship covering '
            'tuition, boarding, meals, and uniforms.'
        ),
        'source_url': 'https://www.africanleadershipacademy.org/apply/',
    },
    {
        'title': 'GNPC Foundation Scholarship',
        'provider': 'Ghana National Petroleum Corporation (GNPC) Foundation',
        'education_level': 'Tertiary',
        'deadline': None,
        'eligibility_criteria': (
            'Ghanaian students admitted to (or continuing at) an accredited tertiary institution for '
            'undergraduate study, and separately a postgraduate scholarship track, with priority given to '
            'oil & gas, engineering, and related STEM fields. Applications open on the GNPC Foundation '
            'portal for the 2026/2027 academic year; the Foundation has extended deadlines in past cycles, '
            'so confirm the current closing date on the official site before applying.'
        ),
        'source_url': 'https://www.gnpcfoundation.org',
    },
    {
        'title': 'Ghana Gas 2026 Local Scholarship Programme',
        'provider': 'Ghana National Gas Company (Ghana Gas)',
        'education_level': 'Tertiary',
        'deadline': date(2026, 8, 15),
        'eligibility_criteria': (
            'Ghanaian citizen, 35 or younger at the time of application, holding an admission letter from '
            'an accredited tertiary institution in Ghana for a Diploma or Undergraduate programme, and not '
            'currently receiving another scholarship. Submission window: 15 July - 15 August 2026. Apply '
            'via the official portal at scholarship.ghanagas.com.gh with admission letter, SHS/Vocational/'
            'Technical certificates, Ghana Card, passport photo, and academic transcripts.'
        ),
        'source_url': 'https://scholarship.ghanagas.com.gh/',
    },
    {
        'title': "Konson Aid Girls' STEM Scholarship",
        'provider': 'Konson Aid',
        'education_level': 'JHS',
        'deadline': None,
        'eligibility_criteria': (
            'Girls aged 13-18 in JHS 1-3, ranked in the top 10 of their class, from rural/underserved '
            'districts (pilot: Bodi/Akontombra, Western North Region), demonstrating financial need. Free '
            'to apply via school liaison or info@konsonaid.org. Covers tuition, exams, uniforms, hygiene '
            'kits, mentorship, and eco-club participation. Reviewed on a rolling basis before each academic '
            'year — no fixed cycle deadline.'
        ),
        'source_url': 'https://konsonaid.org/scholarship/',
    },
]


class Command(BaseCommand):
    help = "Refreshes real scholarship listings (deadlines/links) for the Scholarship Hub. Safe to re-run."

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0
        for s in SCHOLARSHIPS:
            _, created = Scholarship.objects.update_or_create(
                title=s['title'],
                defaults={
                    'provider': s['provider'],
                    'education_level': s['education_level'],
                    'deadline': s['deadline'],
                    'eligibility_criteria': s['eligibility_criteria'],
                    'source_url': s['source_url'],
                },
            )
            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            f'Scholarships created: {created_count}, updated: {updated_count} '
            f'(total: {Scholarship.objects.count()})'
        )
