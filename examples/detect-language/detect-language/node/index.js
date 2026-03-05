/**
 * DeepL API — Detect language (Node.js)
 *
 * Language detection is a side-effect of translation.
 * We translate to EN-US without specifying a source language,
 * then return only the detectedSourceLang value.
 *
 * Usage:
 *   DEEPL_API_KEY=your-key node index.js
 */

"use strict";

const deepl = require("deepl-node");

/**
 * Detects the language of each string in the input array.
 *
 * @param {string[]} texts - Strings whose language should be detected.
 * @returns {Promise<Array<{text: string, detectedLang: string}>>}
 */
async function detectLanguages(texts) {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPL_API_KEY environment variable is not set.");
  }

  const translator = new deepl.Translator(apiKey);

  // Translate to EN-US without source_lang to trigger auto-detection.
  let results;
  try {
    results = await translator.translateText(texts, null, "EN-US");
  } catch (err) {
    if (err instanceof deepl.AuthorizationError) {
      throw new Error("Invalid DeepL API key. Check your DEEPL_API_KEY.");
    }
    if (err instanceof deepl.QuotaExceededError) {
      throw new Error("DeepL character quota exceeded.");
    }
    throw err;
  }

  const resultArray = Array.isArray(results) ? results : [results];
  return texts.map((text, i) => ({
    text,
    detectedLang: resultArray[i].detectedSourceLang,
  }));
}

// ── Demo ────────────────────────────────────────────────────────────────────

async function main() {
  const samples = [
    "Hallo, wie geht es dir?",
    "Bonjour le monde",
    "Ciao mondo",
    "Witaj świecie",
    "¿Cómo estás?",
    "こんにちは世界",
    "Hello, world!",
  ];

  console.log("Detecting language for", samples.length, "string(s)...\n");

  const detections = await detectLanguages(samples);

  const col = 40;
  console.log("Input".padEnd(col) + "  Detected");
  console.log("-".repeat(col) + "  ---------");
  for (const { text, detectedLang } of detections) {
    const snippet = text.length > col - 3 ? text.slice(0, col - 3) + "..." : text;
    console.log(snippet.padEnd(col) + "  " + detectedLang);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
