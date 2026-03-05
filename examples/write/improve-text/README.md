# Example: Improve Text

Improve the style, grammar, and clarity of text using the DeepL Write API.

## Files

| File | Description |
|---|---|
| `curl.sh` | Minimal `curl` reference command |
| `node/` | Node.js implementation |
| `python/` | Python implementation |

## Quick start

```bash
# Node.js
cd node && DEEPL_API_KEY=your-key node index.js

# Python
cd python && DEEPL_API_KEY=your-key python main.py
```

## What it does

1. Reads `DEEPL_API_KEY` from the environment.
2. Submits an English text string with typos and awkward phrasing to `POST /v2/write/rephrase`.
3. Prints the improved text, the target language, and the detected source language.

## Prerequisites

- A DeepL API Pro subscription — the Write API is not available on the Free tier ([upgrade here](https://www.deepl.com/pro#developer))
- Node.js >= 18 **or** Python >= 3.8

## Sample response

```json
{
  "improvements": [
    {
      "text": "I could really use some help with editing this text!",
      "target_language": "en-US",
      "detected_source_language": "en"
    }
  ]
}
```

## Notes

- The Write API uses the endpoint `POST /v2/write/rephrase`, not the standard translations endpoint.
- The request body size must not exceed 10 KiB; split larger texts into multiple calls.
- Supported languages at launch: `de`, `en-GB`, `en-US`, `es`, `fr`, `it`, `pt-BR`, `pt-PT`.
- The `writing_style` and `tone` parameters are mutually exclusive; include only one per request.
- Write API characters count towards the same `character_count` total as translation characters.
