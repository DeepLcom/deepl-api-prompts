"""
DeepL API — Detect language (Python)

Language detection is a side-effect of translation.
We translate to EN-US without specifying a source language,
then return only the detected_source_lang value.

Usage:
    DEEPL_API_KEY=your-key python main.py
"""

from __future__ import annotations

import os
import sys
from dataclasses import dataclass

import deepl


@dataclass
class Detection:
    """Result of a language detection for a single string."""

    text: str
    detected_lang: str


def detect_languages(texts: list[str]) -> list[Detection]:
    """
    Detect the language of each string in ``texts``.

    Translates to EN-US without specifying a source language to trigger
    DeepL's auto-detection, then discards the translated text.

    Args:
        texts: Strings whose language should be detected (max 50 per call).

    Returns:
        List of Detection objects in the same order as the input.

    Raises:
        EnvironmentError: If DEEPL_API_KEY is not set.
        deepl.exceptions.AuthorizationException: If the API key is invalid.
        deepl.exceptions.QuotaExceededException: If the quota is exceeded.
    """
    api_key = os.environ.get("DEEPL_API_KEY")
    if not api_key:
        raise EnvironmentError("DEEPL_API_KEY environment variable is not set.")

    translator = deepl.Translator(api_key)

    # Translate to EN-US; source_lang omitted → triggers auto-detection.
    results = translator.translate_text(texts, target_lang="EN-US")
    result_list = results if isinstance(results, list) else [results]

    return [
        Detection(text=text, detected_lang=r.detected_source_lang)
        for text, r in zip(texts, result_list)
    ]


def main() -> None:
    samples = [
        "Hallo, wie geht es dir?",
        "Bonjour le monde",
        "Ciao mondo",
        "Witaj świecie",
        "¿Cómo estás?",
        "こんにちは世界",
        "Hello, world!",
    ]

    print(f"Detecting language for {len(samples)} string(s)...\n")

    detections = detect_languages(samples)

    col = 42
    print(f"{'Input':<{col}}  Detected")
    print("-" * col + "  ---------")
    for d in detections:
        snippet = d.text if len(d.text) <= col else d.text[: col - 3] + "..."
        print(f"{snippet:<{col}}  {d.detected_lang}")


if __name__ == "__main__":
    try:
        main()
    except EnvironmentError as exc:
        print(f"[EnvironmentError] {exc}", file=sys.stderr)
        sys.exit(1)
    except deepl.exceptions.AuthorizationException as exc:
        print(f"[AuthError] Invalid API key: {exc}", file=sys.stderr)
        sys.exit(1)
    except deepl.exceptions.QuotaExceededException as exc:
        print(f"[QuotaError] {exc}", file=sys.stderr)
        sys.exit(1)
    except Exception as exc:  # noqa: BLE001
        print(f"Unexpected error: {exc}", file=sys.stderr)
        sys.exit(1)
