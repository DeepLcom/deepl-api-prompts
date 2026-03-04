#!/usr/bin/env bash
# DeepL API — Translate text
# Usage: DEEPL_API_KEY=your-key bash curls.sh
#
# Free-tier keys end in :fx  → use api-free.deepl.com
# Paid keys                  → use api.deepl.com
# Adjust the host below to match your key.

# ── Configuration ──────────────────────────────────────────────────────────────
HOST="api-free.deepl.com"          # change to api.deepl.com for paid tier
API_KEY="${DEEPL_API_KEY:?DEEPL_API_KEY is not set}"

# ── 1. Translate a single string ───────────────────────────────────────────────
echo "=== Translate single string ==="
curl --silent --show-error \
  --request POST "https://${HOST}/v2/translate" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "text": ["Hello, world!"],
    "target_lang": "DE"
  }' | jq .

# ── 2. Translate multiple strings with explicit source language ────────────────
echo ""
echo "=== Translate multiple strings (EN → FR) ==="
curl --silent --show-error \
  --request POST "https://${HOST}/v2/translate" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "text": ["Good morning", "How are you?", "Thank you very much."],
    "source_lang": "EN",
    "target_lang": "FR"
  }' | jq .

# ── 3. Translate with formality ────────────────────────────────────────────────
echo ""
echo "=== Translate with formality (prefer_less → DE) ==="
curl --silent --show-error \
  --request POST "https://${HOST}/v2/translate" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "text": ["Could you help me?"],
    "source_lang": "EN",
    "target_lang": "DE",
    "formality": "prefer_less"
  }' | jq .

# ── 4. Translate with context ──────────────────────────────────────────────────
echo ""
echo "=== Translate with context ==="
curl --silent --show-error \
  --request POST "https://${HOST}/v2/translate" \
  --header "Authorization: DeepL-Auth-Key ${API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "text": ["Save"],
    "source_lang": "EN",
    "target_lang": "DE",
    "context": "Button label in a document editor application"
  }' | jq .
