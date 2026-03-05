# Prompt: <Feature Name>

<!--
  Instructions for contributors:
  1. Replace <Feature Name> with the DeepL API feature this prompt covers (e.g. "Translate Text").
  2. Fill in every section below. Remove these HTML comments before committing.
  3. The prompt block MUST be self-contained — no external files needed to use it.
  4. Keep the file name lowercase with hyphens, e.g. prompts/my-feature.md.
  5. The prompt MUST start with a DeepL installation check (Step 1) — never skip it.
  6. The prompt MUST instruct the assistant to ask the user rather than guess.
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

  RULES — every prompt block MUST:
  1. Start with "Step 1 — Verify DeepL is installed" and stop if it is not found.
  2. Contain an explicit instruction NOT to guess: if any required detail is
     ambiguous or missing from the codebase, the assistant must ask the user
     a specific question and wait for an answer before writing code.
  3. Be fenced with ```prompt for syntax highlighting.
  4. Be self-contained — all needed context is inside the prompt.
  5. End with a summary step listing every file created or modified.
-->

```prompt
You are an expert software engineer working inside an existing codebase. You have full read and write access to this project.

Step 1 — Verify DeepL is installed

Search the dependency files for the deepl package used by this project — deepl-node in package.json, deepl in requirements.txt or Pipfile, DeepL.net in a .csproj, deepl-rb in a Gemfile, the deepl-java Maven or Gradle dependency, or deeplcom/deepl-php in composer.json. Then search for the service or wrapper module that imports this package. If either is missing, stop immediately and tell the user to run 0_init.md and the appropriate 1_*.md setup prompt before continuing with this prompt. Do not proceed with any code generation until both the package and the service module are confirmed present.

Step 2 — Read the codebase

<!-- Replace this step with a concrete description of what to scan for and why. -->
Identify: <what to look for — file types, patterns, conventions, existing calls>.

If any information needed to proceed is ambiguous or missing — for example, which target languages are used, where configuration is stored, or what the project's error handling convention is — stop and ask the user a specific, numbered question before writing any code. Do not guess.

Step 3 — <Implement X>

<!-- Describe the implementation. Reference the DeepL service's existing methods.
     Do not re-implement anything that is already in the service module. -->
<Implementation description.>

If you are unsure about any file location, class name, or integration point, ask the user rather than assuming.

Step 4 — Handle errors

Wrap all DeepL service calls in try/catch or equivalent. On authentication error, fail fast with a clear message. On quota exceeded, propagate a structured error to the caller. On network error, let the retry logic in the service handle retries and propagate after exhausting them — never swallow errors silently.

<!-- Add any feature-specific error cases here (e.g. missing glossary ID, unsupported language pair). -->

Step 5 — Print a summary

List every file created or modified and the command to run a quick smoke test.
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
