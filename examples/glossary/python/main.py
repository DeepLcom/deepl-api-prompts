"""
DeepL API — Glossary operations (Python)

Demonstrates: create → list → translate with glossary → get entries → delete.

Usage:
    DEEPL_API_KEY=your-key python main.py
"""

from __future__ import annotations

import os
import sys
import time

import deepl


# ── Helper ──────────────────────────────────────────────────────────────────


def get_translator() -> deepl.Translator:
    api_key = os.environ.get("DEEPL_API_KEY")
    if not api_key:
        raise EnvironmentError("DEEPL_API_KEY environment variable is not set.")
    return deepl.Translator(api_key)


# ── 1. List supported glossary language pairs ──────────────────────────────


def list_supported_language_pairs() -> list[deepl.GlossaryLanguagePair]:
    """Returns all language pairs that support glossaries."""
    return get_translator().get_glossary_languages()


# ── 2. Create a glossary ───────────────────────────────────────────────────


def create_glossary(
    name: str,
    source_lang: str,
    target_lang: str,
    entries: dict[str, str],
) -> deepl.GlossaryInfo:
    """
    Creates a glossary from a dict mapping source → target terms.

    Polls until the glossary is ready.

    Args:
        name: Human-readable name.
        source_lang: Source language code, e.g. "EN".
        target_lang: Target language code, e.g. "DE".
        entries: Dict of { source_term: target_term }.

    Returns:
        GlossaryInfo object.
    """
    translator = get_translator()
    glossary_entries = deepl.GlossaryEntries(entries=entries)
    info = translator.create_glossary(name, source_lang, target_lang, glossary_entries)
    # Poll until ready
    while not info.ready:
        time.sleep(0.5)
        info = translator.get_glossary(info.glossary_id)
    return info


# ── 3. List glossaries ─────────────────────────────────────────────────────


def list_glossaries() -> list[deepl.GlossaryInfo]:
    """Returns all glossaries for this account."""
    return get_translator().list_glossaries()


# ── 4. Get glossary entries ────────────────────────────────────────────────


def get_glossary_entries(glossary_id: str) -> dict[str, str]:
    """
    Returns the entries of a glossary as a dict.

    Args:
        glossary_id: UUID of the glossary.
    """
    translator = get_translator()
    info = translator.get_glossary(glossary_id)
    entries = translator.get_glossary_entries(info)
    return entries.entries


# ── 5. Translate with glossary ─────────────────────────────────────────────


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
    """
    translator = get_translator()
    info = translator.get_glossary(glossary_id)
    results = translator.translate_text(
        texts,
        source_lang=source_lang,
        target_lang=target_lang,
        glossary=info,
    )
    result_list = results if isinstance(results, list) else [results]
    return [r.text for r in result_list]


# ── 6. Delete glossary ─────────────────────────────────────────────────────


def delete_glossary(glossary_id: str) -> None:
    """Permanently deletes a glossary."""
    translator = get_translator()
    info = translator.get_glossary(glossary_id)
    translator.delete_glossary(info)


# ── Demo ────────────────────────────────────────────────────────────────────


def main() -> None:
    # Check supported pairs
    print("=== Supported glossary language pairs (first 5) ===")
    pairs = list_supported_language_pairs()
    for pair in pairs[:5]:
        print(f"  {pair.source_lang} → {pair.target_lang}")

    # Create glossary
    print("\n=== Creating EN→DE car-terminology glossary ===")
    glossary = create_glossary(
        name="Car Terminology EN-DE (python demo)",
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
    print(f"  Created: {glossary.glossary_id}")
    print(f"  Entries: {glossary.entry_count}")
    print(f"  Ready:   {glossary.ready}")

    # List all
    print("\n=== All glossaries ===")
    for g in list_glossaries():
        print(f"  [{g.glossary_id}] {g.name} ({g.source_lang}→{g.target_lang}, {g.entry_count} entries)")

    # Translate with glossary
    sentences = [
        "The automobile runs on gasoline.",
        "Open the hood and check the windshield.",
    ]
    print("\n=== Translating with glossary ===")
    translated = translate_with_glossary(sentences, "EN", "DE", glossary.glossary_id)
    for en, de in zip(sentences, translated):
        print(f'  EN: "{en}"')
        print(f'  DE: "{de}"\n')

    # Print entries
    print("=== Glossary entries ===")
    entries = get_glossary_entries(glossary.glossary_id)
    for src, tgt in entries.items():
        print(f"  {src:<15} → {tgt}")

    # Delete (commented out for safety)
    # delete_glossary(glossary.glossary_id)
    # print(f"\nDeleted glossary {glossary.glossary_id}")
    print(f"\n(Glossary {glossary.glossary_id} NOT deleted — uncomment to clean up)")


if __name__ == "__main__":
    try:
        main()
    except EnvironmentError as exc:
        print(f"[EnvironmentError] {exc}", file=sys.stderr)
        sys.exit(1)
    except deepl.exceptions.AuthorizationException as exc:
        print(f"[AuthError] {exc}", file=sys.stderr)
        sys.exit(1)
    except deepl.exceptions.QuotaExceededException as exc:
        print(f"[QuotaError] {exc}", file=sys.stderr)
        sys.exit(1)
    except Exception as exc:  # noqa: BLE001
        print(f"Unexpected error: {exc}", file=sys.stderr)
        sys.exit(1)
