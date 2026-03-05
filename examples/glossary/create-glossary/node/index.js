/**
 * DeepL API — Create a glossary (Node.js)
 *
 * Creates a new glossary from a plain JS object of source → target term pairs
 * and polls until it is ready for use.
 *
 * Usage:
 *   DEEPL_API_KEY=your-key node index.js
 */

"use strict";

const deepl = require("deepl-node");

/**
 * Creates a glossary and polls until it is ready.
 *
 * @param {string} name
 * @param {string} sourceLang - e.g. "EN"
 * @param {string} targetLang - e.g. "DE"
 * @param {Record<string, string>} entries - { sourceTerm: targetTerm }
 * @returns {Promise<deepl.GlossaryInfo>}
 */
async function createGlossary(name, sourceLang, targetLang, entries) {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) throw new Error("DEEPL_API_KEY environment variable is not set.");

  const translator = new deepl.Translator(apiKey);
  const glossaryEntries = new deepl.GlossaryEntries({ entries });
  let info = await translator.createGlossary(name, sourceLang, targetLang, glossaryEntries);

  // Poll until ready
  while (!info.ready) {
    await new Promise((r) => setTimeout(r, 500));
    info = await translator.getGlossary(info.glossaryId);
  }

  return info;
}

// ── Demo ────────────────────────────────────────────────────────────────────

async function main() {
  const glossary = await createGlossary("Car Terminology EN-DE", "EN", "DE", {
    automobile: "Auto",
    gasoline: "Benzin",
    hood: "Motorhaube",
    trunk: "Kofferraum",
    windshield: "Windschutzscheibe",
  });

  console.log("Glossary created successfully:");
  console.log(`  ID:      ${glossary.glossaryId}`);
  console.log(`  Name:    ${glossary.name}`);
  console.log(`  Pair:    ${glossary.sourceLang} → ${glossary.targetLang}`);
  console.log(`  Entries: ${glossary.entryCount}`);
  console.log(`  Ready:   ${glossary.ready}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
