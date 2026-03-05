"""
Set a character usage limit on a developer API key using the DeepL Admin API.
Requires DEEPL_ADMIN_KEY and KEY_ID environment variables.
Set CHAR_LIMIT to a positive integer, 0 to block the key, or "null" to remove the limit.
"""

import os
import urllib.request
import json

admin_key = os.environ["DEEPL_ADMIN_KEY"]
key_id = os.environ["KEY_ID"]
char_limit_env = os.environ.get("CHAR_LIMIT", "1000000")
char_limit = None if char_limit_env == "null" else int(char_limit_env)

payload = json.dumps({"key_id": key_id, "characters": char_limit}).encode()

request = urllib.request.Request(
    "https://api.deepl.com/v2/admin/developer-keys/limits",
    data=payload,
    headers={
        "Authorization": f"DeepL-Auth-Key {admin_key}",
        "Content-Type": "application/json",
    },
    method="PUT",
)

with urllib.request.urlopen(request) as response:
    result = json.loads(response.read())

print(f"Key ID:        {result['key_id']}")
print(f"Label:         {result['label']}")
print(f"Usage limits:  {result.get('usage_limits', {})}")
