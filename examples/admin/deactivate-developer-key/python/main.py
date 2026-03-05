"""
Deactivate a developer API key using the DeepL Admin API.
WARNING: Deactivation is permanent — the key cannot be reactivated.
Requires DEEPL_ADMIN_KEY and KEY_ID environment variables.
"""

import os
import urllib.request
import json

admin_key = os.environ["DEEPL_ADMIN_KEY"]
key_id = os.environ["KEY_ID"]

payload = json.dumps({"key_id": key_id}).encode()

request = urllib.request.Request(
    "https://api.deepl.com/v2/admin/developer-keys/deactivate",
    data=payload,
    headers={
        "Authorization": f"DeepL-Auth-Key {admin_key}",
        "Content-Type": "application/json",
    },
    method="PUT",
)

with urllib.request.urlopen(request) as response:
    result = json.loads(response.read())

print(f"Key ID:          {result['key_id']}")
print(f"Label:           {result['label']}")
print(f"Is deactivated:  {result['is_deactivated']}")
print(f"Deactivated at:  {result.get('deactivated_time', 'N/A')}")
