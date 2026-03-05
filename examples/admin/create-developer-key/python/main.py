"""
Create a new developer API key using the DeepL Admin API.
Requires an Admin API key (set DEEPL_ADMIN_KEY environment variable).
The Admin API is available only to a limited set of Pro API subscribers.
"""

import os
import urllib.request
import json

admin_key = os.environ["DEEPL_ADMIN_KEY"]

payload = json.dumps({"label": "new-developer-key"}).encode()

request = urllib.request.Request(
    "https://api.deepl.com/v2/admin/developer-keys",
    data=payload,
    headers={
        "Authorization": f"DeepL-Auth-Key {admin_key}",
        "Content-Type": "application/json",
    },
    method="POST",
)

with urllib.request.urlopen(request) as response:
    result = json.loads(response.read())

print(f"Key ID:      {result['key_id']}")
print(f"Label:       {result['label']}")
print(f"Created at:  {result['creation_time']}")
