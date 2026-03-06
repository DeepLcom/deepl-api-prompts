// DeepL Admin MCP Server — ASP.NET Core Minimal API
// Requires: DEEPL_ADMIN_KEY environment variable
// Run: dotnet run

using System.ComponentModel;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using ModelContextProtocol.Server;
using DeepL.Mcp.Admin;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddMcpServer()
    .WithHttpTransport()
    .WithTools<AdminTools>();

builder.Services.AddHttpClient("deepl-admin", client =>
{
    var adminKey = builder.Configuration["DEEPL_ADMIN_KEY"]
                   ?? Environment.GetEnvironmentVariable("DEEPL_ADMIN_KEY")
                   ?? throw new InvalidOperationException("DEEPL_ADMIN_KEY is not set.");
    client.BaseAddress = new Uri("https://api.deepl.com");
    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("DeepL-Auth-Key", adminKey);
    client.DefaultRequestHeaders.Add("User-Agent", "DeepL-MCP-admin/1.0.0");
});

var app = builder.Build();
app.MapMcp();
app.Run();

// ── Tool implementations ─────────────────────────────────────────────────────

namespace DeepL.Mcp.Admin
{
    [McpServerToolType]
    public sealed class AdminTools(IHttpClientFactory httpFactory)
    {
        private HttpClient Http => httpFactory.CreateClient("deepl-admin");

        private static string Json(object? o) =>
            JsonSerializer.Serialize(o, new JsonSerializerOptions { WriteIndented = true });

        private async Task<string> GetAsync(string path)
        {
            var res = await Http.GetAsync(path);
            res.EnsureSuccessStatusCode();
            return await res.Content.ReadAsStringAsync();
        }

        private async Task<string> PutAsync(string path, object body)
        {
            var content = new StringContent(Json(body), Encoding.UTF8, "application/json");
            var res = await Http.PutAsync(path, content);
            res.EnsureSuccessStatusCode();
            return await res.Content.ReadAsStringAsync();
        }

        [McpServerTool, Description("List all developer API keys in the organisation.")]
        public async Task<string> ListDeveloperKeys()
            => await GetAsync("/v2/admin/developer-keys");

        [McpServerTool, Description("Create a new developer API key with the given label.")]
        public async Task<string> CreateDeveloperKey(
            [Description("Human-readable label for the new key")] string label)
        {
            var content = new StringContent(Json(new { label }), Encoding.UTF8, "application/json");
            var res = await Http.PostAsync("/v2/admin/developer-keys", content);
            res.EnsureSuccessStatusCode();
            return await res.Content.ReadAsStringAsync();
        }

        [McpServerTool, Description("Permanently deactivate a developer API key. WARNING: irreversible.")]
        public async Task<string> DeactivateDeveloperKey(
            [Description("ID of the key to deactivate")] string keyId)
            => await PutAsync("/v2/admin/developer-keys/deactivate", new { key_id = keyId });

        [McpServerTool, Description("Rename (relabel) an existing developer API key.")]
        public async Task<string> RenameDeveloperKey(
            [Description("ID of the key to rename")] string keyId,
            [Description("New label for the key")] string newLabel)
            => await PutAsync("/v2/admin/developer-keys/label", new { key_id = keyId, label = newLabel });

        [McpServerTool, Description("Set or remove a character usage limit on a developer API key. Pass null to remove.")]
        public async Task<string> SetKeyUsageLimit(
            [Description("ID of the key")] string keyId,
            [Description("Character limit, or null to remove")] int? characters)
            => await PutAsync("/v2/admin/developer-keys/limits", new { key_id = keyId, characters });

        [McpServerTool, Description("Retrieve organisation usage analytics for a date range.")]
        public async Task<string> GetUsageAnalytics(
            [Description("Start date YYYY-MM-DD (default: 30 days ago)")] string? startDate = null,
            [Description("End date YYYY-MM-DD (default: today)")] string? endDate = null,
            [Description("Group by 'key' or 'day' (default: key)")] string? groupBy = null)
        {
            var today = DateTime.UtcNow;
            var start = startDate ?? today.AddDays(-30).ToString("yyyy-MM-dd");
            var end = endDate ?? today.ToString("yyyy-MM-dd");
            return await GetAsync(
                $"/v2/admin/analytics?start_date={start}&end_date={end}&group_by={groupBy ?? "key"}");
        }
    }
}
