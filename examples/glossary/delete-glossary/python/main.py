"""
DeepL API — Delete a glossary (Python)

Permanently deletes a glossary by its ID. This action cannot be undone.

Usage:
    GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key python main.py
"""

from __future__ import annotations

import os
import sys

import deepl


def delete_glossary(glossary_id: str) -> None:
    """
    Permanently deletes a glossary.

    Args:
        glossary_id: UUID of the glossary to delete.

    Raises:
        EnvironmentError: If DEEPL_API_KEY is not set.
        deepl.exceptions.AuthorizationException: If the API key is invalid.
        deepl.exceptions.GlossaryNotFoundException: If the glossary does not exist.
    """
    api_key = os.environ.get("DEEPL_API_KEY")
    if not api_key:
        raise EnvironmentError("DEEPL_API_KEY environment variable is not set.")

    translator = deepl.Translator(api_key)
    info = translator.get_glossary(glossary_id)
    translator.delete_glossary(info)


def main() -> None:
    glossary_id = os.environ.get("GLOSSARY_ID")
    if not glossary_id:
        print("Usage: GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key python main.py", file=sys.stderr)
        sys.exit(1)

    delete_glossary(glossary_id)
    print(f"Glossary {glossary_id} deleted successfully.")


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
