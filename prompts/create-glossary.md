# Prompt: Create a DeepL Glossary

**Use when:** You want to programmatically create a glossary from a list of term pairs (e.g. from a CSV, TSV, or in-memory map).

---

## Context

**Endpoint:** `POST /v2/glossaries`

**Request body:**

| Field | Required | Description |
|---|---|---|
| `name` | ✅ | Human-readable name (any string) |
| `source_lang` | ✅ | Source language code, e.g. `EN` |
| `target_lang` | ✅ | Target language code, e.g. `DE` |
| `entries` | ✅ | Term pairs as a formatted string |
| `entries_format` | ✅ | `tsv` or `csv` |

**TSV format** (recommended — no quoting issues):

```
source_term\ttarget_term
automobile\tAuto
gasoline\tBenzin
```

**Response:** A `201 Created` with a glossary object:

```json
{
  "glossary_id": "7a8b9c0d-1234-...",
  "name": "My Car Glossary",
  "ready": true,
  "source_lang": "en",
  "target_lang": "de",
  "creation_time": "2026-01-15T10:00:00.000000Z",
  "entry_count": 2
}
```

The `ready` field is usually `true` immediately, but may be `false` for very large glossaries. Poll `GET /v2/glossaries/{id}` until `ready` is `true` before using the glossary.

**Authentication:** `Authorization: DeepL-Auth-Key <key>` header.

---

## Prompt

```prompt
You are an expert software engineer. Generate code that creates a DeepL glossary from a list of term pairs.

Requirements:
1. Read DEEPL_API_KEY from the environment.
2. Auto-select host: :fx suffix → api-free.deepl.com, else api.deepl.com.
3. Accept inputs: name (string), sourceLang (string), targetLang (string), entries (Record<string, string> or dict mapping source → target term).
4. Serialize the entries to TSV format (source\ttarget, one pair per line). Handle edge cases: tabs or newlines in terms should raise a validation error before the request is sent.
5. POST to /v2/glossaries with the correct body and Content-Type: application/json.
6. After creation, poll GET /v2/glossaries/{id} every 500ms until ready === true (timeout after 30s).
7. Return the full glossary object on success.
8. Handle errors:
   - 400 → ValidationError with the API's error message
   - 403 → AuthError
   - 409 → GlossaryConflictError("A glossary with this name already exists for this language pair")
   - 456 → QuotaError
   - other non-2xx → ApiError
9. Log the created glossary_id and entry_count to stdout.
10. Include a runnable demo that creates a small EN→DE car-terminology glossary (at least 5 terms).

Use idiomatic code with full error handling and docstrings/JSDoc.
```

---

## Example output

```
✓ Glossary created: 7a8b9c0d-1234-5678-abcd-ef0123456789
  Name:        Car Terminology EN→DE
  Language:    EN → DE
  Entries:     5
  Ready:       true
```

---

## Caveats

- Glossary names are **not unique** — the API will allow duplicates. If you need to avoid duplicates, list existing glossaries first (see [manage-glossary.md](./manage-glossary.md)) and check for a matching name/language-pair combination.
- Maximum glossary size is **10,000 entries** per glossary.
- Only certain language pairs support glossaries; check `GET /v2/glossary-language-pairs` first.
- The `entries_format` is case-sensitive — use lowercase `tsv` or `csv`.
