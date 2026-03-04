# Prompt: Improve Translation Quality with Context

**Use when:** You have a short or ambiguous sentence whose meaning depends on surrounding text, and you want to pass that surrounding text to DeepL to improve translation accuracy.

---

## Context

The `context` parameter on `POST /v2/translate` accepts a string that provides additional background for the translation engine. It is **not translated itself** and does **not count against your character quota**.

Typical use-cases:
- UI strings: `"Save"` is ambiguous — with `context: "Button label in a document editor"` DeepL knows to translate it as a verb, not a saved file.
- Anaphora resolution: `"It broke"` → context: `"We were discussing the laptop hinge"`.
- Domain terminology: pass a brief domain descriptor to nudge vocabulary choices.

**Key facts:**
- `context` is a plain string (max recommended: ~2,000 characters).
- It is silently ignored if DeepL determines it is not helpful.
- It works best when it is in the same or a closely related language as the `text`.

**Endpoint:** `POST /v2/translate`

**Authentication:** `Authorization: DeepL-Auth-Key <key>` header.

---

## Prompt

```prompt
You are an expert software engineer. Generate code that uses the DeepL API's "context" parameter to improve translation quality for ambiguous strings.

Requirements:
1. Read DEEPL_API_KEY from the environment.
2. Auto-select host: :fx → api-free.deepl.com, else api.deepl.com.
3. Create a function translateWithContext(text, targetLang, context, sourceLang?) that:
   - accepts a single text string and an optional context string
   - POSTs to /v2/translate with the text, target_lang, source_lang (if provided), and context fields
   - returns the translated text string and detected source language
4. Handle errors:
   - 403 → AuthError
   - 456 → QuotaError
   - 429 → retry with back-off
   - other non-2xx → ApiError
5. In the demo, show the effect of context on translation quality by translating the same sentence twice:
   a. Without context
   b. With a helpful context string
   Print a side-by-side comparison of the two results.
6. Use at least two different example sentences that clearly benefit from context (e.g. UI button labels, short noun phrases).

Use idiomatic code with docstrings.
```

---

## Demo comparison example

```
Sentence: "Save"  →  DE

Without context:  "Speichern"         (ambiguous — could be verb or noun)
With context:     "Speichern"         (verb, confirmed by context: "button in a text editor")

---

Sentence: "Right"  →  DE

Without context:  "Richtig"           (adjective: correct)
With context:     "Rechts"            (direction — context: "navigation arrow pointing right")
```

---

## Caveats

- Context is not a system prompt — it does not grant fine-grained control. Think of it as a hint, not a guarantee.
- Extremely long context strings (> 5,000 chars) may be truncated or ignored internally.
- The `context` field is currently only honoured by certain language pairs and model versions; DeepL may silently ignore it for unsupported pairs.
- Context does **not** affect billing — only the characters in `text` count.
