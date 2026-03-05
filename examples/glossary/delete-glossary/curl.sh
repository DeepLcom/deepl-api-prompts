#!/usr/bin/env bash
# DeepL API — Delete a glossary
# Usage: GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key bash curl.sh

HOST="api-free.deepl.com"   # change to api.deepl.com for paid tier
API_KEY="${DEEPL_API_KEY:?DEEPL_API_KEY is not set}"
GLOSSARY_ID="${GLOSSARY_ID:?GLOSSARY_ID is not set}"

echo "=== Delete glossary ${GLOSSARY_ID} ==="
curl --silent --show-error \
  --request DELETE "https://${HOST}/v2/glossaries/${GLOSSARY_ID}" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  --write-out "\nHTTP status: %{http_code}\n"
echo "Done."
