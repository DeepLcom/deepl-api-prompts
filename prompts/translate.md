# Prompt: Translate Text with the DeepL API

**Use when:** You want an AI assistant to generate code that sends one or more strings to the DeepL `/v2/translate` endpoint and returns the translated text.

---

## Context

The DeepL REST API translates text via a `POST` to `/v2/translate`. Key parameters:

| Parameter | Required | Description |
|---|---|---|
| `text` | ✅ | Array of strings to translate (max 50 per request) |
| `target_lang` | ✅ | BCP-47 target language code, e.g. `DE`, `FR`, `PT-BR` |
| `source_lang` | optional | Omit to let DeepL auto-detect |
| `formality` | optional | `default`, `more`, `less`, `prefer_more`, `prefer_less` |
| `context` | optional | Additional context sentence (not translated, improves quality) |
| `tag_handling` | optional | `html` or `xml` |
| `glossary_id` | optional | UUID of a previously created glossary |
| `split_sentences` | optional | `0`, `1` (default), or `nonewlines` |

**Endpoints:**
- Free tier: `https://api-free.deepl.com/v2/translate`
- Paid tier: `https://api.deepl.com/v2/translate`

Detect the tier by checking whether the key ends with `:fx`.

**Authentication:** `Authorization: DeepL-Auth-Key <key>` header.

**Rate limits:** Free tier is throttled; handle `429 Too Many Requests` with exponential back-off.

**Quota exceeded:** HTTP `456 Quota Exceeded` — surface this as a distinct error.

---

## Prompt

```prompt
You are an expert software engineer. Generate production-quality code that translates text using the DeepL REST API.

Requirements:
1. Read the API key from the environment variable DEEPL_API_KEY.
2. Detect whether the key ends with ":fx"; if so use "https://api-free.deepl.com/v2/translate", otherwise use "https://api.deepl.com/v2/translate".
3. Accept an array of strings and a target language code as inputs.
4. Make a POST request to /v2/translate with the body: { text: [...], target_lang: "..." }.
5. Return the translated strings in the same order they were provided.
6. Handle errors explicitly:
   - 403 → throw AuthError("Invalid DeepL API key")
   - 456 → throw QuotaError("DeepL character quota exceeded")
   - 429 → retry up to 3 times with exponential back-off (1 s, 2 s, 4 s)
   - any other non-2xx → throw ApiError with the status code and response body
7. Log the detected source language for each translation to stdout.
8. Include a short runnable example at the bottom of the file (translate "Hello, world!" to German).

Use idiomatic code for the target language. Add JSDoc / docstrings / XML docs as appropriate.
```

---

## Example invocation

```bash
# Node.js
DEEPL_API_KEY=your-key node examples/translate/node/index.js

# Python
DEEPL_API_KEY=your-key python examples/translate/python/main.py
```

---

## Caveats

- `source_lang` and `target_lang` must be **uppercase** (e.g. `EN`, `DE`), except regional variants which use a hyphen (`PT-BR`, `ZH-HANS`).
- The `formality` parameter is ignored for languages that don't support it (e.g. English, Chinese). If you pass it anyway, DeepL silently ignores it unless `prefer_*` variants are used.
- A single request can contain up to **50 text strings** and up to **130,000 characters** total.
- The response preserves array order — `translations[0]` corresponds to `text[0]`.
