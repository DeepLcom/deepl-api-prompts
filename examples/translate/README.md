# Example: Translate Text

Demonstrates translating one or more strings with the DeepL API.

## Files

| File | Description |
|---|---|
| `openapi.yaml` | OpenAPI 3.1 snippet for the translate endpoint |
| `curls.sh` | Minimal `curl` reference commands |
| `node/` | Node.js example using the official `deepl-node` SDK |
| `python/` | Python example using the official `deepl` SDK |
| `dotnet/` | .NET example using the `DeepL.net` NuGet package |

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
2. Detects the API tier (free vs. paid) from the key.
3. Translates `["Hello, world!", "How are you today?"]` to German (`DE`).
4. Prints the detected source language and translated text.
5. Demonstrates error handling for auth failures and quota errors.
