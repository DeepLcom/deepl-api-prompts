/**
 * DeepL Agent MCP Server
 *
 * Tools:
 *   trigger-workflow  – trigger a DeepL Agent workflow and return the task ID
 *   get-task-result   – poll a task until completed and return the result
 *   get-task-status   – check the current status of a task without polling
 *
 * Requires: DEEPL_API_KEY environment variable (Enterprise subscription only)
 * Note: Agent API endpoints are currently under /v1/unstable/ and may change.
 * Transport (env MCP_TRANSPORT): stdio (default) | http
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "http";
import { z } from "zod";

const BASE_URL = "https://api.deepl.com";

function apiKey() {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error("DEEPL_API_KEY environment variable is not set.");
  return key;
}

function authHeader() {
  return { Authorization: `DeepL-Auth-Key ${apiKey()}` };
}

// ── Server ──────────────────────────────────────────────────────────────────

function buildServer() {
  const server = new McpServer({ name: "deepl-agent-mcp", version: "1.0.0" });

  // trigger-workflow
  server.tool(
    "trigger-workflow",
    "Trigger a DeepL Agent workflow. Returns a task_id that you can use with get-task-result to poll for the completed output.",
    {
      workflowId: z
        .string()
        .describe("ID of the workflow to trigger (from your DeepL Agent configuration)"),
      inputText: z
        .string()
        .optional()
        .describe("Text input to pass to the workflow, e.g. document text to translate and summarise"),
      inputFileBase64: z
        .string()
        .optional()
        .describe("Base64-encoded file content to attach to the workflow request"),
      inputFilename: z
        .string()
        .optional()
        .describe("Filename for the attached file, e.g. 'report.docx'"),
    },
    async ({ workflowId, inputText, inputFileBase64, inputFilename }) => {
      const workflowRequest = JSON.stringify({
        input: { text: inputText ?? "" },
      });

      const formData = new FormData();
      formData.append("workflow_request", workflowRequest);

      if (inputFileBase64 && inputFilename) {
        const binary = Uint8Array.from(atob(inputFileBase64), (c) => c.charCodeAt(0));
        formData.append("file", new Blob([binary]), inputFilename);
      }

      const res = await fetch(
        `${BASE_URL}/v1/unstable/agent/workflows/${workflowId}/trigger`,
        {
          method: "POST",
          headers: authHeader(),
          body: formData,
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`DeepL Agent API error ${res.status}: ${text}`);
      }

      const result = await res.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                taskId: result.task_id,
                pollingUrl: result.polling_url ?? null,
                uiUrl: result.ui_url ?? null,
                hint: `Call get-task-result with taskId "${result.task_id}" to retrieve the completed output.`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // get-task-status (single check, no polling)
  server.tool(
    "get-task-status",
    "Check the current status of a DeepL Agent task without blocking. Returns status: 'queued', 'processing', 'Completed', or 'Failed'.",
    {
      taskId: z.string().describe("The task ID returned by trigger-workflow"),
    },
    async ({ taskId }) => {
      const res = await fetch(
        `${BASE_URL}/v1/unstable/agent/tasks/${taskId}`,
        { method: "GET", headers: authHeader() }
      );
      if (!res.ok) throw new Error(`DeepL Agent API error ${res.status}: ${await res.text()}`);
      const task = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(task, null, 2) }] };
    }
  );

  // get-task-result (polls until done)
  server.tool(
    "get-task-result",
    "Poll a DeepL Agent task until it completes (or fails) and return the full result. Will poll up to 60 times with 5-second intervals (5 minutes max).",
    {
      taskId: z.string().describe("The task ID returned by trigger-workflow"),
      maxWaitSeconds: z
        .number()
        .optional()
        .describe("Maximum seconds to wait for completion (default: 300)"),
    },
    async ({ taskId, maxWaitSeconds }) => {
      const maxMs = (maxWaitSeconds ?? 300) * 1000;
      const interval = 5000;
      const start = Date.now();

      let task;
      while (true) {
        const res = await fetch(
          `${BASE_URL}/v1/unstable/agent/tasks/${taskId}`,
          { method: "GET", headers: authHeader() }
        );
        if (!res.ok) throw new Error(`DeepL Agent API error ${res.status}: ${await res.text()}`);

        task = await res.json();
        const status = task.status;

        if (status === "Completed" || status === "Failed") break;

        if (Date.now() - start + interval > maxMs) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ status: "timeout", latestTask: task }, null, 2),
              },
            ],
          };
        }

        await new Promise((r) => setTimeout(r, interval));
      }

      if (task.status === "Failed") {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "Failed", task }, null, 2) }],
        };
      }

      // Fetch content from presigned URL if available
      const contentUrl = task?.result?.content_url;
      let content = null;
      if (contentUrl) {
        const contentRes = await fetch(contentUrl);
        if (contentRes.ok) content = await contentRes.json();
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                status: "Completed",
                taskId,
                result: content ?? task.result ?? task,
              },
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
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);
    await transport.handleRequest(req, res);
  });
  httpServer.listen(port, () => {
    console.error(`deepl-agent-mcp listening on port ${port} (HTTP)`);
  });
} else {
  const server = buildServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
