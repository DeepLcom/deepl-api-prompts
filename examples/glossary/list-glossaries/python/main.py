"""
DeepL API — List glossaries (Python)

Retrieves all glossaries associated with the current account.

Usage:
    DEEPL_API_KEY=your-key python main.py
"""

from __future__ import annotations

import os
import sys

import deepl


def list_glossaries() -> list[deepl.GlossaryInfo]:
    """
    Returns all glossaries for this account.

    Returns:
        List of GlossaryInfo objects.

    Raises:
        EnvironmentError: If DEEPL_API_KEY is not set.
        deepl.exceptions.AuthorizationException: If the API key is invalid.
    """
    api_key = os.environ.get("DEEPL_API_KEY")
    if not api_key:
        raise EnvironmentError("DEEPL_API_KEY environment variable is not set.")

    translator = deepl.Translator(api_key)
    return translator.list_glossaries()


def main() -> None:
    glossaries = list_glossaries()
    if not glossaries:
        print("No glossaries found.")
        return

    print(f"Found {len(glossaries)} glossary/glossaries:\n")
    for g in glossaries:
        print(f"  [{g.glossary_id}]")
        print(f"    Name:    {g.name}")
        print(f"    Pair:    {g.source_lang} → {g.target_lang}")
        print(f"    Entries: {g.entry_count}")
        print(f"    Ready:   {g.ready}\n")


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
