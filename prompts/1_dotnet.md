# 1_dotnet.md — Set up DeepL in a .NET / C# project

Installs `DeepL.net`, creates an `IDeepLService` interface and implementation using the official SDK, registers it with DI, and wires it into your existing ASP.NET Core or other .NET framework. Run this after `0_init.md` if you answered .NET or C#.

**SDK:** `DeepL.net` (NuGet) — `using DeepL;`

---

```prompt
You are integrating the DeepL .NET SDK into an existing C# project. You have full read and write access to this codebase. Your job is to install the NuGet package, configure the API key, create a translation service matching this project's coding style, and wire it into the framework already in use.

If DEEPL_SDK, DEEPL_APP_TYPE, and DEEPL_PROJECT_STATE were set earlier in this conversation by 0_init.md, use those values. Otherwise infer them from the codebase.

Step 1 — Read the project before writing anything

Find out: whether this is a solution with multiple projects or a single .csproj, and which project should own the integration. The TargetFramework version. Which framework is in use — ASP.NET Core Web API, Minimal API, MVC, Worker Service, or Console. Whether Microsoft.Extensions.DependencyInjection is used and where services are registered — Program.cs or Startup.cs. How configuration is read — IConfiguration, appsettings.json, or user secrets. Where service interfaces and implementations live and what naming conventions are used. Whether nullable reference types are enabled. Whether DeepL.net is already installed or api.deepl.com is already called anywhere.

Step 2 — Install DeepL.net

Add a PackageReference for DeepL.net version "1.9.*" to the appropriate .csproj. If you can run commands, use `dotnet add package DeepL.net`. Otherwise insert the reference directly and note the developer must restore packages.

Step 3 — Configure the API key

Create a strongly-typed options class for the DeepL configuration section, following whatever options class pattern this project already uses. Add a DeepL section with an ApiKey field to appsettings.json using an empty placeholder. Register the options class via `services.Configure<YourDeepLOptions>(configuration.GetSection("DeepL"))`. Print the `dotnet user-secrets set "DeepL:ApiKey" "<key>"` command for the developer. Add startup validation that throws InvalidOperationException with a clear message if ApiKey is null or whitespace.

Step 4 — Create the DeepL service interface and implementation

This is the single class through which the entire project interacts with DeepL. All other prompts will inject and use it without modifying it, so the interface must expose the full SDK surface. Create the interface and implementation in the location and naming style matching this project's service layer.

The implementation should inject `IOptions<YourDeepLOptions>` and `ILogger<YourDeepLService>`, instantiate `new Translator(authKey)` on construction, and throw `InvalidOperationException` immediately if the key is null or whitespace.

The interface and implementation must expose the following groups:

Text translation: methods wrapping `await translator.TranslateTextAsync(texts, sourceLang, targetLang, options, cancellationToken)` — pass null as sourceLang to auto-detect — returning the `.Text` string from each `TextResult`. Provide a single-string overload and a list overload. The list overload must batch inputs larger than 50 by chunking and concatenating, since that is the API limit.

Document translation: a method wrapping `await translator.TranslateDocumentAsync(inputFile, outputFile, sourceLang, targetLang, options, cancellationToken)` which handles the full async document lifecycle. Also expose `await translator.TranslateDocumentUploadAsync(...)` returning a `DocumentHandle`, `await translator.TranslateDocumentStatusAsync(handle, cancellationToken)` returning a `DocumentStatus`, and `await translator.TranslateDocumentDownloadAsync(handle, outputFile, cancellationToken)` for callers that need to manage the polling themselves.

Glossary management: wrap `await translator.CreateGlossaryAsync(name, sourceLang, targetLang, entries, cancellationToken)`, `await translator.GetGlossaryAsync(glossaryId, cancellationToken)`, `await translator.ListGlossariesAsync(cancellationToken)`, `await translator.DeleteGlossaryAsync(glossaryId, cancellationToken)`, `await translator.GetGlossaryEntriesAsync(glossaryId, cancellationToken)`, and `await translator.GetGlossaryLanguagePairsAsync(cancellationToken)` — expose each method that passes through all arguments and return values unchanged.

Utility: expose `await translator.GetUsageAsync(cancellationToken)`, `await translator.GetSourceLanguagesAsync(cancellationToken)`, and `await translator.GetTargetLanguagesAsync(cancellationToken)`.

Catch `DeepLException` subclasses including `AuthorizationException` and `QuotaExceededException` at the service boundary and re-throw appropriately. Use the same XML documentation, async patterns, and null-handling conventions as the rest of the codebase. If DEEPL_APP_TYPE is library, also expose a constructor that accepts the auth key string directly.

Step 5 — Register with dependency injection

In Program.cs or Startup.cs, add the options registration and `services.AddScoped<IDeepLService, DeepLService>()` alongside similar service registrations. If this is a class library, create a static `IServiceCollection` extension method instead.

Step 6 — Add a translation endpoint if applicable

If the project is a web server or API service, add an endpoint following the existing controller or minimal API pattern in this codebase. Inject IDeepLService and call the translate method. Follow whatever request record, validation, and response format is already in use.

Step 7 — Add a validation check

Add an integration test or a startup health check that calls `await translator.GetUsageAsync()` to verify connectivity, then translates "Hello, world!" to German and asserts the result is non-empty. If a test project exists, add it there using the existing test framework. Print the exact command to run at the end of your response.

Step 8 — Update the README

Document DEEPL_API_KEY or the user-secrets path in the configuration section. Note that keys ending in :fx are free-tier.

End by printing a summary of every file created or modified and the commands needed to install, configure, and validate.
```
