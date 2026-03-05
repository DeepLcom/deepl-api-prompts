// List all supported source and target languages in the DeepL API.
import * as deepl from "deepl-node";

const authKey = process.env.DEEPL_API_KEY;

const translator = new deepl.Translator(authKey);

const sourceLanguages = await translator.getSourceLanguages();
console.log("Source languages:");
for (const lang of sourceLanguages) {
  console.log(`  ${lang.code}: ${lang.name}`);
}

const targetLanguages = await translator.getTargetLanguages();
console.log("\nTarget languages:");
for (const lang of targetLanguages) {
  const formality = lang.supportsFormality ? " (supports formality)" : "";
  console.log(`  ${lang.code}: ${lang.name}${formality}`);
}
