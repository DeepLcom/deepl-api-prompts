// DeepL Agent MCP Server — ASP.NET Core Minimal API
// Requires: DEEPL_API_KEY environment variable (Enterprise subscription only)
// Run: dotnet run

using System.ComponentModel;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using ModelContextProtocol.Server;
using DeepL.Mcp.Agent;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddMcpServer()
    .WithHttpTransport()
    .WithTools<AgentTools>();

builder.Services.AddHttpClient("deepl-agent", client =>
{
    var apiKey = builder.Configuration["DEEPL_API_KEY"]
                 ?? Environment.GetEnvironmentVariable("DEEPL_API_KEY")
                 ?? throw new InvalidOperationException("DEEPL_API_KEY is not set.");
    client.BaseAddress = new Uri("https://api.deepl.com");
    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("DeepL-Auth-Key", apiKey);
    client.Timeout = TimeSpan.FromMinutes(10); // long-running tasks
});

var app = builder.Build();
app.MapMcp();
app.Run();

// ── Tool implementations ────────────────────────────────────────────────────

namespace DeepL.Mcp.Agent
{
    [McpServerToolType]
    public sealed class AgentTools(IHttpClientFactory httpFactory)
    {
        private HttpClient Http => httpFactory.CreateClient("deepl-agent");

        private static string Json(object? o) =>
            JsonSerializer.Serialize(o, new JsonSerializerOptions { WriteIndented = true });

        [McpServerTool, Description(
            "Trigger a DeepL Agent workflow. Returns a taskId to use with get-task-result. " +
            "Requires an Enterprise subscription.")]
        public async Task<string> TriggerWorkflow(
            [Description("ID of the workflow to trigger")] string workflowId,
            [Description("Text input for the workflow")] string? inputText = null,
            [Description("Base64-encoded file content to attach")] string? inputFileBase64 = null,
            [Description("Filename for the attached file, e.g. 'report.docx'")] string? inputFilename = null)
        {
            var workflowRequest = Json(new { input = new { text = inputText ?? "" } });
            using var multipart = new MultipartFormDataContent();
            multipart.Add(new StringContent(workflowRequest, Encoding.UTF8, "application/json"), "workflow_request");

            if (inputFileBase64 != null && inputFilename != null)
            {
                var bytes = Convert.FromBase64String(inputFileBase64);
                var fileContent = new ByteArrayContent(bytes);
                multipart.Add(fileContent, "file", inputFilename);
            }

            var res = await Http.PostAsync($"/v1/unstable/agent/workflows/{workflowId}/trigger", multipart);
            res.EnsureSuccessStatusCode();
            var json = await res.Content.ReadAsStringAsync();
            var doc = JsonDocument.Parse(json).RootElement;

            return Json(new
            {
                taskId = doc.TryGetProperty("task_id", out var tid) ? tid.GetString() : null,
                pollingUrl = doc.TryGetProperty("polling_url", out var pu) ? pu.GetString() : null,
                uiUrl = doc.TryGetProperty("ui_url", out var ui) ? ui.GetString() : null,
            });
        }

        [McpServerTool, Description("Check the current status of a DeepL Agent task without blocking.")]
        public async Task<string> GetTaskStatus(
            [Description("The task ID returned by trigger-workflow")] string taskId)
        {
            var res = await Http.GetAsync($"/v1/unstable/agent/tasks/{taskId}");
            res.EnsureSuccessStatusCode();
            return await res.Content.ReadAsStringAsync();
        }

        [McpServerTool, Description("Poll a DeepL Agent task until it completes (or fails) and return the result.")]
        public async Task<string> GetTaskResult(
            [Description("The task ID returned by trigger-workflow")] string taskId,
            [Description("Maximum seconds to wait (default: 300)")] int maxWaitSeconds = 300)
        {
            var deadline = DateTime.UtcNow.AddSeconds(maxWaitSeconds);
            JsonElement task = default;

            while (DateTime.UtcNow < deadline)
            {
                var res = await Http.GetAsync($"/v1/unstable/agent/tasks/{taskId}");
                res.EnsureSuccessStatusCode();
                var body = await res.Content.ReadAsStringAsync();
                task = JsonDocument.Parse(body).RootElement;

                var status = task.TryGetProperty("status", out var s) ? s.GetString() : null;
                if (status is "Completed" or "Failed") break;

                await Task.Delay(5000);
            }

            if (!task.TryGetProperty("status", out var finalStatus) || finalStatus.GetString() != "Completed")
                return Json(new { status = "timeout_or_failed", task });

            // Fetch content from presigned URL if available
            object? content = null;
            if (task.TryGetProperty("result", out var result) &&
                result.TryGetProperty("content_url", out var contentUrlProp))
            {
                var contentUrl = contentUrlProp.GetString();
                if (contentUrl != null)
                {
                    using var tempClient = new HttpClient();
                    var cr = await tempClient.GetAsync(contentUrl);
                    if (cr.IsSuccessStatusCode)
                        content = JsonDocument.Parse(await cr.Content.ReadAsStringAsync()).RootElement;
                }
            }

            return Json(new { status = "Completed", taskId, result = content ?? (object)task });
        }
    }
}
