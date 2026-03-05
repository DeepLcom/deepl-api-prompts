/**
 * DeepL API — Delete a glossary (Node.js)
 *
 * Permanently deletes a glossary by its ID. This action cannot be undone.
 *
 * Usage:
 *   GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key node index.js
 */

"use strict";

const deepl = require("deepl-node");

/**
 * Permanently deletes a glossary.
 *
 * @param {string} glossaryId
 * @returns {Promise<void>}
 */
async function deleteGlossary(glossaryId) {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) throw new Error("DEEPL_API_KEY environment variable is not set.");

  const translator = new deepl.Translator(apiKey);
  const info = await translator.getGlossary(glossaryId);
  await translator.deleteGlossary(info);
}

// ── Demo ────────────────────────────────────────────────────────────────────

async function main() {
  const glossaryId = process.env.GLOSSARY_ID;
  if (!glossaryId) {
    console.error("Usage: GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key node index.js");
    process.exit(1);
  }

  await deleteGlossary(glossaryId);
  console.log(`Glossary ${glossaryId} deleted successfully.`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
