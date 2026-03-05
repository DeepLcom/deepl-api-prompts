"""
DeepL API — Get glossary (Python)

Retrieves metadata for a single glossary by its ID.

Usage:
    GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key python main.py
"""

from __future__ import annotations

import os
import sys

import deepl


def get_glossary(glossary_id: str) -> deepl.GlossaryInfo:
    """
    Retrieves metadata for a glossary by its ID.

    Args:
        glossary_id: UUID of the glossary.

    Returns:
        GlossaryInfo object.

    Raises:
        EnvironmentError: If DEEPL_API_KEY is not set.
        deepl.exceptions.AuthorizationException: If the API key is invalid.
        deepl.exceptions.GlossaryNotFoundException: If the glossary does not exist.
    """
    api_key = os.environ.get("DEEPL_API_KEY")
    if not api_key:
        raise EnvironmentError("DEEPL_API_KEY environment variable is not set.")

    translator = deepl.Translator(api_key)
    return translator.get_glossary(glossary_id)


def main() -> None:
    glossary_id = os.environ.get("GLOSSARY_ID")
    if not glossary_id:
        print("Usage: GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key python main.py", file=sys.stderr)
        sys.exit(1)

    g = get_glossary(glossary_id)
    print("Glossary details:")
    print(f"  ID:      {g.glossary_id}")
    print(f"  Name:    {g.name}")
    print(f"  Pair:    {g.source_lang} → {g.target_lang}")
    print(f"  Entries: {g.entry_count}")
    print(f"  Ready:   {g.ready}")
    print(f"  Created: {g.creation_time}")


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
