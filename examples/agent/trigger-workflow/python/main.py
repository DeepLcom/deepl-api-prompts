"""
Trigger an Agent API workflow.
Requires a DeepL API Pro subscription (Enterprise only).
Set DEEPL_API_KEY and WORKFLOW_ID environment variables before running.

The response contains a task_id that can be used to poll for the result.
See the get-task-result example for how to retrieve the completed result.
"""

import os
import urllib.request
import urllib.parse
import json

auth_key = os.environ["DEEPL_API_KEY"]
workflow_id = os.environ["WORKFLOW_ID"]

workflow_request = json.dumps({
    "input": {
        "text": "Hello, translate and summarise this document.",
    }
})

# The endpoint uses multipart/form-data with workflow_request as a JSON string field.
boundary = "----DeepLBoundary"
body = (
    f"--{boundary}\r\n"
    f'Content-Disposition: form-data; name="workflow_request"\r\n\r\n'
    f"{workflow_request}\r\n"
    f"--{boundary}--\r\n"
).encode()

request = urllib.request.Request(
    f"https://api.deepl.com/v1/unstable/agent/workflows/{workflow_id}/trigger",
    data=body,
    headers={
        "Authorization": f"DeepL-Auth-Key {auth_key}",
        "Content-Type": f"multipart/form-data; boundary={boundary}",
    },
    method="POST",
)

with urllib.request.urlopen(request) as response:
    result = json.loads(response.read())

task_id = result["task_id"]
print(f"Task ID:     {task_id}")
print(f"Polling URL: {result.get('polling_url', 'N/A')}")
print(f"UI URL:      {result.get('ui_url', 'N/A')}")
print()
print(f"Use the get-task-result example to poll for the result:")
print(f"  TASK_ID={task_id} python get-task-result/python/main.py")
