# ai.md — Machine-readable index for this repository

This file is intended for LLMs, AI coding assistants, and automated tooling.
It is a dense, structured index of every resource in this repository.
Human-friendly documentation lives in README.md and CONTRIBUTING.md.

---

## Repository purpose

This repository contains:
1. **Prompts** (`/prompts/`) — self-contained natural-language prompts to paste into any AI assistant (Claude, ChatGPT, Copilot, Cursor, etc.) to generate working DeepL API code.
2. **Examples** (`/examples/`) — runnable, tested code in Node.js, Python, and .NET that demonstrates each DeepL API feature.
3. **Schemas** (`/schemas/`) — an OpenAPI 3.1 spec and a Postman v2.1 collection covering the full DeepL REST API v2.
4. **Templates** (`/_templates/`) — contribution scaffolding for adding new prompts and examples consistently.

The target API is the **DeepL REST API v2** (`https://api-free.deepl.com/v2` for free-tier keys, `https://api.deepl.com/v2` for paid-tier keys).

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

### `/examples/translate/`
Full translation example with formality demo.

| Path | Language | Entry point | Dependencies |
|---|---|---|---|
| `examples/translate/node/index.js` | Node.js ≥18 | `node index.js` | `deepl-node` |
| `examples/translate/python/main.py` | Python ≥3.10 | `python main.py` | `deepl` |
| `examples/translate/dotnet/Program.cs` | .NET 8 | `dotnet run` | `DeepL.net` |
| `examples/translate/curls.sh` | Bash / curl | `bash curls.sh` | `curl`, `jq` |
| `examples/translate/openapi.yaml` | OpenAPI 3.1 | — | Covers `/v2/translate` only |

Core function signature (all runtimes):
```
translateTexts(texts: string[], targetLang: string, options?: { sourceLang?, formality?, context?, glossaryId? })
  → { detectedSourceLang, text }[]
```

### `/examples/detect-language/`
Language detection via translation side-effect.

| Path | Language | Entry point | Dependencies |
|---|---|---|---|
| `examples/detect-language/node/index.js` | Node.js ≥18 | `node index.js` | `deepl-node` |
| `examples/detect-language/python/main.py` | Python ≥3.10 | `python main.py` | `deepl` |
| `examples/detect-language/curls.sh` | Bash / curl | `bash curls.sh` | `curl`, `jq` |

Core function signature:
```
detectLanguages(texts: string[]) → { text, detectedLang }[]
```
Implementation note: translates to `EN-US` without `source_lang`; returns only `detected_source_language` and discards the translation.

### `/examples/glossary/`
Full glossary lifecycle: create → list → translate → get entries → delete.

| Path | Language | Entry point | Dependencies |
|---|---|---|---|
| `examples/glossary/node/index.js` | Node.js ≥18 | `node index.js` | `deepl-node` |
| `examples/glossary/python/main.py` | Python ≥3.10 | `python main.py` | `deepl` |
| `examples/glossary/curls.sh` | Bash / curl | `bash curls.sh` | `curl`, `jq` |

Key functions exposed (all runtimes):
```
listSupportedLanguagePairs() → GlossaryLanguagePair[]
createGlossary(name, sourceLang, targetLang, entries) → GlossaryInfo   # polls until ready
listGlossaries() → GlossaryInfo[]
getGlossaryEntries(glossaryId) → Record<string, string>
translateWithGlossary(texts, sourceLang, targetLang, glossaryId) → string[]
deleteGlossary(glossaryId) → void                                       # commented out in demo
```

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

---

## DeepL API endpoint reference (summary)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v2/translate` | Translate up to 50 strings. Supports formality, context, glossary, HTML/XML tags. |
| `GET` | `/v2/languages` | List supported source or target languages (`?type=source` / `?type=target`). |
| `GET` | `/v2/usage` | Current character count and limit for the account. |
| `POST` | `/v2/document` | Upload a document (multipart/form-data). Returns `document_id` + `document_key`. |
| `GET` | `/v2/document/{id}` | Poll document translation status. Statuses: `queued`, `translating`, `done`, `error`. |
| `POST` | `/v2/document/{id}/result` | Download translated document binary (stream response). |
| `GET` | `/v2/glossary-language-pairs` | List language pairs that support glossaries. |
| `GET` | `/v2/glossaries` | List all glossaries for the account. |
| `POST` | `/v2/glossaries` | Create a glossary from TSV or CSV entry pairs. |
| `GET` | `/v2/glossaries/{id}` | Get metadata for a single glossary. |
| `GET` | `/v2/glossaries/{id}/entries` | Get term pairs (TSV/CSV). Send `Accept: text/tab-separated-values`. |
| `DELETE` | `/v2/glossaries/{id}` | Permanently delete a glossary. Returns `204 No Content`. |

---

## Formality support matrix (target languages only)

Formality (`more` / `less` / `prefer_more` / `prefer_less`) is supported for:
`DE`, `FR`, `IT`, `ES`, `NL`, `PL`, `PT-BR`, `PT-PT`, `JA`, `RU`

For all other languages (including `EN`, `ZH`, `AR`): use `prefer_more` / `prefer_less` to avoid a `400` error. Strict `more` / `less` will return `400 Bad Request` for unsupported languages.

---

## Document translation: supported formats

`.docx`, `.pptx`, `.xlsx`, `.pdf`, `.txt`, `.html`, `.xlf`, `.xliff`, `.srt`, `.csv`

Size limits: 10 MB (paid tier), 5 MB (free tier).
The `document_key` is secret — treat it like a credential and never log it.
After a successful download the document is removed from DeepL's servers; it cannot be downloaded again.

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
- New example → create `examples/<feature>/`, copy `_templates/example.readme.template.md` as `README.md`, add a row to the examples index in this file and in `examples/README.md`
- New runtime for existing example → add a subdirectory (`go/`, `ruby/`, etc.) with a manifest and single entry-point; update the example's `README.md` and this file
- Schema changes → update `schemas/openapi.json` to OpenAPI 3.1 and `schemas/postman_collection.json` to v2.1; keep them in sync
