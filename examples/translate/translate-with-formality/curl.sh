#!/usr/bin/env bash
# DeepL API — Translate with formality
# Usage: DEEPL_API_KEY=your-key bash curl.sh
#
# Free-tier keys end in :fx  → use api-free.deepl.com
# Paid keys                  → use api.deepl.com

HOST="api-free.deepl.com"   # change to api.deepl.com for paid tier
API_KEY="${DEEPL_API_KEY:?DEEPL_API_KEY is not set}"

echo "=== Translate with formality: prefer_more (formal) ==="
curl --silent --show-error \
  --request POST "https://${HOST}/v2/translate" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "text": ["Could you please help me?"],
    "source_lang": "EN",
    "target_lang": "DE",
    "formality": "prefer_more"
  }' | jq '.translations[0].text'

echo ""
echo "=== Translate with formality: prefer_less (informal) ==="
curl --silent --show-error \
  --request POST "https://${HOST}/v2/translate" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "text": ["Could you please help me?"],
    "source_lang": "EN",
    "target_lang": "DE",
    "formality": "prefer_less"
  }' | jq '.translations[0].text'
