"""
DeepL API — Create a glossary (Python)

Creates a new glossary from a dict of source → target term pairs and
polls until it is ready for use.

Usage:
    DEEPL_API_KEY=your-key python main.py
"""

from __future__ import annotations

import os
import sys
import time

import deepl


def create_glossary(
    name: str,
    source_lang: str,
    target_lang: str,
    entries: dict[str, str],
) -> deepl.GlossaryInfo:
    """
    Creates a glossary from a dict mapping source → target terms.

    Polls the API until the glossary status is ready.

    Args:
        name: Human-readable name for the glossary.
        source_lang: Source language code, e.g. "EN".
        target_lang: Target language code, e.g. "DE".
        entries: Dict of { source_term: target_term }.

    Returns:
        GlossaryInfo object with ready=True.

    Raises:
        EnvironmentError: If DEEPL_API_KEY is not set.
        deepl.exceptions.AuthorizationException: If the API key is invalid.
    """
    api_key = os.environ.get("DEEPL_API_KEY")
    if not api_key:
        raise EnvironmentError("DEEPL_API_KEY environment variable is not set.")

    translator = deepl.Translator(api_key)
    glossary_entries = deepl.GlossaryEntries(entries=entries)
    info = translator.create_glossary(name, source_lang, target_lang, glossary_entries)

    # Poll until ready
    while not info.ready:
        time.sleep(0.5)
        info = translator.get_glossary(info.glossary_id)

    return info


def main() -> None:
    glossary = create_glossary(
        name="Car Terminology EN-DE",
        source_lang="EN",
        target_lang="DE",
        entries={
            "automobile": "Auto",
            "gasoline": "Benzin",
            "hood": "Motorhaube",
            "trunk": "Kofferraum",
            "windshield": "Windschutzscheibe",
        },
    )
    print("Glossary created successfully:")
    print(f"  ID:      {glossary.glossary_id}")
    print(f"  Name:    {glossary.name}")
    print(f"  Pair:    {glossary.source_lang} → {glossary.target_lang}")
    print(f"  Entries: {glossary.entry_count}")
    print(f"  Ready:   {glossary.ready}")


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
