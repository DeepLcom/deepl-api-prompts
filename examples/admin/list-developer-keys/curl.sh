#!/bin/bash
# List all developer API keys using the Admin API.
# Requires an Admin API key (set DEEPL_ADMIN_KEY).

curl -X GET "https://api.deepl.com/v2/admin/developer-keys" \
  --header "Authorization: DeepL-Auth-Key $DEEPL_ADMIN_KEY" \
  --header "Content-Type: application/json"
