"""
List all developer API keys using the DeepL Admin API.
Requires an Admin API key (set DEEPL_ADMIN_KEY environment variable).
"""

import os
import urllib.request
import json

admin_key = os.environ["DEEPL_ADMIN_KEY"]

request = urllib.request.Request(
    "https://api.deepl.com/v2/admin/developer-keys",
    headers={
        "Authorization": f"DeepL-Auth-Key {admin_key}",
        "Content-Type": "application/json",
    },
    method="GET",
)

with urllib.request.urlopen(request) as response:
    keys = json.loads(response.read())

print(f"Found {len(keys)} developer key(s):")
for key in keys:
    status = "deactivated" if key.get("is_deactivated") else "active"
    print(f"  [{status}] {key['label']} (ID: {key['key_id']})")
