"""
Seeds real Ghanaian senior high schools sourced from Wikipedia's "List of
senior high schools in Ghana" article (fetched + parsed July 2026 from the
raw wikitext, not paraphrased/summarized, to keep the data authentic).

Run with: python manage.py seed_shs_schools

Reads shs_parsed.json (produced by parse_shs.py) sitting next to manage.py.
Entries whose region can't be determined from their own section header
(the "Bono, Bono East & Ahafo Regions" combined section) are resolved by
matching the district text against the already-seeded District table.

Only the plain school name is stored — no location suffix or other
disambiguation is appended to it. If two distinct schools happen to share
an identical name, only the first one seen is kept (get_or_create matches
on name alone), which is an accepted simplification.
"""
import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from accounts.models import District, Institution


class Command(BaseCommand):
    help = 'Seeds real Ghana senior high schools from shs_parsed.json (Wikipedia-sourced).'

    def handle(self, *args, **options):
        json_path = Path(__file__).resolve().parents[3] / 'data' / 'shs_parsed.json'
        if not json_path.exists():
            raise CommandError(f'{json_path} not found — run parse_shs.py first.')

        with open(json_path, encoding='utf-8') as f:
            entries = json.load(f)

        # district name -> region, for resolving the combined Bono/Bono East/Ahafo section
        district_to_region = {
            d.name.lower(): d.region for d in District.objects.all()
        }

        created = 0
        skipped_unresolved = 0

        for e in entries:
            region = e['region']
            if region is None:
                district_text = (e.get('district') or '').lower()
                match_region = None
                for dname, dregion in district_to_region.items():
                    if dname in district_text:
                        match_region = dregion
                        break
                if not match_region:
                    skipped_unresolved += 1
                    continue
                region = match_region

            name = e['school'].strip()
            _, was_created = Institution.objects.get_or_create(
                name=name, defaults={'type': 'school', 'region': region}
            )
            if was_created:
                created += 1

        self.stdout.write(
            f'SHS created: {created}, unresolved region (skipped): {skipped_unresolved}, '
            f'total school-type institutions now: {Institution.objects.filter(type="school").count()}'
        )
