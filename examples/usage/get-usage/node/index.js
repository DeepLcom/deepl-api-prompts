// Retrieve usage and quota for the current DeepL API billing period.
import * as deepl from "deepl-node";

const authKey = process.env.DEEPL_API_KEY;

const translator = new deepl.Translator(authKey);

const usage = await translator.getUsage();

if (usage.anyLimitReached()) {
  console.log("Translation limit reached.");
} else {
  console.log(
    `Characters: ${usage.character.count} of ${usage.character.limit} used`
  );
}
