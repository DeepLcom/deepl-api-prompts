"""
Poll an Agent API task until it completes, then retrieve the result.
Requires a DeepL API Pro subscription (Enterprise only).
Set DEEPL_API_KEY and TASK_ID environment variables before running.
"""

import os
import time
import urllib.request
import json

auth_key = os.environ["DEEPL_API_KEY"]
task_id = os.environ["TASK_ID"]

print(f"Polling task {task_id}...")

while True:
    request = urllib.request.Request(
        f"https://api.deepl.com/v1/unstable/agent/tasks/{task_id}",
        headers={"Authorization": f"DeepL-Auth-Key {auth_key}"},
        method="GET",
    )

    with urllib.request.urlopen(request) as response:
        task = json.loads(response.read())

    status = task.get("status")
    print(f"Status: {status}")

    if status == "Completed":
        break

    time.sleep(5)

# The result contains presigned URLs valid for 5 minutes.
result_urls = task.get("result", {})
content_url = result_urls.get("content_url")
if content_url:
    with urllib.request.urlopen(content_url) as response:
        content = json.loads(response.read())
    print(f"\nResult language: {content.get('language')}")
    print(f"Result content:  {content.get('content', 'N/A')}")
else:
    print(f"\nTask result: {json.dumps(task, indent=2)}")
