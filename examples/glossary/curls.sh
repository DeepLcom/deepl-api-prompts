#!/usr/bin/env bash
# DeepL API — Glossary operations
# Usage: DEEPL_API_KEY=your-key bash curls.sh

HOST="api-free.deepl.com"   # change to api.deepl.com for paid tier
API_KEY="${DEEPL_API_KEY:?DEEPL_API_KEY is not set}"

# ── 1. List supported glossary language pairs ──────────────────────────────
echo "=== Supported glossary language pairs ==="
curl --silent --show-error \
  "https://${HOST}/v2/glossary-language-pairs" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  | jq '.supported_languages | map("\(.source_lang) → \(.target_lang)") | .[:10]'

# ── 2. Create a glossary (TSV format) ─────────────────────────────────────
echo ""
echo "=== Create glossary ==="
GLOSSARY_RESPONSE=$(curl --silent --show-error \
  --request POST "https://${HOST}/v2/glossaries" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "name": "Car Terminology EN-DE (curl demo)",
    "source_lang": "EN",
    "target_lang": "DE",
    "entries": "automobile\tAuto\ngasoline\tBenzin\nhood\tMotorhaube\ntrunk\tKofferraum\nwindshield\tWindschutzscheibe",
    "entries_format": "tsv"
  }')
echo "${GLOSSARY_RESPONSE}" | jq .
GLOSSARY_ID=$(echo "${GLOSSARY_RESPONSE}" | jq -r '.glossary_id')
echo "Created glossary_id: ${GLOSSARY_ID}"

# ── 3. List all glossaries ────────────────────────────────────────────────
echo ""
echo "=== List all glossaries ==="
curl --silent --show-error \
  "https://${HOST}/v2/glossaries" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  | jq '.glossaries[] | { glossary_id, name, source_lang, target_lang, entry_count, ready }'

# ── 4. Get glossary details ───────────────────────────────────────────────
echo ""
echo "=== Get glossary details ==="
curl --silent --show-error \
  "https://${HOST}/v2/glossaries/${GLOSSARY_ID}" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  | jq .

# ── 5. Get glossary entries ───────────────────────────────────────────────
echo ""
echo "=== Glossary entries (TSV) ==="
curl --silent --show-error \
  "https://${HOST}/v2/glossaries/${GLOSSARY_ID}/entries" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  --header "Accept: text/tab-separated-values"

# ── 6. Translate using the glossary ──────────────────────────────────────
echo ""
echo "=== Translate using glossary ==="
curl --silent --show-error \
  --request POST "https://${HOST}/v2/translate" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  --header "Content-Type: application/json" \
  --data "{
    \"text\": [\"The automobile runs on gasoline.\", \"Open the hood and check the windshield.\"],
    \"source_lang\": \"EN\",
    \"target_lang\": \"DE\",
    \"glossary_id\": \"${GLOSSARY_ID}\"
  }" | jq '.translations[].text'

# ── 7. Delete glossary (commented out for safety) ────────────────────────
# echo ""
# echo "=== Delete glossary ==="
# curl --silent --show-error \
#   --request DELETE "https://${HOST}/v2/glossaries/${GLOSSARY_ID}" \
#   --header "Authorization: DeepL-Auth-Key ${API_KEY}"
# echo "Deleted ${GLOSSARY_ID}"
