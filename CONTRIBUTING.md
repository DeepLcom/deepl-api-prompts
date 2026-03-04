# Contributing to DeepL API — AI Prompts & Examples

Thank you for helping make this resource better! This project thrives on community contributions — whether you're adding a new prompt, a code example in a language we don't have yet, or fixing a typo.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [What we accept](#what-we-accept)
- [How to contribute](#how-to-contribute)
- [Adding a prompt](#adding-a-prompt)
- [Adding a code example](#adding-a-code-example)
- [Style guide](#style-guide)
- [Running the examples locally](#running-the-examples-locally)

---

## Code of Conduct

Be kind, constructive, and inclusive. We follow the [Contributor Covenant v2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

---

## What we accept

| Type | Welcome? |
|---|---|
| New prompts for AI assistants | ✅ Yes |
| Code examples in any language | ✅ Yes |
| Corrections to existing examples | ✅ Yes |
| Improvements to schemas | ✅ Yes |
| New example categories (e.g., document translation) | ✅ Yes |
| Unverified or untested code | ❌ Please test first |
| Proprietary / non-MIT-compatible content | ❌ No |

---

## How to contribute

1. **Fork** the repository and create a feature branch:

   ```bash
   git checkout -b feat/add-ruby-translate-example
   ```

2. Make your changes following the [style guide](#style-guide) below.

3. **Test** any code you add (see [Running the examples locally](#running-the-examples-locally)).

4. Open a **Pull Request** against `main` with a clear title and description.

---

## Adding a prompt

1. Copy `_templates/prompt.template.md` into `prompts/`.
2. Name the file after the DeepL feature it covers, e.g. `prompts/split-sentences.md`.
3. Fill in every section of the template — don't leave placeholder text.
4. The prompt itself must be self-contained: someone should be able to copy it into any AI assistant and get useful code without reading anything else.

---

## Adding a code example

1. Pick the relevant feature directory under `examples/` (or create a new one following the existing pattern).
2. Copy `_templates/example.readme.template.md` as the `README.md` for your new directory.
3. Add a `curls.sh` with minimal `curl` invocations — these serve as the canonical HTTP reference.
4. For each runtime, create a subdirectory (`node/`, `python/`, `dotnet/`, `ruby/`, `go/`, etc.) containing:
   - A dependency manifest (`package.json`, `requirements.txt`, `*.csproj`, `go.mod`, …)
   - A single entry-point file (`index.js`, `main.py`, `Program.cs`, `main.go`, …)
   - The example must read `DEEPL_API_KEY` from the environment — **never hardcode keys**.
5. Confirm your example runs cleanly from a fresh environment before opening a PR.

---

## Style guide

### Prompts (`/prompts`)

- Start with a one-sentence summary of what the prompt does.
- Include a **"Context"** section explaining when to use it.
- The prompt block must be fenced with ` ```prompt ` so renderers highlight it correctly.
- List known **caveats** (rate limits, language-pair restrictions, etc.).

### Code examples (`/examples`)

- Use the official [DeepL SDK](https://github.com/DeepLcom) where one exists for the language; fall back to raw HTTP otherwise.
- Detect the API tier from the key suffix (`:fx` → free tier host, otherwise paid tier host).
- Print meaningful output — don't silently swallow results.
- Include error handling for at least `AuthorizationException` / `4xx` responses and `QuotaExceededException` / `456`.
- Keep examples short: demonstrate one concept per file.

### Schemas (`/schemas`)

- The OpenAPI file follows **OpenAPI 3.1**.
- Keep it in sync with the latest public DeepL API documentation.
- Postman collection format must be **v2.1**.

---

## Running the examples locally

### Node.js

```bash
cd examples/translate/node
npm install
DEEPL_API_KEY=your-key node index.js
```

### Python

```bash
cd examples/translate/python
pip install -r requirements.txt
DEEPL_API_KEY=your-key python main.py
```

### .NET

```bash
cd examples/translate/dotnet
DEEPL_API_KEY=your-key dotnet run
```

---

## Questions?

Open a [GitHub Discussion](../../discussions) or file an issue with the `question` label.
