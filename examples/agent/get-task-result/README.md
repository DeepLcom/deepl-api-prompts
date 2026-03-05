# Example: Get Task Result

Poll an Agent API task until it completes, then download and print the result.

## Files

| File | Description |
|---|---|
| `curl.sh` | Minimal `curl` polling loop |
| `node/` | Node.js implementation |
| `python/` | Python implementation |

## Quick start

```bash
# Node.js
cd node && DEEPL_API_KEY=your-key TASK_ID=your-task-id node index.js

# Python
cd python && DEEPL_API_KEY=your-key TASK_ID=your-task-id python main.py
```

## What it does

1. Reads `DEEPL_API_KEY` and `TASK_ID` from the environment.
2. Polls `GET /v1/unstable/agent/tasks/{task_id}` every 5 seconds until `status` is `Completed`.
3. Fetches the result content from the presigned URL provided in the response.
4. Prints the result language and content.

## Prerequisites

- A DeepL API Pro subscription with Agent API access (Enterprise only)
- A `TASK_ID` from the `trigger-workflow` example
- Node.js >= 18 **or** Python >= 3.8

## Sample response

**Polling** (`GET /v1/unstable/agent/tasks/{task_id}`) once complete:

```json
{
  "task_id": "b3c91a4f-5e72-4d1b-89f0-abc123456789",
  "status": "Completed",
  "last_modified_date": "2026-03-05T10:02:00.000Z",
  "result": {
    "content_url": "https://s3.amazonaws.com/...presigned-url...",
    "screenshot_url": "https://s3.amazonaws.com/...presigned-url..."
  }
}
```

**Result content** (fetched from `content_url`):

```json
{
  "message": "Task completed successfully",
  "content_type": "text/plain",
  "language": "EN",
  "content": "Hello, here is the translated and summarised document output."
}
```

## Notes

- The Agent API endpoint is marked `unstable` and may change without notice.
- Only available on `api.deepl.com` (the Pro endpoint).
- Presigned result URLs are valid for only 5 minutes after the task completes; download promptly.
- The API allows a maximum of 12 polling requests per minute; the example waits 5 seconds between polls.
