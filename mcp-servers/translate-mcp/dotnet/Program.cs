// DeepL Translate MCP Server — ASP.NET Core Minimal API
// Requires: DEEPL_API_KEY environment variable
// Run: dotnet run

using System.ComponentModel;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using ModelContextProtocol.Server;
using DeepL.Mcp.Translate;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddMcpServer()
    .WithHttpTransport()
    .WithTools<TranslateTools>();

builder.Services.AddHttpClient("deepl", client =>
{
    var apiKey = builder.Configuration["DEEPL_API_KEY"]
                 ?? Environment.GetEnvironmentVariable("DEEPL_API_KEY")
                 ?? throw new InvalidOperationException("DEEPL_API_KEY is not set.");
    client.BaseAddress = new Uri("https://api.deepl.com");
    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("DeepL-Auth-Key", apiKey);
});

var app = builder.Build();
app.MapMcp();
app.Run();

// ── Tool implementations ────────────────────────────────────────────────────

namespace DeepL.Mcp.Translate
{
    [McpServerToolType]
    public sealed class TranslateTools(IHttpClientFactory httpFactory)
    {
        private HttpClient Http => httpFactory.CreateClient("deepl");

        private static string Json(object? o) =>
            JsonSerializer.Serialize(o, new JsonSerializerOptions { WriteIndented = true });

        private async Task<string> PostJsonAsync(string path, object body)
        {
            var content = new StringContent(Json(body), Encoding.UTF8, "application/json");
            var res = await Http.PostAsync(path, content);
            res.EnsureSuccessStatusCode();
            return await res.Content.ReadAsStringAsync();
        }

        private async Task<string> GetAsync(string path)
        {
            var res = await Http.GetAsync(path);
            res.EnsureSuccessStatusCode();
            return await res.Content.ReadAsStringAsync();
        }

        [McpServerTool, Description("Translate one or more strings to a target language.")]
        public async Task<string> TranslateText(
            [Description("Text(s) to translate — separate multiple texts with |")] string text,
            [Description("Target language code, e.g. 'DE', 'EN-US'")] string targetLang,
            [Description("Source language code. Omit for auto-detection.")] string? sourceLang = null)
        {
            var texts = text.Contains('|') ? text.Split('|') : new[] { text };
            var body = new Dictionary<string, object> { ["text"] = texts, ["target_lang"] = targetLang.ToUpperInvariant() };
            if (sourceLang != null) body["source_lang"] = sourceLang.ToUpperInvariant();
            return await PostJsonAsync("/v2/translate", body);
        }

        [McpServerTool, Description("Translate text with a context hint to improve translation quality.")]
        public async Task<string> TranslateWithContext(
            [Description("Text to translate")] string text,
            [Description("Target language code")] string targetLang,
            [Description("Context hint about the surrounding text")] string context,
            [Description("Source language code. Omit for auto-detection.")] string? sourceLang = null)
        {
            var body = new Dictionary<string, object>
            {
                ["text"] = new[] { text },
                ["target_lang"] = targetLang.ToUpperInvariant(),
                ["context"] = context,
            };
            if (sourceLang != null) body["source_lang"] = sourceLang.ToUpperInvariant();
            return await PostJsonAsync("/v2/translate", body);
        }

        [McpServerTool, Description("Translate text with a specific formality level.")]
        public async Task<string> TranslateWithFormality(
            [Description("Text to translate")] string text,
            [Description("Target language code")] string targetLang,
            [Description("Formality: default | more | less | prefer_more | prefer_less")] string formality,
            [Description("Source language code. Omit for auto-detection.")] string? sourceLang = null)
        {
            var body = new Dictionary<string, object>
            {
                ["text"] = new[] { text },
                ["target_lang"] = targetLang.ToUpperInvariant(),
                ["formality"] = formality,
            };
            if (sourceLang != null) body["source_lang"] = sourceLang.ToUpperInvariant();
            return await PostJsonAsync("/v2/translate", body);
        }

        [McpServerTool, Description("Detect the language of text by translating to EN-US and returning the detected source language.")]
        public async Task<string> DetectLanguage(
            [Description("Text to detect the language of")] string text)
        {
            var body = new { text = new[] { text }, target_lang = "EN-US" };
            return await PostJsonAsync("/v2/translate", body);
        }

        [McpServerTool, Description("List all languages supported by the DeepL API.")]
        public async Task<string> ListLanguages(
            [Description("Filter by 'source' or 'target'. Omit for both.")] string? type = null)
        {
            if (type != null) return await GetAsync($"/v2/languages?type={type}");
            var src = await GetAsync("/v2/languages?type=source");
            var tgt = await GetAsync("/v2/languages?type=target");
            return Json(new { source = JsonDocument.Parse(src).RootElement, target = JsonDocument.Parse(tgt).RootElement });
        }

        [McpServerTool, Description("Get current API character usage and quota for the billing period.")]
        public async Task<string> GetUsage()
            => await GetAsync("/v2/usage");

        [McpServerTool, Description("Improve or rephrase text using DeepL Write. Requires a Pro subscription.")]
        public async Task<string> ImproveText(
            [Description("Text to improve")] string text,
            [Description("Target language code (e.g. 'EN-US'). Omit to use detected language.")] string? targetLang = null,
            [Description("Writing style, e.g. 'business', 'academic', 'casual'")] string? style = null,
            [Description("Writing tone, e.g. 'friendly', 'professional', 'enthusiastic'")] string? tone = null)
        {
            var body = new Dictionary<string, object> { ["text"] = new[] { text } };
            if (targetLang != null) body["target_lang"] = targetLang.ToUpperInvariant();
            if (style != null) body["writing_style"] = style;
            if (tone != null) body["tone"] = tone;
            return await PostJsonAsync("/v2/write/rephrase", body);
        }
    }
}
