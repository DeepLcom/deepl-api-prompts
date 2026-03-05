# Example: Translate Text

Translate one or more plain-text strings into a target language using the DeepL Translate API.

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
2. Sends two English strings to `POST /v2/translate` with `target_lang=DE`.
3. Prints each translated result along with the detected source language.

## Prerequisites

- A DeepL API key ([sign up free](https://www.deepl.com/pro#developer))
- Node.js >= 18 **or** Python >= 3.8 **or** .NET 8 SDK

## Sample response

```json
{
  "translations": [
    {
      "detected_source_language": "EN",
      "text": "Hallo, Welt!"
    },
    {
      "detected_source_language": "EN",
      "text": "Die Übersetzungs-API ist einfach zu benutzen."
    }
  ]
}
```
