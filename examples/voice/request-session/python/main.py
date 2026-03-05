"""
Request a Voice API session for real-time speech translation.
Requires a DeepL API Pro subscription (Enterprise only).

This example requests a session token and streaming URL. The streaming_url
and token are then used to connect a WebSocket client for real-time audio
streaming. See https://developers.deepl.com/api-reference/voice/websocket-streaming
for details on the WebSocket protocol.
"""

import os
import urllib.request
import json

auth_key = os.environ["DEEPL_API_KEY"]

payload = json.dumps({
    "source_media_content_type": "audio/pcm;encoding=s16le;rate=16000",
    "source_language": "en",
    "source_language_mode": "auto",
    "target_languages": ["de", "fr"],
    "message_format": "json",
}).encode()

request = urllib.request.Request(
    "https://api.deepl.com/v3/voice/realtime",
    data=payload,
    headers={
        "Authorization": f"DeepL-Auth-Key {auth_key}",
        "Content-Type": "application/json",
    },
    method="POST",
)

with urllib.request.urlopen(request) as response:
    result = json.loads(response.read())

streaming_url = result["streaming_url"]
token = result["token"]
session_id = result.get("session_id")

print(f"Session ID:    {session_id}")
print(f"Token:         {token}")
print(f"Streaming URL: {streaming_url}")
print()
print(f"Connect to WebSocket: {streaming_url}?token={token}")
print("Then stream PCM audio chunks and receive translated text in real time.")
