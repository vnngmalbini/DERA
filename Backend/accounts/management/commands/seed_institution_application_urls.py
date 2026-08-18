"""
Attaches each institution's real, official admissions/application URL to the
matching (already-seeded) Institution row.

Run with: python manage.py seed_institution_application_urls

This is a deliberately small, hand-verified list — every URL below was
checked (August 2026) against the institution's own domain before being
added. Do not bulk-generate entries for the remaining seeded schools/
universities by guessing a domain pattern; add a new verified row here only
after confirming the real portal, the same way these were confirmed.
"""
from django.core.management.base import BaseCommand

from accounts.models import Institution

# name must match the Institution.name value exactly as seeded by
# seed_universities.py / seed_ghana_data.py.
VERIFIED_APPLICATION_URLS = {
    # Every URL here is the direct apply/login/start step of the portal —
    # not a general admissions info page — so a click lands the applicant
    # where they buy/start the form, not one hop earlier. Confirmed
    # reachable and legitimate via direct fetch, August 2026.
    'University of Ghana': 'https://apply.ug.edu.gh/admissions/undergrad/login',
    'Kwame Nkrumah University of Science and Technology': 'https://apps.knust.edu.gh/admissions/apply',
    'University of Cape Coast': 'https://application.ucc.edu.gh/',
    'University of Education, Winneba': 'https://uew.edu.gh/admissions/apply-online',
    'Ghana Institute of Management and Public Administration': 'https://apply.gimpa.edu.gh/start',
    'University for Development Studies': 'https://admissions.uds.edu.gh/application/user/login',
    'University of Professional Studies': 'https://upsasip.com/adm-area',
    'University of Professional Studies, Accra': 'https://upsasip.com/adm-area',
    'University of Mines and Technology': 'https://apply.umat.edu.gh/',
    'Ashesi University': 'https://admissions.ashesi.edu.gh/',
    'Accra Technical University': 'https://application.atu.edu.gh/',
    'Kumasi Technical University': 'https://apply.kstu.edu.gh/',
}


class Command(BaseCommand):
    help = "Sets Institution.application_url for a hand-verified set of real institutions."

    def handle(self, *args, **options):
        updated = 0
        missing = []
        for name, url in VERIFIED_APPLICATION_URLS.items():
            count = Institution.objects.filter(name=name).update(application_url=url)
            if count:
                updated += count
            else:
                missing.append(name)

        self.stdout.write(f'Institutions updated with application_url: {updated}')
        if missing:
            self.stdout.write(
                self.style.WARNING(
                    'No matching Institution row found for: ' + ', '.join(missing)
                )
            )
