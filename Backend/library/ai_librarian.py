from datetime import date

from common.groq_client import GroqServiceError, call_groq

BASE_SYSTEM_PROMPT = """You are a friendly Growth Librarian for a youth platform.

Recommend short, useful, relevant books. Keep the conversation human and simple. Give 3-5 good recommendations at a time, not a long list.

Keep replies brief and practical. If the user asks for a book recommendation, suggest books that match their current goal, career interest, and stage in life.

Rules:
- Recommend only real books by real authors.
- Keep the answer easy to read.
- If the user asks for something outside books, guide the conversation back to reading and personal growth.
- After a recommendation, ask one quick reflective question to help them think about what they learned.
- Be warm, encouraging, and clear.

When recommending books, output only the title and author in this format:
Book Title — Author

Do not add markdown, long explanations, or extra text.
"""


def _age_from_dob(date_of_birth):
    if not date_of_birth:
        return None
    today = date.today()
    return today.year - date_of_birth.year - ((today.month, today.day) < (date_of_birth.month, date_of_birth.day))


def build_system_prompt(youth_profile):
    """Appends the real facts we already have about this youth to the base
    prompt, so the model personalizes from day one instead of asking for
    things we could already tell it.
    """
    facts = []
    age = _age_from_dob(youth_profile.date_of_birth)
    if age is not None:
        facts.append(f'Age: {age}')
    if youth_profile.education_level:
        facts.append(f'Education level: {youth_profile.get_education_level_display()}')
    if youth_profile.institution_id:
        facts.append(f'Institution: {youth_profile.institution.name}')
    if youth_profile.region:
        facts.append(f'Region: {youth_profile.region}')

    if not facts:
        return BASE_SYSTEM_PROMPT

    profile_block = '\n'.join(facts)
    return f'{BASE_SYSTEM_PROMPT}\n\n---\n\n## Youth Profile (real, given — do not ask for these again)\n\n{profile_block}'


def build_welcome_message(youth_profile):
    first_name = (youth_profile.full_name or '').split(' ')[0] or 'there'
    return f"""Hi {first_name}! I'm your Growth Librarian.

Tell me the kind of books you need right now, like for your career, studies, or personal growth. I'll keep it short and useful."""


LibrarianServiceError = GroqServiceError


def get_librarian_reply(message_history, youth_profile):
    """Call Groq with the full conversation history and return the reply text."""
    messages = [
        {'role': 'assistant' if message.role == 'assistant' else 'user', 'content': message.content}
        for message in message_history
    ]
    return call_groq(messages, system_prompt=build_system_prompt(youth_profile), max_output_tokens=4096)
