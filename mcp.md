# DeepL MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/) server that provides DeepL translation and text-improvement capabilities to AI assistants such as Claude.

- **Repository:** [github.com/DeepLcom/deepl-mcp-server](https://github.com/DeepLcom/deepl-mcp-server)
- **npm package:** [`deepl-mcp-server`](https://www.npmjs.com/package/deepl-mcp-server)
- **License:** MIT

---

## Features

- Translate text between numerous languages
- Translate documents (PDF, DOCX, PPTX, XLSX, HTML, TXT, and more)
- Rephrase / improve text using DeepL Write
- Automatic source-language detection
- Formality control for supported languages
- Glossary support for consistent terminology translation
- Full access to DeepL API language list at runtime

---

## Requirements

- Node.js (for running via `npx` or local install)
- A DeepL API key — [sign up here](https://www.deepl.com/pro-api) (Free tier: up to 500,000 characters/month)

---

## Installation & Usage

### Option 1 – Run directly with npx (no install required)

```bash
DEEPL_API_KEY=your_key npx deepl-mcp-server
```

### Option 2 – Install locally via npm

```bash
npm install deepl-mcp-server
```

### Option 3 – Clone and build from source

```bash
git clone https://github.com/DeepLcom/deepl-mcp-server.git
cd deepl-mcp-server
npm install
```

### Option 4 – Docker

A `Dockerfile` is included in the repository root. Build and run the image, passing your API key as an environment variable:

```bash
docker build -t deepl-mcp-server .
docker run -e DEEPL_API_KEY=your_key deepl-mcp-server
```

---

## Configuration

The server requires a single environment variable:

| Variable | Description |
|---|---|
| `DEEPL_API_KEY` | Your DeepL API authentication key |

---

## Integration with Claude Desktop

### Step 1 – Locate the Claude Desktop configuration file

| OS | Path |
|---|---|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%AppData%\Claude\claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

### Step 2 – Add the server configuration

**Using npx (recommended, no installation needed):**

```json
{
  "mcpServers": {
    "deepl": {
      "command": "npx",
      "args": ["deepl-mcp-server"],
      "env": {
        "DEEPL_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}
```

**Using a local install (pointing to the built JS file):**

```json
{
  "mcpServers": {
    "deepl": {
      "command": "node",
      "args": ["/absolute/path/to/deepl-mcp-server/src/index.mjs"],
      "env": {
        "DEEPL_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}
```

**Using npx with a local clone (no `npm install` needed):**

```json
{
  "mcpServers": {
    "deepl": {
      "command": "npx",
      "args": ["/absolute/path/to/deepl-mcp-server"],
      "env": {
        "DEEPL_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}
```

### Step 3 – Restart Claude Desktop

Once restarted, Claude will automatically use the DeepL tools whenever a translation or text-improvement task arises.

---

## Available Tools

| Tool | Description |
|---|---|
| `translate-text` | Translate text to a target language |
| `translate-document` | Translate a document file |
| `rephrase-text` | Rephrase / improve text in the same or a different language |
| `get-source-languages` | List all available source languages |
| `get-target-languages` | List all available target languages |
| `get-writing-styles` | List available writing styles for rephrasing |
| `get-writing-tones` | List available writing tones for rephrasing |
| `list-glossaries` | List all glossaries and their metadata |
| `get-glossary-info` | Get metadata for a specific glossary by ID |
| `get-glossary-dictionary-entries` | Retrieve the term entries from a glossary dictionary |

---

## Tool Details

### `translate-text`

Translates text using the DeepL API.

| Parameter | Required | Description |
|---|---|---|
| `text` | Yes | The text to translate |
| `targetLangCode` | Yes | Target language code (e.g., `en-US`, `de`, `fr`) |
| `sourceLangCode` | No | Source language code. Leave empty for auto-detection. Required when using a glossary. |
| `formality` | No | `less`, `more`, `default`, `prefer_less`, or `prefer_more` |
| `glossaryId` | No | ID of a glossary to apply to the translation |

---

### `translate-document`

Translates a document file using the DeepL API. The AI agent must have access to a filesystem tool because this tool works with file paths.

Supported formats: PDF, DOCX, PPTX, XLSX, HTML, TXT, and more.

| Parameter | Required | Description |
|---|---|---|
| `inputFile` | Yes | Path to the input document |
| `targetLangCode` | Yes | Target language code |
| `outputFile` | No | Output path. If omitted, auto-generated (e.g., `document_de.pdf`) |
| `sourceLangCode` | No | Source language code. Leave empty for auto-detection. Required when using a glossary. |
| `formality` | No | Same options as `translate-text` |
| `glossaryId` | No | ID of a glossary to use |

**Returns:** Translation status, number of characters billed, output file path.

---

### `rephrase-text`

Rephrases or improves text using DeepL Write.

| Parameter | Required | Description |
|---|---|---|
| `text` | Yes | The text to rephrase |
| `style` | No | Writing style (e.g., `business`, `academic`, `casual`). Use `get-writing-styles` to see all options. |
| `tone` | No | Writing tone (e.g., `enthusiastic`, `friendly`, `professional`). Use `get-writing-tones` to see all options. |

---

### `get-source-languages` / `get-target-languages`

Returns the complete list of source or target languages supported by the DeepL API, including language names and ISO 639 codes. No parameters required.

---

### `get-writing-styles`

Returns the list of writing styles available for the `rephrase-text` tool. No parameters required.

---

### `get-writing-tones`

Returns the list of writing tones available for the `rephrase-text` tool. No parameters required.

---

### `list-glossaries`

Lists all glossaries in your DeepL account.

**Returns for each glossary:**
- `id` – Unique glossary identifier
- `name` – Human-readable name
- `dictionaries` – Available language-pair dictionaries (e.g., `{"en": ["de"], "de": ["en"]}`)
- `creationTime` – Creation timestamp

> Returns metadata only; does not include the actual term entries.

---

### `get-glossary-info`

Retrieves metadata for a single glossary.

| Parameter | Required | Description |
|---|---|---|
| `glossaryId` | Yes | The unique identifier of the glossary |

Returns the same fields as `list-glossaries` but for one glossary.

---

### `get-glossary-dictionary-entries`

Retrieves the actual term entries from a glossary dictionary. A glossary can contain multiple dictionaries (one per translation direction). For example, a bidirectional EN↔DE glossary has two dictionaries: EN→DE and DE→EN.

| Parameter | Required | Description |
|---|---|---|
| `glossaryId` | Yes | The unique identifier of the glossary |
| `sourceLangCode` | Yes | Source language code for the dictionary (e.g., `en`) |
| `targetLangCode` | Yes | Target language code for the dictionary (e.g., `de`) |

**Returns:** Glossary name, language pair, all entries as key-value pairs.

> **Tip:** Most AI agents can resolve a glossary by name automatically — use `list-glossaries` to find available glossaries and their IDs, then pass the correct ID into a translation or lookup call.

---

## Formality Options

The `formality` parameter is supported by `translate-text` and `translate-document` for languages that have formal/informal registers (e.g., German, French, Spanish, Italian, Japanese, Russian, Portuguese).

| Value | Behaviour |
|---|---|
| `default` | Use the default formality for the language |
| `more` | Use formal / polite language |
| `less` | Use informal language |
| `prefer_more` | Use formal if available, otherwise default |
| `prefer_less` | Use informal if available, otherwise default |

---

## Supported Languages (examples)

Use `get-source-languages` and `get-target-languages` at runtime to get the full, up-to-date list.

| Language | Source code | Target code(s) |
|---|---|---|
| English | `en` | `en-US`, `en-GB` |
| German | `de` | `de` |
| French | `fr` | `fr` |
| Spanish | `es` | `es` |
| Italian | `it` | `it` |
| Portuguese | `pt` | `pt-BR`, `pt-PT` |
| Japanese | `ja` | `ja` |
| Chinese | `zh` | `zh-Hans`, `zh-Hant` |
| Russian | `ru` | `ru` |
| Korean | `ko` | `ko` |
| Dutch | `nl` | `nl` |
| Polish | `pl` | `pl` |
| Swedish | `sv` | `sv` |

---

## Error Handling

If you encounter errors, check the following:

- The `DEEPL_API_KEY` environment variable is set and valid.
- You have not exceeded your API usage quota.
- The language codes you are using are valid (use `get-source-languages` / `get-target-languages` to verify).
- For document translation, the agent has access to the filesystem.

For MCP-level debugging, see the [MCP debugging documentation](https://modelcontextprotocol.io/docs/tools/debugging).

---

## Links

- [DeepL MCP Server – GitHub](https://github.com/DeepLcom/deepl-mcp-server)
- [deepl-mcp-server – npm](https://www.npmjs.com/package/deepl-mcp-server)
- [DeepL API Documentation](https://www.deepl.com/docs-api)
- [DeepL API Sign-up (Free tier available)](https://www.deepl.com/pro-api)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/docs/)
- [Smithery listing](https://smithery.ai/server/@DeepLcom/deepl-mcp-server)
