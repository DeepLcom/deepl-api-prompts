#!/usr/bin/env bash
# DeepL API — Create a glossary
# Usage: DEEPL_API_KEY=your-key bash curl.sh

HOST="api-free.deepl.com"   # change to api.deepl.com for paid tier
API_KEY="${DEEPL_API_KEY:?DEEPL_API_KEY is not set}"

echo "=== Create glossary ==="
curl --silent --show-error \
  --request POST "https://${HOST}/v2/glossaries" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "name": "Car Terminology EN-DE",
    "source_lang": "EN",
    "target_lang": "DE",
    "entries": "automobile\tAuto\ngasoline\tBenzin\nhood\tMotorhaube\ntrunk\tKofferraum\nwindshield\tWindschutzscheibe",
    "entries_format": "tsv"
  }' | jq '{ glossary_id, name, source_lang, target_lang, entry_count, ready }'
