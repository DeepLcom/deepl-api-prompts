// Retrieve usage analytics for the organisation using the DeepL Admin API.
// Requires DEEPL_ADMIN_KEY environment variable.
// Optionally set START_DATE and END_DATE (ISO 8601 format, e.g. 2025-01-01).

const adminKey = process.env.DEEPL_ADMIN_KEY;

const today = new Date();
const thirtyDaysAgo = new Date(today);
thirtyDaysAgo.setDate(today.getDate() - 30);

const startDate =
  process.env.START_DATE ?? thirtyDaysAgo.toISOString().split("T")[0];
const endDate = process.env.END_DATE ?? today.toISOString().split("T")[0];

const params = new URLSearchParams({
  start_date: startDate,
  end_date: endDate,
  group_by: "key",
});

const response = await fetch(
  `https://api.deepl.com/v2/admin/analytics?${params}`,
  {
    method: "GET",
    headers: { Authorization: `DeepL-Auth-Key ${adminKey}` },
  }
);

const result = await response.json();

const report = result.usage_report ?? {};
const total = report.total_usage ?? {};
console.log(`Period: ${startDate} to ${endDate}`);
console.log(`Total characters:                ${total.total_characters ?? 0}`);
console.log(
  `Text translation characters:     ${total.text_translation_characters ?? 0}`
);
console.log(
  `Document translation characters: ${total.document_translation_characters ?? 0}`
);
console.log(
  `Text improvement characters:     ${total.text_improvement_characters ?? 0}`
);
