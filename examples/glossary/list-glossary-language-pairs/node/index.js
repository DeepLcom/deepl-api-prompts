/**
 * DeepL API — List supported glossary language pairs (Node.js)
 *
 * Retrieves all language pairs that can be used with DeepL glossaries.
 *
 * Usage:
 *   DEEPL_API_KEY=your-key node index.js
 */

"use strict";

const deepl = require("deepl-node");

/**
 * Returns all language pairs supported by DeepL glossaries.
 *
 * @returns {Promise<deepl.GlossaryLanguagePair[]>}
 */
async function listGlossaryLanguagePairs() {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) throw new Error("DEEPL_API_KEY environment variable is not set.");
  const translator = new deepl.Translator(apiKey);
  return translator.getGlossaryLanguagePairs();
}

// ── Demo ────────────────────────────────────────────────────────────────────

async function main() {
  const pairs = await listGlossaryLanguagePairs();
  console.log(`Supported glossary language pairs (${pairs.length} total):\n`);
  pairs.forEach((p) => console.log(`  ${p.sourceLang} → ${p.targetLang}`));
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
