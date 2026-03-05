# Example: Get Glossary Entries

Retrieve the term pairs stored inside a glossary.

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
2. Calls `GET /v2/glossaries/{glossary_id}/entries` with `Accept: text/tab-separated-values`.
3. Parses and prints each source → target term pair.

## Prerequisites

- A DeepL API key ([sign up free](https://www.deepl.com/pro#developer))
- An existing glossary ID — run the `create-glossary` example first
- Node.js >= 18 **or** Python >= 3.8

## Sample response

The endpoint returns tab-separated values (`text/tab-separated-values`):

```
Hello	Hallo
Thank you	Vielen Dank
Goodbye	Auf Wiedersehen
```
