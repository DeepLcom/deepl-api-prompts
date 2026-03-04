# Example: Glossaries

Demonstrates creating a glossary, listing glossaries, and using a glossary in translation.

## Files

| File | Description |
|---|---|
| `curls.sh` | Minimal `curl` reference for all glossary endpoints |
| `node/` | Node.js example (create, list, translate with glossary, delete) |
| `python/` | Python example (create, list, translate with glossary, delete) |

## Quick start

```bash
# Node.js
cd node && npm install && DEEPL_API_KEY=your-key node index.js

# Python
cd python && pip install -r requirements.txt && DEEPL_API_KEY=your-key python main.py
```

## What it does

1. Checks which language pairs support glossaries.
2. Creates an EN→DE glossary with five car-terminology entries.
3. Lists all glossaries and prints a summary table.
4. Translates two sentences using the new glossary.
5. Prints the glossary entries.
6. Deletes the glossary (commented out by default — uncomment to run).

## Glossary language pairs

Not all language pairs support glossaries. The examples fetch the supported pairs from `GET /v2/glossary-language-pairs` and validate before creating.
