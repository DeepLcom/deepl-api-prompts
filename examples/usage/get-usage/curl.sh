#!/bin/bash
# Retrieve usage and quota for the current billing period.
# Set DEEPL_API_KEY to your DeepL API key before running this script.
# For a paid DeepL API account, change the host to api.deepl.com.

curl -X GET "https://api-free.deepl.com/v2/usage" \
  --header "Authorization: DeepL-Auth-Key $DEEPL_API_KEY"
