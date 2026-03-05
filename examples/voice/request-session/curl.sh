#!/bin/bash
# Request a Voice API session for real-time speech translation.
# Requires a DeepL API Pro subscription (Enterprise only).
# Set DEEPL_API_KEY to your API key before running.
#
# The response contains a streaming_url and token for establishing
# a WebSocket connection for real-time audio streaming.

curl -X POST "https://api.deepl.com/v3/voice/realtime" \
  --header "Authorization: DeepL-Auth-Key $DEEPL_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{
    "source_media_content_type": "audio/pcm;encoding=s16le;rate=16000",
    "source_language": "en",
    "source_language_mode": "auto",
    "target_languages": ["de", "fr"],
    "message_format": "json"
  }'
