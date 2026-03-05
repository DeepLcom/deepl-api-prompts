## What does this PR add or change?

<!-- One or two sentences describing the contribution. -->

## Type of contribution

<!-- Check all that apply. -->

- [ ] New prompt (`/prompts`)
- [ ] New code example (`/examples`)
- [ ] New language for an existing example
- [ ] MCP server addition or update (`/mcp-servers`)
- [ ] Schema update (`/schemas`)
- [ ] Bug fix / correction
- [ ] Documentation improvement
- [ ] Other (describe below)

## DeepL feature covered

<!-- Which DeepL API feature does this touch? e.g. Text translation, Glossary, Document translation, Formality, Detect language, Write/improve, Voice, Agent, Admin -->

## Checklist

### All contributions

- [ ] I have read [CONTRIBUTING.md](../CONTRIBUTING.md)
- [ ] No API keys or secrets are hardcoded anywhere
- [ ] Content is MIT-compatible

### New or updated prompts

- [ ] Copied `_templates/prompt.template.md` as the starting point
- [ ] The prompt block is fenced with ` ```prompt ``` `
- [ ] The prompt is self-contained — it works when pasted into any AI assistant without extra context
- [ ] Known caveats (rate limits, language-pair restrictions, Enterprise-only features) are documented

### New or updated code examples

- [ ] API key is read from `DEEPL_API_KEY` environment variable
- [ ] Host is selected based on the `:fx` key suffix (free vs. paid tier)
- [ ] Error handling covers at minimum: `AuthorizationError`/403, `QuotaExceededError`/456, `TooManyRequestsError`/429
- [ ] A `README.md` exists (copied from `_templates/example.readme.template.md`)
- [ ] A `curl.sh` exists as the canonical HTTP reference
- [ ] I have run the example locally and it works from a clean environment

### MCP server changes

- [ ] Tool names and parameter schemas match `/schemas/openapi.json`
- [ ] Dockerfile is up to date

### Schema changes

- [ ] `openapi.json` and `postman_collection.json` are kept in sync

## How to test

<!-- Describe the exact commands to run to verify this works, e.g.: -->

```bash
cd examples/<feature>/<variant>/node
npm install
DEEPL_API_KEY=your-key node index.js
```

## Additional notes

<!-- Anything else reviewers should know — edge cases, follow-up work, related issues. -->
