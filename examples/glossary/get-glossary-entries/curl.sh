#!/usr/bin/env bash
# DeepL API — Get glossary entries
# Usage: GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key bash curl.sh

HOST="api-free.deepl.com"   # change to api.deepl.com for paid tier
API_KEY="${DEEPL_API_KEY:?DEEPL_API_KEY is not set}"
GLOSSARY_ID="${GLOSSARY_ID:?GLOSSARY_ID is not set}"

echo "=== Glossary entries (TSV) ==="
curl --silent --show-error \
  "https://${HOST}/v2/glossaries/${GLOSSARY_ID}/entries" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  --header "Accept: text/tab-separated-values"
echo ""
