"""
DeepL API — List supported glossary language pairs (Python)

Retrieves all language pairs that can be used with DeepL glossaries.

Usage:
    DEEPL_API_KEY=your-key python main.py
"""

from __future__ import annotations

import os
import sys

import deepl


def list_glossary_language_pairs() -> list[deepl.GlossaryLanguagePair]:
    """
    Returns all language pairs supported by DeepL glossaries.

    Returns:
        List of GlossaryLanguagePair objects.

    Raises:
        EnvironmentError: If DEEPL_API_KEY is not set.
        deepl.exceptions.AuthorizationException: If the API key is invalid.
    """
    api_key = os.environ.get("DEEPL_API_KEY")
    if not api_key:
        raise EnvironmentError("DEEPL_API_KEY environment variable is not set.")

    translator = deepl.Translator(api_key)
    return translator.get_glossary_languages()


def main() -> None:
    pairs = list_glossary_language_pairs()
    print(f"Supported glossary language pairs ({len(pairs)} total):\n")
    for pair in pairs:
        print(f"  {pair.source_lang} → {pair.target_lang}")


if __name__ == "__main__":
    try:
        main()
    except EnvironmentError as exc:
        print(f"[EnvironmentError] {exc}", file=sys.stderr)
        sys.exit(1)
    except deepl.exceptions.AuthorizationException as exc:
        print(f"[AuthError] {exc}", file=sys.stderr)
        sys.exit(1)
    except Exception as exc:  # noqa: BLE001
        print(f"Unexpected error: {exc}", file=sys.stderr)
        sys.exit(1)
