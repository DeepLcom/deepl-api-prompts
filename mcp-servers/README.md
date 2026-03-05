# DeepL Mini MCP Servers

Five focused [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers, each scoped to a single DeepL API domain.  Every server is available in **four** flavours:

| Flavour | Transport | Use-case |
|---|---|---|
| `node/` | stdio (default) or HTTP (`MCP_TRANSPORT=http`) | Claude Desktop, local agents, Docker |
| `cloudflare-worker/` | HTTP (StreamableHTTP) | Serverless edge deployment |
| `dotnet/` | HTTP (ASP.NET Core Minimal API) | .NET / Azure environments |
| `Dockerfile` | HTTP — wraps the Node.js server | Any container runtime |

---

## Servers

| Server | Domain | Tools |
|---|---|---|
| [`glossary-mcp`](./glossary-mcp) | Glossary management | list, create, get, delete, entries, language-pairs, translate-with-glossary |
| [`admin-mcp`](./admin-mcp) | Developer key admin | list-keys, create-key, deactivate-key, rename-key, set-limit, usage-analytics |
| [`translate-mcp`](./translate-mcp) | Text & document translation | translate-text, translate-with-context, translate-with-formality, translate-document, detect-language, list-languages, get-usage |
| [`voice-mcp`](./voice-mcp) | Real-time voice translation | request-session |
| [`agent-mcp`](./agent-mcp) | Agentic workflow automation | trigger-workflow, get-task-result |

---

## Environment variables

| Variable | Used by | Description |
|---|---|---|
| `DEEPL_API_KEY` | translate-mcp, voice-mcp, agent-mcp, glossary-mcp | Standard DeepL API key |
| `DEEPL_ADMIN_KEY` | admin-mcp | Admin API key (limited Pro subscribers) |
| `MCP_TRANSPORT` | node/ only | `stdio` (default) or `http` |
| `PORT` | node/ HTTP mode, dotnet/, workers | Listening port (default `3000`) |

---

## Quick start — Node.js (stdio, Claude Desktop)

```bash
cd glossary-mcp/node
npm install
DEEPL_API_KEY=your_key node index.mjs
```

### Claude Desktop `claude_desktop_config.json` snippet

```json
{
  "mcpServers": {
    "deepl-glossary": {
      "command": "node",
      "args": ["/path/to/mcp-servers/glossary-mcp/node/index.mjs"],
      "env": { "DEEPL_API_KEY": "<YOUR_KEY>" }
    },
    "deepl-translate": {
      "command": "node",
      "args": ["/path/to/mcp-servers/translate-mcp/node/index.mjs"],
      "env": { "DEEPL_API_KEY": "<YOUR_KEY>" }
    },
    "deepl-admin": {
      "command": "node",
      "args": ["/path/to/mcp-servers/admin-mcp/node/index.mjs"],
      "env": { "DEEPL_ADMIN_KEY": "<YOUR_ADMIN_KEY>" }
    },
    "deepl-voice": {
      "command": "node",
      "args": ["/path/to/mcp-servers/voice-mcp/node/index.mjs"],
      "env": { "DEEPL_API_KEY": "<YOUR_KEY>" }
    },
    "deepl-agent": {
      "command": "node",
      "args": ["/path/to/mcp-servers/agent-mcp/node/index.mjs"],
      "env": { "DEEPL_API_KEY": "<YOUR_KEY>" }
    }
  }
}
```

---

## Quick start — Docker

```bash
# build + run any server (HTTP on port 3000)
docker build -t deepl-translate-mcp ./translate-mcp
docker run -p 3000:3000 -e DEEPL_API_KEY=your_key deepl-translate-mcp
```

---

## Quick start — Cloudflare Workers

```bash
cd glossary-mcp/cloudflare-worker
npm install
# Add DEEPL_API_KEY as a Worker secret:
npx wrangler secret put DEEPL_API_KEY
npx wrangler deploy
```

---

## Quick start — .NET Minimal API

```bash
cd translate-mcp/dotnet
dotnet run
# or
dotnet publish -c Release -o out && dotnet out/TranslateMcp.dll
```
