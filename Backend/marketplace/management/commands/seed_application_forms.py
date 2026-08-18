"""
Seeds ApplicationForm rows for the Forms Marketplace, tied to real,
already-seeded Institution records (see seed_universities.py) whose
official application URL was hand-verified in
seed_institution_application_urls.py.

Run with: python manage.py seed_application_forms
(run seed_institution_application_urls first — this reuses those rows)

Prices below are e-voucher/application fees found via multiple independent
listings during verification (August 2026). Where sources disagreed on the
exact figure (GIMPA, UPSA, Ashesi), price_ghs is left null on purpose —
those cards show only the official-site link, not a guessed fee. Fees
change every admissions cycle; re-verify before trusting an old figure.
"""
from django.core.management.base import BaseCommand

from accounts.models import Institution
from marketplace.models import ApplicationForm

# (institution name, form title, price_ghs or None)
FORMS = [
    ('University of Ghana', 'Undergraduate Application Form', 220),
    ('Kwame Nkrumah University of Science and Technology', 'Undergraduate Application Form', 250),
    ('University of Cape Coast', 'Undergraduate Application Form', 220),
    ('University of Education, Winneba', 'Undergraduate Application Form', 255),
    ('Ghana Institute of Management and Public Administration', 'Undergraduate Application Form', None),
    ('University for Development Studies', 'Undergraduate Application Form', 200),
    ('University of Professional Studies, Accra', 'Undergraduate Application Form', None),
    ('University of Mines and Technology', 'BSc Application Form', 230),
    ('Ashesi University', 'Undergraduate Application Form', None),
    ('Accra Technical University', 'Undergraduate / HND Application Form', 230),
    ('Kumasi Technical University', 'Undergraduate Application Form', 200),
]


class Command(BaseCommand):
    help = 'Seeds Forms Marketplace entries for real, verified institutions.'

    def handle(self, *args, **options):
        created = 0
        missing = []
        for institution_name, title, price in FORMS:
            try:
                institution = Institution.objects.get(name=institution_name)
            except Institution.DoesNotExist:
                missing.append(institution_name)
                continue

            _, was_created = ApplicationForm.objects.get_or_create(
                institution=institution, title=title, defaults={'price_ghs': price}
            )
            if was_created:
                created += 1

        self.stdout.write(f'Application forms created: {created}')
        if missing:
            self.stdout.write(self.style.WARNING('No matching Institution row found for: ' + ', '.join(missing)))
