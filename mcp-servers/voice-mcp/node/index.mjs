/**
 * DeepL Voice MCP Server
 *
 * Tools:
 *   request-session  – request a real-time voice translation session
 *                      (returns streaming_url + token for WebSocket audio streaming)
 *   session-info     – explain the Voice API WebSocket streaming protocol
 *
 * Requires: DEEPL_API_KEY environment variable (Pro / Enterprise subscription)
 * Transport (env MCP_TRANSPORT): stdio (default) | http
 *
 * After calling request-session, connect to:
 *   ${streaming_url}?token=${token}
 * and stream PCM audio chunks to receive translated text in real time.
 * See: https://developers.deepl.com/api-reference/voice/websocket-streaming
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "http";
import { z } from "zod";

const BASE_URL = "https://api.deepl.com";

function authHeaders() {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error("DEEPL_API_KEY environment variable is not set.");
  return {
    Authorization: `DeepL-Auth-Key ${key}`,
    "Content-Type": "application/json",
  };
}

// ── Server ──────────────────────────────────────────────────────────────────

function buildServer() {
  const server = new McpServer({ name: "deepl-voice-mcp", version: "1.0.0" });

  // request-session
  server.tool(
    "request-session",
    "Request a real-time voice translation session. Returns a streaming_url and token to use with a WebSocket client for live audio streaming.",
    {
      sourceLanguage: z
        .string()
        .describe("Source language code, e.g. 'en'. The audio will be spoken in this language."),
      targetLanguages: z
        .array(z.string())
        .describe("Array of target language codes the speech should be translated into, e.g. ['de', 'fr']."),
      sourceMediaContentType: z
        .string()
        .optional()
        .describe("Audio format descriptor (default: 'audio/pcm;encoding=s16le;rate=16000')."),
      sourceLanguageMode: z
        .enum(["auto", "manual"])
        .optional()
        .describe("'auto' lets DeepL detect language shifts; 'manual' locks to sourceLanguage (default: auto)."),
      messageFormat: z
        .enum(["json", "text"])
        .optional()
        .describe("Format for WebSocket messages (default: json)."),
    },
    async ({
      sourceLanguage,
      targetLanguages,
      sourceMediaContentType,
      sourceLanguageMode,
      messageFormat,
    }) => {
      const body = {
        source_language: sourceLanguage,
        target_languages: targetLanguages,
        source_media_content_type:
          sourceMediaContentType ?? "audio/pcm;encoding=s16le;rate=16000",
        source_language_mode: sourceLanguageMode ?? "auto",
        message_format: messageFormat ?? "json",
      };

      const res = await fetch(`${BASE_URL}/v3/voice/realtime`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`DeepL Voice API error ${res.status}: ${text}`);
      }

      const { streaming_url, token, session_id } = await res.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                sessionId: session_id,
                token,
                streamingUrl: streaming_url,
                webSocketUrl: `${streaming_url}?token=${token}`,
                instructions:
                  "Connect to webSocketUrl and stream PCM audio chunks (16-bit LE, 16 kHz mono by default). Receive translated text messages in real time.",
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // session-info
  server.tool(
    "session-info",
    "Return documentation explaining how to use a DeepL Voice session after calling request-session.",
    {},
    async () => {
      return {
        content: [
          {
            type: "text",
            text: [
              "## DeepL Voice WebSocket protocol",
              "",
              "After calling `request-session` you receive:",
              "  - sessionId  — opaque identifier for the session",
              "  - token      — short-lived auth token",
              "  - streamingUrl — WebSocket endpoint base URL",
              "  - webSocketUrl — ready-to-use URL (streamingUrl + ?token=...)",
              "",
              "### Connecting",
              "Open a WebSocket connection to `webSocketUrl`.",
              "",
              "### Sending audio",
              "Send binary WebSocket frames containing raw PCM audio chunks.",
              "Default format: 16-bit signed little-endian, 16 kHz, mono.",
              "To signal end of audio, send an empty binary frame.",
              "",
              "### Receiving translations",
              "The server sends JSON messages with the following shape:",
              "  { type: 'result', translations: [{ language: 'de', text: '...' }] }",
              "  { type: 'partial', translations: [...] }   // incremental results",
              "  { type: 'done' }                           // session complete",
              "",
              "### Reference",
              "https://developers.deepl.com/api-reference/voice/websocket-streaming",
            ].join("\n"),
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
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);
    await transport.handleRequest(req, res);
  });
  httpServer.listen(port, () => {
    console.error(`deepl-voice-mcp listening on port ${port} (HTTP)`);
  });
} else {
  const server = buildServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
