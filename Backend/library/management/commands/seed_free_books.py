"""
Seeds the Self Development Library — real, public-domain self-development
classics sourced from Project Gutenberg.

Unlike seed_books.py (which curates commercially published, copyrighted
titles that can only ever be linked out to, never hosted), every book here
is confirmed out-of-copyright ("copyright": false on Gutendex) so its full
text is legally free to read on-platform and download. Each entry's
gutenberg_id, title, author, and format URLs were hand-verified against the
Gutendex API (https://gutendex.com/books/<id>) on 2026-08-09 — the same
"hand-verified, no guessing" approach as seed_books.py and
accounts/management/commands/seed_institution_application_urls.py.

Safe to re-run: update_or_create keyed on gutenberg_id.

Covers 13 of the 16 Book.Category buckets, several with multiple titles.
Deliberately left empty: TECHNOLOGY, SCHOLARSHIP_PREPARATION, and
WOMEN_IN_TECHNOLOGY — these are modern concepts with no genuine
public-domain equivalent on Gutenberg; every candidate found while
researching them was too much of a stretch to tag honestly, so — same
"real fit only, no forcing it" rule as the rest of this catalog — they're
left uncovered here rather than mistagged.

Run with: python manage.py seed_free_books
"""

from django.core.management.base import BaseCommand

from library.models import Book, FreeBook

FREE_BOOKS = [
    {
        'gutenberg_id': 4507,
        'title': 'As a Man Thinketh',
        'author': 'James Allen',
        'category': Book.Category.PERSONAL_DEVELOPMENT,
        'description': (
            'A short, foundational self-help classic on how habitual thought shapes character and '
            'circumstance — the root text behind most modern personal-development writing.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/4507/pg4507.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/4507.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/4507.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/4507.epub3.images',
    },
    {
        'gutenberg_id': 59844,
        'title': 'The Science of Getting Rich',
        'author': 'Wallace D. Wattles',
        'category': Book.Category.FINANCIAL_LITERACY,
        'description': (
            'A 1910 classic on building wealth through deliberate thought and action — a direct '
            'ancestor of much modern financial-mindset writing.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/59844/pg59844.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/59844.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/59844.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/59844.epub3.images',
    },
    {
        'gutenberg_id': 2680,
        'title': 'Meditations',
        'author': 'Marcus Aurelius',
        'category': Book.Category.EMOTIONAL_INTELLIGENCE,
        'description': (
            "The Roman emperor's private journal on self-discipline, resilience, and staying calm under "
            'pressure — one of the most enduring texts on emotional self-mastery ever written.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/2680/pg2680.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/2680.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/2680.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/2680.epub3.images',
    },
    {
        'gutenberg_id': 132,
        'title': 'The Art of War',
        'author': 'Sun Tzu',
        'category': Book.Category.LEADERSHIP,
        'description': (
            'An ancient strategy text on discipline, planning, and leadership under pressure, still widely '
            'read today far beyond its original military context.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/132/pg132.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/132.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/132.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/132.epub3.images',
    },
    {
        'gutenberg_id': 368,
        'title': 'Acres of Diamonds',
        'author': 'Russell H. Conwell',
        'category': Book.Category.ENTREPRENEURSHIP,
        'description': (
            "A famous lecture-turned-book arguing that opportunity is usually already where you stand — "
            'a classic on recognizing and acting on the potential in your own circumstances.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/368/pg368.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/368.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/368.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/368.epub3.images',
    },
    {
        'gutenberg_id': 2274,
        'title': 'How to Live on 24 Hours a Day',
        'author': 'Arnold Bennett',
        'category': Book.Category.PRODUCTIVITY_STUDY_SKILLS,
        'description': (
            'A practical, still-relevant 1910 guide to using ordinary daily time well — an early classic '
            'of what would now be called time management and productivity.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/2274/pg2274.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/2274.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/2274.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/2274.epub3.images',
    },
    {
        'gutenberg_id': 148,
        'title': 'The Autobiography of Benjamin Franklin',
        'author': 'Benjamin Franklin',
        'category': Book.Category.PROFESSIONAL_DEVELOPMENT,
        'description': (
            "Franklin's own account of building his character, habits, and career from nothing — including "
            'his famous system for deliberately practicing thirteen virtues.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/148/pg148.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/148.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/148.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/148.epub3.images',
    },
    {
        'gutenberg_id': 205,
        'title': 'Walden',
        'author': 'Henry David Thoreau',
        'category': Book.Category.FAITH_CHARACTER_DEVELOPMENT,
        'description': (
            "Thoreau's account of two years living simply and deliberately by Walden Pond — a foundational "
            'reflection on character, purpose, and independence from convention.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/205/pg205.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/205.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/205.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/205.epub3.images',
    },
    {
        'gutenberg_id': 21291,
        'title': 'Pushing to the Front',
        'author': 'Orison Swett Marden',
        'category': Book.Category.CAREER_DEVELOPMENT,
        'description': (
            'A hugely popular 1894 collection of success stories and principles about ambition, '
            'self-reliance, and persistence — one of the founding texts of the self-help genre.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/21291/pg21291.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/21291.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/21291.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/21291.epub3.images',
    },
    {
        'gutenberg_id': 2944,
        'title': 'Essays — First Series',
        'author': 'Ralph Waldo Emerson',
        'category': Book.Category.INNOVATION_CREATIVITY,
        'description': (
            'Includes "Self-Reliance," Emerson\'s landmark essay on original thinking and trusting your '
            'own judgment instead of following the crowd.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/2944/pg2944.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/2944.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/2944.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/2944.epub3.images',
    },
    {
        'gutenberg_id': 935,
        'title': 'Self Help',
        'author': 'Samuel Smiles',
        'category': Book.Category.PERSONAL_DEVELOPMENT,
        'description': (
            'The 1859 book that popularized the term "self-help" — biographical sketches of people who '
            'achieved great things through persistence and character rather than privilege.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/935/pg935.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/935.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/935.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/935.epub3.images',
    },
    {
        'gutenberg_id': 2397,
        'title': 'The Story of My Life',
        'author': 'Helen Keller',
        'category': Book.Category.PERSONAL_DEVELOPMENT,
        'description': (
            "Keller's own account of overcoming deaf-blindness to earn a university degree and become a "
            'world figure — a direct, powerful account of persistence against real adversity.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/2397/pg2397.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/2397.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/2397.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/2397.epub3.images',
    },
    {
        'gutenberg_id': 3296,
        'title': 'The Confessions of St. Augustine',
        'author': 'Augustine of Hippo',
        'category': Book.Category.PERSONAL_DEVELOPMENT,
        'description': (
            "One of history's most honest personal memoirs — a candid account of Augustine's own moral "
            'struggle and transformation, still widely read as an early model of self-examination.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/3296/pg3296.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/3296.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/3296.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/3296.epub3.images',
    },
    {
        'gutenberg_id': 43855,
        'title': "Franklin's Way to Wealth",
        'author': 'Benjamin Franklin',
        'category': Book.Category.FINANCIAL_LITERACY,
        'description': (
            'Franklin\'s own collection of "Poor Richard" proverbs on thrift, work, and saving — plain, '
            'quotable financial wisdom that has stayed in print for over 250 years.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/43855/pg43855.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/43855.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/43855.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/43855.epub3.images',
    },
    {
        'gutenberg_id': 14418,
        'title': 'Thrift',
        'author': 'Samuel Smiles',
        'category': Book.Category.FINANCIAL_LITERACY,
        'description': (
            'A 19th-century case for saving and living within your means, illustrated with real examples of '
            'people who built security through modest, consistent habits.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/14418/pg14418.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/14418.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/14418.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/14418.epub3.images',
    },
    {
        'gutenberg_id': 21622,
        'title': 'Architects of Fate',
        'author': 'Orison Swett Marden',
        'category': Book.Category.CAREER_DEVELOPMENT,
        'description': (
            'Profiles of people who built significant careers from ordinary starting points, organized '
            'around the habits and choices that made the difference.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/21622/pg21622.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/21622.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/21622.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/21622.epub3.images',
    },
    {
        'gutenberg_id': 20513,
        'title': 'How to Succeed',
        'author': 'Orison Swett Marden',
        'category': Book.Category.CAREER_DEVELOPMENT,
        'description': (
            'A practical companion to Pushing to the Front, focused specifically on the early, "stepping '
            'stone" choices that shape whether a career gets off the ground.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/20513/pg20513.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/20513.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/20513.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/20513.epub3.images',
    },
    {
        'gutenberg_id': 8581,
        'title': 'The Art of Money Getting',
        'author': 'P. T. Barnum',
        'category': Book.Category.ENTREPRENEURSHIP,
        'description': (
            "Barnum's own rules for building a business, drawn from his career as a showman and "
            'entrepreneur — blunt, practical advice on debt, focus, and reputation.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/8581/pg8581.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/8581.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/8581.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/8581.epub3.images',
    },
    {
        'gutenberg_id': 2376,
        'title': 'Up from Slavery',
        'author': 'Booker T. Washington',
        'category': Book.Category.LEADERSHIP,
        'description': (
            "Washington's autobiography of building Tuskegee Institute from nothing — a firsthand account "
            'of leading an institution and a community against enormous odds.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/2376/pg2376.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/2376.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/2376.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/2376.epub3.images',
    },
    {
        'gutenberg_id': 11982,
        'title': 'Eighty Years and More',
        'author': 'Elizabeth Cady Stanton',
        'category': Book.Category.LEADERSHIP,
        'description': (
            "Stanton's memoir of leading the women's rights movement for decades — a firsthand account of "
            'building and sustaining a reform movement across a lifetime.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/11982/pg11982.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/11982.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/11982.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/11982.epub3.images',
    },
    {
        'gutenberg_id': 1319,
        'title': 'Increasing Human Efficiency in Business',
        'author': 'Walter Dill Scott',
        'category': Book.Category.PRODUCTIVITY_STUDY_SKILLS,
        'description': (
            'An early application of psychology to workplace habits and effectiveness — a more analytical '
            'companion to Deep Work-style advice, from one of the founders of industrial psychology.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/1319/pg1319.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/1319.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/1319.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/1319.epub3.images',
    },
    {
        'gutenberg_id': 45109,
        'title': 'The Enchiridion',
        'author': 'Epictetus',
        'category': Book.Category.EMOTIONAL_INTELLIGENCE,
        'description': (
            'A short, direct Stoic handbook on distinguishing what you can and cannot control — one of the '
            'clearest ancient texts on emotional self-regulation under pressure.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/45109/pg45109.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/45109.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/45109.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/45109.epub3.images',
    },
    {
        'gutenberg_id': 9944,
        'title': 'The Conquest of Fear',
        'author': 'Basil King',
        'category': Book.Category.EMOTIONAL_INTELLIGENCE,
        'description': (
            'A widely-read early self-help book focused specifically on managing fear and anxiety — '
            'practical strategies for staying steady under stress.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/9944/pg9944.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/9944.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/9944.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/9944.epub3.images',
    },
    {
        'gutenberg_id': 16317,
        'title': 'The Art of Public Speaking',
        'author': 'J. Berg Esenwein and Dale Carnegie',
        'category': Book.Category.COMMUNICATION_PUBLIC_SPEAKING,
        'description': (
            "Dale Carnegie's early, foundational textbook on public speaking — structure, delivery, and "
            'overcoming nervousness, written before his later, still-copyrighted bestsellers.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/16317/pg16317.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/16317.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/16317.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/16317.epub3.images',
    },
    {
        'gutenberg_id': 22222,
        'title': 'How to Write Letters',
        'author': 'Mary Owens Crowther',
        'category': Book.Category.COMMUNICATION_PUBLIC_SPEAKING,
        'description': (
            'A practical guide to clear business and personal written correspondence — the written-word '
            'counterpart to public speaking, still directly useful for emails and applications today.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/22222/pg22222.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/22222.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/22222.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/22222.epub3.images',
    },
    {
        'gutenberg_id': 23347,
        'title': 'Mental Efficiency',
        'author': 'Arnold Bennett',
        'category': Book.Category.ACADEMIC_SUCCESS,
        'description': (
            'Practical hints on concentration, memory, and organizing mental effort — directly useful for '
            'studying, from the same author as How to Live on 24 Hours a Day.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/23347/pg23347.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/23347.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/23347.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/23347.epub3.images',
    },
    {
        'gutenberg_id': 3538,
        'title': 'The Americanization of Edward Bok',
        'author': 'Edward Bok',
        'category': Book.Category.GLOBAL_OPPORTUNITIES,
        'description': (
            'A Pulitzer Prize-winning autobiography of a Dutch immigrant boy who built a major career in a '
            'new country from nothing — a firsthand account of turning global opportunity into a real life.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/3538/pg3538.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/3538.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/3538.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/3538.epub3.images',
    },
    {
        'gutenberg_id': 2541,
        'title': 'Character',
        'author': 'Samuel Smiles',
        'category': Book.Category.FAITH_CHARACTER_DEVELOPMENT,
        'description': (
            "A companion to Smiles's Self Help focused specifically on integrity, duty, and moral "
            'character — illustrated throughout with real historical examples.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/2541/pg2541.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/2541.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/2541.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/2541.epub3.images',
    },
    {
        'gutenberg_id': 1653,
        'title': 'The Imitation of Christ',
        'author': 'Thomas à Kempis',
        'category': Book.Category.FAITH_CHARACTER_DEVELOPMENT,
        'description': (
            'One of the most widely read Christian devotional texts ever written — short reflections on '
            'humility, discipline, and inner life, read across denominations for over 500 years.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/1653/pg1653.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/1653.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/1653.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/1653.epub3.images',
    },
    {
        'gutenberg_id': 22359,
        'title': 'An Essay on Professional Ethics',
        'author': 'George Sharswood',
        'category': Book.Category.PROFESSIONAL_DEVELOPMENT,
        'description': (
            'A classic treatment of professional conduct and integrity in the workplace — the responsibilities '
            'that come with any professional role, not just the technical skills of it.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/22359/pg22359.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/22359.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/22359.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/22359.epub3.images',
    },
    {
        'gutenberg_id': 41838,
        'title': 'The Art of Logical Thinking',
        'author': 'William Walker Atkinson',
        'category': Book.Category.INNOVATION_CREATIVITY,
        'description': (
            'A practical introduction to reasoning clearly and spotting flawed logic — the analytical '
            'foundation underneath most creative problem-solving.'
        ),
        'cover_url': 'https://www.gutenberg.org/cache/epub/41838/pg41838.cover.medium.jpg',
        'html_url': 'https://www.gutenberg.org/ebooks/41838.html.images',
        'text_url': 'https://www.gutenberg.org/ebooks/41838.txt.utf-8',
        'epub_url': 'https://www.gutenberg.org/ebooks/41838.epub3.images',
    },
]


class Command(BaseCommand):
    help = 'Seeds the Self Development Library: real, public-domain books from Project Gutenberg. Safe to re-run.'

    def handle(self, *args, **options):
        created, updated = 0, 0
        for b in FREE_BOOKS:
            _, was_created = FreeBook.objects.update_or_create(gutenberg_id=b['gutenberg_id'], defaults=b)
            created += was_created
            updated += not was_created
        self.stdout.write(
            f'Self Development Library books created: {created}, updated: {updated} (total: {FreeBook.objects.count()})'
        )
