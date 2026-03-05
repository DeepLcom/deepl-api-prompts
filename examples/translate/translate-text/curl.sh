#!/usr/bin/env bash
# DeepL API — Translate text
# Usage: DEEPL_API_KEY=your-key bash curl.sh
#
# Free-tier keys end in :fx  → use api-free.deepl.com
# Paid keys                  → use api.deepl.com

HOST="api-free.deepl.com"   # change to api.deepl.com for paid tier
API_KEY="${DEEPL_API_KEY:?DEEPL_API_KEY is not set}"

echo "=== Translate multiple strings (auto-detect source → DE) ==="
curl --silent --show-error \
  --request POST "https://${HOST}/v2/translate" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "text": [
      "Hello, world!",
      "How are you today?",
      "The quick brown fox jumps over the lazy dog."
    ],
    "target_lang": "DE"
  }' | jq '.translations[] | { detected_source_language, text }'
