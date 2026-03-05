/**
 * DeepL Admin MCP Server
 *
 * Tools:
 *   list-developer-keys      – list all developer API keys
 *   create-developer-key     – create a new developer API key
 *   deactivate-developer-key – permanently deactivate a key
 *   rename-developer-key     – rename (relabel) a key
 *   set-key-usage-limit      – set or remove a character limit on a key
 *   get-usage-analytics      – retrieve organisation usage analytics
 *
 * Requires: DEEPL_ADMIN_KEY environment variable
 * Transport (env MCP_TRANSPORT): stdio (default) | http
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "http";
import { z } from "zod";

const BASE_URL = "https://api.deepl.com";

function authHeaders() {
  const key = process.env.DEEPL_ADMIN_KEY;
  if (!key) throw new Error("DEEPL_ADMIN_KEY environment variable is not set.");
  return {
    Authorization: `DeepL-Auth-Key ${key}`,
    "Content-Type": "application/json",
  };
}

async function deeplFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DeepL Admin API error ${res.status}: ${body}`);
  }
  return res.status === 204 ? null : res.json();
}

// ── Server ──────────────────────────────────────────────────────────────────

function buildServer() {
  const server = new McpServer({ name: "deepl-admin-mcp", version: "1.0.0" });

  // list-developer-keys
  server.tool(
    "list-developer-keys",
    "List all developer API keys in the organisation.",
    {},
    async () => {
      const data = await deeplFetch("/v2/admin/developer-keys");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // create-developer-key
  server.tool(
    "create-developer-key",
    "Create a new developer API key.",
    {
      label: z.string().describe("Human-readable label for the new key"),
    },
    async ({ label }) => {
      const data = await deeplFetch("/v2/admin/developer-keys", {
        method: "POST",
        body: JSON.stringify({ label }),
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // deactivate-developer-key
  server.tool(
    "deactivate-developer-key",
    "Permanently deactivate a developer API key. WARNING: irreversible.",
    {
      keyId: z.string().describe("ID of the key to deactivate"),
    },
    async ({ keyId }) => {
      const data = await deeplFetch("/v2/admin/developer-keys/deactivate", {
        method: "PUT",
        body: JSON.stringify({ key_id: keyId }),
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // rename-developer-key
  server.tool(
    "rename-developer-key",
    "Rename (relabel) an existing developer API key.",
    {
      keyId: z.string().describe("ID of the key to rename"),
      newLabel: z.string().describe("New label for the key"),
    },
    async ({ keyId, newLabel }) => {
      const data = await deeplFetch("/v2/admin/developer-keys/label", {
        method: "PUT",
        body: JSON.stringify({ key_id: keyId, label: newLabel }),
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // set-key-usage-limit
  server.tool(
    "set-key-usage-limit",
    "Set or remove a character usage limit on a developer API key. Pass null to remove the limit, 0 to block all usage.",
    {
      keyId: z.string().describe("ID of the key"),
      characters: z
        .number()
        .nullable()
        .describe("Character limit, or null to remove the limit"),
    },
    async ({ keyId, characters }) => {
      const data = await deeplFetch("/v2/admin/developer-keys/limits", {
        method: "PUT",
        body: JSON.stringify({ key_id: keyId, characters }),
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // get-usage-analytics
  server.tool(
    "get-usage-analytics",
    "Retrieve character usage analytics for the organisation for a date range.",
    {
      startDate: z
        .string()
        .optional()
        .describe("Start date in YYYY-MM-DD format (default: 30 days ago)"),
      endDate: z
        .string()
        .optional()
        .describe("End date in YYYY-MM-DD format (default: today)"),
      groupBy: z
        .enum(["key", "day"])
        .optional()
        .describe("Group results by 'key' or 'day' (default: key)"),
    },
    async ({ startDate, endDate, groupBy }) => {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      const start = startDate ?? thirtyDaysAgo.toISOString().split("T")[0];
      const end = endDate ?? today.toISOString().split("T")[0];
      const params = new URLSearchParams({
        start_date: start,
        end_date: end,
        group_by: groupBy ?? "key",
      });
      const data = await deeplFetch(`/v2/admin/analytics?${params}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  return server;
}

// ── Transport ────────────────────────────────────────────────────────────────

const useHttp = process.env.MCP_TRANSPORT === "http";
const port = parseInt(process.env.PORT ?? "3000", 10);

if (useHttp) {
  const httpServer = createServer(async (req, res) => {
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);
    await transport.handleRequest(req, res);
  });
  httpServer.listen(port, () => {
    console.error(`deepl-admin-mcp listening on port ${port} (HTTP)`);
  });
} else {
  const server = buildServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
