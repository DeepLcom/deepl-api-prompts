#!/usr/bin/env bash
# DeepL API — Get glossary details
# Usage: GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key bash curl.sh

HOST="api-free.deepl.com"   # change to api.deepl.com for paid tier
API_KEY="${DEEPL_API_KEY:?DEEPL_API_KEY is not set}"
GLOSSARY_ID="${GLOSSARY_ID:?GLOSSARY_ID is not set}"

echo "=== Get glossary details ==="
curl --silent --show-error \
  "https://${HOST}/v2/glossaries/${GLOSSARY_ID}" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  | jq '{ glossary_id, name, source_lang, target_lang, entry_count, ready, creation_time }'
