"""
Retrieve usage analytics for the organisation using the DeepL Admin API.
Requires DEEPL_ADMIN_KEY environment variable.
Optionally set START_DATE and END_DATE (ISO 8601 format, e.g. 2025-01-01).
"""

import os
import urllib.request
import urllib.parse
import json
from datetime import date, timedelta

admin_key = os.environ["DEEPL_ADMIN_KEY"]

today = date.today()
start_date = os.environ.get("START_DATE", (today - timedelta(days=30)).isoformat())
end_date = os.environ.get("END_DATE", today.isoformat())

params = urllib.parse.urlencode({
    "start_date": start_date,
    "end_date": end_date,
    "group_by": "key",
})

request = urllib.request.Request(
    f"https://api.deepl.com/v2/admin/analytics?{params}",
    headers={"Authorization": f"DeepL-Auth-Key {admin_key}"},
    method="GET",
)

with urllib.request.urlopen(request) as response:
    result = json.loads(response.read())

report = result.get("usage_report", {})
total = report.get("total_usage", {})
print(f"Period: {start_date} to {end_date}")
print(f"Total characters:               {total.get('total_characters', 0):,}")
print(f"Text translation characters:    {total.get('text_translation_characters', 0):,}")
print(f"Document translation characters:{total.get('document_translation_characters', 0):,}")
print(f"Text improvement characters:    {total.get('text_improvement_characters', 0):,}")
