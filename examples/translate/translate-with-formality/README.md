# Example: Translate with Formality

Translate text and control whether the output uses formal or informal language.

## Files

| File | Description |
|---|---|
| `curl.sh` | Minimal `curl` reference command |
| `node/` | Node.js implementation |
| `python/` | Python implementation |
| `dotnet/` | .NET / C# implementation |

## Quick start

```bash
# Node.js
cd node && npm install && DEEPL_API_KEY=your-key node index.js

# Python
cd python && pip install -r requirements.txt && DEEPL_API_KEY=your-key python main.py

# .NET
cd dotnet && DEEPL_API_KEY=your-key dotnet run
```

## What it does

1. Reads `DEEPL_API_KEY` from the environment.
2. Translates the same English sentence to German twice:
   - Once with `formality=prefer_more` (formal register).
   - Once with `formality=prefer_less` (informal register).
3. Prints both results side by side so the difference is visible.

## Prerequisites

- A DeepL API key ([sign up free](https://www.deepl.com/pro#developer))
- Node.js >= 18 **or** Python >= 3.8 **or** .NET 8 SDK

## Sample response

Formal (`formality=prefer_more`):

```json
{
  "translations": [
    {
      "detected_source_language": "EN",
      "text": "Könnten Sie mir bitte helfen?"
    }
  ]
}
```

Informal (`formality=prefer_less`):

```json
{
  "translations": [
    {
      "detected_source_language": "EN",
      "text": "Kannst du mir bitte helfen?"
    }
  ]
}
```

## Notes

- The `formality` parameter is supported only for a subset of target languages (e.g. `DE`, `FR`, `ES`, `IT`, `PT-BR`, `PT-PT`, `NL`, `PL`, `RU`, `JA`).
- Use `prefer_more` / `prefer_less` rather than `more` / `less` to avoid errors when formality is not supported for a given language.
