# Example: Get Glossary

Retrieve metadata for a single glossary by its ID.

## Files

| File | Description |
|---|---|
| `curl.sh` | Minimal `curl` reference command |
| `node/` | Node.js implementation |
| `python/` | Python implementation |

## Quick start

```bash
# Node.js
cd node && npm install && DEEPL_API_KEY=your-key GLOSSARY_ID=your-glossary-id node index.js

# Python
cd python && pip install -r requirements.txt && DEEPL_API_KEY=your-key GLOSSARY_ID=your-glossary-id python main.py
```

## What it does

1. Reads `DEEPL_API_KEY` and `GLOSSARY_ID` from the environment.
2. Calls `GET /v2/glossaries/{glossary_id}`.
3. Prints the name, language pair, entry count, creation time, and ready status.

## Prerequisites

- A DeepL API key ([sign up free](https://www.deepl.com/pro#developer))
- An existing glossary ID — run the `create-glossary` example first
- Node.js >= 18 **or** Python >= 3.8

## Sample response

```json
{
  "glossary_id": "3b4a5e2f-1234-5678-abcd-ef0123456789",
  "name": "My EN→DE Glossary",
  "ready": true,
  "source_lang": "en",
  "target_lang": "de",
  "creation_time": "2026-03-05T10:00:00.000Z",
  "entry_count": 3
}
```
