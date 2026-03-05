# Example: Get Usage

Retrieve character usage and quota for the current billing period.

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
2. Calls `GET /v2/usage`.
3. Checks whether any translation limit has been reached.
4. Prints the number of characters consumed and the account limit.

## Prerequisites

- A DeepL API key ([sign up free](https://www.deepl.com/pro#developer))
- Node.js >= 18 **or** Python >= 3.8

## Sample response

```json
{
  "products": [
    {
      "product_type": "translate",
      "api_key_character_count": 880000,
      "character_count": 900000
    },
    {
      "product_type": "write",
      "api_key_character_count": 1000000,
      "character_count": 1250000
    }
  ],
  "api_key_character_count": 1880000,
  "api_key_character_limit": 1000000000000,
  "start_time": "2026-02-05T14:58:02Z",
  "end_time": "2026-03-05T14:58:02Z",
  "character_count": 2150000,
  "character_limit": 20000000
}
```

> **Note:** Free API and Pro Classic accounts return only `character_count` and `character_limit`.

## Notes

- The `character_count` field is a combined total of text translation, document translation, and text improvement (Write API) characters.
- Free accounts receive 500,000 characters per month. Pro accounts vary by plan.
- The API returns HTTP 456 when the quota is exceeded.
