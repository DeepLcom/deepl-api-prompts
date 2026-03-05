// Create a new developer API key using the DeepL Admin API.
// Requires an Admin API key (set DEEPL_ADMIN_KEY environment variable).
// The Admin API is available only to a limited set of Pro API subscribers.

const adminKey = process.env.DEEPL_ADMIN_KEY;

const response = await fetch("https://api.deepl.com/v2/admin/developer-keys", {
  method: "POST",
  headers: {
    Authorization: `DeepL-Auth-Key ${adminKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ label: "new-developer-key" }),
});

const result = await response.json();

console.log(`Key ID:      ${result.key_id}`);
console.log(`Label:       ${result.label}`);
console.log(`Created at:  ${result.creation_time}`);
