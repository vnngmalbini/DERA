import time

from django.conf import settings
from google import genai
from google.genai import errors as genai_errors
from google.genai import types as genai_types


class GeminiServiceError(Exception):
    """Raised when a Gemini API call fails or returns no usable reply."""


# Google's servers occasionally return a transient 503 under high demand;
# a couple of quick retries clears most of these without surfacing an error.
_MAX_ATTEMPTS = 2
_RETRY_DELAY_SECONDS = 1


def call_gemini(contents, system_prompt, max_output_tokens=1024):
    """Call Gemini with the given conversation `contents` and return the reply text.

    `contents` is a list of {'role': 'user' | 'model', 'parts': [{'text': ...}]} dicts.
    """
    last_error = None
    for attempt in range(1, _MAX_ATTEMPTS + 1):
        try:
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=contents,
                config=genai_types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    max_output_tokens=max_output_tokens,
                ),
            )
        except genai_errors.ServerError as exc:
            last_error = exc
            if attempt < _MAX_ATTEMPTS:
                time.sleep(_RETRY_DELAY_SECONDS)
            continue
        except (genai_errors.APIError, ValueError) as exc:
            raise GeminiServiceError(str(exc)) from exc

        if not response.text:
            raise GeminiServiceError('No text response received from the model.')

        return response.text

    raise GeminiServiceError(str(last_error)) from last_error
