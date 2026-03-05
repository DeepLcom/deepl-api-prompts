# formality.md — Add per-user formality control to DeepL translation

Finds the user or request model in your codebase and threads a formality setting through existing translation calls. Uses the service module from the init prompts.

---

```prompt
You are adding formality control to translation calls in an existing application that already has a DeepL service set up. Do not install any packages and do not modify the DeepL service module. You have full read and write access to this codebase.

Step 1 — Verify the service exists

Search dependency files for the deepl package used by this project. Then search the codebase for the service or wrapper module that imports this package. If either is missing, stop and tell the user to run 0_init.md followed by the appropriate 1_*.md for their language before continuing.

Step 2 — Read the codebase

Identify: whether a user model or user preferences structure exists. Where language preferences are stored today. Whether the target languages in use for translation include any that support formality — German, French, Italian, Spanish, Dutch, Polish, Portuguese, Russian, and Japanese support formality; English does not. Where in the code translation calls are made and what arguments they currently receive.

Step 3 — Add a formality field

Add a formality preference field to the user preferences model, settings object, or config structure using the project's schema conventions. Use an enum or string type with three values: default, more, and less. Migration, schema change, or config key should follow existing project patterns. If no user model exists and this is an API service or CLI, add a formality parameter to the translation endpoint or command arguments.

Step 4 — Thread formality through translation calls

Find all calls to the service's translate method. For each call, determine whether the target language supports formality. If it does, read the formality preference from the user context, request context, or config available at that call site, and pass it as the formality option. If the target language does not support formality, do not pass the formality option — passing it for unsupported languages causes an API error.

Step 5 — Expose formality in the API or UI

If the project exposes a translation endpoint, add formality as an accepted request parameter. If the project has a user settings screen or form, add a formality selector. Follow existing UI and API patterns exactly — do not introduce new conventions.

Step 6 — Print a summary

List every file created or modified and note which target languages in the project support formality and which do not.
```
