#!/bin/bash
# Rename a developer API key using the Admin API.
# Requires an Admin API key (set DEEPL_ADMIN_KEY).
# Set KEY_ID to the key ID to rename (format: GUID:GUID).

curl -X PUT "https://api.deepl.com/v2/admin/developer-keys/label" \
  --header "Authorization: DeepL-Auth-Key $DEEPL_ADMIN_KEY" \
  --header "Content-Type: application/json" \
  --data "{
    \"key_id\": \"$KEY_ID\",
    \"label\": \"my-renamed-key\"
  }"
