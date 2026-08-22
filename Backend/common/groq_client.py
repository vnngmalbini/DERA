import time

from django.conf import settings
from groq import APIError, APIStatusError, Groq


class GroqServiceError(Exception):
    """Raised when a Groq API call fails or returns no usable reply."""


# Groq's servers occasionally return a transient error under high demand;
# a couple of quick retries clears most of these without surfacing an error.
_MAX_ATTEMPTS = 3
_RETRY_DELAY_SECONDS = 2
_RETRYABLE_STATUS_CODES = {429, 500, 502, 503, 504}


def call_groq(messages, system_prompt, max_output_tokens=1024):
    """Call Groq with the given conversation `messages` and return the reply text.

    `messages` is a list of {'role': 'user' | 'assistant', 'content': ...} dicts.
    """
    client = Groq(api_key=settings.GROQ_API_KEY)
    full_messages = [{'role': 'system', 'content': system_prompt}, *messages]

    last_error = None
    for attempt in range(1, _MAX_ATTEMPTS + 1):
        try:
            response = client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=full_messages,
                max_tokens=max_output_tokens,
            )
        except APIStatusError as exc:
            last_error = exc
            if exc.status_code in _RETRYABLE_STATUS_CODES and attempt < _MAX_ATTEMPTS:
                time.sleep(_RETRY_DELAY_SECONDS)
                continue
            raise GroqServiceError(str(exc)) from exc
        except APIError as exc:
            raise GroqServiceError(str(exc)) from exc

        text = response.choices[0].message.content
        if not text:
            raise GroqServiceError('No text response received from the model.')

        return text

    raise GroqServiceError(str(last_error)) from last_error
