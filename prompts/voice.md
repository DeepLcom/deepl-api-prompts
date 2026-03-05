# voice.md — Integrate DeepL Voice real-time translation

Checks your project for audio infrastructure and integrates the DeepL Voice WebSocket API for real-time speech translation. This feature requires a DeepL Enterprise plan.

---

```prompt
You are integrating DeepL Voice real-time speech translation into an existing application that already has a DeepL service set up. Do not install any packages and do not modify the DeepL service module unless the voice session method was not included in it. You have full read and write access to this codebase.

Step 1 — Verify the service exists

Search dependency files for the deepl package used by this project. Then search the codebase for the service or wrapper module that imports this package. If either is missing, stop and tell the user to run 0_init.md followed by the appropriate 1_*.md for their language before continuing.

Step 2 — Check for audio infrastructure

Search the codebase for signals that audio processing is already present: WebSocket server or client setup, microphone or audio capture APIs, WebRTC peer connections, media stream handling, audio encoding libraries such as opus or pcm utilities, or streaming endpoint patterns. If none of these are found, stop and tell the user that DeepL Voice requires existing audio infrastructure to integrate with and that this prompt cannot add audio capture from scratch.

Step 3 — Check the service for a voice session method

Look in the DeepL service module for a method that requests a voice session token or establishes a voice WebSocket connection. If it is missing, add only that method to the service: call POST /v2/voice/session or the equivalent SDK method to obtain a session token and WebSocket URL, and expose it as a named method following the service's existing style. Note this addition in your summary.

Step 4 — Read the audio architecture

Understand how audio is currently captured and streamed: what encoding and sample rate is used, whether streaming happens client-side or server-side, where audio chunks are sent today. Identify the correct integration point where DeepL Voice should receive the audio stream.

Step 5 — Implement the voice translation integration

At the identified integration point, request a voice session by calling the service's session method. Open a WebSocket connection to the URL returned. Send audio chunks in the format required by the DeepL Voice API — PCM 16-bit mono at the sample rate specified in the session response. Read translation events from the WebSocket and pass transcription and translation results downstream using the project's existing event, callback, or stream handling pattern. Handle WebSocket disconnection by requesting a new session and reconnecting, using exponential backoff.

Step 6 — Expose translated speech output

Wire the translation output into the project's existing display, playback, or forwarding layer following the patterns already in use.

Step 7 — Print a summary

List every file created or modified and describe the audio flow from capture to DeepL Voice to output.
```
