# Example: List Languages

Retrieve all supported source and target languages for the DeepL Translate API.

## Files

| File | Description |
|---|---|
| `curl.sh` | Minimal `curl` reference commands (source and target) |
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
2. Calls `GET /v2/languages?type=source` and prints each source language code and name.
3. Calls `GET /v2/languages?type=target` and prints each target language code and name, flagging languages that support the `formality` parameter.

## Prerequisites

- A DeepL API key ([sign up free](https://www.deepl.com/pro#developer))
- Node.js >= 18 **or** Python >= 3.8

## Sample response

Source languages (`GET /v2/languages?type=source`):

```json
[
  { "language": "BG", "name": "Bulgarian" },
  { "language": "CS", "name": "Czech" },
  { "language": "DA", "name": "Danish" },
  { "language": "DE", "name": "German" },
  { "language": "EN", "name": "English" },
  { "language": "FR", "name": "French" }
]
```

Target languages (`GET /v2/languages?type=target`):

```json
[
  { "language": "BG", "name": "Bulgarian", "supports_formality": false },
  { "language": "CS", "name": "Czech", "supports_formality": false },
  { "language": "DA", "name": "Danish", "supports_formality": false },
  { "language": "DE", "name": "German", "supports_formality": true },
  { "language": "EN-GB", "name": "English (British)", "supports_formality": false },
  { "language": "EN-US", "name": "English (American)", "supports_formality": false },
  { "language": "FR", "name": "French", "supports_formality": true }
]
```
