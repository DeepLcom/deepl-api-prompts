/**
 * DeepL Translate MCP Server
 *
 * Tools:
 *   translate-text           – translate text to a target language
 *   translate-with-context   – translate with an optional context hint
 *   translate-with-formality – translate with formality control
 *   detect-language          – detect the language of text
 *   translate-document       – translate a document file (stdio/HTTP mode only)
 *   list-languages           – list supported source and target languages
 *   get-usage                – get current API usage and quota
 *   improve-text             – improve/rephrase text using DeepL Write
 *
 * Requires: DEEPL_API_KEY environment variable
 * Transport (env MCP_TRANSPORT): stdio (default) | http
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "http";
import { readFile } from "fs/promises";
import { z } from "zod";

const BASE_URL = "https://api.deepl.com";

function authHeaders() {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error("DEEPL_API_KEY environment variable is not set.");
  return {
    Authorization: `DeepL-Auth-Key ${key}`,
    "Content-Type": "application/json",
    "User-Agent": "DeepL-MCP-translate/1.0.0",
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
  return res.json();
}

async function translateTexts(texts, targetLang, sourceLang, extra = {}) {
  const body = {
    text: Array.isArray(texts) ? texts : [texts],
    target_lang: targetLang.toUpperCase(),
    ...(sourceLang ? { source_lang: sourceLang.toUpperCase() } : {}),
    ...extra,
  };
  return deeplFetch("/v2/translate", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ── Server ──────────────────────────────────────────────────────────────────

function buildServer() {
  const server = new McpServer({ name: "deepl-translate-mcp", version: "1.0.0" });

  // translate-text
  server.tool(
    "translate-text",
    "Translate one or more strings to a target language.",
    {
      text: z.union([z.string(), z.array(z.string())]).describe("Text or array of texts to translate"),
      targetLang: z.string().describe("Target language code, e.g. 'DE', 'EN-US', 'FR'"),
      sourceLang: z.string().optional().describe("Source language code. Omit for auto-detection."),
    },
    async ({ text, targetLang, sourceLang }) => {
      const data = await translateTexts(text, targetLang, sourceLang);
      return { content: [{ type: "text", text: JSON.stringify(data.translations, null, 2) }] };
    }
  );

  // translate-with-context
  server.tool(
    "translate-with-context",
    "Translate text with an optional context hint to improve translation quality. Context is not translated or billed.",
    {
      text: z.union([z.string(), z.array(z.string())]).describe("Text to translate"),
      targetLang: z.string().describe("Target language code"),
      context: z.string().describe("Context hint about the surrounding text or domain"),
      sourceLang: z.string().optional().describe("Source language code. Omit for auto-detection."),
    },
    async ({ text, targetLang, context, sourceLang }) => {
      const data = await translateTexts(text, targetLang, sourceLang, { context });
      return { content: [{ type: "text", text: JSON.stringify(data.translations, null, 2) }] };
    }
  );

  // translate-with-formality
  server.tool(
    "translate-with-formality",
    "Translate text with explicit formality control. Formality applies to supported languages only.",
    {
      text: z.union([z.string(), z.array(z.string())]).describe("Text to translate"),
      targetLang: z.string().describe("Target language code"),
      formality: z
        .enum(["default", "more", "less", "prefer_more", "prefer_less"])
        .describe("Formality level"),
      sourceLang: z.string().optional().describe("Source language code. Omit for auto-detection."),
    },
    async ({ text, targetLang, formality, sourceLang }) => {
      const data = await translateTexts(text, targetLang, sourceLang, { formality });
      return { content: [{ type: "text", text: JSON.stringify(data.translations, null, 2) }] };
    }
  );

  // detect-language
  server.tool(
    "detect-language",
    "Detect the language of one or more strings by translating to EN-US and returning the detected source language.",
    {
      text: z.union([z.string(), z.array(z.string())]).describe("Text or array of texts"),
    },
    async ({ text }) => {
      const data = await translateTexts(text, "EN-US", undefined);
      const detections = data.translations.map((t) => ({
        detectedLang: t.detected_source_language,
      }));
      return { content: [{ type: "text", text: JSON.stringify(detections, null, 2) }] };
    }
  );

  // translate-document
  server.tool(
    "translate-document",
    "Translate a document file (PDF, DOCX, PPTX, XLSX, HTML, TXT). Provide a local file path. Not available in Cloudflare Worker mode.",
    {
      inputFile: z.string().describe("Absolute path to the input document"),
      targetLang: z.string().describe("Target language code, e.g. 'DE'"),
      sourceLang: z.string().optional().describe("Source language code. Omit for auto-detection."),
      formality: z
        .enum(["default", "more", "less", "prefer_more", "prefer_less"])
        .optional()
        .describe("Formality level (for supported languages)"),
      glossaryId: z.string().optional().describe("Glossary ID to apply"),
    },
    async ({ inputFile, targetLang, sourceLang, formality, glossaryId }) => {
      const key = process.env.DEEPL_API_KEY;
      if (!key) throw new Error("DEEPL_API_KEY environment variable is not set.");

      const fileContent = await readFile(inputFile);
      const filename = inputFile.split(/[\\/]/).pop();

      const formData = new FormData();
      formData.append("file", new Blob([fileContent]), filename);
      formData.append("target_lang", targetLang.toUpperCase());
      if (sourceLang) formData.append("source_lang", sourceLang.toUpperCase());
      if (formality) formData.append("formality", formality);
      if (glossaryId) formData.append("glossary_id", glossaryId);

      // Step 1: Upload document
      const uploadRes = await fetch(`${BASE_URL}/v2/document`, {
        method: "POST",
        headers: { Authorization: `DeepL-Auth-Key ${key}`, "User-Agent": "DeepL-MCP-translate/1.0.0" },
        body: formData,
      });
      if (!uploadRes.ok) throw new Error(`Upload error ${uploadRes.status}: ${await uploadRes.text()}`);
      const { document_id, document_key } = await uploadRes.json();

      // Step 2: Poll for completion
      let status;
      do {
        await new Promise((r) => setTimeout(r, 2000));
        const statusRes = await fetch(`${BASE_URL}/v2/document/${document_id}`, {
          method: "POST",
          headers: { Authorization: `DeepL-Auth-Key ${key}`, "Content-Type": "application/json", "User-Agent": "DeepL-MCP-translate/1.0.0" },
          body: JSON.stringify({ document_key }),
        });
        status = await statusRes.json();
      } while (status.status === "translating" || status.status === "queued");

      if (status.status !== "done")
        throw new Error(`Translation failed: ${JSON.stringify(status)}`);

      // Step 3: Download result
      const dlRes = await fetch(`${BASE_URL}/v2/document/${document_id}/result`, {
        method: "POST",
        headers: { Authorization: `DeepL-Auth-Key ${key}`, "Content-Type": "application/json", "User-Agent": "DeepL-MCP-translate/1.0.0" },
        body: JSON.stringify({ document_key }),
      });
      if (!dlRes.ok) throw new Error(`Download error ${dlRes.status}`);

      const ext = filename?.includes(".") ? filename.split(".").pop() : "out";
      const outFile = inputFile.replace(/(\.[^.]+)$/, `_${targetLang.toLowerCase()}$1`) || `output.${ext}`;
      const { writeFile } = await import("fs/promises");
      await writeFile(outFile, Buffer.from(await dlRes.arrayBuffer()));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: "done",
              billedCharacters: status.billed_characters,
              outputFile: outFile,
            }, null, 2),
          },
        ],
      };
    }
  );

  // list-languages
  server.tool(
    "list-languages",
    "List all languages supported by the DeepL API.",
    {
      type: z
        .enum(["source", "target"])
        .optional()
        .describe("Filter by 'source' or 'target'. Omit for both."),
    },
    async ({ type }) => {
      if (!type || type === "source") {
        const src = await deeplFetch("/v2/languages?type=source");
        if (type === "source")
          return { content: [{ type: "text", text: JSON.stringify(src, null, 2) }] };
        const tgt = await deeplFetch("/v2/languages?type=target");
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ source: src, target: tgt }, null, 2),
            },
          ],
        };
      }
      const tgt = await deeplFetch("/v2/languages?type=target");
      return { content: [{ type: "text", text: JSON.stringify(tgt, null, 2) }] };
    }
  );

  // get-usage
  server.tool(
    "get-usage",
    "Retrieve current API character usage and quota for the billing period.",
    {},
    async () => {
      const data = await deeplFetch("/v2/usage");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  // improve-text
  server.tool(
    "improve-text",
    "Improve or rephrase text using DeepL Write. Requires a Pro subscription.",
    {
      text: z.union([z.string(), z.array(z.string())]).describe("Text to improve"),
      targetLang: z
        .string()
        .optional()
        .describe("Language code to rephrase in (e.g. 'EN-US'). Omit to use detected language."),
      style: z
        .string()
        .optional()
        .describe("Writing style, e.g. 'business', 'academic', 'casual'"),
      tone: z
        .string()
        .optional()
        .describe("Writing tone, e.g. 'enthusiastic', 'friendly', 'professional'"),
    },
    async ({ text, targetLang, style, tone }) => {
      const body = {
        text: Array.isArray(text) ? text : [text],
        ...(targetLang ? { target_lang: targetLang.toUpperCase() } : {}),
        ...(style ? { writing_style: style } : {}),
        ...(tone ? { tone } : {}),
      };
      const data = await deeplFetch("/v2/write/rephrase", {
        method: "POST",
        body: JSON.stringify(body),
      });
      return { content: [{ type: "text", text: JSON.stringify(data.improvements, null, 2) }] };
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
    console.error(`deepl-translate-mcp listening on port ${port} (HTTP)`);
  });
} else {
  const server = buildServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
