/**
 * DeepL API — Translate with context (Node.js)
 *
 * Passes an optional context hint alongside the text to improve translation
 * quality. The context is not translated or billed.
 *
 * Usage:
 *   DEEPL_API_KEY=your-key node index.js
 */

"use strict";

const deepl = require("deepl-node");

/**
 * Translates an array of strings with an additional context hint.
 *
 * @param {string[]} texts
 * @param {string} targetLang - e.g. "DE"
 * @param {string} context - Free-text hint about the surrounding context.
 * @param {string|null} [sourceLang=null]
 * @returns {Promise<Array<{detectedSourceLang: string, text: string}>>}
 */
async function translateWithContext(texts, targetLang, context, sourceLang = null) {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPL_API_KEY environment variable is not set.");
  }

  const translator = new deepl.Translator(apiKey);

  let results;
  try {
    results = await translator.translateText(texts, sourceLang, targetLang, { context });
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
  // "Save" can mean many things; context pins the correct translation.
  const word = "Save";
  const contexts = [
    "Button label in a document editor application",
    "Button label in a video game about rescuing animals",
  ];

  console.log(`Source (EN): "${word}"\n`);

  for (const context of contexts) {
    const [result] = await translateWithContext([word], "DE", context, "EN");
    console.log(`Context: "${context}"`);
    console.log(`    → "${result.text}"\n`);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
