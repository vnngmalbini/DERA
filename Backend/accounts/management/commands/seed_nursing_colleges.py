"""
Seeds real Ghanaian nursing/midwifery training colleges sourced from
Wikipedia's "List of Nursing Training Colleges in Ghana" article (fetched
+ parsed July 2026 from the raw wikitext).

Run with: python manage.py seed_nursing_colleges

Modeled as type='college_of_education' — the closest fit in this project's
Institution.Type enum, since there is no dedicated nursing-college type in
the schema (matches the earlier seed of Tamale Nursing and Midwifery
Training College).
"""
import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from accounts.models import Institution

TOWN_TO_REGION = {
    'sekondi': 'Western',
    'seikwa': 'Bono',
}


class Command(BaseCommand):
    help = 'Seeds real Ghana nursing/midwifery training colleges (Wikipedia-sourced).'

    def handle(self, *args, **options):
        json_path = Path(__file__).resolve().parents[3] / 'data' / 'nursing_parsed.json'
        if not json_path.exists():
            raise CommandError(f'{json_path} not found — run parse_nursing.py first.')

        with open(json_path, encoding='utf-8') as f:
            entries = json.load(f)

        created = 0
        skipped = 0
        for e in entries:
            name = e['name'].strip()
            region = e['region']
            if not region:
                for town, r in TOWN_TO_REGION.items():
                    if town in name.lower():
                        region = r
                        break
            if not region or not name or len(name) < 5:
                skipped += 1
                continue

            _, was_created = Institution.objects.get_or_create(
                name=name, defaults={'type': 'college_of_education', 'region': region}
            )
            if was_created:
                created += 1

        self.stdout.write(f'Nursing colleges created: {created}, skipped: {skipped}')
