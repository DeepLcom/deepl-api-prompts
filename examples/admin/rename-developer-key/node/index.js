// Rename a developer API key using the DeepL Admin API.
// Requires DEEPL_ADMIN_KEY and KEY_ID environment variables.

const adminKey = process.env.DEEPL_ADMIN_KEY;
const keyId = process.env.KEY_ID;
const newLabel = process.env.KEY_LABEL ?? "my-renamed-key";

const response = await fetch(
  "https://api.deepl.com/v2/admin/developer-keys/label",
  {
    method: "PUT",
    headers: {
      Authorization: `DeepL-Auth-Key ${adminKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key_id: keyId, label: newLabel }),
  }
);

const result = await response.json();

console.log(`Key ID:  ${result.key_id}`);
console.log(`Label:   ${result.label}`);
