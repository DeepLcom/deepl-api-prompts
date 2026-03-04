# Prompt: Control Formality in DeepL Translations

**Use when:** You need translations that match a specific register — formal (Sie, vous) or informal (du, tu) — for languages that grammatically encode this distinction.

---

## Context

The `formality` parameter on `POST /v2/translate` accepts:

| Value | Behaviour |
|---|---|
| `default` | DeepL's default choice for the language |
| `more` | Always use formal forms; fail with `400` if the language doesn't support it |
| `less` | Always use informal forms; fail with `400` if not supported |
| `prefer_more` | Use formal if available, otherwise fall back to default |
| `prefer_less` | Use informal if available, otherwise fall back to default |

**Languages that support formality (as of early 2026):**

`DE`, `FR`, `IT`, `ES`, `NL`, `PL`, `PT-BR`, `PT-PT`, `JA`, `RU`

English, Chinese, and several others do **not** support formality — use `prefer_more` / `prefer_less` to avoid errors when the target language is dynamic.

**Authentication:** `Authorization: DeepL-Auth-Key <key>` header.

---

## Prompt

```prompt
You are an expert software engineer. Generate code that demonstrates DeepL's formality parameter for translation.

Requirements:
1. Read DEEPL_API_KEY from the environment.
2. Auto-select host: :fx → api-free.deepl.com, else api.deepl.com.
3. Create a translateWithFormality(texts, targetLang, formality) function.
   - texts: string[]
   - targetLang: string (e.g. "DE")
   - formality: "default" | "more" | "less" | "prefer_more" | "prefer_less"
4. POST to /v2/translate including the formality field.
5. Return translated strings.
6. Handle errors:
   - 400 where the body mentions "formality" → throw FormalityNotSupportedError("Formality not supported for target language <lang>")
   - 403 → AuthError
   - 456 → QuotaError
   - 429 → retry with back-off
   - other non-2xx → ApiError
7. In the demo, translate the same sentence ("Could you please help me with this?") into German four times:
   - formality: "default", "more", "less", then show that "prefer_more" with English target does NOT error.
8. Print a comparison table showing formality setting → translated text.

Use idiomatic code with docstrings/JSDoc.
```

---

## Example output

```
Translating "Could you please help me with this?" → DE

Formality        Translation
---------------  ---------------------------------------------------
default          Könnten Sie mir dabei bitte helfen?
more (formal)    Könnten Sie mir dabei bitte helfen?
less (informal)  Könntest du mir dabei bitte helfen?
prefer_more      Könnten Sie mir dabei bitte helfen?
```

---

## Caveats

- Using `more` or `less` (not `prefer_*`) with a language that does not support formality returns HTTP `400`. Always use the `prefer_*` variants if your target language is dynamic or user-supplied.
- Formality applies to the **target** language, not the source.
- Regional variants (`PT-BR` vs `PT-PT`) may behave differently — test both.
