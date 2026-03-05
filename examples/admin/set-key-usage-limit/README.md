# Example: Set Key Usage Limit

Set a monthly character usage limit on a developer API key using the DeepL Admin API.

## Files

| File | Description |
|---|---|
| `curl.sh` | Minimal `curl` reference command |
| `node/` | Node.js implementation |
| `python/` | Python implementation |

## Quick start

```bash
# Node.js — set limit to 1,000,000 characters
cd node && DEEPL_ADMIN_KEY=your-admin-key KEY_ID=guid:guid CHAR_LIMIT=1000000 node index.js

# Python
cd python && DEEPL_ADMIN_KEY=your-admin-key KEY_ID=guid:guid CHAR_LIMIT=1000000 python main.py
```

## What it does

1. Reads `DEEPL_ADMIN_KEY`, `KEY_ID`, and `CHAR_LIMIT` from the environment.
2. Calls `PUT /v2/admin/developer-keys/limits` with the key ID and character limit.
3. Prints the key ID, label, and updated usage limits.

## Prerequisites

- A DeepL Admin API key (requires a Pro subscription with Admin API access)
- The `KEY_ID` of the key to limit (format: `GUID:GUID`) — get this from the `list-developer-keys` example
- Node.js >= 18 **or** Python >= 3.8

## Sample response

```json
{
  "key_id": "ca7d5694-96eb-4263-a9a4-7f7e4211529e:20c2abcf-4c3c-4cd6-8ae8-8bd2a7d4da38",
  "label": "prod-api-key",
  "creation_time": "2026-01-01T09:00:00.000Z",
  "is_deactivated": false,
  "usage_limits": {
    "characters": 1000000
  }
}
```

## Notes

- Set `CHAR_LIMIT=0` to block all usage on the key immediately.
- Set `CHAR_LIMIT=null` to remove the limit and allow unlimited usage.
- The limit resets at the start of each usage period.
- Developers receive notification emails at 80% and 100% of the limit.
