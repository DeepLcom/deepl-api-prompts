# Example: Create Glossary

Create a new glossary from a set of term pairs and wait until it is ready to use.

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
2. Defines a small dictionary of English → German term pairs (e.g. product-specific terminology).
3. Calls `POST /v2/glossaries` to create the glossary.
4. Polls the glossary status until it is `ready`.
5. Prints the new glossary ID, which can be used in translation requests.

## Prerequisites

- A DeepL API key ([sign up free](https://www.deepl.com/pro#developer))
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

## Notes

- Glossary creation is asynchronous; the SDK polls until the status is `ready` before returning.
- Glossaries are scoped to the API key used to create them.
- Save the printed glossary ID — you will need it for the `get-glossary`, `translate-with-glossary`, and `delete-glossary` examples.
