# Example: Create Developer Key

Create a new developer API key using the DeepL Admin API.

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
2. Calls `POST /v2/admin/developer-keys` with an optional label.
3. Prints the new key ID, label, and creation timestamp.

## Prerequisites

- A DeepL Admin API key (requires a Pro subscription — [contact support](https://www.deepl.com/contact-us) to enable Admin API access)
- Node.js >= 18 **or** Python >= 3.8

## Sample response

```json
{
  "key_id": "ca7d5694-96eb-4263-a9a4-7f7e4211529e:20c2abcf-4c3c-4cd6-8ae8-8bd2a7d4da38",
  "label": "new-developer-key",
  "creation_time": "2026-03-05T10:00:00.362Z",
  "is_deactivated": false,
  "usage_limits": {}
}
```

## Notes

- Admin API keys are separate from developer API keys. Manage admin keys in the [Admin Keys tab](https://www.deepl.com/your-account/admin).
- Up to 25 simultaneously active API keys are allowed per account.
- The returned `key_id` (format `GUID:GUID`) is needed for deactivation, renaming, and setting usage limits.
