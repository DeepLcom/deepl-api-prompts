# Example: Delete Glossary

Permanently delete a glossary by its ID.

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
2. Calls `DELETE /v2/glossaries/{glossary_id}`.
3. Confirms deletion with a success message.

## Prerequisites

- A DeepL API key ([sign up free](https://www.deepl.com/pro#developer))
- An existing glossary ID — run the `create-glossary` example first
- Node.js >= 18 **or** Python >= 3.8

## Sample response

HTTP `204 No Content` — the response body is empty on success.

```
HTTP/1.1 204 No Content
```

## Notes

- Deletion is permanent and cannot be undone.
- The API returns HTTP 204 No Content on success; the example prints a confirmation message locally.
