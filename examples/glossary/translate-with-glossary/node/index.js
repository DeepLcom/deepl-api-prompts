/**
 * DeepL API — Translate with glossary (Node.js)
 *
 * Translates text using a previously created glossary to enforce specific
 * term translations. Source language must be specified when using a glossary.
 *
 * Usage:
 *   GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key node index.js
 */

"use strict";

const deepl = require("deepl-node");

/**
 * Translates strings using a specific glossary.
 *
 * @param {string[]} texts
 * @param {string} sourceLang - Source language code (required with a glossary).
 * @param {string} targetLang - Target language code.
 * @param {string} glossaryId - UUID of the glossary.
 * @returns {Promise<string[]>}
 */
async function translateWithGlossary(texts, sourceLang, targetLang, glossaryId) {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) throw new Error("DEEPL_API_KEY environment variable is not set.");

  const translator = new deepl.Translator(apiKey);
  const glossaryInfo = await translator.getGlossary(glossaryId);
  const results = await translator.translateText(texts, sourceLang, targetLang, {
    glossary: glossaryInfo,
  });
  return (Array.isArray(results) ? results : [results]).map((r) => r.text);
}

// ── Demo ────────────────────────────────────────────────────────────────────

async function main() {
  const glossaryId = process.env.GLOSSARY_ID;
  if (!glossaryId) {
    console.error("Usage: GLOSSARY_ID=<uuid> DEEPL_API_KEY=your-key node index.js");
    process.exit(1);
  }

  const sentences = [
    "The automobile runs on gasoline.",
    "Open the hood and check the windshield.",
  ];

  console.log(`Translating ${sentences.length} sentence(s) EN → DE using glossary ${glossaryId}\n`);
  const translated = await translateWithGlossary(sentences, "EN", "DE", glossaryId);

  sentences.forEach((en, i) => {
    console.log(`  EN: "${en}"`);
    console.log(`  DE: "${translated[i]}"\n`);
  });
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
