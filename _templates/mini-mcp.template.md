# <Name>-mcp — DeepL <Domain> MCP Server

<!--
  Instructions for contributors:
  1. Replace <Name> with lowercase kebab-case server name, e.g. "glossary".
  2. Replace <Domain> with the DeepL API domain this server covers, e.g. "Glossary Management".
  3. Save this file as mcp-servers/<name>-mcp/README.md
  4. Fill in all sections. Remove these HTML comments before committing.
  5. Keep tool names consistent with the OpenAPI spec in /schemas/openapi.json.
-->

A focused [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that exposes DeepL <!-- domain --> capabilities as tools.

Available in four flavours:

| Flavour | Transport | Use-case |
|---|---|---|
| `node/` | stdio (default) or HTTP (`MCP_TRANSPORT=http`) | Claude Desktop, local agents, Docker |
| `cloudflare-worker/` | HTTP (StreamableHTTP) | Serverless edge deployment |
| `dotnet/` | HTTP (ASP.NET Core Minimal API) | .NET / Azure environments |
| `Dockerfile` | HTTP — wraps the Node.js server | Any container runtime |

---

## Tools

<!--
  List every MCP tool this server exposes.
  Tool names must match the names declared in the server implementation.
  Parameter names must match the OpenAPI spec.
-->

| Tool | Description |
|---|---|
| `<tool-name>` | <!-- One-sentence description --> |
| `<tool-name>` | <!-- One-sentence description --> |

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `DEEPL_API_KEY` | ✅ | DeepL API authentication key |
| `MCP_TRANSPORT` | optional | `stdio` (default) or `http` — Node.js only |
| `PORT` | optional | HTTP listening port (default `3000`) — HTTP mode only |

<!-- Replace DEEPL_API_KEY with DEEPL_ADMIN_KEY if this server uses the Admin API. -->

---

## Quick start — Node.js (stdio)

```bash
cd node
npm install
DEEPL_API_KEY=your-key node index.mjs
```

### Claude Desktop configuration

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "deepl-<name>": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-servers/<name>-mcp/node/index.mjs"],
      "env": {
        "DEEPL_API_KEY": "<YOUR_KEY>"
      }
    }
  }
}
```

---

## Quick start — Docker

```bash
docker build -t deepl-<name>-mcp .
docker run -e DEEPL_API_KEY=your-key -p 3000:3000 deepl-<name>-mcp
```

---

## Quick start — Cloudflare Worker

```bash
cd cloudflare-worker
npm install
DEEPL_API_KEY=your-key npx wrangler dev
```

Set `DEEPL_API_KEY` as a secret before deploying:

```bash
npx wrangler secret put DEEPL_API_KEY
npx wrangler deploy
```

---

## Quick start — .NET

```bash
cd dotnet
DEEPL_API_KEY=your-key dotnet run
```

---

## Notes

<!--
  Any gotchas, access restrictions, or things the user should know.
  Examples:
  - "Requires a DeepL Enterprise plan."
  - "Uses DEEPL_ADMIN_KEY, not DEEPL_API_KEY — available to limited Pro subscribers only."
  - "Host is always api.deepl.com regardless of key suffix."
  Delete this section if there is nothing to add.
-->

- <!-- Note 1 -->
