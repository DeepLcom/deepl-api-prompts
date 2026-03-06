/**
 * DeepL Glossary MCP Server
 *
 * Tools:
 *   list-glossaries              – list all glossaries
 *   create-glossary              – create a new glossary
 *   get-glossary                 – get metadata for one glossary
 *   delete-glossary              – delete a glossary
 *   get-glossary-entries         – retrieve dictionary entries
 *   list-glossary-language-pairs – supported language pairs
 *   translate-with-glossary      – translate text applying a glossary
 *
 * Transport (env MCP_TRANSPORT):
 *   stdio (default) – for Claude Desktop / local agents
 *   http            – for Docker / network deployments (PORT env, default 3000)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "http";
import { z } from "zod";

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const BASE_URL = "https://api.deepl.com";

function authHeaders() {
  if (!DEEPL_API_KEY) throw new Error("DEEPL_API_KEY environment variable is not set.");
  return {
    Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
    "Content-Type": "application/json",
    "User-Agent": "DeepL-MCP-glossary/1.0.0",
  };
}

async function deeplFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DeepL API error ${res.status}: ${body}`);
  }
  return res.status === 204 ? null : res.json();
}

// ── Server ──────────────────────────────────────────────────────────────────

function buildServer() {
  const server = new McpServer({
    name: "deepl-glossary-mcp",
    version: "1.0.0",
  });

  // list-glossaries
  server.tool(
    "list-glossaries",
    "List all glossaries in your DeepL account with their metadata.",
    {},
    async () => {
      const data = await deeplFetch("/v2/glossaries");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // create-glossary
  server.tool(
    "create-glossary",
    "Create a new glossary from a set of source→target term pairs.",
    {
      name: z.string().describe("Human-readable name for the glossary"),
      sourceLang: z.string().describe("Source language code, e.g. 'en'"),
      targetLang: z.string().describe("Target language code, e.g. 'de'"),
      entries: z
        .record(z.string(), z.string())
        .describe("Object of { sourceTerm: targetTerm } pairs"),
    },
    async ({ name, sourceLang, targetLang, entries }) => {
      // Convert entries object to TSV format
      const tsvEntries = Object.entries(entries)
        .map(([src, tgt]) => `${src}\t${tgt}`)
        .join("\n");
      const data = await deeplFetch("/v2/glossaries", {
        method: "POST",
        body: JSON.stringify({
          name,
          source_lang: sourceLang.toUpperCase(),
          target_lang: targetLang.toUpperCase(),
          entries: tsvEntries,
          entries_format: "tsv",
        }),
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // get-glossary
  server.tool(
    "get-glossary",
    "Get metadata for a specific glossary by ID.",
    {
      glossaryId: z.string().describe("The unique glossary ID"),
    },
    async ({ glossaryId }) => {
      const data = await deeplFetch(`/v2/glossaries/${glossaryId}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // delete-glossary
  server.tool(
    "delete-glossary",
    "Permanently delete a glossary.",
    {
      glossaryId: z.string().describe("The unique glossary ID to delete"),
    },
    async ({ glossaryId }) => {
      await deeplFetch(`/v2/glossaries/${glossaryId}`, { method: "DELETE" });
      return { content: [{ type: "text", text: `Glossary ${glossaryId} deleted.` }] };
    }
  );

  // get-glossary-entries
  server.tool(
    "get-glossary-entries",
    "Retrieve all term entries from a glossary dictionary.",
    {
      glossaryId: z.string().describe("The unique glossary ID"),
    },
    async ({ glossaryId }) => {
      const res = await fetch(`${BASE_URL}/v2/glossaries/${glossaryId}/entries`, {
        headers: {
          ...authHeaders(),
          Accept: "text/tab-separated-values",
          "Content-Type": undefined,
        },
      });
      if (!res.ok) throw new Error(`DeepL API error ${res.status}: ${await res.text()}`);
      const tsv = await res.text();
      return { content: [{ type: "text", text: tsv }] };
    }
  );

  // list-glossary-language-pairs
  server.tool(
    "list-glossary-language-pairs",
    "List language pairs supported for glossary creation.",
    {},
    async () => {
      const data = await deeplFetch("/v2/glossary-language-pairs");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // translate-with-glossary
  server.tool(
    "translate-with-glossary",
    "Translate text using a specific glossary for consistent terminology.",
    {
      text: z.string().describe("Text to translate"),
      targetLang: z.string().describe("Target language code, e.g. 'de'"),
      sourceLang: z.string().describe("Source language code — required when using a glossary"),
      glossaryId: z.string().describe("Glossary ID to apply"),
    },
    async ({ text, targetLang, sourceLang, glossaryId }) => {
      const data = await deeplFetch("/v2/translate", {
        method: "POST",
        body: JSON.stringify({
          text: [text],
          target_lang: targetLang.toUpperCase(),
          source_lang: sourceLang.toUpperCase(),
          glossary_id: glossaryId,
        }),
      });
      const translation = data.translations?.[0];
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { translatedText: translation?.text, detectedSourceLang: translation?.detected_source_language },
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

// ── Transport ────────────────────────────────────────────────────────────────

const useHttp = process.env.MCP_TRANSPORT === "http";
const port = parseInt(process.env.PORT ?? "3000", 10);

if (useHttp) {
  const httpServer = createServer(async (req, res) => {
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless
    });
    await server.connect(transport);
    await transport.handleRequest(req, res);
  });
  httpServer.listen(port, () => {
    console.error(`deepl-glossary-mcp listening on port ${port} (HTTP)`);
  });
} else {
  const server = buildServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
