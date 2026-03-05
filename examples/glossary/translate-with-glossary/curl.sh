#!/usr/bin/env bash
# DeepL API — Translate using a glossary
# Usage: GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key bash curl.sh

HOST="api-free.deepl.com"   # change to api.deepl.com for paid tier
API_KEY="${DEEPL_API_KEY:?DEEPL_API_KEY is not set}"
GLOSSARY_ID="${GLOSSARY_ID:?GLOSSARY_ID is not set}"

echo "=== Translate using glossary ==="
curl --silent --show-error \
  --request POST "https://${HOST}/v2/translate" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  --header "Content-Type: application/json" \
  --data "{
    \"text\": [
      \"The automobile runs on gasoline.\",
      \"Open the hood and check the windshield.\"
    ],
    \"source_lang\": \"EN\",
    \"target_lang\": \"DE\",
    \"glossary_id\": \"${GLOSSARY_ID}\"
  }" | jq '.translations[].text'
