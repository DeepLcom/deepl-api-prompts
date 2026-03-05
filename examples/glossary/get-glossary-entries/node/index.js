/**
 * DeepL API — Get glossary entries (Node.js)
 *
 * Retrieves the term pairs stored in a glossary by its ID.
 *
 * Usage:
 *   GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key node index.js
 */

"use strict";

const deepl = require("deepl-node");

/**
 * Returns the entries of a glossary as a plain object { sourceTerm: targetTerm }.
 *
 * @param {string} glossaryId
 * @returns {Promise<Record<string, string>>}
 */
async function getGlossaryEntries(glossaryId) {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) throw new Error("DEEPL_API_KEY environment variable is not set.");

  const translator = new deepl.Translator(apiKey);
  const info = await translator.getGlossary(glossaryId);
  const entries = await translator.getGlossaryEntries(info);
  return entries.entries();
}

// ── Demo ────────────────────────────────────────────────────────────────────

async function main() {
  const glossaryId = process.env.GLOSSARY_ID;
  if (!glossaryId) {
    console.error("Usage: GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key node index.js");
    process.exit(1);
  }

  const entries = await getGlossaryEntries(glossaryId);
  const pairs = Object.entries(entries);
  console.log(`Glossary entries (${pairs.length} total):\n`);
  const col = Math.max(...pairs.map(([k]) => k.length), 6);
  console.log(`  ${"Source".padEnd(col)}  Target`);
  console.log(`  ${"-".repeat(col)}  ------`);
  for (const [src, tgt] of pairs) {
    console.log(`  ${src.padEnd(col)}  ${tgt}`);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
