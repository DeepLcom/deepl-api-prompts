# 1_go.md — Set up DeepL in a Go project

Builds an idiomatic Go client for the DeepL REST API (no official Go SDK exists), covering the full API surface — text translation, document translation, glossary management, and utility endpoints. Run this after `0_init.md` if you answered Go.

**API base URLs:** `https://api-free.deepl.com/v2` (keys ending in `:fx`) · `https://api.deepl.com/v2`

---

```prompt
You are integrating the DeepL REST API into an existing Go project. There is no official Go SDK, so you will build an idiomatic Go client that covers the full DeepL API surface. You have full read and write access to this codebase.

If DEEPL_SDK, DEEPL_APP_TYPE, and DEEPL_PROJECT_STATE were set earlier in this conversation by 0_init.md, use those values. Otherwise infer them from the codebase.

Step 1 — Read the project before writing anything

Find out: the module name from go.mod and the Go version. Whether the project follows standard layout with cmd, internal, and pkg directories, or uses a flat structure. Which HTTP framework or router is in use if any — net/http, Gin, Echo, Chi, Fiber, or none. How configuration and environment variables are managed — os.Getenv, godotenv, envconfig, viper, or a custom config struct. The error handling pattern throughout — sentinel errors, fmt.Errorf with %w wrapping, or a custom error type. Whether context.Context is passed throughout. Whether api.deepl.com is already called anywhere.

Step 2 — Configure the API key

Add DEEPL_API_KEY to the project's environment config following the pattern already in use for other secrets. Add a placeholder entry to .env.example with a comment that free-tier keys end in :fx and determine which base URL to use. If the project has a central config struct, add the field there with startup validation.

Step 3 — Create the DeepL client package

Create the package at internal/deepl (application code) or pkg/deepl (library), matching the project's layout. The package must cover the full API surface through a Client struct.

The constructor should accept the API key, return an error if it is missing or empty, and automatically select the base URL — keys ending in :fx use https://api-free.deepl.com/v2, all others use https://api.deepl.com/v2. Store an http.Client with a sensible default timeout.

Implement the following method groups on the Client, following the project's error handling and context propagation conventions throughout:

Text translation: a Translate method that POSTs to /v2/translate accepting a context, a slice of strings, a target language code, and an optional options struct (source language, formality, glossary ID, context string, tag handling). It should automatically batch inputs larger than 50 strings. Deserialise the translations array from the response and return a slice of result structs containing the translated text and detected source language.

Document translation: a TranslateDocument method that handles the full lifecycle by calling upload, polling status, and download in sequence. Also expose TranslateDocumentUpload (POST /v2/document) returning a DocumentHandle struct, TranslateDocumentStatus (GET /v2/document/{id}) returning a DocumentStatus struct, and TranslateDocumentDownload (GET /v2/document/{id}/result) saving to an output path.

Glossary management: implement CreateGlossary (POST /v2/glossaries), GetGlossary (GET /v2/glossaries/{id}), ListGlossaries (GET /v2/glossaries), DeleteGlossary (DELETE /v2/glossaries/{id}), GetGlossaryEntries (GET /v2/glossaries/{id}/entries), and GetGlossaryLanguagePairs (GET /v2/glossary-language-pairs). Model the request and response structs appropriately.

Utility: implement GetUsage (GET /v2/usage) and GetLanguages (GET /v2/languages?type=source and ?type=target).

Set the Authorization header to "DeepL-Auth-Key " followed by the key on every request. Return descriptive errors that include the HTTP status code and response body for non-2xx responses. Retry on 429 and 5xx with exponential backoff up to three times. All methods must respect the provided context.

Step 4 — Wire into the framework

If the project is a web server or API service, add a handler for text translation following the existing handler and routing patterns. Use whatever request decoding and response encoding helpers the project already uses. Register the route where other routes are registered.

Step 5 — Add a validation command

Create a small entry point at cmd/validate-deepl or a test file following the project's conventions. It should call GetUsage to confirm the key is valid, then call Translate with "Hello, world!" to German and print the result. Print the exact command to run at the end of your response.

Step 6 — Update the README

Document DEEPL_API_KEY in the environment variables section. Note that no external dependencies are added — the client uses only the standard library.

End by printing a summary of every file created or modified and the validation command.
```
