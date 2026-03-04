"""
DeepL API — Translate text (Python)

Uses the official deepl Python SDK.
https://github.com/DeepLcom/deepl-python

Usage:
    DEEPL_API_KEY=your-key python main.py
"""

from __future__ import annotations

import os
import sys
from dataclasses import dataclass
from typing import Optional

import deepl


# ── Custom exception types ──────────────────────────────────────────────────


class AuthError(Exception):
    """Raised when the API key is invalid or missing."""


class QuotaError(Exception):
    """Raised when the DeepL character quota is exceeded."""


# ── Core translation function ───────────────────────────────────────────────


@dataclass
class Translation:
    """Result of a single translated string."""

    detected_source_lang: str
    text: str


def translate_texts(
    texts: list[str],
    target_lang: str,
    *,
    source_lang: Optional[str] = None,
    formality: Optional[str] = None,
    context: Optional[str] = None,
    glossary_id: Optional[str] = None,
) -> list[Translation]:
    """
    Translate a list of strings using the DeepL API.

    Args:
        texts: Strings to translate (max 50 per call).
        target_lang: Target language code, e.g. "DE", "FR", "PT-BR".
        source_lang: Source language code. Omit to auto-detect.
        formality: One of "default", "more", "less", "prefer_more", "prefer_less".
        context: Optional context hint to improve quality (not billed).
        glossary_id: UUID of an existing DeepL glossary.

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

    kwargs: dict = {}
    if formality:
        kwargs["formality"] = formality
    if context:
        kwargs["context"] = context
    if glossary_id:
        kwargs["glossary"] = glossary_id

    try:
        results = translator.translate_text(
            texts,
            source_lang=source_lang,
            target_lang=target_lang,
            **kwargs,
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


# ── Demo ────────────────────────────────────────────────────────────────────


def main() -> None:
    texts = [
        "Hello, world!",
        "How are you today?",
        "The quick brown fox jumps over the lazy dog.",
    ]

    print(f"Translating {len(texts)} string(s) → DE\n")

    translations = translate_texts(texts, target_lang="DE")

    for i, (original, t) in enumerate(zip(texts, translations), start=1):
        print(f'[{i}] ({t.detected_source_lang}) "{original}"')
        print(f'    → "{t.text}"\n')

    # Demonstrate formality
    print("── Formality example ────────────────────────────────────")
    [formal] = translate_texts(
        ["Could you please help me?"],
        target_lang="DE",
        source_lang="EN",
        formality="prefer_more",
    )
    [informal] = translate_texts(
        ["Could you please help me?"],
        target_lang="DE",
        source_lang="EN",
        formality="prefer_less",
    )
    print(f'prefer_more → "{formal.text}"')
    print(f'prefer_less → "{informal.text}"')


if __name__ == "__main__":
    try:
        main()
    except (AuthError, QuotaError) as exc:
        print(f"[{type(exc).__name__}] {exc}", file=sys.stderr)
        sys.exit(1)
    except Exception as exc:  # noqa: BLE001
        print(f"Unexpected error: {exc}", file=sys.stderr)
        sys.exit(1)
