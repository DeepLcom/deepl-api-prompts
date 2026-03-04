# Prompt: Detect Language with the DeepL API

**Use when:** You want an AI assistant to generate code that sends text to DeepL and reads back the detected source language, without necessarily translating the content.

---

## Context

DeepL does not expose a dedicated language-detection endpoint. Detection happens as a side-effect of translation: when you omit `source_lang`, the API returns a `detected_source_language` field inside each `translations` object.

The canonical trick is to translate to a "safe" target that is very unlikely to match the input (e.g. always target `EN-US`) and then discard the translated text — or use it if you need it.

**Endpoint:** `POST /v2/translate`

**Key response field:**

```json
{
  "translations": [
    {
      "detected_source_language": "DE",
      "text": "Hello, world!"
    }
  ]
}
```

**Authentication:** `Authorization: DeepL-Auth-Key <key>` header.

**Host detection:** Keys ending in `:fx` → `api-free.deepl.com`, otherwise `api.deepl.com`.

---

## Prompt

```prompt
You are an expert software engineer. Generate code that detects the language of one or more text strings using the DeepL REST API.

Requirements:
1. Read the API key from the environment variable DEEPL_API_KEY.
2. Auto-select the correct host: keys ending in ":fx" use "https://api-free.deepl.com", all others use "https://api.deepl.com".
3. Accept an array of strings as input.
4. POST to /v2/translate with the strings, no source_lang, and target_lang set to "EN-US" (or any language unlikely to match the input).
5. Extract and return detected_source_language from each translations entry, in input order.
6. Do NOT return the translated text — only the detected language codes.
7. Handle errors:
   - 403 → throw AuthError("Invalid DeepL API key")
   - 456 → throw QuotaError("DeepL character quota exceeded")
   - 429 → retry with exponential back-off (up to 3 attempts)
   - other non-2xx → throw ApiError with status and body
8. Print a table of { input_snippet, detected_language } to stdout in the demo.
9. Include a runnable demo at the bottom that tests at least 4 different languages.

Write idiomatic, production-quality code with proper error types and docstrings/JSDoc.
```

---

## Example output

```
Input snippet                 Detected language
----------------------------  -----------------
"Hallo, wie geht es dir?"    DE
"Bonjour le monde"           FR
"Ciao mondo"                 IT
"Hello, world!"              EN
```

---

## Caveats

- Very short strings (< 3 words) can fool the detector — add a note in your output's confidence caveats.
- Language codes returned are **uppercase ISO 639-1** (e.g. `DE`, `FR`, `ZH`), without regional variants.
- Character usage is counted against your quota even when you discard the translation — detection is not free.
- If you are detecting language for many strings in bulk, batch them into a single request (up to 50 per call) to minimize quota usage.
