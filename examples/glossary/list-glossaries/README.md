# Example: List Glossaries

List all glossaries associated with the current API key.

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
2. Calls `GET /v2/glossaries`.
3. Prints the ID, name, language pair, entry count, and status for each glossary.

## Prerequisites

- A DeepL API key ([sign up free](https://www.deepl.com/pro#developer))
- Node.js >= 18 **or** Python >= 3.8

## Sample response

```json
{
  "glossaries": [
    {
      "glossary_id": "3b4a5e2f-1234-5678-abcd-ef0123456789",
      "name": "My EN→DE Glossary",
      "ready": true,
      "source_lang": "en",
      "target_lang": "de",
      "creation_time": "2026-03-05T10:00:00.000Z",
      "entry_count": 3
    },
    {
      "glossary_id": "9a1b2c3d-abcd-ef01-2345-678901234567",
      "name": "Legal Terms FR→EN",
      "ready": true,
      "source_lang": "fr",
      "target_lang": "en",
      "creation_time": "2026-02-10T08:30:00.000Z",
      "entry_count": 12
    }
  ]
}
```
