/**
 * DeepL Voice MCP Server — Cloudflare Worker
 *
 * Deploy:
 *   wrangler secret put DEEPL_API_KEY
 *   wrangler deploy
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const BASE = "https://api.deepl.com";

function buildServer(apiKey) {
  const server = new McpServer({ name: "deepl-voice-mcp", version: "1.0.0" });

  server.tool(
    "request-session",
    "Request a real-time voice translation session. Returns streamingUrl and token for WebSocket audio streaming.",
    {
      sourceLanguage: z.string().describe("Source language code, e.g. 'en'"),
      targetLanguages: z.array(z.string()).describe("Target language codes, e.g. ['de', 'fr']"),
      sourceMediaContentType: z.string().optional(),
      sourceLanguageMode: z.enum(["auto", "manual"]).optional(),
      messageFormat: z.enum(["json", "text"]).optional(),
    },
    async ({ sourceLanguage, targetLanguages, sourceMediaContentType, sourceLanguageMode, messageFormat }) => {
      const res = await fetch(`${BASE}/v3/voice/realtime`, {
        method: "POST",
        headers: {
          Authorization: `DeepL-Auth-Key ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_language: sourceLanguage,
          target_languages: targetLanguages,
          source_media_content_type: sourceMediaContentType ?? "audio/pcm;encoding=s16le;rate=16000",
          source_language_mode: sourceLanguageMode ?? "auto",
          message_format: messageFormat ?? "json",
        }),
      });
      if (!res.ok) throw new Error(`DeepL Voice API error ${res.status}: ${await res.text()}`);
      const { streaming_url, token, session_id } = await res.json();
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            sessionId: session_id,
            token,
            streamingUrl: streaming_url,
            webSocketUrl: `${streaming_url}?token=${token}`,
          }, null, 2),
        }],
      };
    }
  );

  server.tool("session-info", "Explain the DeepL Voice WebSocket streaming protocol.", {}, async () => ({
    content: [{
      type: "text",
      text: "Connect to webSocketUrl (from request-session). Send binary PCM audio frames (16-bit LE, 16 kHz mono). Receive JSON messages: { type: 'result'|'partial'|'done', translations: [{language, text}] }. Send an empty binary frame to signal end of audio. See https://developers.deepl.com/api-reference/voice/websocket-streaming",
    }],
  }));

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
