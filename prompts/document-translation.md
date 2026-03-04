# Prompt: Translate a Document with the DeepL API

**Use when:** You need to translate a whole file (PDF, Word, PowerPoint, etc.) rather than individual strings, preserving the original layout and formatting.

---

## Context

Document translation is a three-step async workflow:

```
1. POST /v2/document          → upload file → get { document_id, document_key }
2. GET  /v2/document/{id}     → poll status until done (status: "done")
3. GET  /v2/document/{id}/result → download translated binary
```

### Step 1 — Upload

`POST /v2/document` — **multipart/form-data**

| Field | Description |
|---|---|
| `file` | The file binary (field name must be `file`) |
| `target_lang` | Target language code |
| `source_lang` | Optional source language |
| `glossary_id` | Optional glossary UUID |
| `formality` | Optional formality setting |
| `filename` | Optional override for the filename (affects MIME detection) |

### Step 2 — Poll status

`GET /v2/document/{document_id}?document_key={document_key}`

```json
{
  "document_id": "abc123",
  "status": "translating",   // "queued" | "translating" | "done" | "error"
  "seconds_remaining": 12,
  "billed_characters": 4200
}
```

Poll every 2–5 seconds. Stop when `status` is `"done"` or `"error"`.

### Step 3 — Download

`POST /v2/document/{document_id}/result` with body `{ "document_key": "..." }`

Returns the binary of the translated file. Save it with the original extension.

**Supported formats:** `.pdf`, `.docx`, `.pptx`, `.xlsx`, `.txt`, `.html`, `.xlf`, `.srt`, `.xliff`, `.csv`

**Authentication:** `Authorization: DeepL-Auth-Key <key>` header.

---

## Prompt

```prompt
You are an expert software engineer. Generate code that translates a document file using the DeepL document translation API.

Requirements:
1. Read DEEPL_API_KEY from the environment.
2. Auto-select host: :fx → api-free.deepl.com, else api.deepl.com.
3. Accept inputs: inputFilePath (string), targetLang (string), outputFilePath (string), and optional sourceLang and glossaryId.
4. Step 1 — Upload: POST the file as multipart/form-data to /v2/document. Store the returned document_id and document_key.
5. Step 2 — Poll: GET /v2/document/{document_id}?document_key=... every 3 seconds. Print progress (status + seconds_remaining) to stdout. Stop when status is "done". If status is "error", throw TranslationError with the error_message from the response.
6. Step 3 — Download: POST to /v2/document/{document_id}/result, stream the binary response directly to outputFilePath. Do not load the whole file into memory at once (use streaming / chunked writes).
7. Print a summary when done: input file, output file, billed characters, total time taken.
8. Handle errors:
   - 403 → AuthError
   - 413 → FileTooLargeError("File exceeds DeepL's document size limit")
   - 415 → UnsupportedFormatError("File type not supported by DeepL")
   - 456 → QuotaError
   - other non-2xx → ApiError with status and body
9. Provide a runnable demo that translates a small .txt file from EN to DE (create the sample .txt file in the demo code).

Use streaming for the download, handle all errors, and add docstrings.
```

---

## Example output

```
Uploading document: sample.txt (1.2 KB) → DE
Document ID: abc123...
Status: translating (12s remaining)
Status: translating (7s remaining)
Status: done
✓ Saved translated document to: sample_DE.txt
  Billed characters: 423
  Total time: 18.4 s
```

---

## Caveats

- Document translation uses a **separate character quota** from text translation for `.pdf` files; other formats share the text quota.
- The `document_key` is **secret** — treat it like a credential. Never log it.
- Maximum file size is **10 MB** (free tier: **5 MB**).
- PDFs are translated via OCR and may lose some formatting; prefer `.docx` when possible.
- Once you download the result, the document is deleted from DeepL's servers (no second download).
