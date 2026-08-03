"""
Seeds the Growth Librarian's real book catalog and a starter set of reading
challenges.

Every book below is a real, published, widely-known title — verified either
from general knowledge of extremely canonical works, or (where less certain)
via web search (August 2026): "How to Write a Winning Scholarship Essay" by
Gen & Kelly Tanabe and "Designing Your Life" by Bill Burnett & Dave Evans
were both confirmed against their publisher/retailer listings. None of this
content is AI-invented — the Growth Librarian chat is instructed to only
recommend real books too, but this catalog is what backs the Reading
Tracker, ratings, and reviews, so it needs to be right independently of
whatever the chat says in any given conversation.

One book per category (16 categories, matching the Growth Librarian's
system prompt) — a starting catalog, not exhaustive. Safe to re-run:
update_or_create keyed on title.

Run with: python manage.py seed_books
"""

from django.core.management.base import BaseCommand

from library.models import Book, ReadingChallenge

BOOKS = [
    {
        'title': 'Atomic Habits',
        'author': 'James Clear',
        'category': Book.Category.PERSONAL_DEVELOPMENT,
        'reading_level': Book.ReadingLevel.BEGINNER,
        'estimated_reading_time': '5-6 hours',
        'why_recommended': (
            'Builds strong habits through tiny, consistent changes rather than relying on willpower or '
            'motivation alone — a practical foundation for every other goal on this list.'
        ),
        'key_lessons': [
            'Focus on systems and identity, not just goals.',
            'Make good habits obvious, attractive, easy, and satisfying.',
            'Small 1% improvements compound into large results over time.',
        ],
        'who_should_read': 'Anyone who wants to build consistency in study, work, or personal routines.',
        'difficulty_rating': 1,
    },
    {
        'title': 'Rich Dad Poor Dad',
        'author': 'Robert Kiyosaki',
        'category': Book.Category.FINANCIAL_LITERACY,
        'reading_level': Book.ReadingLevel.BEGINNER,
        'estimated_reading_time': '4-5 hours',
        'why_recommended': (
            'Introduces the basic mindset shift between working for money and making money work for you — '
            'a widely-read starting point for financial literacy, even where its specific advice is dated.'
        ),
        'key_lessons': [
            'Understand the difference between assets and liabilities.',
            'Financial education matters as much as income.',
            "Build income streams instead of depending on one job.",
        ],
        'who_should_read': 'Young people who have never had a structured conversation about money.',
        'difficulty_rating': 1,
    },
    {
        'title': 'Designing Your Life',
        'author': 'Bill Burnett and Dave Evans',
        'category': Book.Category.CAREER_DEVELOPMENT,
        'reading_level': Book.ReadingLevel.BEGINNER,
        'estimated_reading_time': '6-7 hours',
        'why_recommended': (
            'Applies Stanford design-thinking methods to career and life choices, which suits someone who '
            "genuinely doesn't know what they want to do yet more than a traditional career-advice book does."
        ),
        'key_lessons': [
            'Treat career planning as prototyping, not a single life-defining decision.',
            'Reframe "dysfunctional beliefs" about work that quietly limit your choices.',
            'Build a small number of realistic "Odyssey Plans" for your future instead of one rigid plan.',
        ],
        'who_should_read': 'Anyone feeling stuck or undecided about what career path to pursue.',
        'difficulty_rating': 2,
    },
    {
        'title': 'The Pragmatic Programmer',
        'author': 'David Thomas and Andrew Hunt',
        'category': Book.Category.TECHNOLOGY,
        'reading_level': Book.ReadingLevel.INTERMEDIATE,
        'estimated_reading_time': '8-10 hours',
        'why_recommended': (
            'A classic on the daily mindset and habits of professional software engineers, not tied to any '
            'one programming language — teaches how to think like a working developer.'
        ),
        'key_lessons': [
            'Treat your knowledge as a portfolio you continuously invest in.',
            'Take ownership of your code and your own learning.',
            'Break large technical problems into small, testable steps.',
        ],
        'who_should_read': 'Aspiring developers ready to move from tutorials to real engineering practice.',
        'difficulty_rating': 3,
    },
    {
        'title': 'The Lean Startup',
        'author': 'Eric Ries',
        'category': Book.Category.ENTREPRENEURSHIP,
        'reading_level': Book.ReadingLevel.INTERMEDIATE,
        'estimated_reading_time': '6-7 hours',
        'why_recommended': (
            "Teaches how to test a business idea cheaply before betting everything on it — the single most "
            'useful entrepreneurship skill for a first-time founder.'
        ),
        'key_lessons': [
            'Build a minimum viable product to test assumptions before scaling.',
            'Use the Build-Measure-Learn loop to iterate quickly.',
            "Be willing to pivot when the data says your idea isn't working.",
        ],
        'who_should_read': 'Anyone with a business idea who has never launched anything before.',
        'difficulty_rating': 2,
    },
    {
        'title': 'The 7 Habits of Highly Effective People',
        'author': 'Stephen R. Covey',
        'category': Book.Category.LEADERSHIP,
        'reading_level': Book.ReadingLevel.INTERMEDIATE,
        'estimated_reading_time': '8-9 hours',
        'why_recommended': (
            'One of the most widely read leadership books ever published — grounds leadership in personal '
            'character and integrity rather than just tactics.'
        ),
        'key_lessons': [
            'Be proactive: focus energy on what you can actually influence.',
            'Begin with the end in mind — lead from clear values and goals.',
            'Seek to understand others before seeking to be understood.',
        ],
        'who_should_read': 'Anyone starting to take on leadership responsibility, formal or informal.',
        'difficulty_rating': 2,
    },
    {
        'title': 'Deep Work',
        'author': 'Cal Newport',
        'category': Book.Category.PRODUCTIVITY_STUDY_SKILLS,
        'reading_level': Book.ReadingLevel.INTERMEDIATE,
        'estimated_reading_time': '6-8 hours',
        'why_recommended': (
            'Makes the case that the ability to focus without distraction is a rare and valuable skill, and '
            'gives concrete routines for building it — directly useful for studying and skill-building.'
        ),
        'key_lessons': [
            'Depth of focus matters more than hours logged.',
            'Eliminate multitasking to protect your concentration.',
            'Schedule distraction-free blocks instead of hoping focus happens by accident.',
        ],
        'who_should_read': 'Students or early professionals who feel constantly distracted.',
        'difficulty_rating': 2,
    },
    {
        'title': 'Emotional Intelligence',
        'author': 'Daniel Goleman',
        'category': Book.Category.EMOTIONAL_INTELLIGENCE,
        'reading_level': Book.ReadingLevel.INTERMEDIATE,
        'estimated_reading_time': '7-8 hours',
        'why_recommended': (
            'The book that popularized emotional intelligence as a skill you can build — self-awareness, '
            'self-regulation, and empathy — which matters as much as raw intellect for life outcomes.'
        ),
        'key_lessons': [
            'Self-awareness is the foundation of managing your own emotions well.',
            'Empathy can be deliberately practiced, not just something you either have or lack.',
            'Emotional skills predict success in relationships and work as much as IQ does.',
        ],
        'who_should_read': 'Anyone who wants to understand and manage their reactions under pressure.',
        'difficulty_rating': 2,
    },
    {
        'title': 'How to Win Friends and Influence People',
        'author': 'Dale Carnegie',
        'category': Book.Category.COMMUNICATION_PUBLIC_SPEAKING,
        'reading_level': Book.ReadingLevel.BEGINNER,
        'estimated_reading_time': '5-6 hours',
        'why_recommended': (
            'A near-century-old classic on how to talk to people, listen well, and build genuine rapport — '
            'still one of the clearest, most practical communication guides available.'
        ),
        'key_lessons': [
            "Show genuine interest in other people rather than trying to impress them.",
            "Remember that people care more about their own name and concerns than yours.",
            'Give honest, specific appreciation instead of empty flattery.',
        ],
        'who_should_read': 'Anyone who wants to build better relationships at school, work, or in interviews.',
        'difficulty_rating': 1,
    },
    {
        'title': 'A Mind for Numbers',
        'author': 'Barbara Oakley',
        'category': Book.Category.ACADEMIC_SUCCESS,
        'reading_level': Book.ReadingLevel.BEGINNER,
        'estimated_reading_time': '6-7 hours',
        'why_recommended': (
            'Written by an engineering professor, it explains the actual science of how the brain learns '
            'difficult material — directly useful for studying math, science, and technical subjects.'
        ),
        'key_lessons': [
            'Alternate focused and diffuse thinking to solve hard problems.',
            'Use active recall instead of passive re-reading to retain material.',
            'Break complex topics into small "chunks" your brain can hold onto.',
        ],
        'who_should_read': 'Students who feel like they are "not a math person" and want real study techniques.',
        'difficulty_rating': 2,
    },
    {
        'title': 'The World Is Flat',
        'author': 'Thomas L. Friedman',
        'category': Book.Category.GLOBAL_OPPORTUNITIES,
        'reading_level': Book.ReadingLevel.ADVANCED,
        'estimated_reading_time': '10-12 hours',
        'why_recommended': (
            'Explains how technology and globalization opened up international opportunity — useful context '
            'for understanding why global education, remote work, and scholarships abroad matter today.'
        ),
        'key_lessons': [
            'Technology has "flattened" competition, connecting people across borders directly.',
            'Adaptability and continuous learning matter more than any single fixed skill.',
            'Local talent can now compete globally if given the right tools and access.',
        ],
        'who_should_read': 'Youth considering studying, working, or competing internationally.',
        'difficulty_rating': 4,
    },
    {
        'title': 'The First 90 Days',
        'author': 'Michael D. Watkins',
        'category': Book.Category.PROFESSIONAL_DEVELOPMENT,
        'reading_level': Book.ReadingLevel.INTERMEDIATE,
        'estimated_reading_time': '6-7 hours',
        'why_recommended': (
            'A practical guide to succeeding in the critical early weeks of a new job or role — exactly the '
            'moment many first-time workers stumble without realizing it.'
        ),
        'key_lessons': [
            'Diagnose the situation you are stepping into before acting.',
            'Secure a few early wins to build credibility.',
            'Build key relationships deliberately rather than assuming they will happen naturally.',
        ],
        'who_should_read': 'Anyone starting a first job, internship, or new leadership role.',
        'difficulty_rating': 3,
    },
    {
        'title': 'How to Write a Winning Scholarship Essay',
        'author': 'Gen Tanabe and Kelly Tanabe',
        'category': Book.Category.SCHOLARSHIP_PREPARATION,
        'reading_level': Book.ReadingLevel.BEGINNER,
        'estimated_reading_time': '4-5 hours',
        'why_recommended': (
            'Written by two authors who together won over $100,000 in scholarships; walks through 30 real '
            'winning essays and what made them work, plus interview preparation.'
        ),
        'key_lessons': [
            'A strong scholarship essay tells a specific, honest personal story, not generic achievements.',
            'Interview panels look for authenticity and clear reasoning, not rehearsed answers.',
            'Start early and revise — winning essays are rarely first drafts.',
        ],
        'who_should_read': 'SHS graduates and tertiary students preparing scholarship applications.',
        'difficulty_rating': 1,
    },
    {
        'title': 'Creative Confidence',
        'author': 'Tom Kelley and David Kelley',
        'category': Book.Category.INNOVATION_CREATIVITY,
        'reading_level': Book.ReadingLevel.BEGINNER,
        'estimated_reading_time': '6-7 hours',
        'why_recommended': (
            'Argues that creativity is a skill anyone can build, not a fixed talent — practical for youth who '
            'have written themselves off as "not creative."'
        ),
        'key_lessons': [
            'Creative confidence grows through small experiments and repeated practice, not talent alone.',
            'Fear of judgment is the biggest block to creative thinking — start small to build courage.',
            'Empathy for the people you are designing for leads to better, more original ideas.',
        ],
        'who_should_read': 'Anyone who wants to build ideas or solve problems more originally.',
        'difficulty_rating': 2,
    },
    {
        'title': 'Lean In',
        'author': 'Sheryl Sandberg',
        'category': Book.Category.WOMEN_IN_TECHNOLOGY,
        'reading_level': Book.ReadingLevel.INTERMEDIATE,
        'estimated_reading_time': '6-7 hours',
        'why_recommended': (
            "Written by a former Facebook COO, it addresses the specific barriers women face pursuing "
            'leadership and technical careers, and how to navigate them with confidence.'
        ),
        'key_lessons': [
            'Sit at the table — claim space in rooms where decisions are made.',
            'Seek mentors and sponsors deliberately rather than waiting to be noticed.',
            'Combine ambition with genuine support for other women coming up behind you.',
        ],
        'who_should_read': 'Young women pursuing leadership roles in tech, business, or any male-dominated field.',
        'difficulty_rating': 2,
    },
    {
        'title': "Man's Search for Meaning",
        'author': 'Viktor E. Frankl',
        'category': Book.Category.FAITH_CHARACTER_DEVELOPMENT,
        'reading_level': Book.ReadingLevel.INTERMEDIATE,
        'estimated_reading_time': '4-5 hours',
        'why_recommended': (
            "A psychiatrist's account of surviving the Holocaust and the philosophy of meaning he built from "
            'it — a universal, non-denominational reflection on character, purpose, and resilience.'
        ),
        'key_lessons': [
            'People can find meaning even in the hardest circumstances.',
            "The last of human freedoms is choosing one's attitude in any given situation.",
            'A clear sense of purpose sustains people through genuine hardship.',
        ],
        'who_should_read': 'Anyone facing hardship who wants a grounded, universal perspective on meaning.',
        'difficulty_rating': 3,
    },
]

CHALLENGES = [
    {
        'title': 'Read one personal development book this month',
        'description': 'Pick anything from the Personal Development category and finish it this month.',
        'category': Book.Category.PERSONAL_DEVELOPMENT,
        'target_count': 1,
        'period': ReadingChallenge.Period.MONTH,
        'icon': 'self_improvement',
    },
    {
        'title': 'Read one finance book every quarter',
        'description': 'Build your financial literacy one book at a time, every three months.',
        'category': Book.Category.FINANCIAL_LITERACY,
        'target_count': 1,
        'period': ReadingChallenge.Period.QUARTER,
        'icon': 'payments',
    },
    {
        'title': 'Read five books related to your career this year',
        'description': 'Any book in Career Development, Professional Development, or Leadership counts.',
        'category': Book.Category.CAREER_DEVELOPMENT,
        'target_count': 5,
        'period': ReadingChallenge.Period.YEAR,
        'icon': 'work',
    },
    {
        'title': 'Finish 3 books this quarter',
        'description': 'From any category — just build the reading habit.',
        'category': None,
        'target_count': 3,
        'period': ReadingChallenge.Period.QUARTER,
        'icon': 'auto_stories',
    },
]


class Command(BaseCommand):
    help = 'Seeds the real Growth Librarian book catalog and starter reading challenges. Safe to re-run.'

    def handle(self, *args, **options):
        created, updated = 0, 0
        for b in BOOKS:
            _, was_created = Book.objects.update_or_create(title=b['title'], defaults=b)
            created += was_created
            updated += not was_created
        self.stdout.write(f'Books created: {created}, updated: {updated} (total: {Book.objects.count()})')

        challenge_created = 0
        for c in CHALLENGES:
            _, was_created = ReadingChallenge.objects.update_or_create(title=c['title'], defaults=c)
            challenge_created += was_created
        self.stdout.write(
            f'Challenges created: {challenge_created} (total: {ReadingChallenge.objects.count()})'
        )
