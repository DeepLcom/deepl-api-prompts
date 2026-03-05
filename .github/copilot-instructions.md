# GitHub Copilot Instructions — DeepL API AI Prompts & Examples

This repository is a curated collection of **AI prompts**, **runnable code examples**, **MCP servers**, and **API schemas** for the [DeepL API](https://www.deepl.com/pro#developer). Use these instructions to understand the repo layout and contribute effectively with Copilot's help.

---

## Repository layout

| Directory | What lives there |
|---|---|
| `/prompts` | Copy-paste prompts for AI assistants (Copilot, Claude, ChatGPT, Cursor, etc.) |
| `/examples` | Runnable, tested code examples grouped by DeepL feature and language |
| `/mcp-servers` | Model Context Protocol servers exposing DeepL capabilities as tools |
| `/schemas` | OpenAPI 3.1 spec and Postman v2.1 collection for the DeepL API |
| `/_templates` | Markdown templates for consistent prompt and example formatting |

---

## Prompts (`/prompts`)

Prompts are Markdown files with a fenced ` ```prompt ``` ` block inside them. Each file targets a specific DeepL feature or SDK setup task.

### Prompt sequencing

1. **`0_init.md`** — always run first; detects the project type and sets session variables.
2. **`1_<language>.md`** — run after `0_init.md`; installs the SDK and creates a service wrapper.
3. **Feature prompts** (`translate.md`, `glossary.md`, `formality.md`, etc.) — run after the SDK is wired in.

### When adding or editing a prompt

- Copy `_templates/prompt.template.md` as your starting point.
- The `prompt` block must be **self-contained** — someone must be able to paste it into any AI assistant without reading anything else.
- Reference `0_init.md` session variables (`DEEPL_SDK`, `DEEPL_APP_TYPE`, `DEEPL_PROJECT_STATE`) where relevant.
- Note any known caveats (rate limits, language-pair restrictions, Enterprise-only features).

---

## Code examples (`/examples`)

Examples are grouped by feature, then by runtime:

```
examples/
  <feature>/
    <variant>/          ← e.g. translate-text/, translate-with-glossary/
      README.md
      curl.sh
      node/
      python/
      dotnet/
      ...
```

### Rules for every example

- Use the **official DeepL SDK** where one exists; fall back to raw `net/http`-style HTTP otherwise.
- Read the API key from `DEEPL_API_KEY` environment variable — **never hardcode keys**.
- Detect the API tier from the key suffix: keys ending in `:fx` use `api-free.deepl.com`; all others use `api.deepl.com`.
- Handle at minimum: `AuthorizationError` / 403, `QuotaExceededError` / 456, and `TooManyRequestsError` / 429.
- Keep each example focused on **one concept**; print meaningful output.
- Copy `_templates/example.readme.template.md` as the `README.md` for any new directory.

### Running an example

```bash
# Node.js
cd examples/translate/translate-text/node
npm install
DEEPL_API_KEY=your-key node index.js

# Python
cd examples/translate/translate-text/python
pip install -r requirements.txt
DEEPL_API_KEY=your-key python main.py

# .NET
cd examples/translate/translate-text/dotnet
DEEPL_API_KEY=your-key dotnet run
```

---

## MCP Servers (`/mcp-servers`)

Each MCP server exposes a subset of the DeepL API as [Model Context Protocol](https://modelcontextprotocol.io) tools. They share a consistent layout:

```
mcp-servers/
  <name>-mcp/
    Dockerfile
    node/           ← Node.js implementation
    dotnet/         ← .NET implementation
    cloudflare-worker/
```

When editing MCP servers, keep tool names and parameter schemas consistent with the OpenAPI spec in `/schemas/openapi.json`.

---

## Schemas (`/schemas`)

- `openapi.json` — OpenAPI **3.1** description of the full DeepL API.
- `postman_collection.json` — Postman collection **v2.1**.

If you update either schema, keep them in sync with each other and with the examples that reference specific endpoint paths or parameters.

---

## Style conventions

- **Markdown**: ATX headings (`#`), fenced code blocks with a language tag, tables for structured data.
- **Node.js**: ESM imports, `async/await`, no default exports in service modules.
- **Python**: type hints, `httpx` or the `deepl` SDK, `python-dotenv` for local env loading.
- **.NET**: top-level statements for examples, `DeepL.Translator` from the `DeepL.net` NuGet package.
- **Shell**: `curl` examples use `-H "Authorization: DeepL-Auth-Key $DEEPL_API_KEY"`.

---

## Common tasks for Copilot

| Task | Where to start |
|---|---|
| Add a new code example | Copy `_templates/example.readme.template.md`; add `curl.sh` then per-language subdirs |
| Add a new prompt | Copy `_templates/prompt.template.md` into `/prompts` |
| Add a language to an existing example | Add a subdirectory alongside existing `node/`, `python/`, etc. |
| Update the OpenAPI schema | Edit `/schemas/openapi.json` then update `postman_collection.json` |
| Add a new MCP tool | Add to the relevant `mcp-servers/<name>-mcp/` implementation; keep Dockerfile in sync |

---

## What to avoid

- Do not hardcode API keys anywhere.
- Do not add untested code — all examples must run from a clean environment.
- Do not add non-MIT-compatible content or dependencies.
- Do not break the `0_init.md` → `1_<lang>.md` → feature prompt sequencing contract.
