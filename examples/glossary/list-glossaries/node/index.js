/**
 * DeepL API — List glossaries (Node.js)
 *
 * Retrieves all glossaries associated with the current account.
 *
 * Usage:
 *   DEEPL_API_KEY=your-key node index.js
 */

"use strict";

const deepl = require("deepl-node");

/**
 * Returns all glossaries for this account.
 *
 * @returns {Promise<deepl.GlossaryInfo[]>}
 */
async function listGlossaries() {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) throw new Error("DEEPL_API_KEY environment variable is not set.");
  const translator = new deepl.Translator(apiKey);
  return translator.listGlossaries();
}

// ── Demo ────────────────────────────────────────────────────────────────────

async function main() {
  const glossaries = await listGlossaries();
  if (glossaries.length === 0) {
    console.log("No glossaries found.");
    return;
  }

  console.log(`Found ${glossaries.length} glossary/glossaries:\n`);
  for (const g of glossaries) {
    console.log(`  [${g.glossaryId}]`);
    console.log(`    Name:    ${g.name}`);
    console.log(`    Pair:    ${g.sourceLang} → ${g.targetLang}`);
    console.log(`    Entries: ${g.entryCount}`);
    console.log(`    Ready:   ${g.ready}\n`);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
