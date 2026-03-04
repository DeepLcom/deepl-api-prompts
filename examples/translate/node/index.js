/**
 * DeepL API — Translate text (Node.js)
 *
 * Uses the official deepl-node SDK.
 * https://github.com/DeepLcom/deepl-node
 *
 * Usage:
 *   DEEPL_API_KEY=your-key node index.js
 */

"use strict";

const deepl = require("deepl-node");

// ── Custom error types ──────────────────────────────────────────────────────

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
  }
}

class QuotaError extends Error {
  constructor(message) {
    super(message);
    this.name = "QuotaError";
  }
}

// ── Core translation function ───────────────────────────────────────────────

/**
 * Translates an array of strings using the DeepL API.
 *
 * @param {string[]} texts - The strings to translate.
 * @param {string} targetLang - Target language code, e.g. "DE", "FR", "PT-BR".
 * @param {Object} [options={}]
 * @param {string} [options.sourceLang] - Source language code. Omit to auto-detect.
 * @param {string} [options.formality] - "default" | "more" | "less" | "prefer_more" | "prefer_less"
 * @param {string} [options.context] - Additional context hint (not translated).
 * @param {string} [options.glossaryId] - UUID of an existing DeepL glossary.
 * @returns {Promise<Array<{detectedSourceLang: string, text: string}>>}
 */
async function translateTexts(texts, targetLang, options = {}) {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPL_API_KEY environment variable is not set.");
  }

  const translator = new deepl.Translator(apiKey);

  const translateOptions = {};
  if (options.sourceLang) translateOptions.sourceLang = options.sourceLang;
  if (options.formality) translateOptions.formality = options.formality;
  if (options.context) translateOptions.context = options.context;
  if (options.glossaryId) translateOptions.glossary = options.glossaryId;

  let results;
  try {
    results = await translator.translateText(texts, options.sourceLang ?? null, targetLang, translateOptions);
  } catch (err) {
    if (err instanceof deepl.AuthorizationError) {
      throw new AuthError("Invalid DeepL API key. Check your DEEPL_API_KEY.");
    }
    if (err instanceof deepl.QuotaExceededError) {
      throw new QuotaError("DeepL character quota exceeded for this billing period.");
    }
    throw err;
  }

  // Normalise to array (SDK returns a single object when given a single string)
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

  // Demonstrate formality
  console.log("── Formality example (prefer_less) ──────────────────────");
  const [formal] = await translateTexts(["Could you please help me?"], "DE", {
    sourceLang: "EN",
    formality: "prefer_more",
  });
  const [informal] = await translateTexts(["Could you please help me?"], "DE", {
    sourceLang: "EN",
    formality: "prefer_less",
  });
  console.log(`prefer_more → "${formal.text}"`);
  console.log(`prefer_less → "${informal.text}"`);
}

main().catch((err) => {
  if (err.name === "AuthError" || err.name === "QuotaError") {
    console.error(`[${err.name}] ${err.message}`);
    process.exit(1);
  }
  console.error("Unexpected error:", err);
  process.exit(1);
});
