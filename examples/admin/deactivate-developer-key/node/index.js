// Deactivate a developer API key using the DeepL Admin API.
// WARNING: Deactivation is permanent — the key cannot be reactivated.
// Requires DEEPL_ADMIN_KEY and KEY_ID environment variables.

const adminKey = process.env.DEEPL_ADMIN_KEY;
const keyId = process.env.KEY_ID;

const response = await fetch(
  "https://api.deepl.com/v2/admin/developer-keys/deactivate",
  {
    method: "PUT",
    headers: {
      Authorization: `DeepL-Auth-Key ${adminKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key_id: keyId }),
  }
);

const result = await response.json();

console.log(`Key ID:          ${result.key_id}`);
console.log(`Label:           ${result.label}`);
console.log(`Is deactivated:  ${result.is_deactivated}`);
console.log(`Deactivated at:  ${result.deactivated_time ?? "N/A"}`);
