// DeepL API — Translate with formality (.NET / C#)
//
// Controls the formality level of the translated text.
// Supported languages include DE, FR, IT, ES, NL, PL, PT-BR, PT-PT, RU, JA, ZH.
//
// Uses the official DeepL.net NuGet package.
// https://github.com/DeepLcom/deepl-dotnet
//
// Usage:
//   DEEPL_API_KEY=your-key dotnet run

using DeepL;
using DeepL.Model;

namespace DeepLTranslateWithFormalityExample;

/// <summary>Thrown when the API key is invalid.</summary>
public sealed class AuthException(string message) : Exception(message);

/// <summary>Thrown when the character quota is exceeded.</summary>
public sealed class QuotaException(string message) : Exception(message);

public static class DeepLHelper
{
    /// <summary>
    /// Translates an array of strings with a specific formality level.
    /// </summary>
    public static async Task<TextResult[]> TranslateWithFormalityAsync(
        IEnumerable<string> texts,
        string targetLang,
        Formality formality,
        string? sourceLang = null)
    {
        var apiKey = Environment.GetEnvironmentVariable("DEEPL_API_KEY")
            ?? throw new InvalidOperationException("DEEPL_API_KEY environment variable is not set.");

        var translator = new Translator(apiKey);
        var options = new TextTranslateOptions { Formality = formality };

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
    const string text = "Could you please help me?";
    Console.WriteLine($"Source (EN): \"{text}\"\n");

    var formalResults = await DeepLHelper.TranslateWithFormalityAsync(
        [text], "DE", Formality.PreferMore, "EN");
    Console.WriteLine($"{"PreferMore",-12} → \"{formalResults[0].Text}\"");

    var informalResults = await DeepLHelper.TranslateWithFormalityAsync(
        [text], "DE", Formality.PreferLess, "EN");
    Console.WriteLine($"{"PreferLess",-12} → \"{informalResults[0].Text}\"");
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
