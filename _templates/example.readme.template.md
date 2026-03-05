# Example: <Feature Name>

<!--
  Instructions for contributors:
  1. Replace <Feature Name> with the DeepL feature this example covers.
  2. Fill in all sections. Remove HTML comments before committing.
  3. Place this README.md at the root of your example directory,
     e.g. examples/my-feature/my-variant/README.md
-->

<!-- One-sentence description of what this example demonstrates. -->

## Files

<!--
  List every file in this directory with a short description.
  Adjust the table rows to match your actual files.
-->

| File | Description |
|---|---|
| `curl.sh` | Minimal `curl` reference commands |
| `node/` | Node.js implementation (`deepl-node`) |
| `python/` | Python implementation (`deepl`) |
| `dotnet/` | .NET / C# implementation (`DeepL.net`) — include if adding .NET |

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
2. Auto-selects the correct API host: keys ending in `:fx` use `api-free.deepl.com`, otherwise `api.deepl.com`.
3. <!-- Step 3 -->
4. Handles errors: 403 (auth), 456 (quota exceeded), 429 (rate limit — retries with exponential back-off).

## Sample response

<!--
  Paste the exact raw JSON (or other format) returned by the API for this example.
  Use a fenced code block with the appropriate language tag (json, tsv, etc.).
  For multi-step flows (e.g. document translation) add one block per step.
  For endpoints that return an empty body (e.g. HTTP 204), document that explicitly.
-->

```json
{
  "key": "value"
}
```

## Prerequisites

- A DeepL API key ([sign up free](https://www.deepl.com/pro#developer))
- <!-- Any language-specific prerequisite: Node >= 18, Python >= 3.10, .NET 8 SDK, etc. -->

## Notes

<!--
  Any gotchas, performance notes, or things the user should know before running.
  Delete this section if there's nothing to add.
-->

- <!-- Note 1 -->
