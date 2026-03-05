# Example: Trigger Workflow

Trigger an Agent API workflow to process an input and receive a task ID for polling.

## Files

| File | Description |
|---|---|
| `curl.sh` | Minimal `curl` reference command |
| `node/` | Node.js implementation |
| `python/` | Python implementation |

## Quick start

```bash
# Node.js
cd node && DEEPL_API_KEY=your-key WORKFLOW_ID=your-workflow-id node index.js

# Python
cd python && DEEPL_API_KEY=your-key WORKFLOW_ID=your-workflow-id python main.py
```

## What it does

1. Reads `DEEPL_API_KEY` and `WORKFLOW_ID` from the environment.
2. Calls `POST /v1/unstable/agent/workflows/{workflow_id}/trigger` with a `workflow_request` form field containing a JSON payload with the input text.
3. Prints the `task_id`, polling URL, and UI URL returned by the API.

## Prerequisites

- A DeepL API Pro subscription with Agent API access (Enterprise only — [contact sales](https://www.deepl.com/contact-us))
- Your `WORKFLOW_ID` provided by DeepL
- Node.js >= 18 **or** Python >= 3.8

## Sample response

```json
{
  "task_id": "b3c91a4f-5e72-4d1b-89f0-abc123456789",
  "polling_url": "https://api.deepl.com/v1/unstable/agent/tasks/b3c91a4f-5e72-4d1b-89f0-abc123456789",
  "ui_url": "https://app.deepl.com/agent/tasks/b3c91a4f-5e72-4d1b-89f0-abc123456789",
  "last_modified_date": "2026-03-05T10:00:00.000Z"
}
```

## Notes

- The Agent API endpoint is marked `unstable` and may change without notice.
- Only available on `api.deepl.com` (the Pro endpoint); `api-free.deepl.com` is not supported.
- Use the `get-task-result` example to poll until the task is complete and fetch the result.
