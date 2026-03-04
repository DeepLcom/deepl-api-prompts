# Prompt: Translate Using a DeepL Glossary

**Use when:** You have an existing DeepL glossary and want code that applies it during translation to enforce consistent terminology.

---

## Context

A DeepL glossary is a set of source→target term pairs linked to a specific language pair. Once created (see [create-glossary.md](./create-glossary.md)), you reference it by its UUID in every translation request.

**Endpoint:** `POST /v2/translate`

**Extra parameter:**

| Parameter | Description |
|---|---|
| `glossary_id` | UUID of the glossary to apply |
| `source_lang` | **Required** when using a glossary — you cannot omit it |
| `target_lang` | Must match the glossary's target language |

**Glossary language-pair restrictions:** Not all language pairs support glossaries. Fetch supported pairs first:

```
GET /v2/glossary-language-pairs
```

**Authentication:** `Authorization: DeepL-Auth-Key <key>` header.

---

## Prompt

```prompt
You are an expert software engineer. Generate code that translates text using the DeepL API with a specific glossary applied.

Requirements:
1. Read DEEPL_API_KEY from the environment.
2. Auto-select host based on key suffix (:fx → api-free.deepl.com, else api.deepl.com).
3. Accept these inputs: texts (string[]), sourceLang (string), targetLang (string), glossaryId (string).
4. Validate up front that the glossary language pair is supported by calling GET /v2/glossary-language-pairs and checking that the source/target pair exists. Throw a descriptive error if not.
5. POST to /v2/translate with { text, source_lang, target_lang, glossary_id }.
6. Return translated strings in order.
7. Handle errors:
   - 403 → AuthError
   - 404 → GlossaryNotFoundError("Glossary <id> not found")
   - 456 → QuotaError
   - 429 → retry with back-off
   - other non-2xx → ApiError
8. Print each original → translated pair clearly in the demo.
9. Provide a runnable demo that uses a hard-coded glossary_id placeholder ("YOUR_GLOSSARY_ID") so the user only needs to swap in their real UUID.

Use idiomatic code with full error handling and docstrings.
```

---

## Example output

```
[EN → DE, glossary: 7a8b9c0d-...]
  "The car runs on gasoline."  →  "Das Auto fährt mit Benzin."
  "Open the hood."             →  "Öffne die Motorhaube."
```

---

## Caveats

- `source_lang` is **mandatory** when `glossary_id` is provided; requests without it will return `400 Bad Request`.
- A glossary is tied to exactly one language pair — you cannot reuse the same glossary for different pairs.
- Glossary entries are case-sensitive by default.
- Glossaries are not available for all language pairs. Always check `/v2/glossary-language-pairs` first.
