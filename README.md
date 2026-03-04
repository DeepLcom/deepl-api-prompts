# DeepL API — AI Prompts & Examples

> A curated collection of prompts, runnable code examples, and schemas for working with the [DeepL API](https://www.deepl.com/pro#developer) using AI assistants, automation tools, and your own applications.

---

## What's in this repo?

| Directory | Purpose |
|---|---|
| [`/prompts`](./prompts/README.md) | Copy-paste prompts for AI assistants (Claude, ChatGPT, Copilot, etc.) |
| [`/examples`](./examples/README.md) | Runnable, tested code examples in multiple languages |
| [`/schemas`](./schemas/) | OpenAPI spec and Postman collection for the DeepL API |
| [`/_templates`](./_templates/) | Contribution templates for consistent formatting |

---

## Quick Start

### 1. Get a DeepL API key

Sign up at [deepl.com/pro](https://www.deepl.com/pro#developer). Free tier available — no credit card required for the free API.

Set your key as an environment variable:

```bash
export DEEPL_API_KEY="your-key-here"
```

> **Free vs. paid API:** Free accounts use `api-free.deepl.com`; paid accounts use `api.deepl.com`. Every example in this repo checks for the `:fx` suffix on your key and selects the correct host automatically.

### 2. Pick a starting point

- **I want to ask an AI to write DeepL code for me →** [`/prompts`](./prompts/README.md)
- **I want runnable code right now →** [`/examples`](./examples/README.md)
- **I want to import the API into Postman / Insomnia →** [`/schemas`](./schemas/)

---

## Supported Languages & Targets

DeepL supports **33 source languages** and **31 target languages** as of early 2026. Run the `/languages` endpoint to get the current list:

```bash
curl "https://api-free.deepl.com/v2/languages?type=target" \
  -H "Authorization: DeepL-Auth-Key $DEEPL_API_KEY"
```

---

## Repository Structure

```
.
├── README.md                  ← you are here
├── LICENSE                    ← MIT
├── CONTRIBUTING.md
│
├── prompts/                   ← AI-assistant entry-points
│   ├── README.md
│   ├── translate.md
│   ├── detect-language.md
│   ├── glossary.md
│   ├── create-glossary.md
│   ├── manage-glossary.md
│   ├── document-translation.md
│   ├── formality.md
│   ├── context.md
│   └── tag-handling.md
│
├── examples/                  ← Runnable code, grouped by feature
│   ├── README.md
│   ├── translate/
│   │   ├── README.md
│   │   ├── openapi.yaml
│   │   ├── curls.sh
│   │   ├── node/
│   │   ├── python/
│   │   └── dotnet/
│   ├── detect-language/
│   │   ├── README.md
│   │   ├── curls.sh
│   │   ├── node/
│   │   └── python/
│   └── glossary/
│       ├── README.md
│       ├── curls.sh
│       ├── node/
│       └── python/
│
├── schemas/                   ← Machine-readable API specs
│   ├── openapi.json
│   └── postman_collection.json
│
└── _templates/                ← Contribution scaffolding
    ├── prompt.template.md
    └── example.readme.template.md
```

---

## Contributing

Contributions are very welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

---

## License

[MIT](./LICENSE)
