#!/bin/bash
# Deactivate a developer API key using the Admin API.
# WARNING: Deactivation is permanent — the key cannot be reactivated.
# Requires an Admin API key (set DEEPL_ADMIN_KEY).
# Set KEY_ID to the key ID to deactivate (format: GUID:GUID).

curl -X PUT "https://api.deepl.com/v2/admin/developer-keys/deactivate" \
  --header "Authorization: DeepL-Auth-Key $DEEPL_ADMIN_KEY" \
  --header "Content-Type: application/json" \
  --data "{
    \"key_id\": \"$KEY_ID\"
  }"
