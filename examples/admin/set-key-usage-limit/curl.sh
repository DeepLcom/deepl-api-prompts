#!/bin/bash
# Set a character usage limit on a developer API key using the Admin API.
# Requires an Admin API key (set DEEPL_ADMIN_KEY).
# Set KEY_ID to the key ID (format: GUID:GUID).
# Set CHAR_LIMIT to a positive integer, 0 to block the key, or null to remove the limit.

curl -X PUT "https://api.deepl.com/v2/admin/developer-keys/limits" \
  --header "Authorization: DeepL-Auth-Key $DEEPL_ADMIN_KEY" \
  --header "Content-Type: application/json" \
  --data "{
    \"key_id\": \"$KEY_ID\",
    \"characters\": 1000000
  }"
