"""
DeepL API — Translate with formality (Python)

Controls the formality level of the translated text.
Supported languages include DE, FR, IT, ES, NL, PL, PT-BR, PT-PT, RU, JA, ZH.

Usage:
    DEEPL_API_KEY=your-key python main.py
"""

from __future__ import annotations

import os
import sys
from dataclasses import dataclass
from typing import Optional

import deepl


class AuthError(Exception):
    """Raised when the API key is invalid or missing."""


class QuotaError(Exception):
    """Raised when the DeepL character quota is exceeded."""


@dataclass
class Translation:
    """Result of a single translated string."""

    detected_source_lang: str
    text: str


def translate_with_formality(
    texts: list[str],
    target_lang: str,
    formality: str,
    *,
    source_lang: Optional[str] = None,
) -> list[Translation]:
    """
    Translate a list of strings with a specific formality level.

    Args:
        texts: Strings to translate (max 50 per call).
        target_lang: Target language code, e.g. "DE", "FR".
        formality: One of "default", "more", "less", "prefer_more", "prefer_less".
        source_lang: Source language code. Omit to auto-detect.

    Returns:
        List of Translation objects in the same order as the input.

    Raises:
        AuthError: If the API key is invalid.
        QuotaError: If the character quota is exceeded.
    """
    api_key = os.environ.get("DEEPL_API_KEY")
    if not api_key:
        raise EnvironmentError("DEEPL_API_KEY environment variable is not set.")

    translator = deepl.Translator(api_key)

    try:
        results = translator.translate_text(
            texts,
            source_lang=source_lang,
            target_lang=target_lang,
            formality=formality,
        )
    except deepl.exceptions.AuthorizationException as exc:
        raise AuthError("Invalid DeepL API key. Check your DEEPL_API_KEY.") from exc
    except deepl.exceptions.QuotaExceededException as exc:
        raise QuotaError("DeepL character quota exceeded for this billing period.") from exc

    result_list = results if isinstance(results, list) else [results]
    return [
        Translation(
            detected_source_lang=r.detected_source_lang,
            text=r.text,
        )
        for r in result_list
    ]


def main() -> None:
    text = "Could you please help me?"
    print(f'Source (EN): "{text}"\n')

    for formality in ("prefer_more", "prefer_less"):
        [result] = translate_with_formality(
            [text],
            target_lang="DE",
            source_lang="EN",
            formality=formality,
        )
        print(f'{formality:<12} → "{result.text}"')


if __name__ == "__main__":
    try:
        main()
    except (AuthError, QuotaError) as exc:
        print(f"[{type(exc).__name__}] {exc}", file=sys.stderr)
        sys.exit(1)
    except Exception as exc:  # noqa: BLE001
        print(f"Unexpected error: {exc}", file=sys.stderr)
        sys.exit(1)
