// Set a character usage limit on a developer API key using the DeepL Admin API.
// Requires DEEPL_ADMIN_KEY and KEY_ID environment variables.
// Set CHAR_LIMIT to a number, "0" to block the key, or "null" to remove the limit.

const adminKey = process.env.DEEPL_ADMIN_KEY;
const keyId = process.env.KEY_ID;
const charLimitEnv = process.env.CHAR_LIMIT ?? "1000000";
const characters = charLimitEnv === "null" ? null : parseInt(charLimitEnv, 10);

const response = await fetch(
  "https://api.deepl.com/v2/admin/developer-keys/limits",
  {
    method: "PUT",
    headers: {
      Authorization: `DeepL-Auth-Key ${adminKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key_id: keyId, characters }),
  }
);

const result = await response.json();

console.log(`Key ID:        ${result.key_id}`);
console.log(`Label:         ${result.label}`);
console.log(`Usage limits:  ${JSON.stringify(result.usage_limits ?? {})}`);
