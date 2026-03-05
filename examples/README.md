# Examples

> Runnable, tested code examples demonstrating the DeepL API grouped by feature.

Every example reads `DEEPL_API_KEY` from the environment. **Never hardcode your key.**

---

## Prerequisites

### Get a DeepL API key

1. Sign up at [deepl.com/pro](https://www.deepl.com/pro#developer) (free tier available).
2. Export your key:

```bash
export DEEPL_API_KEY="your-key-here"
```

> Keys ending in `:fx` are free-tier keys — they automatically use `api-free.deepl.com`. Paid keys use `api.deepl.com`. Every example handles this automatically.

---

## Available Examples

### Detect language

| Directory | Feature | Languages |
|---|---|---|
| [detect-language/detect-language/](./detect-language/detect-language/) | Detect the source language of text | Node.js, Python, curl |

### Translate

| Directory | Feature | Languages |
|---|---|---|
| [translate/translate-text/](./translate/translate-text/) | Translate plain-text strings | Node.js, Python, .NET, curl |
| [translate/translate-with-formality/](./translate/translate-with-formality/) | Translate with formal/informal register | Node.js, Python, .NET, curl |
| [translate/translate-with-context/](./translate/translate-with-context/) | Translate with a context hint | Node.js, Python, .NET, curl |

### Glossary

| Directory | Feature | Languages |
|---|---|---|
| [glossary/list-glossary-language-pairs/](./glossary/list-glossary-language-pairs/) | List supported glossary language pairs | Node.js, Python, curl |
| [glossary/create-glossary/](./glossary/create-glossary/) | Create a glossary from term pairs | Node.js, Python, curl |
| [glossary/list-glossaries/](./glossary/list-glossaries/) | List all glossaries | Node.js, Python, curl |
| [glossary/get-glossary/](./glossary/get-glossary/) | Get metadata for a glossary | Node.js, Python, curl |
| [glossary/get-glossary-entries/](./glossary/get-glossary-entries/) | Retrieve term pairs from a glossary | Node.js, Python, curl |
| [glossary/translate-with-glossary/](./glossary/translate-with-glossary/) | Translate using a glossary | Node.js, Python, curl |
| [glossary/delete-glossary/](./glossary/delete-glossary/) | Delete a glossary | Node.js, Python, curl |

### Languages

| Directory | Feature | Languages |
|---|---|---|
| [languages/list-languages/](./languages/list-languages/) | List all supported source and target languages | Node.js, Python, curl |

### Usage

| Directory | Feature | Languages |
|---|---|---|
| [usage/get-usage/](./usage/get-usage/) | Retrieve usage and quota for the current billing period | Node.js, Python, curl |

### Write (Improve text)

| Directory | Feature | Languages |
|---|---|---|
| [write/improve-text/](./write/improve-text/) | Improve grammar, style, and clarity with DeepL Write | Node.js, Python, curl |

### Document translation

| Directory | Feature | Languages |
|---|---|---|
| [document-translation/translate-document/](./document-translation/translate-document/) | Upload, translate, and download a document | Node.js, Python, curl |

### Admin API _(Pro — limited availability)_

| Directory | Feature | Languages |
|---|---|---|
| [admin/create-developer-key/](./admin/create-developer-key/) | Create a developer API key | Node.js, Python, curl |
| [admin/list-developer-keys/](./admin/list-developer-keys/) | List all developer API keys | Node.js, Python, curl |
| [admin/deactivate-developer-key/](./admin/deactivate-developer-key/) | Permanently deactivate a developer key | Node.js, Python, curl |
| [admin/rename-developer-key/](./admin/rename-developer-key/) | Rename a developer key | Node.js, Python, curl |
| [admin/set-key-usage-limit/](./admin/set-key-usage-limit/) | Set a monthly character limit on a key | Node.js, Python, curl |
| [admin/get-usage-analytics/](./admin/get-usage-analytics/) | Get organisation-wide usage analytics | Node.js, Python, curl |

### Voice API _(Enterprise only)_

| Directory | Feature | Languages |
|---|---|---|
| [voice/request-session/](./voice/request-session/) | Request a real-time speech translation session | Node.js, Python, curl |

### Agent API _(Enterprise only)_

| Directory | Feature | Languages |
|---|---|---|
| [agent/trigger-workflow/](./agent/trigger-workflow/) | Trigger an Agent workflow | Node.js, Python, curl |
| [agent/get-task-result/](./agent/get-task-result/) | Poll a task and retrieve the result | Node.js, Python, curl |

---

## Running an example

Each example directory contains its own `README.md` with the exact commands. The general pattern is:

### Node.js

```bash
cd translate/translate-text/node
npm install
DEEPL_API_KEY=your-key node index.js
```

### Python

```bash
cd translate/translate-text/python
pip install -r requirements.txt
DEEPL_API_KEY=your-key python main.py
```

### .NET

```bash
cd translate/translate-text/dotnet
DEEPL_API_KEY=your-key dotnet run
```

### curl

```bash
DEEPL_API_KEY=your-key bash translate/translate-text/curl.sh
```

> Examples that require additional identifiers (e.g. `GLOSSARY_ID`, `WORKFLOW_ID`, `TASK_ID`, `DEEPL_ADMIN_KEY`, `KEY_ID`) document the required environment variables in their own `README.md`.

---

## Adding a new example

See [CONTRIBUTING.md](../CONTRIBUTING.md) and copy the `_templates/example.readme.template.md` as your starting `README.md`.
