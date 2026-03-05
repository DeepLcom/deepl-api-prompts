"""
DeepL API — Get glossary entries (Python)

Retrieves the term pairs stored in a glossary by its ID.

Usage:
    GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key python main.py
"""

from __future__ import annotations

import os
import sys

import deepl


def get_glossary_entries(glossary_id: str) -> dict[str, str]:
    """
    Returns the entries of a glossary as a dict { source_term: target_term }.

    Args:
        glossary_id: UUID of the glossary.

    Returns:
        Dict mapping each source term to its target term.

    Raises:
        EnvironmentError: If DEEPL_API_KEY is not set.
        deepl.exceptions.AuthorizationException: If the API key is invalid.
    """
    api_key = os.environ.get("DEEPL_API_KEY")
    if not api_key:
        raise EnvironmentError("DEEPL_API_KEY environment variable is not set.")

    translator = deepl.Translator(api_key)
    info = translator.get_glossary(glossary_id)
    entries = translator.get_glossary_entries(info)
    return entries.entries


def main() -> None:
    glossary_id = os.environ.get("GLOSSARY_ID")
    if not glossary_id:
        print("Usage: GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key python main.py", file=sys.stderr)
        sys.exit(1)

    entries = get_glossary_entries(glossary_id)
    print(f"Glossary entries ({len(entries)} total):\n")
    col = max((len(k) for k in entries), default=10)
    print(f"  {'Source':<{col}}  Target")
    print(f"  {'-' * col}  ------")
    for src, tgt in entries.items():
        print(f"  {src:<{col}}  {tgt}")


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
