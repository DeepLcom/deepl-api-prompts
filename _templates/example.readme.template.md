# Example: <Feature Name>

<!--
  Instructions for contributors:
  1. Replace <Feature Name> with the DeepL feature this example covers.
  2. Fill in all sections. Remove HTML comments before committing.
  3. Place this README.md at the root of your example directory,
     e.g. examples/my-feature/README.md
-->

<!-- One-sentence description of what this example demonstrates. -->

## Files

<!--
  List every file in this directory with a short description.
  Adjust the table rows to match your actual files.
-->

| File | Description |
|---|---|
| `curls.sh` | Minimal `curl` reference commands |
| `openapi.yaml` | OpenAPI 3.1 snippet (optional — include if the endpoint is complex) |
| `node/` | Node.js implementation |
| `python/` | Python implementation |
| `dotnet/` | .NET / C# implementation (optional) |

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

<!--
  Step-by-step numbered list of what the example code actually does.
  Keep it brief — 3 to 7 steps.
-->

1. Reads `DEEPL_API_KEY` from the environment.
2. <!-- Step 2 -->
3. <!-- Step 3 -->
4. Handles errors for auth failures and quota exceeded.

## Prerequisites

- A DeepL API key ([sign up free](https://www.deepl.com/pro#developer))
- <!-- Any language-specific prerequisite: Node >= 18, Python >= 3.10, .NET 8 SDK, etc. -->

## Notes

<!--
  Any gotchas, performance notes, or things the user should know before running.
  Delete this section if there's nothing to add.
-->

- <!-- Note 1 -->
