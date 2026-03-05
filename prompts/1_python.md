# 1_python.md — Set up DeepL in a Python project

Installs `deepl`, creates a translation service using the official SDK, and wires it into your existing framework. Run this after `0_init.md` if you answered Python.

**SDK:** `deepl` (pip) — `import deepl`

---

```prompt
You are integrating the DeepL Python SDK into an existing project. You have full read and write access to this codebase. Your job is to install the SDK, configure the API key, create a translation service that matches this project's coding style, and wire it into the framework already in use.

If DEEPL_SDK, DEEPL_APP_TYPE, and DEEPL_PROJECT_STATE were set earlier in this conversation by 0_init.md, use those values. Otherwise infer them from the codebase.

Step 1 — Read the project before writing anything

Find out: which package manager is in use — pip with requirements.txt, poetry, pipenv, or uv. The Python version and whether the codebase uses type annotations with mypy or pyright. Which framework is in use — FastAPI, Django, Flask, Starlette, or none. Whether the project is async throughout, because the deepl SDK is synchronous and async projects need a wrapper. Where service modules live and what the naming convention is. How environment variables are read — raw os.environ, python-dotenv, pydantic-settings, decouple, or Django settings. Whether deepl is already installed or api.deepl.com is already called anywhere.

Step 2 — Install the deepl package

Add deepl as a dependency using this project's package manager. If you cannot run install commands, add deepl>=1.18.0 to the appropriate dependency file and note the developer must install it.

Step 3 — Configure the API key

Add DEEPL_API_KEY to the project's environment config using the same pattern already in use for other secrets. Add a placeholder entry to .env.example with a comment that free-tier keys end in :fx. For Django, read it in settings.py and raise ImproperlyConfigured if missing. For pydantic-settings, add it as a required field. For other setups, use whatever env-reading pattern already exists and raise a clear error at import time if missing.

Step 4 — Create the DeepL service module

This is the single file through which the entire project interacts with DeepL. All other prompts will import and use it without modifying it, so it must expose the full SDK surface. Create it in whatever location and filename style matches the project's conventions.

Instantiate `deepl.Translator(auth_key)` at module load time using the API key from Step 3 — raise immediately with a clear message if the key is missing.

Expose the following groups of functionality as module-level functions or class methods depending on the project's style:

Text translation: a function that calls `translator.translate_text(text, source_lang=None, target_lang=target_lang, **options)` — None as source_lang triggers auto-detect — reads the `.text` attribute from each returned `TextResult`, and automatically batches list inputs larger than 50 by slicing and concatenating results.

Document translation: a function for the full document flow that calls `translator.translate_document(input_path, output_path, source_lang, target_lang, **options)`, which handles upload, polling, and download internally. Also expose `translator.translate_document_upload(input_path, source_lang, target_lang)` returning a `DocumentHandle`, `translator.translate_document_get_status(handle)` returning a `DocumentStatus`, and `translator.translate_document_download(handle, output_path)` for callers that need fine-grained control.

Glossary management: wrap `translator.create_glossary(name, source_lang, target_lang, entries)`, `translator.get_glossary(glossary_id)`, `translator.list_glossaries()`, `translator.delete_glossary(glossary_id)`, `translator.get_glossary_entries(glossary_id)`, and `translator.get_glossary_languages()` — expose each as a named function that passes through all arguments and return values unchanged.

Utility: expose `translator.get_usage()`, `translator.get_source_languages()`, and `translator.get_target_languages()`.

If the project is async throughout, add async wrappers using `asyncio.to_thread` for every function, since the deepl SDK is synchronous. Handle `deepl.AuthorizationException`, `deepl.QuotaExceededException`, and `deepl.TooManyRequestsException` at the service boundary using the project's error handling conventions. Use the same type annotation style and docstring format as the rest of the codebase. If DEEPL_APP_TYPE is library, accept auth_key as a parameter. If DEEPL_APP_TYPE is web-client, add a comment that this module must only be called from server-side code.

Step 5 — Add a translation endpoint if applicable

If the project is a web server or API service, add a route in the same file or folder where similar routes live, using the same request validation, response model, and error handling patterns already in use. For FastAPI, add to the appropriate router using Pydantic request and response models matching the project's style. For Django, add a view and URL pattern. For Flask, add to the appropriate blueprint. If DEEPL_APP_TYPE is web-client, a server-side endpoint is required.

Step 6 — Add a validation script

Create a small script that calls `translator.get_usage()` to confirm the key is valid, translates "Hello, world!" to German using your service, and prints the result. Load .env first if python-dotenv is available. Print the exact command to run at the end of your response.

Step 7 — Update the README

Add DEEPL_API_KEY to the environment variables table or section if one exists, or create a minimal one.

End by printing a summary of every file created or modified, the install command, and the validation command.
```
