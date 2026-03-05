// Improve text using the DeepL Write API.
// Requires a DeepL API Pro subscription (not available on Free tier).

const authKey = process.env.DEEPL_API_KEY;

const response = await fetch("https://api.deepl.com/v2/write/rephrase", {
  method: "POST",
  headers: {
    Authorization: `DeepL-Auth-Key ${authKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    text: ["The quick brwon fox jumpd over the lazzy dog."],
    target_lang: "en-US",
  }),
});

const result = await response.json();

for (const improvement of result.improvements) {
  console.log(`Improved text:             ${improvement.text}`);
  console.log(`Target language:           ${improvement.target_language}`);
  console.log(
    `Detected source language:  ${improvement.detected_source_language}`
  );
}
