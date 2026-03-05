#!/usr/bin/env bash
# DeepL API — List supported glossary language pairs
# Usage: DEEPL_API_KEY=your-key bash curl.sh

HOST="api-free.deepl.com"   # change to api.deepl.com for paid tier
API_KEY="${DEEPL_API_KEY:?DEEPL_API_KEY is not set}"

echo "=== Supported glossary language pairs ==="
curl --silent --show-error \
  "https://${HOST}/v2/glossary-language-pairs" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  | jq '.supported_languages | map("\(.source_lang) → \(.target_lang)")'
