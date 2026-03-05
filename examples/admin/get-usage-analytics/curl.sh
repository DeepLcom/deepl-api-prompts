#!/bin/bash
# Retrieve usage analytics for the organisation using the Admin API.
# Requires an Admin API key (set DEEPL_ADMIN_KEY).
# Adjust START_DATE and END_DATE as needed (ISO 8601 format).

curl -X GET "https://api.deepl.com/v2/admin/analytics?start_date=2025-01-01&end_date=2025-01-31&group_by=key" \
  --header "Authorization: DeepL-Auth-Key $DEEPL_ADMIN_KEY"
