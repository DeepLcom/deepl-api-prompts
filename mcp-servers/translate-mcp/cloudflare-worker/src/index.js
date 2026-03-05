/**
 * DeepL Translate MCP Server — Cloudflare Worker
 *
 * Note: translate-document accepts base64-encoded file content because
 * Cloudflare Workers have no filesystem. The agent must base64-encode the
 * file before calling this tool.
 *
 * Deploy:
 *   wrangler secret put DEEPL_API_KEY
 *   wrangler deploy
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const BASE = "https://api.deepl.com";

function headers(apiKey) {
  return { Authorization: `DeepL-Auth-Key ${apiKey}`, "Content-Type": "application/json" };
}

async function apiFetch(apiKey, path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...headers(apiKey), ...(options.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`DeepL API error ${res.status}: ${await res.text()}`);
  return res.json();
}

async function translate(apiKey, text, targetLang, sourceLang, extra = {}) {
  return apiFetch(apiKey, "/v2/translate", {
    method: "POST",
    body: JSON.stringify({
      text: Array.isArray(text) ? text : [text],
      target_lang: targetLang.toUpperCase(),
      ...(sourceLang ? { source_lang: sourceLang.toUpperCase() } : {}),
      ...extra,
    }),
  });
}

function buildServer(apiKey) {
  const server = new McpServer({ name: "deepl-translate-mcp", version: "1.0.0" });

  server.tool(
    "translate-text",
    "Translate one or more strings to a target language.",
    {
      text: z.union([z.string(), z.array(z.string())]),
      targetLang: z.string(),
      sourceLang: z.string().optional(),
    },
    async ({ text, targetLang, sourceLang }) => {
      const data = await translate(apiKey, text, targetLang, sourceLang);
      return { content: [{ type: "text", text: JSON.stringify(data.translations, null, 2) }] };
    }
  );

  server.tool(
    "translate-with-context",
    "Translate text with a context hint to improve quality. Context is not billed.",
    {
      text: z.union([z.string(), z.array(z.string())]),
      targetLang: z.string(),
      context: z.string(),
      sourceLang: z.string().optional(),
    },
    async ({ text, targetLang, context, sourceLang }) => {
      const data = await translate(apiKey, text, targetLang, sourceLang, { context });
      return { content: [{ type: "text", text: JSON.stringify(data.translations, null, 2) }] };
    }
  );

  server.tool(
    "translate-with-formality",
    "Translate text with explicit formality control.",
    {
      text: z.union([z.string(), z.array(z.string())]),
      targetLang: z.string(),
      formality: z.enum(["default", "more", "less", "prefer_more", "prefer_less"]),
      sourceLang: z.string().optional(),
    },
    async ({ text, targetLang, formality, sourceLang }) => {
      const data = await translate(apiKey, text, targetLang, sourceLang, { formality });
      return { content: [{ type: "text", text: JSON.stringify(data.translations, null, 2) }] };
    }
  );

  server.tool(
    "detect-language",
    "Detect the language of one or more strings.",
    { text: z.union([z.string(), z.array(z.string())]) },
    async ({ text }) => {
      const data = await translate(apiKey, text, "EN-US", undefined);
      const detections = data.translations.map((t) => ({
        detectedLang: t.detected_source_language,
      }));
      return { content: [{ type: "text", text: JSON.stringify(detections, null, 2) }] };
    }
  );

  server.tool(
    "translate-document",
    "Translate a document. Provide the file content as a base64 string and a filename (e.g. 'report.docx'). Supports PDF, DOCX, PPTX, XLSX, HTML, TXT.",
    {
      fileBase64: z.string().describe("Base64-encoded file content"),
      filename: z.string().describe("Original filename including extension, e.g. 'report.docx'"),
      targetLang: z.string(),
      sourceLang: z.string().optional(),
      formality: z.enum(["default", "more", "less", "prefer_more", "prefer_less"]).optional(),
      glossaryId: z.string().optional(),
    },
    async ({ fileBase64, filename, targetLang, sourceLang, formality, glossaryId }) => {
      const binary = Uint8Array.from(atob(fileBase64), (c) => c.charCodeAt(0));
      const form = new FormData();
      form.append("file", new Blob([binary]), filename);
      form.append("target_lang", targetLang.toUpperCase());
      if (sourceLang) form.append("source_lang", sourceLang.toUpperCase());
      if (formality) form.append("formality", formality);
      if (glossaryId) form.append("glossary_id", glossaryId);

      const uploadRes = await fetch(`${BASE}/v2/document`, {
        method: "POST",
        headers: { Authorization: `DeepL-Auth-Key ${apiKey}` },
        body: form,
      });
      if (!uploadRes.ok)
        throw new Error(`Upload error ${uploadRes.status}: ${await uploadRes.text()}`);
      const { document_id, document_key } = await uploadRes.json();

      // Poll
      let status;
      let attempts = 0;
      do {
        await new Promise((r) => setTimeout(r, 2000));
        const statusRes = await fetch(`${BASE}/v2/document/${document_id}`, {
          method: "POST",
          headers: { Authorization: `DeepL-Auth-Key ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ document_key }),
        });
        status = await statusRes.json();
        attempts++;
      } while ((status.status === "translating" || status.status === "queued") && attempts < 60);

      if (status.status !== "done")
        throw new Error(`Translation failed or timed out: ${JSON.stringify(status)}`);

      const dlRes = await fetch(`${BASE}/v2/document/${document_id}/result`, {
        method: "POST",
        headers: { Authorization: `DeepL-Auth-Key ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ document_key }),
      });
      const resultBuffer = await dlRes.arrayBuffer();
      const resultBase64 = btoa(String.fromCharCode(...new Uint8Array(resultBuffer)));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: "done",
              billedCharacters: status.billed_characters,
              resultBase64,
              outputFilename: filename.replace(/(\.[^.]+)$/, `_${targetLang.toLowerCase()}$1`),
            }, null, 2),
          },
        ],
      };
    }
  );

  server.tool("list-languages", "List all languages supported by the DeepL API.",
    { type: z.enum(["source", "target"]).optional() },
    async ({ type }) => {
      if (type) {
        const data = await apiFetch(apiKey, `/v2/languages?type=${type}`);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
      const [src, tgt] = await Promise.all([
        apiFetch(apiKey, "/v2/languages?type=source"),
        apiFetch(apiKey, "/v2/languages?type=target"),
      ]);
      return { content: [{ type: "text", text: JSON.stringify({ source: src, target: tgt }, null, 2) }] };
    }
  );

  server.tool("get-usage", "Get current API usage and quota.", {}, async () => {
    const data = await apiFetch(apiKey, "/v2/usage");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.tool(
    "improve-text",
    "Improve / rephrase text using DeepL Write. Requires a Pro subscription.",
    {
      text: z.union([z.string(), z.array(z.string())]),
      targetLang: z.string().optional(),
      style: z.string().optional().describe("Writing style, e.g. 'business', 'academic'"),
      tone: z.string().optional().describe("Writing tone, e.g. 'friendly', 'professional'"),
    },
    async ({ text, targetLang, style, tone }) => {
      const body = {
        text: Array.isArray(text) ? text : [text],
        ...(targetLang ? { target_lang: targetLang.toUpperCase() } : {}),
        ...(style ? { writing_style: style } : {}),
        ...(tone ? { tone } : {}),
      };
      const data = await apiFetch(apiKey, "/v2/write/rephrase", {
        method: "POST",
        body: JSON.stringify(body),
      });
      return { content: [{ type: "text", text: JSON.stringify(data.improvements, null, 2) }] };
    }
  );

  return server;
}

export default {
  async fetch(request, env) {
    const apiKey = env.DEEPL_API_KEY;
    if (!apiKey) return new Response("DEEPL_API_KEY secret not set", { status: 500 });
    const server = buildServer(apiKey);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);
    return transport.handleRequest(request);
  },
};
