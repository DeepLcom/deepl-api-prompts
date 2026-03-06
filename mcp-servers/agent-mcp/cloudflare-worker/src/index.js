/**
 * DeepL Agent MCP Server — Cloudflare Worker
 *
 * Note: get-task-result polls by making multiple sequential fetch calls.
 * Cloudflare Workers have a 30-second CPU time limit — for long-running
 * tasks use get-task-status in a loop from the calling agent instead.
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
  const authHeader = { Authorization: `DeepL-Auth-Key ${apiKey}`, "User-Agent": "DeepL-MCP-agent/1.0.0" };
  const server = new McpServer({ name: "deepl-agent-mcp", version: "1.0.0" });

  server.tool(
    "trigger-workflow",
    "Trigger a DeepL Agent workflow. Returns taskId, pollingUrl, and uiUrl.",
    {
      workflowId: z.string(),
      inputText: z.string().optional(),
      inputFileBase64: z.string().optional(),
      inputFilename: z.string().optional(),
    },
    async ({ workflowId, inputText, inputFileBase64, inputFilename }) => {
      const formData = new FormData();
      formData.append("workflow_request", JSON.stringify({ input: { text: inputText ?? "" } }));
      if (inputFileBase64 && inputFilename) {
        const binary = Uint8Array.from(atob(inputFileBase64), (c) => c.charCodeAt(0));
        formData.append("file", new Blob([binary]), inputFilename);
      }
      const res = await fetch(
        `${BASE}/v1/unstable/agent/workflows/${workflowId}/trigger`,
        { method: "POST", headers: authHeader, body: formData }
      );
      if (!res.ok) throw new Error(`Agent API error ${res.status}: ${await res.text()}`);
      const result = await res.json();
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            taskId: result.task_id,
            pollingUrl: result.polling_url ?? null,
            uiUrl: result.ui_url ?? null,
          }, null, 2),
        }],
      };
    }
  );

  server.tool(
    "get-task-status",
    "Check the current status of a DeepL Agent task (non-blocking).",
    { taskId: z.string() },
    async ({ taskId }) => {
      const res = await fetch(`${BASE}/v1/unstable/agent/tasks/${taskId}`, {
        method: "GET", headers: authHeader,
      });
      if (!res.ok) throw new Error(`Agent API error ${res.status}: ${await res.text()}`);
      const task = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(task, null, 2) }] };
    }
  );

  server.tool(
    "get-task-result",
    "Poll a DeepL Agent task until completion. Limited to ~25 polls due to Worker CPU constraints. Use get-task-status in a loop for long-running tasks.",
    { taskId: z.string() },
    async ({ taskId }) => {
      let task;
      for (let i = 0; i < 25; i++) {
        const res = await fetch(`${BASE}/v1/unstable/agent/tasks/${taskId}`, {
          method: "GET", headers: authHeader,
        });
        if (!res.ok) throw new Error(`Agent API error ${res.status}: ${await res.text()}`);
        task = await res.json();
        if (task.status === "Completed" || task.status === "Failed") break;
        await new Promise((r) => setTimeout(r, 3000));
      }

      if (task?.status !== "Completed")
        return { content: [{ type: "text", text: JSON.stringify({ status: task?.status ?? "timeout", task }, null, 2) }] };

      const contentUrl = task?.result?.content_url;
      let content = null;
      if (contentUrl) {
        const cr = await fetch(contentUrl);
        if (cr.ok) content = await cr.json();
      }

      return {
        content: [{
          type: "text",
          text: JSON.stringify({ status: "Completed", taskId, result: content ?? task.result }, null, 2),
        }],
      };
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
