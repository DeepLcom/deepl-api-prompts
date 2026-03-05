"""
Improve text using the DeepL Write API.
Requires a DeepL API Pro subscription (not available on Free tier).
"""

import os
import urllib.request
import json

auth_key = os.environ["DEEPL_API_KEY"]

texts = ["The quick brwon fox jumpd over the lazzy dog."]
target_lang = "en-US"

payload = json.dumps({"text": texts, "target_lang": target_lang}).encode()

request = urllib.request.Request(
    "https://api.deepl.com/v2/write/rephrase",
    data=payload,
    headers={
        "Authorization": f"DeepL-Auth-Key {auth_key}",
        "Content-Type": "application/json",
    },
    method="POST",
)

with urllib.request.urlopen(request) as response:
    result = json.loads(response.read())

for improvement in result["improvements"]:
    print(f"Improved text:             {improvement['text']}")
    print(f"Target language:           {improvement['target_language']}")
    print(f"Detected source language:  {improvement['detected_source_language']}")
