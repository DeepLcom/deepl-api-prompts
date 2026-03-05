# Example: List Glossary Language Pairs

Retrieve all language pairs that are supported for glossary-assisted translation.

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
2. Calls `GET /v2/glossary-language-pairs`.
3. Prints each supported source/target language pair.

## Prerequisites

- A DeepL API key ([sign up free](https://www.deepl.com/pro#developer))
- Node.js >= 18 **or** Python >= 3.8

## Sample response

```json
{
  "supported_languages": [
    { "source_lang": "de", "target_lang": "en" },
    { "source_lang": "en", "target_lang": "de" },
    { "source_lang": "en", "target_lang": "fr" },
    { "source_lang": "en", "target_lang": "es" },
    { "source_lang": "en", "target_lang": "it" },
    { "source_lang": "en", "target_lang": "ja" },
    { "source_lang": "fr", "target_lang": "en" },
    { "source_lang": "es", "target_lang": "en" }
  ]
}
```

## Notes

- Not every translation language pair supports glossaries. Always call this endpoint first if you need to confirm support.
