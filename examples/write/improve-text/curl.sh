#!/bin/bash
# Improve text using the DeepL Write API.
# Requires a DeepL API Pro subscription (not available on Free tier).
# Set DEEPL_API_KEY to your DeepL API key before running this script.

curl -X POST "https://api.deepl.com/v2/write/rephrase" \
  --header "Authorization: DeepL-Auth-Key $DEEPL_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{
    "text": ["The quick brwon fox jumpd over the lazzy dog."],
    "target_lang": "en-US"
  }'
