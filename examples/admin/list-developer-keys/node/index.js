// List all developer API keys using the DeepL Admin API.
// Requires an Admin API key (set DEEPL_ADMIN_KEY environment variable).

const adminKey = process.env.DEEPL_ADMIN_KEY;

const response = await fetch("https://api.deepl.com/v2/admin/developer-keys", {
  method: "GET",
  headers: {
    Authorization: `DeepL-Auth-Key ${adminKey}`,
    "Content-Type": "application/json",
  },
});

const keys = await response.json();

console.log(`Found ${keys.length} developer key(s):`);
for (const key of keys) {
  const status = key.is_deactivated ? "deactivated" : "active";
  console.log(`  [${status}] ${key.label} (ID: ${key.key_id})`);
}
