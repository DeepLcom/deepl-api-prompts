# Prompt: <Feature Name>

<!--
  Instructions for contributors:
  1. Replace <Feature Name> with the DeepL API feature this prompt covers (e.g. "Translate Text").
  2. Fill in every section below. Remove these HTML comments before committing.
  3. The prompt block MUST be self-contained — no external files needed to use it.
  4. Keep the file name lowercase with hyphens, e.g. prompts/my-feature.md.
-->

**Use when:** <!-- One sentence: when should someone reach for this prompt? -->

---

## Context

<!--
  Provide a concise technical reference for the AI assistant.
  Include:
  - The relevant endpoint(s) and HTTP method(s)
  - Required and optional parameters (table format preferred)
  - Key response fields
  - Authentication method
  - Any important constraints (e.g. language-pair restrictions, size limits)

  Example table:
-->

**Endpoint:** `POST /v2/<endpoint>`

| Parameter | Required | Description |
|---|---|---|
| `param_a` | ✅ | Description |
| `param_b` | optional | Description |

**Authentication:** `Authorization: DeepL-Auth-Key <key>` header.

**Host detection:** Keys ending in `:fx` → `api-free.deepl.com`, otherwise `api.deepl.com`.

---

## Prompt

<!--
  The prompt block below is what contributors paste into an AI assistant.
  It must be:
  - Fenced with ```prompt (for syntax highlighting in renderers)
  - Self-contained (all needed API context is inside the prompt)
  - Explicit about error handling requirements
  - Language-agnostic (the user appends their preferred language)
-->

```prompt
You are an expert software engineer. Generate production-quality code that <does X> using the DeepL REST API.

Requirements:
1. Read the API key from the environment variable DEEPL_API_KEY.
2. Auto-select the correct host: keys ending in ":fx" use "https://api-free.deepl.com/v2/<endpoint>", otherwise use "https://api.deepl.com/v2/<endpoint>".
3. <Requirement 3>
4. <Requirement 4>
5. Handle errors explicitly:
   - 403 → throw AuthError("Invalid DeepL API key")
   - 456 → throw QuotaError("DeepL character quota exceeded")
   - 429 → retry up to 3 times with exponential back-off (1 s, 2 s, 4 s)
   - any other non-2xx → throw ApiError with the status code and response body
6. Include a runnable example at the bottom.

Use idiomatic code for the target language. Add docstrings/JSDoc/XML docs as appropriate.
```

---

## Example invocation

<!--
  Show a short shell command or expected console output.
  This helps contributors verify their prompt is working correctly.
-->

```bash
DEEPL_API_KEY=your-key node index.js
# or
DEEPL_API_KEY=your-key python main.py
```

---

## Caveats

<!--
  List gotchas, language-pair restrictions, quota implications, etc.
  At least 2-3 bullet points.
-->

- <!-- Caveat 1 -->
- <!-- Caveat 2 -->
- <!-- Caveat 3 -->
