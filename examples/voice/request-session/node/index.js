// Request a Voice API session for real-time speech translation.
// Requires a DeepL API Pro subscription (Enterprise only).
//
// This example requests a session token and streaming URL. The streaming_url
// and token are then used to connect a WebSocket client for real-time audio
// streaming. See https://developers.deepl.com/api-reference/voice/websocket-streaming
// for details on the WebSocket protocol.

const authKey = process.env.DEEPL_API_KEY;

const response = await fetch("https://api.deepl.com/v3/voice/realtime", {
  method: "POST",
  headers: {
    Authorization: `DeepL-Auth-Key ${authKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    source_media_content_type: "audio/pcm;encoding=s16le;rate=16000",
    source_language: "en",
    source_language_mode: "auto",
    target_languages: ["de", "fr"],
    message_format: "json",
  }),
});

const result = await response.json();

const { streaming_url, token, session_id } = result;

console.log(`Session ID:    ${session_id}`);
console.log(`Token:         ${token}`);
console.log(`Streaming URL: ${streaming_url}`);
console.log();
console.log(`Connect to WebSocket: ${streaming_url}?token=${token}`);
console.log("Then stream PCM audio chunks and receive translated text in real time.");
