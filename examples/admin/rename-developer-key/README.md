# Example: Rename Developer Key

Rename a developer API key using the DeepL Admin API.

## Files

| File | Description |
|---|---|
| `curl.sh` | Minimal `curl` reference command |
| `node/` | Node.js implementation |
| `python/` | Python implementation |

## Quick start

```bash
# Node.js
cd node && DEEPL_ADMIN_KEY=your-admin-key KEY_ID=guid:guid KEY_LABEL=new-name node index.js

# Python
cd python && DEEPL_ADMIN_KEY=your-admin-key KEY_ID=guid:guid KEY_LABEL=new-name python main.py
```

## What it does

1. Reads `DEEPL_ADMIN_KEY`, `KEY_ID`, and optionally `KEY_LABEL` from the environment.
2. Calls `PUT /v2/admin/developer-keys/label` with the key ID and new label.
3. Prints the key ID and updated label.

## Prerequisites

- A DeepL Admin API key (requires a Pro subscription with Admin API access)
- The `KEY_ID` of the key to rename (format: `GUID:GUID`) — get this from the `list-developer-keys` example
- Node.js >= 18 **or** Python >= 3.8

## Sample response

```json
{
  "key_id": "ca7d5694-96eb-4263-a9a4-7f7e4211529e:20c2abcf-4c3c-4cd6-8ae8-8bd2a7d4da38",
  "label": "my-renamed-key",
  "creation_time": "2026-01-01T09:00:00.000Z",
  "is_deactivated": false,
  "usage_limits": {}
}
```
