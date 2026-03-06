/**
 * DeepL Admin MCP Server — Cloudflare Worker
 *
 * Deploy:
 *   wrangler secret put DEEPL_ADMIN_KEY
 *   wrangler deploy
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const BASE = "https://api.deepl.com";

function headers(adminKey) {
  return {
    Authorization: `DeepL-Auth-Key ${adminKey}`,
    "Content-Type": "application/json",
    "User-Agent": "DeepL-MCP-admin/1.0.0",
  };
}

async function apiFetch(adminKey, path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...headers(adminKey), ...(options.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`DeepL Admin API error ${res.status}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

function buildServer(adminKey) {
  const server = new McpServer({ name: "deepl-admin-mcp", version: "1.0.0" });

  server.tool("list-developer-keys", "List all developer API keys.", {}, async () => {
    const data = await apiFetch(adminKey, "/v2/admin/developer-keys");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.tool(
    "create-developer-key",
    "Create a new developer API key.",
    { label: z.string() },
    async ({ label }) => {
      const data = await apiFetch(adminKey, "/v2/admin/developer-keys", {
        method: "POST",
        body: JSON.stringify({ label }),
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "deactivate-developer-key",
    "Permanently deactivate a developer API key (irreversible).",
    { keyId: z.string() },
    async ({ keyId }) => {
      const data = await apiFetch(adminKey, "/v2/admin/developer-keys/deactivate", {
        method: "PUT",
        body: JSON.stringify({ key_id: keyId }),
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "rename-developer-key",
    "Rename an existing developer API key.",
    { keyId: z.string(), newLabel: z.string() },
    async ({ keyId, newLabel }) => {
      const data = await apiFetch(adminKey, "/v2/admin/developer-keys/label", {
        method: "PUT",
        body: JSON.stringify({ key_id: keyId, label: newLabel }),
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "set-key-usage-limit",
    "Set or remove a character usage limit on a key. Pass null to remove the limit.",
    { keyId: z.string(), characters: z.number().nullable() },
    async ({ keyId, characters }) => {
      const data = await apiFetch(adminKey, "/v2/admin/developer-keys/limits", {
        method: "PUT",
        body: JSON.stringify({ key_id: keyId, characters }),
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "get-usage-analytics",
    "Retrieve organisation usage analytics for a date range.",
    {
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      groupBy: z.enum(["key", "day"]).optional(),
    },
    async ({ startDate, endDate, groupBy }) => {
      const today = new Date();
      const ago = new Date(today);
      ago.setDate(today.getDate() - 30);
      const params = new URLSearchParams({
        start_date: startDate ?? ago.toISOString().split("T")[0],
        end_date: endDate ?? today.toISOString().split("T")[0],
        group_by: groupBy ?? "key",
      });
      const data = await apiFetch(adminKey, `/v2/admin/analytics?${params}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  return server;
}

export default {
  async fetch(request, env) {
    const adminKey = env.DEEPL_ADMIN_KEY;
    if (!adminKey) return new Response("DEEPL_ADMIN_KEY secret not set", { status: 500 });
    const server = buildServer(adminKey);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);
    return transport.handleRequest(request);
  },
};
