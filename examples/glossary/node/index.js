/**
 * DeepL API — Glossary operations (Node.js)
 *
 * Demonstrates: create → list → translate with glossary → get entries → delete.
 *
 * Usage:
 *   DEEPL_API_KEY=your-key node index.js
 */

"use strict";

const deepl = require("deepl-node");

// ── Helper: build a Translator ──────────────────────────────────────────────

function getTranslator() {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) throw new Error("DEEPL_API_KEY environment variable is not set.");
  return new deepl.Translator(apiKey);
}

// ── 1. List supported glossary language pairs ──────────────────────────────

/**
 * Returns all language pairs that support glossaries.
 * @returns {Promise<deepl.GlossaryLanguagePair[]>}
 */
async function listSupportedLanguagePairs() {
  const translator = getTranslator();
  return translator.getGlossaryLanguagePairs();
}

// ── 2. Create a glossary ───────────────────────────────────────────────────

/**
 * Creates a glossary from a plain JS object mapping source → target terms.
 *
 * @param {string} name
 * @param {string} sourceLang - e.g. "EN"
 * @param {string} targetLang - e.g. "DE"
 * @param {Record<string, string>} entries - { "automobile": "Auto", ... }
 * @returns {Promise<deepl.GlossaryInfo>}
 */
async function createGlossary(name, sourceLang, targetLang, entries) {
  const translator = getTranslator();
  const glossaryEntries = new deepl.GlossaryEntries({ entries });
  const glossary = await translator.createGlossary(name, sourceLang, targetLang, glossaryEntries);
  // Poll until ready
  let info = glossary;
  while (!info.ready) {
    await new Promise((r) => setTimeout(r, 500));
    info = await translator.getGlossary(info.glossaryId);
  }
  return info;
}

// ── 3. List glossaries ─────────────────────────────────────────────────────

/**
 * @returns {Promise<deepl.GlossaryInfo[]>}
 */
async function listGlossaries() {
  return getTranslator().listGlossaries();
}

// ── 4. Get glossary entries ────────────────────────────────────────────────

/**
 * @param {string} glossaryId
 * @returns {Promise<Record<string, string>>}
 */
async function getGlossaryEntries(glossaryId) {
  const translator = getTranslator();
  const info = await translator.getGlossary(glossaryId);
  const entries = await translator.getGlossaryEntries(info);
  return entries.entries();
}

// ── 5. Translate with glossary ─────────────────────────────────────────────

/**
 * @param {string[]} texts
 * @param {string} sourceLang
 * @param {string} targetLang
 * @param {string} glossaryId
 * @returns {Promise<string[]>}
 */
async function translateWithGlossary(texts, sourceLang, targetLang, glossaryId) {
  const translator = getTranslator();
  const glossaryInfo = await translator.getGlossary(glossaryId);
  const results = await translator.translateText(texts, sourceLang, targetLang, {
    glossary: glossaryInfo,
  });
  return (Array.isArray(results) ? results : [results]).map((r) => r.text);
}

// ── 6. Delete glossary ─────────────────────────────────────────────────────

/**
 * @param {string} glossaryId
 */
async function deleteGlossary(glossaryId) {
  const translator = getTranslator();
  const info = await translator.getGlossary(glossaryId);
  await translator.deleteGlossary(info);
}

// ── Demo ────────────────────────────────────────────────────────────────────

async function main() {
  // Check supported pairs
  console.log("=== Supported glossary language pairs (first 5) ===");
  const pairs = await listSupportedLanguagePairs();
  pairs.slice(0, 5).forEach((p) => console.log(`  ${p.sourceLang} → ${p.targetLang}`));

  // Create glossary
  console.log("\n=== Creating EN→DE car-terminology glossary ===");
  const glossary = await createGlossary("Car Terminology EN-DE (node demo)", "EN", "DE", {
    automobile: "Auto",
    gasoline: "Benzin",
    hood: "Motorhaube",
    trunk: "Kofferraum",
    windshield: "Windschutzscheibe",
  });
  console.log(`  Created: ${glossary.glossaryId}`);
  console.log(`  Entries: ${glossary.entryCount}`);
  console.log(`  Ready:   ${glossary.ready}`);

  // List all
  console.log("\n=== All glossaries ===");
  const all = await listGlossaries();
  all.forEach((g) => {
    console.log(`  [${g.glossaryId}] ${g.name} (${g.sourceLang}→${g.targetLang}, ${g.entryCount} entries)`);
  });

  // Translate with glossary
  const sentences = [
    "The automobile runs on gasoline.",
    "Open the hood and check the windshield.",
  ];
  console.log("\n=== Translating with glossary ===");
  const translated = await translateWithGlossary(sentences, "EN", "DE", glossary.glossaryId);
  sentences.forEach((s, i) => {
    console.log(`  EN: "${s}"`);
    console.log(`  DE: "${translated[i]}"\n`);
  });

  // Print entries
  console.log("=== Glossary entries ===");
  const entries = await getGlossaryEntries(glossary.glossaryId);
  Object.entries(entries).forEach(([src, tgt]) => console.log(`  ${src.padEnd(15)} → ${tgt}`));

  // Delete (commented out for safety)
  // console.log("\n=== Deleting glossary ===");
  // await deleteGlossary(glossary.glossaryId);
  // console.log("  Deleted.");
  console.log(`\n(Glossary ${glossary.glossaryId} NOT deleted — uncomment to clean up)`);
}

main().catch((err) => {
  console.error("Error:", err.message ?? err);
  process.exit(1);
});
