"""
Rename a developer API key using the DeepL Admin API.
Requires DEEPL_ADMIN_KEY and KEY_ID environment variables.
"""

import os
import urllib.request
import json

admin_key = os.environ["DEEPL_ADMIN_KEY"]
key_id = os.environ["KEY_ID"]
new_label = os.environ.get("KEY_LABEL", "my-renamed-key")

payload = json.dumps({"key_id": key_id, "label": new_label}).encode()

request = urllib.request.Request(
    "https://api.deepl.com/v2/admin/developer-keys/label",
    data=payload,
    headers={
        "Authorization": f"DeepL-Auth-Key {admin_key}",
        "Content-Type": "application/json",
    },
    method="PUT",
)

with urllib.request.urlopen(request) as response:
    result = json.loads(response.read())

print(f"Key ID:  {result['key_id']}")
print(f"Label:   {result['label']}")
