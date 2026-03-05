# Example: Deactivate Developer Key

Permanently deactivate a developer API key using the DeepL Admin API.

## Files

| File | Description |
|---|---|
| `curl.sh` | Minimal `curl` reference command |
| `node/` | Node.js implementation |
| `python/` | Python implementation |

## Quick start

```bash
# Node.js
cd node && DEEPL_ADMIN_KEY=your-admin-key KEY_ID=guid:guid node index.js

# Python
cd python && DEEPL_ADMIN_KEY=your-admin-key KEY_ID=guid:guid python main.py
```

## What it does

1. Reads `DEEPL_ADMIN_KEY` and `KEY_ID` from the environment.
2. Calls `PUT /v2/admin/developer-keys/deactivate` with the key ID in the request body.
3. Prints the key's updated status and deactivation timestamp.

## Prerequisites

- A DeepL Admin API key (requires a Pro subscription with Admin API access)
- The `KEY_ID` of the key to deactivate (format: `GUID:GUID`) — get this from the `list-developer-keys` example
- Node.js >= 18 **or** Python >= 3.8

## Sample response

```json
{
  "key_id": "ca7d5694-96eb-4263-a9a4-7f7e4211529e:20c2abcf-4c3c-4cd6-8ae8-8bd2a7d4da38",
  "label": "prod-api-key",
  "creation_time": "2026-01-01T09:00:00.000Z",
  "deactivated_time": "2026-03-05T10:00:00.362Z",
  "is_deactivated": true,
  "usage_limits": {}
}
```

## Notes

- **Deactivation is permanent.** The key stops working immediately and cannot be reactivated.
- Use `list-developer-keys` to retrieve key IDs before running this example.
