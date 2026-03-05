// DeepL Voice MCP Server — ASP.NET Core Minimal API
// Requires: DEEPL_API_KEY environment variable (Pro / Enterprise subscription)
// Run: dotnet run

using System.ComponentModel;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using ModelContextProtocol.Server;
using DeepL.Mcp.Voice;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddMcpServer()
    .WithHttpTransport()
    .WithTools<VoiceTools>();

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

namespace DeepL.Mcp.Voice
{
    [McpServerToolType]
    public sealed class VoiceTools(IHttpClientFactory httpFactory)
    {
        private HttpClient Http => httpFactory.CreateClient("deepl");

        private static string Json(object? o) =>
            JsonSerializer.Serialize(o, new JsonSerializerOptions { WriteIndented = true });

        [McpServerTool, Description(
            "Request a real-time voice translation session. Returns a streamingUrl and token for WebSocket audio streaming. " +
            "Requires a DeepL Pro/Enterprise subscription.")]
        public async Task<string> RequestSession(
            [Description("Source language code, e.g. 'en'")] string sourceLanguage,
            [Description("Comma-separated target language codes, e.g. 'de,fr'")] string targetLanguages,
            [Description("Audio format descriptor (default: audio/pcm;encoding=s16le;rate=16000)")] string? sourceMediaContentType = null,
            [Description("Language mode: 'auto' or 'manual' (default: auto)")] string? sourceLanguageMode = null,
            [Description("Message format: 'json' or 'text' (default: json)")] string? messageFormat = null)
        {
            var body = new
            {
                source_language = sourceLanguage,
                target_languages = targetLanguages.Split(',').Select(s => s.Trim()).ToArray(),
                source_media_content_type = sourceMediaContentType ?? "audio/pcm;encoding=s16le;rate=16000",
                source_language_mode = sourceLanguageMode ?? "auto",
                message_format = messageFormat ?? "json",
            };

            var content = new StringContent(Json(body), Encoding.UTF8, "application/json");
            var res = await Http.PostAsync("/v3/voice/realtime", content);
            res.EnsureSuccessStatusCode();
            var json = await res.Content.ReadAsStringAsync();
            var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            var streamingUrl = root.GetProperty("streaming_url").GetString();
            var token = root.GetProperty("token").GetString();
            var sessionId = root.GetProperty("session_id").GetString();

            return Json(new
            {
                sessionId,
                token,
                streamingUrl,
                webSocketUrl = $"{streamingUrl}?token={token}",
                instructions = "Connect to webSocketUrl and stream PCM audio. Receive JSON translation messages in real time.",
            });
        }

        [McpServerTool, Description("Return documentation explaining how to use a DeepL Voice session.")]
        public string SessionInfo() => @"
## DeepL Voice WebSocket protocol

1. Call request-session to obtain webSocketUrl and token.
2. Open a WebSocket connection to webSocketUrl.
3. Send binary frames containing raw PCM audio (16-bit LE, 16 kHz mono by default).
4. Receive JSON messages:
   { ""type"": ""result""|""partial""|""done"", ""translations"": [{""language"": ""de"", ""text"": ""...""}] }
5. Send an empty binary frame to signal end of audio.

Reference: https://developers.deepl.com/api-reference/voice/websocket-streaming";
    }
}
