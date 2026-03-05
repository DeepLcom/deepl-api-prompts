// DeepL API — Translate with context (.NET / C#)
//
// Passes an optional context hint alongside the text to improve translation
// quality. The context is not translated or billed.
//
// Uses the official DeepL.net NuGet package.
// https://github.com/DeepLcom/deepl-dotnet
//
// Usage:
//   DEEPL_API_KEY=your-key dotnet run

using DeepL;
using DeepL.Model;

namespace DeepLTranslateWithContextExample;

/// <summary>Thrown when the API key is invalid.</summary>
public sealed class AuthException(string message) : Exception(message);

/// <summary>Thrown when the character quota is exceeded.</summary>
public sealed class QuotaException(string message) : Exception(message);

public static class DeepLHelper
{
    /// <summary>
    /// Translates an array of strings with an additional context hint.
    /// </summary>
    public static async Task<TextResult[]> TranslateWithContextAsync(
        IEnumerable<string> texts,
        string targetLang,
        string context,
        string? sourceLang = null)
    {
        var apiKey = Environment.GetEnvironmentVariable("DEEPL_API_KEY")
            ?? throw new InvalidOperationException("DEEPL_API_KEY environment variable is not set.");

        var translator = new Translator(apiKey);
        var options = new TextTranslateOptions { Context = context };

        try
        {
            return await translator.TranslateTextAsync(texts, sourceLang, targetLang, options);
        }
        catch (AuthorizationException)
        {
            throw new AuthException("Invalid DeepL API key. Check your DEEPL_API_KEY.");
        }
        catch (QuotaExceededException)
        {
            throw new QuotaException("DeepL character quota exceeded for this billing period.");
        }
    }
}

// ── Entry point ─────────────────────────────────────────────────────────────

try
{
    // "Save" can mean many things; context pins the correct translation.
    const string word = "Save";
    string[] contexts =
    [
        "Button label in a document editor application",
        "Button label in a video game about rescuing animals",
    ];

    Console.WriteLine($"Source (EN): \"{word}\"\n");

    foreach (var ctx in contexts)
    {
        var results = await DeepLHelper.TranslateWithContextAsync([word], "DE", ctx, "EN");
        Console.WriteLine($"Context: \"{ctx}\"");
        Console.WriteLine($"    → \"{results[0].Text}\"\n");
    }
}
catch (AuthException ex)
{
    Console.Error.WriteLine($"[AuthError] {ex.Message}");
    Environment.Exit(1);
}
catch (QuotaException ex)
{
    Console.Error.WriteLine($"[QuotaError] {ex.Message}");
    Environment.Exit(1);
}
catch (Exception ex)
{
    Console.Error.WriteLine($"Unexpected error: {ex}");
    Environment.Exit(1);
}
