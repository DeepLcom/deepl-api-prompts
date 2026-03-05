# Example: Translate with Context

Provide surrounding context to improve translation quality for short or ambiguous strings.

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
2. Translates the word `"Save"` to German twice:
   - Without context — may produce a generic translation.
   - With `context="Save button in a document editor"` — produces a more suitable UI translation.
3. Prints both translations to highlight the difference context makes.

## Prerequisites

- A DeepL API key ([sign up free](https://www.deepl.com/pro#developer))
- Node.js >= 18 **or** Python >= 3.8 **or** .NET 8 SDK

## Sample response

Without context:

```json
{
  "translations": [
    {
      "detected_source_language": "EN",
      "text": "Sparen"
    }
  ]
}
```

With context (`"Save button in a document editor"`):

```json
{
  "translations": [
    {
      "detected_source_language": "EN",
      "text": "Speichern"
    }
  ]
}
```

## Notes

- The `context` string is never translated or included in the output; it is used only to guide the model.
- Context works best when it describes the surrounding UI, domain, or sentence purpose.
