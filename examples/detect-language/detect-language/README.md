# Example: Detect Language

Detect the source language of one or more text strings using the DeepL Translate API.

## Files

| File | Description |
|---|---|
| `curl.sh` | Minimal `curl` reference command |
| `node/` | Node.js implementation |
| `python/` | Python implementation |

## Quick start

```bash
# Node.js
cd node && npm install && DEEPL_API_KEY=your-key node index.js

# Python
cd python && pip install -r requirements.txt && DEEPL_API_KEY=your-key python main.py
```

## What it does

1. Reads `DEEPL_API_KEY` from the environment.
2. Submits two text strings to `POST /v2/translate` with `target_lang=EN-US` and no `source_lang`.
3. Discards the translated text; reads only the `detected_source_lang` field from each result.
4. Prints the detected language code for each input string.

## Prerequisites

- A DeepL API key ([sign up free](https://www.deepl.com/pro#developer))
- Node.js >= 18 **or** Python >= 3.8

## Sample response

```json
{
  "translations": [
    {
      "detected_source_language": "FR",
      "text": "Hello everyone"
    },
    {
      "detected_source_language": "DE",
      "text": "Good morning"
    }
  ]
}
```

## Notes

- Language detection is a side effect of translation; no dedicated detection-only endpoint exists.
- The `detected_source_lang` value is always an ISO 639-1 code (e.g. `FR`, `DE`), never a regional variant.
