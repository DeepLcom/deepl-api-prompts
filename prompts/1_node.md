# 1_node.md — Set up DeepL in a Node.js / TypeScript project

Installs `deepl-node`, creates a translation service using the official SDK, and wires it into your existing framework. Run this after `0_init.md` if you answered Node.js or TypeScript.

**SDK:** `deepl-node` (npm) — `import * as deepl from 'deepl-node'`

---

```prompt
You are integrating the DeepL Node.js SDK into an existing project. You have full read and write access to this codebase. Your job is to install the SDK, configure the API key, create a translation service that matches this project's coding style, and wire it into the framework already in use.

If DEEPL_SDK, DEEPL_APP_TYPE, and DEEPL_PROJECT_STATE were set earlier in this conversation by 0_init.md, use those values. Otherwise infer them from the codebase.

Step 1 — Read the project before writing anything

Find out: which package manager is in use by checking for package-lock.json, yarn.lock, pnpm-lock.yaml, or bun.lockb. Whether TypeScript is used and what the tsconfig.json module setting is, because this controls import style. Which framework is in use — Express, Fastify, NestJS, Next.js, Nuxt, Hono, or none. Where service modules live and what the file naming convention is. How other secrets and environment variables are read — raw process.env, a typed config module, dotenv, t3-env, or zod-based validation. Whether deepl-node is already in package.json or api.deepl.com is already called anywhere.

Step 2 — Install deepl-node

Add deepl-node as a production dependency using whichever package manager this project uses. If you cannot run install commands, add "deepl-node" at version "^1.14.0" to package.json dependencies and note that the developer must install it.

Step 3 — Configure the API key

Add DEEPL_API_KEY to the project's environment config using the same pattern already in use for other secrets. Add a placeholder entry to .env.example with a comment saying free-tier keys end in :fx. If the project uses a typed config or env validation module, add DEEPL_API_KEY there and throw a clear startup error if the value is missing.

Step 4 — Create the DeepL service module

This is the single file through which the entire project interacts with DeepL. All other prompts will import and use it without modifying it, so it must expose the full SDK surface. Create it in whatever location and filename style matches the project's conventions.

Instantiate `new deepl.Translator(authKey)` at module load time using the API key from Step 3 — throw immediately with a clear message if the key is missing.

Expose the following groups of functionality as named exports (functions or methods depending on whether the project uses a class-based or module-based pattern):

Text translation: a function that calls `translator.translateText(texts, sourceLang, targetLang, options)` — pass null as sourceLang to auto-detect — reads the `.text` property from each returned `TextResult`, and automatically batches inputs larger than 50 strings by splitting into chunks and concatenating results.

Document translation: a function for the full document flow that calls `translator.translateDocument(inputFile, outputFile, sourceLang, targetLang, options)`, which handles upload, polling, and download internally. Also expose lower-level controls via `translator.uploadDocument(...)` returning a `DocumentHandle`, `translator.isDocumentTranslationComplete(handle)`, and `translator.downloadDocument(handle, outputFile)` for callers that need to manage the async lifecycle themselves.

Glossary management: wrap `translator.createGlossary(name, sourceLang, targetLang, entries)`, `translator.getGlossary(glossaryId)`, `translator.listGlossaries()`, `translator.deleteGlossary(glossaryId)`, `translator.getGlossaryEntries(glossaryId)`, and `translator.getGlossaryLanguagePairs()` — expose each as a named export that passes through all arguments and return values unchanged.

Utility: expose `translator.getUsage()` which returns character and document usage counts, `translator.getSourceLanguages()`, and `translator.getTargetLanguages()`.

Catch `deepl.AuthorizationError`, `deepl.QuotaExceededError`, and `deepl.TooManyRequestsError` at the service boundary and re-throw as clear, descriptive errors using the project's error handling conventions. Use the same async patterns and export style as the rest of the codebase. If this is NestJS, wrap everything in an `@Injectable()` class. If DEEPL_APP_TYPE is library, accept the API key as a constructor or function parameter. If DEEPL_APP_TYPE is web-client, add a prominent comment that this module must only be imported in server-side code.

Step 5 — Add a translation endpoint if applicable

If the project is a web server or API service, add a route that accepts text and a target language and calls your service, placed in the same file or folder where similar routes live, following the exact same request parsing and response format used elsewhere. For Next.js App Router add a server action or route handler. For Next.js Pages Router add an API route. For Express or Fastify add to the existing router. For NestJS add a controller method. If DEEPL_APP_TYPE is web-client, this server-side endpoint is required — the service must never be imported into a client bundle.

Step 6 — Add a validation script

Create a small script in the project's scripts directory that calls `translator.getUsage()` to confirm the key is valid, then translates "Hello, world!" to German using your service and prints the result. Use the command runner that matches the project — npx tsx, ts-node, bun, or plain node. Print the exact command to run at the end of your response.

Step 7 — Update the README

Add DEEPL_API_KEY to the environment variables table or section if one exists, or create a minimal one.

End by printing a summary of every file created or modified, the install command, and the validation command.
```
