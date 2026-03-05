/**
 * DeepL Glossary MCP Server — Cloudflare Worker
 *
 * Exposes the same glossary tools as the Node variant, using
 * StreamableHTTP transport over the Worker fetch handler.
 *
 * Deploy:
 *   wrangler secret put DEEPL_API_KEY
 *   wrangler deploy
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const DEEPL_BASE = "https://api.deepl.com";

function authHeaders(apiKey) {
  return {
    Authorization: `DeepL-Auth-Key ${apiKey}`,
    "Content-Type": "application/json",
  };
}

async function deeplFetch(apiKey, path, options = {}) {
  const res = await fetch(`${DEEPL_BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(apiKey), ...(options.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DeepL API error ${res.status}: ${body}`);
  }
  return res.status === 204 ? null : res.json();
}

function buildServer(apiKey) {
  const server = new McpServer({ name: "deepl-glossary-mcp", version: "1.0.0" });

  server.tool("list-glossaries", "List all glossaries.", {}, async () => {
    const data = await deeplFetch(apiKey, "/v2/glossaries");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.tool(
    "create-glossary",
    "Create a new glossary from source→target term pairs.",
    {
      name: z.string(),
      sourceLang: z.string(),
      targetLang: z.string(),
      entries: z.record(z.string(), z.string()),
    },
    async ({ name, sourceLang, targetLang, entries }) => {
      const tsv = Object.entries(entries).map(([s, t]) => `${s}\t${t}`).join("\n");
      const data = await deeplFetch(apiKey, "/v2/glossaries", {
        method: "POST",
        body: JSON.stringify({
          name,
          source_lang: sourceLang.toUpperCase(),
          target_lang: targetLang.toUpperCase(),
          entries: tsv,
          entries_format: "tsv",
        }),
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "get-glossary",
    "Get metadata for a specific glossary.",
    { glossaryId: z.string() },
    async ({ glossaryId }) => {
      const data = await deeplFetch(apiKey, `/v2/glossaries/${glossaryId}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "delete-glossary",
    "Permanently delete a glossary.",
    { glossaryId: z.string() },
    async ({ glossaryId }) => {
      await deeplFetch(apiKey, `/v2/glossaries/${glossaryId}`, { method: "DELETE" });
      return { content: [{ type: "text", text: `Glossary ${glossaryId} deleted.` }] };
    }
  );

  server.tool(
    "get-glossary-entries",
    "Retrieve all term entries from a glossary as TSV.",
    { glossaryId: z.string() },
    async ({ glossaryId }) => {
      const res = await fetch(`${DEEPL_BASE}/v2/glossaries/${glossaryId}/entries`, {
        headers: {
          Authorization: `DeepL-Auth-Key ${apiKey}`,
          Accept: "text/tab-separated-values",
        },
      });
      if (!res.ok) throw new Error(`DeepL API error ${res.status}`);
      const tsv = await res.text();
      return { content: [{ type: "text", text: tsv }] };
    }
  );

  server.tool(
    "list-glossary-language-pairs",
    "List language pairs supported for glossary creation.",
    {},
    async () => {
      const data = await deeplFetch(apiKey, "/v2/glossary-language-pairs");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "translate-with-glossary",
    "Translate text applying a named glossary.",
    {
      text: z.string(),
      targetLang: z.string(),
      sourceLang: z.string(),
      glossaryId: z.string(),
    },
    async ({ text, targetLang, sourceLang, glossaryId }) => {
      const data = await deeplFetch(apiKey, "/v2/translate", {
        method: "POST",
        body: JSON.stringify({
          text: [text],
          target_lang: targetLang.toUpperCase(),
          source_lang: sourceLang.toUpperCase(),
          glossary_id: glossaryId,
        }),
      });
      const t = data.translations?.[0];
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { translatedText: t?.text, detectedSourceLang: t?.detected_source_language },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  return server;
}

export default {
  async fetch(request, env) {
    const apiKey = env.DEEPL_API_KEY;
    if (!apiKey) {
      return new Response("DEEPL_API_KEY secret not set", { status: 500 });
    }
    const server = buildServer(apiKey);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);
    return transport.handleRequest(request);
  },
};
