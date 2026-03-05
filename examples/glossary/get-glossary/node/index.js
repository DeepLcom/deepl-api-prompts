/**
 * DeepL API — Get glossary (Node.js)
 *
 * Retrieves metadata for a single glossary by its ID.
 *
 * Usage:
 *   GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key node index.js
 */

"use strict";

const deepl = require("deepl-node");

/**
 * Retrieves metadata for a glossary by its ID.
 *
 * @param {string} glossaryId
 * @returns {Promise<deepl.GlossaryInfo>}
 */
async function getGlossary(glossaryId) {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) throw new Error("DEEPL_API_KEY environment variable is not set.");
  const translator = new deepl.Translator(apiKey);
  return translator.getGlossary(glossaryId);
}

// ── Demo ────────────────────────────────────────────────────────────────────

async function main() {
  const glossaryId = process.env.GLOSSARY_ID;
  if (!glossaryId) {
    console.error("Usage: GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key node index.js");
    process.exit(1);
  }

  const g = await getGlossary(glossaryId);
  console.log("Glossary details:");
  console.log(`  ID:      ${g.glossaryId}`);
  console.log(`  Name:    ${g.name}`);
  console.log(`  Pair:    ${g.sourceLang} → ${g.targetLang}`);
  console.log(`  Entries: ${g.entryCount}`);
  console.log(`  Ready:   ${g.ready}`);
  console.log(`  Created: ${g.creationTime}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
