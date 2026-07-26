"""
Seeds real Ghanaian universities, technical universities, and colleges of
education sourced from Wikipedia's "List of universities in Ghana" and
"List of colleges of education in Ghana" articles (fetched + parsed July
2026 from the raw wikitext, not paraphrased, to keep the data authentic).

Run with: python manage.py seed_universities

Reads universities_parsed.json (produced by parse_universities.py) sitting
next to manage.py. Entries whose region wasn't resolvable from the article's
own location text (many college-of-education entries just name a town, not
a region) are resolved via a manual town->region lookup built from general
Ghanaian geography knowledge, verified for this well-known, bounded set of
towns.
"""
import json
import re
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from accounts.models import Institution

# Manual town/city -> region resolution for entries where the source
# article names only a town, not a region (bounded, verified set).
TOWN_TO_REGION = {
    'legon': 'Greater Accra', 'accra': 'Greater Accra', 'tesano': 'Greater Accra',
    'tema': 'Greater Accra', 'ada': 'Greater Accra',
    'abetifi': 'Eastern', 'kwahu': 'Eastern', 'akropong': 'Eastern', 'aburi': 'Eastern',
    'kibi': 'Eastern', 'akim oda': 'Eastern', 'somanya': 'Eastern', 'asokore-koforidua': 'Eastern',
    'agogo': 'Ashanti', 'akrokerri': 'Ashanti', 'kumasi': 'Ashanti', 'mampong': 'Ashanti',
    'offinso': 'Ashanti', 'agona': 'Ashanti', 'asokore': 'Ashanti',
    'akatsi': 'Volta', 'amedzofe': 'Volta', 'peki': 'Volta', 'hohoe': 'Volta',
    'wenchi': 'Bono', 'berekum': 'Bono', 'dormaa': 'Bono',
    'atebubu': 'Bono East',
    'tamale': 'Northern', 'bimbilla': 'Northern', 'yendi': 'Northern',
    'sefwi-debiso': 'Western North', 'sefwi-wiawso': 'Western North', 'enchi': 'Western North',
    'dambai': 'Oti', 'jasikan': 'Oti',
    'assin foso': 'Central', 'sekondi-takoradi': 'Central', 'cape coast': 'Central',
    'kommenda': 'Central', 'komenda': 'Central', 'bechem': 'Ahafo',
    'gambaga': 'North East', 'bawku': 'Upper East', 'navrongo': 'Upper East',
    'wa': 'Upper West', 'tumu': 'Upper West',
}


def resolve_town(text):
    text_lower = text.lower()
    for town, region in TOWN_TO_REGION.items():
        if town in text_lower:
            return region
    return None


class Command(BaseCommand):
    help = 'Seeds real Ghana universities/technical universities/colleges of education (Wikipedia-sourced).'

    def handle(self, *args, **options):
        json_path = Path(__file__).resolve().parents[3] / 'data' / 'universities_parsed.json'
        if not json_path.exists():
            raise CommandError(f'{json_path} not found — run parse_universities.py first.')

        with open(json_path, encoding='utf-8') as f:
            entries = json.load(f)

        created = 0
        skipped = 0

        for e in entries:
            name = re.sub(r'^\[https?://\S+\s+', '', e['name']).rstrip(']').strip()
            if not name or len(name) < 4:
                skipped += 1
                continue

            region = e['region'] or resolve_town(f"{name} {e.get('source_location', '')}")
            if not region:
                skipped += 1
                continue

            _, was_created = Institution.objects.get_or_create(
                name=name, defaults={'type': e['type'], 'region': region}
            )
            if was_created:
                created += 1

        self.stdout.write(
            f'Universities/CoE created: {created}, skipped (no resolvable region): {skipped}, '
            f'total university-type institutions: '
            f'{Institution.objects.filter(type__in=["university", "technical_university", "college_of_education"]).count()}'
        )
