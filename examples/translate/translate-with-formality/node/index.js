/**
 * DeepL API — Translate with formality (Node.js)
 *
 * Controls the formality level of the translated text.
 * Supported languages include DE, FR, IT, ES, NL, PL, PT-BR, PT-PT, RU, JA, ZH.
 *
 * Usage:
 *   DEEPL_API_KEY=your-key node index.js
 */

"use strict";

const deepl = require("deepl-node");

/**
 * Translates an array of strings with a specific formality level.
 *
 * @param {string[]} texts
 * @param {string} targetLang - e.g. "DE"
 * @param {string} formality - "default" | "more" | "less" | "prefer_more" | "prefer_less"
 * @param {string|null} [sourceLang=null]
 * @returns {Promise<Array<{detectedSourceLang: string, text: string}>>}
 */
async function translateWithFormality(texts, targetLang, formality, sourceLang = null) {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPL_API_KEY environment variable is not set.");
  }

  const translator = new deepl.Translator(apiKey);

  let results;
  try {
    results = await translator.translateText(texts, sourceLang, targetLang, { formality });
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
  const text = "Could you please help me?";
  console.log(`Source (EN): "${text}"\n`);

  for (const formality of ["prefer_more", "prefer_less"]) {
    const [result] = await translateWithFormality([text], "DE", formality, "EN");
    console.log(`${formality.padEnd(12)} → "${result.text}"`);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
