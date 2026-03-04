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

| Directory | Feature | Languages |
|---|---|---|
| [translate/](./translate/) | Translate text strings | Node.js, Python, .NET |
| [detect-language/](./detect-language/) | Detect source language | Node.js, Python |
| [glossary/](./glossary/) | Create and use glossaries | Node.js, Python |

---

## Running an example

### Node.js

```bash
cd translate/node
npm install
DEEPL_API_KEY=your-key node index.js
```

### Python

```bash
cd translate/python
pip install -r requirements.txt
DEEPL_API_KEY=your-key python main.py
```

### .NET

```bash
cd translate/dotnet
DEEPL_API_KEY=your-key dotnet run
```

---

## Adding a new example

See [CONTRIBUTING.md](../CONTRIBUTING.md) and copy the `_templates/example.readme.template.md` as your starting `README.md`.
