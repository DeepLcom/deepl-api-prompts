# Example: Detect Language

Demonstrates how to detect the language of text strings using the DeepL API.

## Background

DeepL has no dedicated detection endpoint. Language detection is a side-effect of translation: when you omit `source_lang`, the API returns `detected_source_language` for each result. This example translates to `EN-US` and discards the translated text, exposing only the detected language.

## Files

| File | Description |
|---|---|
| `curls.sh` | Minimal `curl` reference |
| `node/` | Node.js example |
| `python/` | Python example |

## Quick start

```bash
# Node.js
cd node && npm install && DEEPL_API_KEY=your-key node index.js

# Python
cd python && pip install -r requirements.txt && DEEPL_API_KEY=your-key python main.py
```

## What it does

1. Accepts an array of strings.
2. Translates them to `EN-US` without specifying `source_lang`.
3. Returns only the detected language codes.
4. Prints a summary table.

## Note on character usage

Characters are billed even when you discard the translation. Batch strings in a single request (up to 50) to minimise cost.
