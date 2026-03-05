# detect-language.md — Add language detection to your application

Finds text entry points in your codebase and wires in DeepL language detection using the existing service module from the init prompts.

---

```prompt
You are adding language detection to an existing application that already has a DeepL service set up. Do not install any packages and do not modify the DeepL service module. You have full read and write access to this codebase.

Step 1 — Verify the service exists

Search dependency files for the deepl package used by this project. Then search the codebase for the service or wrapper module that imports this package. If either is missing, stop and tell the user to run 0_init.md followed by the appropriate 1_*.md for their language before continuing.

Step 2 — Read the codebase

Identify: where user-submitted or externally sourced text enters the system — form inputs, API endpoints, file imports, webhook handlers, chat messages. Whether language detection or locale inference is already attempted anywhere using browser headers, user profiles, or heuristics. Whether the project already calls the service with a null or omitted source language — if so, note those call sites because the detected language is already returned in those responses.

Step 3 — Check existing translation calls for detected language

For each existing service translate call that omits source_lang or passes null, the API already returns the detected source language in the result. Identify where the result is used and whether the detected language is read from it. If it is not being read, update those call sites to extract and use the detected source language from the result — the field is detectedSourceLang on SDK results or detected_source_language in the REST response.

Step 4 — Add explicit detection where needed

For call sites where detection is needed before translation — such as routing logic, content filtering, or language-gating — call the service's translate method with the source language omitted and read the detected language from the result. DeepL's text translation endpoint always returns the detected source language; there is no need for a separate detection-only call unless the project specifically needs to detect without translating. If a detection-only result is needed, call translate with target_lang set to EN and source_lang omitted, then use only the detected language from the response and discard the translation.

Step 5 — Wire detected language into downstream logic

Update the call sites or their consumers to store, return, or act on the detected language — for example, storing it on a content record, returning it in an API response, or using it to select a reply language. Follow existing data flow patterns in the project.

Step 6 — Print a summary

List every file created or modified and describe where detection results now flow within the application.
```
