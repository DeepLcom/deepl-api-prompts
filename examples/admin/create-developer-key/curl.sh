#!/bin/bash
# Create a new developer API key using the Admin API.
# Requires an Admin API key (set DEEPL_ADMIN_KEY).
# The Admin API is available only to a limited set of Pro API subscribers.

curl -X POST "https://api.deepl.com/v2/admin/developer-keys" \
  --header "Authorization: DeepL-Auth-Key $DEEPL_ADMIN_KEY" \
  --header "Content-Type: application/json" \
  --data '{
    "label": "new-developer-key"
  }'
