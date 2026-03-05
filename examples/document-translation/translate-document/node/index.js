// Translate a document using the DeepL API.
// Creates a sample .txt file, translates it to German, and writes the output.
// The SDK handles the 3-step upload/poll/download flow automatically.
import * as deepl from "deepl-node";
import { writeFileSync, readFileSync, existsSync } from "fs";

const authKey = process.env.DEEPL_API_KEY;

const translator = new deepl.Translator(authKey);

const inputPath = "document.txt";
const outputPath = "document_translated.txt";

// Create a sample input file if it does not already exist.
if (!existsSync(inputPath)) {
  writeFileSync(inputPath, "Hello, world! This is a sample document for translation.");
}

await translator.translateDocument(inputPath, outputPath, null, "de");

console.log(`Translated document saved to: ${outputPath}`);
console.log(`Contents: ${readFileSync(outputPath, "utf-8")}`);
