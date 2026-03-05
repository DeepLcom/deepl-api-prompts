#!/usr/bin/env bash
# DeepL API — List glossaries
# Usage: DEEPL_API_KEY=your-key bash curl.sh

HOST="api-free.deepl.com"   # change to api.deepl.com for paid tier
API_KEY="${DEEPL_API_KEY:?DEEPL_API_KEY is not set}"

echo "=== List all glossaries ==="
curl --silent --show-error \
  "https://${HOST}/v2/glossaries" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  | jq '.glossaries[] | { glossary_id, name, source_lang, target_lang, entry_count, ready }'
