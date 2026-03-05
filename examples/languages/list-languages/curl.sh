#!/bin/bash
# List supported source and target languages.
# Set DEEPL_API_KEY to your DeepL API key before running this script.
# For a paid DeepL API account, change the host to api.deepl.com.

echo "Source languages:"
curl -X GET "https://api-free.deepl.com/v2/languages?type=source" \
  --header "Authorization: DeepL-Auth-Key $DEEPL_API_KEY"

echo ""
echo "Target languages:"
curl -X GET "https://api-free.deepl.com/v2/languages?type=target" \
  --header "Authorization: DeepL-Auth-Key $DEEPL_API_KEY"
