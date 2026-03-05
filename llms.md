# ai.md — Machine-readable index for this repository

This file is intended for LLMs, AI coding assistants, and automated tooling.
It is a dense, structured index of every resource in this repository.
Human-friendly documentation lives in README.md and CONTRIBUTING.md.

---

## Repository purpose

This repository contains:
1. **Prompts** (`/prompts/`) — self-contained natural-language prompts to paste into any AI assistant (Claude, ChatGPT, Copilot, Cursor, etc.) to generate working DeepL API code.
2. **Examples** (`/examples/`) — runnable, tested code in Node.js, Python, and .NET that demonstrates each DeepL API feature.
3. **MCP Servers** (`/mcp-servers/`) — five focused Model Context Protocol servers, each scoped to a single DeepL API domain, available in Node.js, .NET, Cloudflare Worker, and Docker flavours.
4. **Schemas** (`/schemas/`) — an OpenAPI 3.1 spec and a Postman v2.1 collection covering the full DeepL REST API v2.
5. **Templates** (`/_templates/`) — contribution scaffolding for adding new prompts and examples consistently.

The target API is the **DeepL REST API** — primarily v2 (`https://api-free.deepl.com/v2` / `https://api.deepl.com/v2`), plus v3 for Voice (`https://api.deepl.com/v3`) and the unstable v1 Agent API (`https://api.deepl.com/v1/unstable`).

---

## Critical API conventions

Every piece of code generated from this repo MUST follow these rules:

### Authentication
All requests require the header:
```
Authorization: DeepL-Auth-Key <DEEPL_API_KEY>
```
The key is always read from the environment variable `DEEPL_API_KEY`. Never hardcode it.

### Host selection
Inspect the key suffix to pick the correct host:
- Key ends with `:fx` → free tier → `https://api-free.deepl.com/v2`
- Key does not end with `:fx` → paid tier → `https://api.deepl.com/v2`

### Language codes
- Always **uppercase**: `EN`, `DE`, `FR`, `ES`, `JA`, `ZH`
- Regional variants use a hyphen: `PT-BR`, `PT-PT`, `EN-US`, `EN-GB`, `ZH-HANS`
- `source_lang` is optional on `/translate` (omit for auto-detection); required when `glossary_id` is provided

### Standard error handling (all endpoints)
| HTTP status | Meaning | Suggested exception |
|---|---|---|
| 400 | Bad request / invalid parameters | `ValidationError` |
| 403 | Invalid or missing API key | `AuthError` |
| 404 | Resource not found | `NotFoundError` |
| 413 | File too large (documents) | `FileTooLargeError` |
| 415 | Unsupported file type (documents) | `UnsupportedFormatError` |
| 429 | Rate limit — retry with exponential back-off (1 s, 2 s, 4 s, max 3 retries) | |
| 456 | Character quota exceeded | `QuotaError` |
| 5xx | Server error — retry later | `ApiError` |

### Official SDKs (preferred over raw HTTP)
- Node.js: `deepl-node` (npm) — `new deepl.Translator(apiKey)`
- Python: `deepl` (PyPI) — `deepl.Translator(api_key)`
- .NET: `DeepL.net` (NuGet) — `new Translator(apiKey)`

---

## Prompts index

Each file in `/prompts/` is a self-contained prompt. Copy the fenced `prompt` block and paste it into any AI assistant.

| File | Feature | Key endpoint | Notes |
|---|---|---|---|
| `prompts/translate.md` | Translate text strings | `POST /v2/translate` | Batching, formality, context, glossary |
| `prompts/detect-language.md` | Detect source language | `POST /v2/translate` | No dedicated endpoint; detection is a side-effect of translation; billed normally |
| `prompts/glossary.md` | Use a glossary in translation | `POST /v2/translate` | `glossary_id` + required `source_lang` |
| `prompts/create-glossary.md` | Create a glossary | `POST /v2/glossaries` | TSV format recommended; poll `ready` field |
| `prompts/manage-glossary.md` | List / inspect / delete glossaries | `GET /v2/glossaries`, `DELETE /v2/glossaries/{id}` | Delete is irreversible |
| `prompts/document-translation.md` | Translate a whole document | `POST /v2/document` → poll → download | Async 3-step workflow |
| `prompts/formality.md` | Control formality register | `POST /v2/translate` | Use `prefer_more`/`prefer_less` when target language is dynamic |
| `prompts/context.md` | Pass context to improve quality | `POST /v2/translate` | Context is not billed; not all pairs honour it |
| `prompts/tag-handling.md` | Translate HTML/XML preserving tags | `POST /v2/translate` | `tag_handling: "html"` or `"xml"`; `ignore_tags` for untranslatable blocks |

---

## Examples index

All examples read `DEEPL_API_KEY` from the environment and auto-select the API host.
Each example directory contains a `README.md` with quick-start commands and the exact API response.

### Detect language

| Path | Runtime | Dependencies |
|---|---|---|
| `examples/detect-language/detect-language/python/main.py` | Python ≥3.8 | `deepl` |
| `examples/detect-language/detect-language/node/index.js` | Node.js ≥18 | `deepl-node` |
| `examples/detect-language/detect-language/curl.sh` | curl | — |

Endpoint: `POST /v2/translate` (no `source_lang`). Discards translated text; reads `detected_source_language` only.

### Translate

| Path | Runtime | Dependencies |
|---|---|---|
| `examples/translate/translate-text/` | Python, Node.js, .NET, curl | `deepl` / `deepl-node` / `DeepL.net` |
| `examples/translate/translate-with-formality/` | Python, Node.js, .NET, curl | `deepl` / `deepl-node` / `DeepL.net` |
| `examples/translate/translate-with-context/` | Python, Node.js, .NET, curl | `deepl` / `deepl-node` / `DeepL.net` |

Endpoint: `POST /v2/translate`. Use `prefer_more`/`prefer_less` for `formality` when target language is dynamic. The `context` string is not billed and is not included in the response.

### Glossary

| Path | Feature |
|---|---|
| `examples/glossary/list-glossary-language-pairs/` | `GET /v2/glossary-language-pairs` |
| `examples/glossary/create-glossary/` | `POST /v2/glossaries` — polls until `ready: true` |
| `examples/glossary/list-glossaries/` | `GET /v2/glossaries` |
| `examples/glossary/get-glossary/` | `GET /v2/glossaries/{id}` — requires `GLOSSARY_ID` env var |
| `examples/glossary/get-glossary-entries/` | `GET /v2/glossaries/{id}/entries` — returns TSV |
| `examples/glossary/translate-with-glossary/` | `POST /v2/translate` with `glossary_id` — requires `GLOSSARY_ID` env var |
| `examples/glossary/delete-glossary/` | `DELETE /v2/glossaries/{id}` — permanent, HTTP 204 |

All runtimes: Python, Node.js, curl. `source_lang` is required when `glossary_id` is set.

### Languages

| Path | Runtime |
|---|---|
| `examples/languages/list-languages/` | Python, Node.js, curl |

Endpoint: `GET /v2/languages?type=source|target`. Response includes `supports_formality` flag per target language.

### Usage

| Path | Runtime |
|---|---|
| `examples/usage/get-usage/` | Python, Node.js, curl |

Endpoint: `GET /v2/usage`. Returns combined character count covering text translation, document translation, and Write API characters.

### Write (Improve text)

| Path | Runtime |
|---|---|
| `examples/write/improve-text/` | Python, Node.js, curl |

Endpoint: `POST /v2/write/rephrase`. **Pro only — not available on Free tier.** Max 10 KiB per request. Uses raw HTTP (no SDK); host is always `api.deepl.com`.

### Document translation

| Path | Runtime |
|---|---|
| `examples/document-translation/translate-document/` | Python, Node.js, curl |

3-step async workflow:
1. `POST /v2/document` (multipart) → `{document_id, document_key}`
2. `POST /v2/document/{id}` (poll) → `{status: "queued"|"translating"|"done"|"error"}`
3. `POST /v2/document/{id}/result` (download, one-shot) → binary file

The SDK wraps all three steps in a single call. Min billing: 50,000 chars for `.pptx/.docx/.xlsx/.pdf`.

### Admin API

**Requires `DEEPL_ADMIN_KEY` (separate from `DEEPL_API_KEY`). Only available to a limited set of Pro subscribers. Host is always `api.deepl.com`.**

| Path | Endpoint | Feature |
|---|---|---|
| `examples/admin/create-developer-key/` | `POST /v2/admin/developer-keys` | Create a key |
| `examples/admin/list-developer-keys/` | `GET /v2/admin/developer-keys` | List all keys |
| `examples/admin/deactivate-developer-key/` | `PUT /v2/admin/developer-keys/deactivate` | Permanently deactivate a key |
| `examples/admin/rename-developer-key/` | `PUT /v2/admin/developer-keys/label` | Rename a key |
| `examples/admin/set-key-usage-limit/` | `PUT /v2/admin/developer-keys/limits` | Set monthly character limit; `0` blocks, `null` removes limit |
| `examples/admin/get-usage-analytics/` | `GET /v2/admin/analytics` | Organisation-wide usage by key and/or day |

All runtimes: Python, Node.js, curl. No SDK support — all examples use raw HTTP.

### Voice API

**Enterprise only. Host is always `api.deepl.com`.**

| Path | Runtime |
|---|---|
| `examples/voice/request-session/` | Python, Node.js, curl |

2-step flow:
1. `POST /v3/voice/realtime` → `{streaming_url, token, session_id}`
2. Connect WebSocket to `streaming_url?token=…` and stream audio chunks

Max 5 target languages. Chunks ≤100 KB / 1 s. 30 s silence timeout, 1 hr max. No SDK support.

### Agent API

**Enterprise only. Endpoint is `/v1/unstable/…` and may change. Host is always `api.deepl.com`.**

| Path | Endpoint | Feature |
|---|---|---|
| `examples/agent/trigger-workflow/` | `POST /v1/unstable/agent/workflows/{workflow_id}/trigger` | Start a task — requires `WORKFLOW_ID` env var |
| `examples/agent/get-task-result/` | `GET /v1/unstable/agent/tasks/{task_id}` | Poll until `Completed`; fetch presigned result URL (valid 5 min) |

All runtimes: Python, Node.js, curl. No SDK support — all examples use raw HTTP.

---

## Schemas index

| File | Format | Contents |
|---|---|---|
| `schemas/openapi.json` | OpenAPI 3.1 JSON | All 11 DeepL API v2 endpoints: `/translate`, `/languages`, `/usage`, `/document`, `/document/{id}`, `/document/{id}/result`, `/glossaries`, `/glossaries/{id}`, `/glossaries/{id}/entries`, `/glossary-language-pairs`. Full request/response schemas and error responses. |
| `schemas/postman_collection.json` | Postman v2.1 | Ready-to-import collection. Requires Postman environment variables: `DEEPL_API_KEY`, `DEEPL_HOST`, `GLOSSARY_ID`, `DOCUMENT_ID`, `DOCUMENT_KEY`. |

---

## Templates index

| File | Purpose |
|---|---|
| `_templates/prompt.template.md` | Scaffold for adding a new prompt file to `/prompts/`. Fill in: feature name, endpoint table, self-contained prompt block, example invocation, caveats. |
| `_templates/example.readme.template.md` | Scaffold for the `README.md` of a new example directory under `/examples/`. Fill in: feature name, file table, quick-start commands, step-by-step description. |
| `_templates/mini-mcp.template.md` | Scaffold for the `README.md` of a new mini MCP server under `/mcp-servers/`. Fill in: server name, domain, tools table, environment variables, quick-start commands. |

---

## DeepL API endpoint reference (summary)

### Translate API (v2)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v2/translate` | Translate up to 50 strings. Supports formality, context, glossary, HTML/XML tags. |
| `GET` | `/v2/languages` | List supported source or target languages (`?type=source` / `?type=target`). |
| `GET` | `/v2/usage` | Current billing period character counts and limits. |

### Document translation (v2)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v2/document` | Upload a document (multipart/form-data). Returns `document_id` + `document_key`. |
| `POST` | `/v2/document/{id}` | Poll translation status. Statuses: `queued`, `translating`, `done`, `error`. |
| `POST` | `/v2/document/{id}/result` | Download translated document binary (one-shot; file deleted after download). |

### Glossary (v2)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/v2/glossary-language-pairs` | List language pairs that support glossaries. |
| `GET` | `/v2/glossaries` | List all glossaries for the account. |
| `POST` | `/v2/glossaries` | Create a glossary from TSV or CSV entry pairs. |
| `GET` | `/v2/glossaries/{id}` | Get metadata for a single glossary. |
| `GET` | `/v2/glossaries/{id}/entries` | Get term pairs (TSV). Send `Accept: text/tab-separated-values`. |
| `DELETE` | `/v2/glossaries/{id}` | Permanently delete a glossary. Returns `204 No Content`. |

### Write API (v2) — Pro only

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v2/write/rephrase` | Improve grammar, style, and clarity. Max 10 KiB per request. |

### Admin API (v2) — limited Pro subscribers; requires Admin key

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v2/admin/developer-keys` | Create a developer API key. |
| `GET` | `/v2/admin/developer-keys` | List all developer keys (active and deactivated). |
| `PUT` | `/v2/admin/developer-keys/deactivate` | Permanently deactivate a key (irreversible). |
| `PUT` | `/v2/admin/developer-keys/label` | Rename a key. |
| `PUT` | `/v2/admin/developer-keys/limits` | Set/remove a monthly character limit on a key. |
| `GET` | `/v2/admin/analytics` | Organisation usage statistics, optionally grouped by key and/or day. |

### Voice API (v3) — Enterprise only

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v3/voice/realtime` | Request a session token and WebSocket streaming URL for real-time speech translation. |

### Agent API (v1/unstable) — Enterprise only; endpoint may change

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/unstable/agent/workflows/{workflow_id}/trigger` | Trigger a workflow; returns `task_id`. |
| `GET` | `/v1/unstable/agent/tasks/{task_id}` | Poll task status; result contains presigned download URLs (valid 5 min). |

---

## Formality support matrix (target languages only)

Formality (`more` / `less` / `prefer_more` / `prefer_less`) is supported for:
`DE`, `FR`, `IT`, `ES`, `NL`, `PL`, `PT-BR`, `PT-PT`, `JA`, `RU`

For all other languages (including `EN`, `ZH`, `AR`): use `prefer_more` / `prefer_less` to avoid a `400` error. Strict `more` / `less` will return `400 Bad Request` for unsupported languages.

---

## Document translation: supported formats

`.docx`, `.pptx`, `.xlsx`, `.pdf`, `.txt`, `.html`, `.xlf`, `.xliff`, `.srt`, `.csv`, `.jpeg`, `.jpg`, `.png` (images in beta)

Size limits: 10 MB (paid tier), 5 MB (free tier).
Min billing: 50,000 characters per `.pptx`, `.docx`, `.doc`, `.xlsx`, or `.pdf` submission.
The `document_key` is secret — treat it like a credential and never log it.
After a successful download the document is removed from DeepL's servers; it cannot be downloaded again.
Use the `output_format` parameter to convert between formats during translation (e.g. `pdf` → `docx`).

---

## Glossary constraints

- Maximum entries per glossary: **10,000**
- Languages without glossary support: call `GET /v2/glossary-language-pairs` to check at runtime
- Glossary names are not unique — duplicates are allowed by the API
- Entries are case-sensitive
- `source_lang` is **required** when `glossary_id` is used in `/v2/translate`
- `entries_format` must be lowercase `"tsv"` or `"csv"`
- After creation, poll the `ready` field before using the glossary

---

## How to add content to this repo

- New prompt → copy `_templates/prompt.template.md`, save to `prompts/<feature>.md`, add a row to the prompts index in this file and in `prompts/README.md`
- New example → create `examples/<category>/<use-case>/`, copy `_templates/example.readme.template.md` as `README.md`, add `python/`, `node/`, and optionally `dotnet/` subdirectories, then add a row to the examples index in this file and in `examples/README.md`
- New runtime for existing example → add a subdirectory (`go/`, `ruby/`, etc.) with a manifest and single entry-point; update the example's `README.md` and this file
- New MCP server → create `mcp-servers/<name>-mcp/` with `node/`, `cloudflare-worker/`, `dotnet/`, and `Dockerfile`; copy `_templates/mini-mcp.template.md` as `README.md`; add a row to the MCP servers index in `mcp-servers/README.md` and in this file
- New tool for existing MCP server → add to the server's implementation files, keep tool name consistent with `/schemas/openapi.json`, update the server's `README.md` and this file
- Schema changes → update `schemas/openapi.json` to OpenAPI 3.1 and `schemas/postman_collection.json` to v2.1; keep them in sync
- Admin / Voice / Agent examples require enterprise or limited-access keys; note this clearly in the `README.md` Prerequisites section
