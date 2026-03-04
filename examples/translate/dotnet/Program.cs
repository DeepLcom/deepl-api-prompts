// DeepL API — Translate text (.NET / C#)
//
// Uses the official DeepL.net NuGet package.
// https://github.com/DeepLcom/deepl-dotnet
//
// Usage:
//   DEEPL_API_KEY=your-key dotnet run

using DeepL;
using DeepL.Model;

namespace DeepLTranslateExample;

// ── Custom exceptions ───────────────────────────────────────────────────────

/// <summary>Thrown when the API key is invalid.</summary>
public sealed class AuthException(string message) : Exception(message);

/// <summary>Thrown when the character quota is exceeded.</summary>
public sealed class QuotaException(string message) : Exception(message);

// ── Translation helper ──────────────────────────────────────────────────────

public static class DeepLHelper
{
    /// <summary>
    /// Translates an array of strings using the DeepL API.
    /// </summary>
    /// <param name="texts">Strings to translate.</param>
    /// <param name="targetLang">Target language code, e.g. "DE", "FR".</param>
    /// <param name="sourceLang">Optional source language code. Null to auto-detect.</param>
    /// <param name="formality">Optional formality override.</param>
    /// <returns>Array of <see cref="TextResult"/> in input order.</returns>
    /// <exception cref="AuthException">API key is invalid.</exception>
    /// <exception cref="QuotaException">Character quota exceeded.</exception>
    public static async Task<TextResult[]> TranslateTextsAsync(
        IEnumerable<string> texts,
        string targetLang,
        string? sourceLang = null,
        Formality formality = Formality.Default)
    {
        var apiKey = Environment.GetEnvironmentVariable("DEEPL_API_KEY")
            ?? throw new InvalidOperationException("DEEPL_API_KEY environment variable is not set.");

        var translator = new Translator(apiKey);

        var options = new TextTranslateOptions
        {
            Formality = formality,
        };

        try
        {
            return await translator.TranslateTextAsync(texts, sourceLang, targetLang, options);
        }
        catch (AuthorizationException ex)
        {
            throw new AuthException("Invalid DeepL API key. Check your DEEPL_API_KEY.") { };
        }
        catch (QuotaExceededException ex)
        {
            throw new QuotaException("DeepL character quota exceeded for this billing period.");
        }
    }
}

// ── Entry point ─────────────────────────────────────────────────────────────

try
{
    var texts = new[]
    {
        "Hello, world!",
        "How are you today?",
        "The quick brown fox jumps over the lazy dog.",
    };

    Console.WriteLine($"Translating {texts.Length} string(s) → DE\n");

    var results = await DeepLHelper.TranslateTextsAsync(texts, "DE");

    for (var i = 0; i < texts.Length; i++)
    {
        Console.WriteLine($"[{i + 1}] ({results[i].DetectedSourceLanguageCode}) \"{texts[i]}\"");
        Console.WriteLine($"    → \"{results[i].Text}\"\n");
    }

    // Demonstrate formality
    Console.WriteLine("── Formality example ────────────────────────────────────");

    var [formal] = await DeepLHelper.TranslateTextsAsync(
        ["Could you please help me?"], "DE", "EN", Formality.PreferMore);

    var [informal] = await DeepLHelper.TranslateTextsAsync(
        ["Could you please help me?"], "DE", "EN", Formality.PreferLess);

    Console.WriteLine($"PreferMore → \"{formal.Text}\"");
    Console.WriteLine($"PreferLess → \"{informal.Text}\"");
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
