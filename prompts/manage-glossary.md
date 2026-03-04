# Prompt: Manage DeepL Glossaries (List, Inspect, Delete)

**Use when:** You need to audit existing glossaries, retrieve a glossary's entries, or clean up glossaries you no longer need.

---

## Context

### Endpoints

| Action | Method | Path |
|---|---|---|
| List all glossaries | `GET` | `/v2/glossaries` |
| Get one glossary | `GET` | `/v2/glossaries/{glossary_id}` |
| Get entries of a glossary | `GET` | `/v2/glossaries/{glossary_id}/entries` |
| Delete a glossary | `DELETE` | `/v2/glossaries/{glossary_id}` |

### List response

```json
{
  "glossaries": [
    {
      "glossary_id": "7a8b9c0d-...",
      "name": "Car Terminology EN→DE",
      "ready": true,
      "source_lang": "en",
      "target_lang": "de",
      "creation_time": "2026-01-15T10:00:00.000000Z",
      "entry_count": 5
    }
  ]
}
```

### Entries response

Returns a TSV (or CSV, depending on `Accept` header) of `source\ttarget` pairs.

Pass `Accept: text/tab-separated-values` to get TSV back.

### Delete response

`204 No Content` on success.

**Authentication:** `Authorization: DeepL-Auth-Key <key>` header.

---

## Prompt

```prompt
You are an expert software engineer. Generate a CLI-style utility that manages DeepL glossaries.

Requirements:
1. Read DEEPL_API_KEY from the environment.
2. Auto-select host: :fx → api-free.deepl.com, else api.deepl.com.
3. Implement four functions/methods:
   a. listGlossaries() → returns array of glossary metadata objects.
   b. getGlossary(id: string) → returns the full metadata object for one glossary.
   c. getGlossaryEntries(id: string) → returns a Map/dict of { source: target } term pairs parsed from the TSV response.
   d. deleteGlossary(id: string) → deletes the glossary and returns void/None; throws GlossaryNotFoundError on 404.
4. Error handling:
   - 403 → AuthError
   - 404 → GlossaryNotFoundError("Glossary <id> not found")
   - other non-2xx → ApiError
5. In the demo section, show all four operations:
   - list all glossaries and print a summary table
   - look up a single glossary by a placeholder ID "YOUR_GLOSSARY_ID"
   - print its entries as a two-column table
   - (comment out) delete it, with a warning comment so the user doesn't run it accidentally

Use idiomatic code with full docstrings and clean console output.
```

---

## Example output

```
=== Glossaries ===
ID                                    Name                      Lang     Entries  Ready
------------------------------------  ------------------------  -------  -------  -----
7a8b9c0d-1234-5678-abcd-ef0123456789  Car Terminology EN→DE     EN → DE       5  true

=== Entries for 7a8b9c0d-... ===
Source         Target
-------------  ----------------
automobile     Auto
gasoline       Benzin
hood           Motorhaube
```

---

## Caveats

- `DELETE` is **irreversible**. The prompt intentionally comments out the delete call in the demo.
- The entries format for `GET /entries` defaults to TSV when you send `Accept: text/tab-separated-values`. Without that header, behaviour may vary — always set it explicitly.
- A glossary with `ready: false` exists but cannot be used in translations yet.
