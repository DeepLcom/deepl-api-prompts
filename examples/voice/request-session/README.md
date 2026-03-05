# Example: Request Voice Session

Request a real-time speech translation session token from the DeepL Voice API.

## Files

| File | Description |
|---|---|
| `curl.sh` | Minimal `curl` reference command (session request only) |
| `node/` | Node.js implementation |
| `python/` | Python implementation |

## Quick start

```bash
# Node.js
cd node && DEEPL_API_KEY=your-key node index.js

# Python
cd python && DEEPL_API_KEY=your-key python main.py
```

## What it does

1. Reads `DEEPL_API_KEY` from the environment.
2. Calls `POST /v3/voice/realtime` with the desired audio format (`audio/pcm;encoding=s16le;rate=16000`), source language, target languages, and message format.
3. Receives a `streaming_url`, ephemeral `token`, and `session_id`.
4. Prints the WebSocket connection URL (`streaming_url?token=…`) to use for streaming.

## Prerequisites

- A DeepL API Pro subscription with Voice API access (Enterprise only — [contact sales](https://www.deepl.com/contact-us))
- Node.js >= 18 **or** Python >= 3.8

## Sample response

```json
{
  "streaming_url": "wss://api.deepl.com/v3/voice/realtime/connect",
  "token": "VGhpcyBpcyBhIGZha2UgdG9rZW4K",
  "session_id": "4f911080-cfe2-41d4-8269-0e6ec15a0354"
}
```

Connect to the WebSocket using:

```
wss://api.deepl.com/v3/voice/realtime/connect?token=VGhpcyBpcyBhIGZha2UgdG9rZW4K
```

## Notes

- The session token is ephemeral and single-use; request a new session for each stream.
- The WebSocket streaming protocol is documented at [developers.deepl.com/api-reference/voice/websocket-streaming](https://developers.deepl.com/api-reference/voice/websocket-streaming).
- Supported audio formats include PCM, FLAC, MP3, OPUS, and AAC; see the API reference for the full list.
- A maximum of 5 target languages can be specified per session.
- Streams time out after 30 seconds of silence and have a maximum duration of 1 hour.
- Audio chunks must not exceed 100 KB or 1 second of audio; 50–250 ms chunks are recommended.
