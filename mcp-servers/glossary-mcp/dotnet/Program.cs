// DeepL Glossary MCP Server — ASP.NET Core Minimal API
// Requires: DEEPL_API_KEY environment variable
// Run: dotnet run
// The MCP endpoint is served at POST /mcp  (StreamableHTTP transport)

using System.ComponentModel;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using ModelContextProtocol.Server;
using DeepL.Mcp.Glossary;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddMcpServer()
    .WithHttpTransport()
    .WithTools<GlossaryTools>();

builder.Services.AddHttpClient("deepl", client =>
{
    var apiKey = builder.Configuration["DEEPL_API_KEY"]
                 ?? Environment.GetEnvironmentVariable("DEEPL_API_KEY")
                 ?? throw new InvalidOperationException("DEEPL_API_KEY is not set.");
    client.BaseAddress = new Uri("https://api.deepl.com");
    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("DeepL-Auth-Key", apiKey);
    client.DefaultRequestHeaders.Add("User-Agent", "DeepL-MCP-glossary/1.0.0");
});

var app = builder.Build();
app.MapMcp();
app.Run();

// ── Tool implementations ────────────────────────────────────────────────────

namespace DeepL.Mcp.Glossary
{
    [McpServerToolType]
    public sealed class GlossaryTools(IHttpClientFactory httpFactory)
    {
        private HttpClient Http => httpFactory.CreateClient("deepl");

        // ── helpers ─────────────────────────────────────────────────────────

        private static string Json(object? o) =>
            JsonSerializer.Serialize(o, new JsonSerializerOptions { WriteIndented = true });

        private async Task<string> GetAsync(string path)
        {
            var res = await Http.GetAsync(path);
            res.EnsureSuccessStatusCode();
            return await res.Content.ReadAsStringAsync();
        }

        private async Task<string> PostAsync(string path, object body)
        {
            var content = new StringContent(Json(body), Encoding.UTF8, "application/json");
            var res = await Http.PostAsync(path, content);
            res.EnsureSuccessStatusCode();
            return await res.Content.ReadAsStringAsync();
        }

        // ── tools ────────────────────────────────────────────────────────────

        [McpServerTool, Description("List all glossaries in your DeepL account.")]
        public async Task<string> ListGlossaries()
            => await GetAsync("/v2/glossaries");

        [McpServerTool, Description("Get metadata for a specific glossary by ID.")]
        public async Task<string> GetGlossary(
            [Description("The unique glossary ID")] string glossaryId)
            => await GetAsync($"/v2/glossaries/{glossaryId}");

        [McpServerTool, Description("Create a new glossary from source→target term pairs. Provide entries as a JSON object.")]
        public async Task<string> CreateGlossary(
            [Description("Human-readable name")] string name,
            [Description("Source language code, e.g. 'en'")] string sourceLang,
            [Description("Target language code, e.g. 'de'")] string targetLang,
            [Description("JSON object of { sourceTerm: targetTerm }")] string entriesJson)
        {
            var entries = JsonSerializer.Deserialize<Dictionary<string, string>>(entriesJson)
                          ?? throw new ArgumentException("Invalid entries JSON");
            var tsv = string.Join("\n", entries.Select(kv => $"{kv.Key}\t{kv.Value}"));
            return await PostAsync("/v2/glossaries", new
            {
                name,
                source_lang = sourceLang.ToUpperInvariant(),
                target_lang = targetLang.ToUpperInvariant(),
                entries = tsv,
                entries_format = "tsv",
            });
        }

        [McpServerTool, Description("Permanently delete a glossary.")]
        public async Task<string> DeleteGlossary(
            [Description("The unique glossary ID")] string glossaryId)
        {
            var res = await Http.DeleteAsync($"/v2/glossaries/{glossaryId}");
            res.EnsureSuccessStatusCode();
            return $"Glossary {glossaryId} deleted.";
        }

        [McpServerTool, Description("Retrieve all term entries from a glossary (TSV format).")]
        public async Task<string> GetGlossaryEntries(
            [Description("The unique glossary ID")] string glossaryId)
        {
            var req = new HttpRequestMessage(HttpMethod.Get, $"/v2/glossaries/{glossaryId}/entries");
            req.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("text/tab-separated-values"));
            var res = await Http.SendAsync(req);
            res.EnsureSuccessStatusCode();
            return await res.Content.ReadAsStringAsync();
        }

        [McpServerTool, Description("List all language pairs supported for glossary creation.")]
        public async Task<string> ListGlossaryLanguagePairs()
            => await GetAsync("/v2/glossary-language-pairs");

        [McpServerTool, Description("Translate text using a specific glossary for consistent terminology.")]
        public async Task<string> TranslateWithGlossary(
            [Description("Text to translate")] string text,
            [Description("Target language code, e.g. 'de'")] string targetLang,
            [Description("Source language code — required when using a glossary")] string sourceLang,
            [Description("Glossary ID to apply")] string glossaryId)
            => await PostAsync("/v2/translate", new
            {
                text = new[] { text },
                target_lang = targetLang.ToUpperInvariant(),
                source_lang = sourceLang.ToUpperInvariant(),
                glossary_id = glossaryId,
            });
    }
}
