# Example: Translate with Glossary

Translate text using a custom glossary to enforce specific terminology.

## Files

| File | Description |
|---|---|
| `curl.sh` | Minimal `curl` reference command |
| `node/` | Node.js implementation |
| `python/` | Python implementation |

## Quick start

```bash
# Node.js
cd node && npm install && DEEPL_API_KEY=your-key GLOSSARY_ID=your-glossary-id node index.js

# Python
cd python && pip install -r requirements.txt && DEEPL_API_KEY=your-key GLOSSARY_ID=your-glossary-id python main.py
```

## What it does

1. Reads `DEEPL_API_KEY` and `GLOSSARY_ID` from the environment.
2. Calls `POST /v2/translate` with `target_lang=DE` and the `glossary_id` parameter set.
3. Prints the translated text, which respects the terminology defined in the glossary.

## Prerequisites

- A DeepL API key ([sign up free](https://www.deepl.com/pro#developer))
- An existing glossary ID — run the `create-glossary` example first
- Node.js >= 18 **or** Python >= 3.8

## Sample response

```json
{
  "translations": [
    {
      "detected_source_language": "EN",
      "text": "Hallo, vielen Dank für Ihren Besuch auf unserer Website."
    }
  ]
}
```

## Notes

- The `source_lang` must match the glossary's source language exactly; passing the wrong language returns an error.
- A glossary only affects terms that are listed in it; all other words are translated normally.
