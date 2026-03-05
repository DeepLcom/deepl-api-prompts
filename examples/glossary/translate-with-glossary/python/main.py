"""
DeepL API — Translate with glossary (Python)

Translates text using a previously created glossary to enforce specific
term translations. Source language must be specified when using a glossary.

Usage:
    GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key python main.py
"""

from __future__ import annotations

import os
import sys

import deepl


def translate_with_glossary(
    texts: list[str],
    source_lang: str,
    target_lang: str,
    glossary_id: str,
) -> list[str]:
    """
    Translates strings using a specific glossary.

    Args:
        texts: Strings to translate.
        source_lang: Source language code (required when using a glossary).
        target_lang: Target language code.
        glossary_id: UUID of the glossary to apply.

    Returns:
        List of translated strings in input order.

    Raises:
        EnvironmentError: If DEEPL_API_KEY is not set.
        deepl.exceptions.AuthorizationException: If the API key is invalid.
    """
    api_key = os.environ.get("DEEPL_API_KEY")
    if not api_key:
        raise EnvironmentError("DEEPL_API_KEY environment variable is not set.")

    translator = deepl.Translator(api_key)
    info = translator.get_glossary(glossary_id)
    results = translator.translate_text(
        texts,
        source_lang=source_lang,
        target_lang=target_lang,
        glossary=info,
    )
    result_list = results if isinstance(results, list) else [results]
    return [r.text for r in result_list]


def main() -> None:
    glossary_id = os.environ.get("GLOSSARY_ID")
    if not glossary_id:
        print("Usage: GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key python main.py", file=sys.stderr)
        sys.exit(1)

    sentences = [
        "The automobile runs on gasoline.",
        "Open the hood and check the windshield.",
    ]

    print(f"Translating {len(sentences)} sentence(s) EN → DE using glossary {glossary_id}\n")
    translated = translate_with_glossary(sentences, "EN", "DE", glossary_id)

    for en, de in zip(sentences, translated):
        print(f'  EN: "{en}"')
        print(f'  DE: "{de}"\n')


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
