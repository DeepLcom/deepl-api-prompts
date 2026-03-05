#!/usr/bin/env bash
# DeepL API — Translate with context
# Usage: DEEPL_API_KEY=your-key bash curl.sh
#
# Free-tier keys end in :fx  → use api-free.deepl.com
# Paid keys                  → use api.deepl.com

HOST="api-free.deepl.com"   # change to api.deepl.com for paid tier
API_KEY="${DEEPL_API_KEY:?DEEPL_API_KEY is not set}"

echo "=== Translate with context: document editor ==="
curl --silent --show-error \
  --request POST "https://${HOST}/v2/translate" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "text": ["Save"],
    "source_lang": "EN",
    "target_lang": "DE",
    "context": "Button label in a document editor application"
  }' | jq '.translations[0].text'

echo ""
echo "=== Translate with context: video game ==="
curl --silent --show-error \
  --request POST "https://${HOST}/v2/translate" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "text": ["Save"],
    "source_lang": "EN",
    "target_lang": "DE",
    "context": "Button label in a video game about rescuing animals"
  }' | jq '.translations[0].text'
