# translate.md — Wire DeepL translation into your application

Finds existing text content flows in your codebase and integrates the DeepL service to translate them, using the service module created by the init prompts.

---

```prompt
You are adding translation capability to an existing application using a DeepL service that is already set up. Do not install any packages and do not modify the DeepL service module. You have full read and write access to this codebase.

Step 1 — Verify the service exists

Search dependency files for the deepl package or gem used by this project — deepl-node in package.json, deepl in requirements.txt or Pipfile, DeepL.net in a .csproj, deepl-rb in the Gemfile, the deepl-java Maven or Gradle dependency, the deeplcom/deepl-php Composer package, or api.deepl.com in HTTP clients. Then search the codebase for the service or wrapper module that imports this package. If either is missing, stop and tell the user to run 0_init.md followed by the appropriate 1_*.md for their language before continuing.

Step 2 — Read the codebase

Identify: how text content is stored — database columns, JSON files, CMS calls, i18n locale files, or in-memory strings. Where languages are determined — user preferences, URL parameters, request headers, a config file. Whether a caching layer exists for translated content. Where it makes most sense to add translation — a background job, a controller action, a middleware, an i18n loader hook, or a build-time script.

Step 3 — Choose an integration pattern

If locale files drive the UI, pattern A applies: create a one-time or scheduled script that iterates locale keys from the source language file, calls the translate method on the existing service for each value in batches, and writes the results into target locale files. If runtime translation is needed, pattern B applies: add a thin translation endpoint or middleware layer that calls the service and caches results by content hash and target language. If both apply, implement both.

Step 4 — Implement the integration

For pattern A, create the translation script following the project's scripting conventions. Accept source locale, a list of target locales, and a dry-run flag. Write only to locale files, never to the service module. For pattern B, add the endpoint or middleware using the same routing and handler style already in use, calling the service's translate method directly. Cache calls using whatever cache layer the project already has. In both cases, read the list of supported target languages from the service's getLanguages method if the project does not already hard-code a list.

Step 5 — Handle errors and edge cases

Wrap translation calls in a try/catch or equivalent. On authentication error, log clearly and fail fast. On quota exceeded, propagate a structured error so the caller layer can surface it to the operator. On network errors, let the retry logic in the service handle retries and let the exception propagate after exhausting retries rather than silently returning empty strings.

Step 6 — Print a summary

List every file created or modified and the command to run a quick smoke test, such as running the locale script with dry-run true or sending a test request to the new endpoint.
```
