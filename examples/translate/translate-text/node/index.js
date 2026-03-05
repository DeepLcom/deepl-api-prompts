/**
 * DeepL API — Translate text (Node.js)
 *
 * Translates an array of strings to a target language using the DeepL API.
 * Source language is auto-detected when not specified.
 *
 * Usage:
 *   DEEPL_API_KEY=your-key node index.js
 */

"use strict";

const deepl = require("deepl-node");

/**
 * Translates an array of strings using the DeepL API.
 *
 * @param {string[]} texts - The strings to translate.
 * @param {string} targetLang - Target language code, e.g. "DE", "FR", "PT-BR".
 * @param {string|null} [sourceLang=null] - Source language code. Null to auto-detect.
 * @returns {Promise<Array<{detectedSourceLang: string, text: string}>>}
 */
async function translateTexts(texts, targetLang, sourceLang = null) {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPL_API_KEY environment variable is not set.");
  }

  const translator = new deepl.Translator(apiKey);

  let results;
  try {
    results = await translator.translateText(texts, sourceLang, targetLang);
  } catch (err) {
    if (err instanceof deepl.AuthorizationError) {
      throw new Error("Invalid DeepL API key. Check your DEEPL_API_KEY.");
    }
    if (err instanceof deepl.QuotaExceededError) {
      throw new Error("DeepL character quota exceeded for this billing period.");
    }
    throw err;
  }

  const resultArray = Array.isArray(results) ? results : [results];
  return resultArray.map((r) => ({
    detectedSourceLang: r.detectedSourceLang,
    text: r.text,
  }));
}

// ── Demo ────────────────────────────────────────────────────────────────────

async function main() {
  const texts = [
    "Hello, world!",
    "How are you today?",
    "The quick brown fox jumps over the lazy dog.",
  ];

  console.log(`Translating ${texts.length} string(s) → DE\n`);

  const translations = await translateTexts(texts, "DE");

  translations.forEach((t, i) => {
    console.log(`[${i + 1}] (${t.detectedSourceLang}) "${texts[i]}"`);
    console.log(`    → "${t.text}"\n`);
  });
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
