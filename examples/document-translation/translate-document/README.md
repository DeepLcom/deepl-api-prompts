# Example: Translate Document

Upload a document, wait for translation to complete, and download the translated file.

## Files

| File | Description |
|---|---|
| `curl.sh` | Manual 3-step `curl` reference (upload → poll → download) |
| `node/` | Node.js implementation |
| `python/` | Python implementation |

## Quick start

```bash
# Node.js
cd node && npm install && DEEPL_API_KEY=your-key node index.js

# Python
cd python && pip install -r requirements.txt && DEEPL_API_KEY=your-key python main.py
```

## What it does

1. Reads `DEEPL_API_KEY` from the environment.
2. Creates a sample `document.txt` if it does not already exist.
3. Uploads the file to `POST /v2/document` (multipart/form-data) and receives a `document_id` and `document_key`.
4. Polls `POST /v2/document/{document_id}` until the `status` field is `done`.
5. Downloads the translated file from `POST /v2/document/{document_id}/result` and saves it as `document_translated.txt`.

## Prerequisites

- A DeepL API key ([sign up free](https://www.deepl.com/pro#developer))
- Node.js >= 18 **or** Python >= 3.8

## Supported file formats

`docx`, `pptx`, `xlsx`, `pdf`, `html`, `txt`, `xliff`, `srt`, `jpeg`, `jpg`, `png` (images in beta)

## Sample responses

**Step 1 — Upload** (`POST /v2/document`):

```json
{
  "document_id": "a1b2c3d4e5f6a1b2",
  "document_key": "7890abcdef1234567890abcdef123456"
}
```

**Step 2 — Poll status** (`POST /v2/document/{document_id}`):

```json
{
  "document_id": "a1b2c3d4e5f6a1b2",
  "status": "done",
  "seconds_remaining": 0,
  "billed_characters": 57
}
```

**Step 3 — Download** (`POST /v2/document/{document_id}/result`): returns the translated file as binary content.

## Notes

- Documents are deleted from DeepL servers immediately after the first successful download.
- `.pptx`, `.docx`, `.doc`, `.xlsx`, and `.pdf` files are billed a minimum of 50,000 characters per submission.
- The `output_format` parameter can convert documents during translation (e.g. `pdf` → `docx`).
