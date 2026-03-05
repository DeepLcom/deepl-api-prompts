#!/usr/bin/env bash
# DeepL API — Detect language
# Usage: DEEPL_API_KEY=your-key bash curl.sh

HOST="api-free.deepl.com"   # change to api.deepl.com for paid tier
API_KEY="${DEEPL_API_KEY:?DEEPL_API_KEY is not set}"

echo "=== Detect language for multiple strings ==="
# Translate to EN-US without source_lang to trigger auto-detection.
# The detected_source_language field in the response is what we care about.
curl --silent --show-error \
  --request POST "https://${HOST}/v2/translate" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "text": [
      "Hallo, wie geht es dir?",
      "Bonjour le monde",
      "Ciao mondo",
      "Witaj świecie",
      "Hello, world!"
    ],
    "target_lang": "EN-US"
  }' \
  | jq '[.translations[] | { detected_source_language, snippet: .text[:40] }]'
