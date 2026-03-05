# 1_other.md — Set up DeepL in any project via REST API

Creates a DeepL client built on raw HTTP requests for any language without an official SDK. Run this after `0_init.md` if your language was not in the list.

**API:** DeepL REST API — base URL `https://api.deepl.com/v2` (or `https://api-free.deepl.com/v2` for `:fx` keys)

---

```prompt
You are integrating the DeepL REST API into an existing project using direct HTTP calls. No SDK is assumed. You have full read and write access to this codebase. Your job is to identify the HTTP client already in use, configure the API key, create a service module that exposes the full DeepL API surface as named methods, and wire it into the framework already in use.

If DEEPL_SDK, DEEPL_APP_TYPE, and DEEPL_PROJECT_STATE were set earlier in this conversation by 0_init.md, use those values. Otherwise infer them from the codebase.

Step 1 — Read the project before writing anything

Find out: the programming language and version. Which HTTP client library is already in use. Where service classes or helper modules live and what naming conventions are followed. How environment variables or configuration are read. Whether any calls to api.deepl.com or api-free.deepl.com already exist in the codebase. Whether the project is synchronous, multithreaded, or uses async/await.

Step 2 — Configure the API key

Add DEEPL_API_KEY to the project's environment or configuration using the same pattern in use for other secrets. Add a placeholder to .env.example or equivalent with a comment that free-tier keys end in :fx. Raise or throw a clear error at startup if the key is missing.

Step 3 — Create the DeepL service module

This is the single module or class through which the entire project interacts with DeepL. All other prompts will use it without modifying it, so it must expose the full REST API surface.

Select the base URL at construction time: if the API key ends in :fx use https://api-free.deepl.com/v2, otherwise use https://api.deepl.com/v2. Set an Authorization header with value DeepL-Auth-Key {key} on every request.

Retry on HTTP 429 and 5xx responses using exponential backoff — wait 1 second before the first retry, doubling each time, up to 4 retries. On HTTP 403 raise an authentication error immediately without retrying.

Expose the following groups of functionality as named methods matching the language conventions in use:

Text translation: POST /translate with fields text (array), source_lang (optional), target_lang, plus any extra options passed in. Batch arrays at 50 items per call by slicing and merging. Return only the translated strings, not the full response structures.

Document translation: POST /document to upload a file and return a document_id and document_key. GET /document/{document_id} with the key to retrieve status. GET /document/{document_id}/result with the key to download the translated file. Expose all three as separate methods. Expose a fourth convenience method that calls all three in sequence with a polling loop on status.

Glossary management: POST /glossaries to create; GET /glossaries to list; GET /glossaries/{glossary_id} to get one; DELETE /glossaries/{glossary_id} to delete; GET /glossaries/{glossary_id}/entries to get entries; GET /glossary-language-pairs to list supported language pairs. Expose each as a named method.

Utility: GET /usage to return character usage; GET /languages?type=source and GET /languages?type=target to return supported languages. Expose each as a named method.

Use the same coding style, documentation, error handling, and module organisation as the rest of the codebase. If DEEPL_APP_TYPE is library, accept auth_key as a constructor argument rather than reading from the environment. If DEEPL_APP_TYPE is web-client, add a comment that this service must only be called from server-side code.

Step 4 — Add an endpoint or handler if applicable

If the project is a web server, add a translation endpoint following the existing routing and handler patterns. If DEEPL_APP_TYPE is cli, add a translation subcommand following existing cli patterns.

Step 5 — Add a validation script

Create a small script that instantiates the service, calls the usage method, then translates "Hello, world!" to German and prints the result. Print the exact command to run it at the end of your response.

Step 6 — Update the README

Add DEEPL_API_KEY to the environment variables section. Note that keys ending in :fx are free-tier.

End by printing a summary of every file created or modified and the validation command.
```
