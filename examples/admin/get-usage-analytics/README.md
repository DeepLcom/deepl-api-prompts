# Example: Get Usage Analytics

Retrieve character usage statistics for your organisation over a date range using the DeepL Admin API.

## Files

| File | Description |
|---|---|
| `curl.sh` | Minimal `curl` reference command |
| `node/` | Node.js implementation |
| `python/` | Python implementation |

## Quick start

```bash
# Node.js — reports the last 30 days grouped by API key
cd node && DEEPL_ADMIN_KEY=your-admin-key node index.js

# Python
cd python && DEEPL_ADMIN_KEY=your-admin-key python main.py

# Custom date range
cd node && DEEPL_ADMIN_KEY=your-admin-key START_DATE=2026-01-01 END_DATE=2026-01-31 node index.js
```

## What it does

1. Reads `DEEPL_ADMIN_KEY` from the environment; optionally reads `START_DATE` and `END_DATE`.
2. Defaults to the last 30 days if dates are not provided.
3. Calls `GET /v2/admin/analytics?start_date=…&end_date=…&group_by=key`.
4. Prints a summary of total characters, text translation, document translation, and text improvement characters for the period.

## Prerequisites

- A DeepL Admin API key (requires a Pro subscription with Admin API access)
- Node.js >= 18 **or** Python >= 3.8

## Sample response

```json
{
  "usage_report": {
    "total_usage": {
      "total_characters": 9619,
      "text_translation_characters": 4892,
      "document_translation_characters": 0,
      "text_improvement_characters": 4727,
      "speech_to_text_minutes": 107.46
    },
    "group_by": "key",
    "start_date": "2026-02-03T00:00:00",
    "end_date": "2026-03-05T00:00:00",
    "key_usages": [
      {
        "api_key": "dc88****3a2c",
        "api_key_label": "prod-api-key",
        "usage": {
          "total_characters": 9619,
          "text_translation_characters": 4892,
          "document_translation_characters": 0,
          "text_improvement_characters": 4727,
          "speech_to_text_minutes": 107.46
        }
      }
    ]
  }
}
```

## Notes

- Use `group_by=key_and_day` to get per-key, per-day breakdowns (adjust the query parameter in the example).
- Analytics are only available on `api.deepl.com` (the Pro endpoint).
