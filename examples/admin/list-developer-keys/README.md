# Example: List Developer Keys

List all developer API keys associated with your organisation using the DeepL Admin API.

## Files

| File | Description |
|---|---|
| `curl.sh` | Minimal `curl` reference command |
| `node/` | Node.js implementation |
| `python/` | Python implementation |

## Quick start

```bash
# Node.js
cd node && DEEPL_ADMIN_KEY=your-admin-key node index.js

# Python
cd python && DEEPL_ADMIN_KEY=your-admin-key python main.py
```

## What it does

1. Reads `DEEPL_ADMIN_KEY` from the environment.
2. Calls `GET /v2/admin/developer-keys`.
3. Prints the ID, label, and status (active or deactivated) of each key.

## Prerequisites

- A DeepL Admin API key (requires a Pro subscription with Admin API access)
- Node.js >= 18 **or** Python >= 3.8

## Sample response

```json
[
  {
    "key_id": "ca7d5694-96eb-4263-a9a4-7f7e4211529e:20c2abcf-4c3c-4cd6-8ae8-8bd2a7d4da38",
    "label": "prod-api-key",
    "creation_time": "2026-01-01T09:00:00.000Z",
    "is_deactivated": false,
    "usage_limits": {}
  },
  {
    "key_id": "b9e1fa32-5c84-4e77-9d21-4d7c0a110b5f:3a918de2-f441-4b02-b1dc-982f01c3d7fa",
    "label": "old-test-key",
    "creation_time": "2025-06-15T14:30:00.000Z",
    "deactivated_time": "2026-02-01T10:00:00.000Z",
    "is_deactivated": true,
    "usage_limits": {}
  }
]
```

## Notes

- Both active and deactivated keys are returned.
- Use the `key_id` values to pass to `deactivate-developer-key`, `rename-developer-key`, or `set-key-usage-limit`.
