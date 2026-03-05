# glossary.md — Create and apply DeepL glossaries to your translation flow

Analyses your codebase for domain-specific terminology, creates glossaries via the DeepL service, and threads the glossary IDs into existing translation calls. Uses the service module from the init prompts.

---

```prompt
You are adding glossary-controlled translation to an existing application that already has a DeepL service set up. Do not install any packages and do not modify the DeepL service module. You have full read and write access to this codebase.

Step 1 — Verify the service exists

Search dependency files for the deepl package used by this project. Then search the codebase for the service or wrapper module that imports this package. If either is missing, stop and tell the user to run 0_init.md followed by the appropriate 1_*.md for their language before continuing.

Step 2 — Discover the domain and existing translation calls

Read the codebase identifyng: which source and target language pairs are used in existing translate calls. Domain-specific terms that appear in UI strings, API responses, documentation strings, or locale files — product names, technical terms, legal phrases, or brand vocabulary that must never be changed by the translation engine. Whether a glossary management file or term list already exists in the project.

Step 3 — Verify supported language pairs

Call the service's getGlossaryLanguagePairs method or equivalent to retrieve the list of language pairs that DeepL supports for glossaries. Filter your set of required language pairs to only those that are supported. Note any unsupported pairs in your summary.

Step 4 — Create a glossary terms file

Create a terms file — JSON, CSV, or whatever format fits the project — containing the domain-specific terms you identified. For each source term, include the intended translation in each target language. Include a comment explaining what this file is and that changing it requires re-running the glossary sync script.

Step 5 — Create a glossary sync script

Create a script that reads the terms file, calls the service's listGlossaries method to check which glossaries already exist, deletes and recreates any that are stale, calls the service's createGlossary method for each required language pair passing the name, source language, target language, and entries, and writes the resulting glossary IDs to a local config or environment file so they can be referenced at runtime. Follow the project's scripting conventions for script placement and entry-point style.

Step 6 — Thread glossary IDs into existing translation calls

Find all calls to the service's translate method in the codebase. For each call, determine the language pair in use and look up the corresponding glossary ID from the config written in step 5. Pass the glossary ID as an option on each matching call. If the ID lookup must happen at runtime rather than build time, load the IDs from the config file at application startup and inject them at the call site.

Step 7 — Handle errors

If a glossary ID is missing at runtime, fall back to translating without a glossary and log a warning. Never throw on a missing glossary ID.

Step 8 — Print a summary

List every file created or modified, the command to run the glossary sync script, the total number of glossaries that will be created, and the language pairs that could not be supported.
```
