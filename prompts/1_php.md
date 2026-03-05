# 1_php.md — Set up DeepL in a PHP project

Installs `deeplcom/deepl-php`, creates a translation service using the official SDK, and wires it into your existing Laravel, Symfony, or plain PHP project. Run this after `0_init.md` if you answered PHP.

**SDK:** `deeplcom/deepl-php` (Composer) — `use DeepL\Translator;`

---

```prompt
You are integrating the DeepL PHP SDK into an existing project. You have full read and write access to this codebase. Your job is to install the package, configure the API key, create a translation service that matches this project's coding style, and wire it into the framework already in use.

If DEEPL_SDK, DEEPL_APP_TYPE, and DEEPL_PROJECT_STATE were set earlier in this conversation by 0_init.md, use those values. Otherwise infer them from the codebase.

Step 1 — Read the project before writing anything

Find out: which framework is in use — Laravel, Symfony, Slim, or plain PHP. The PHP version from composer.json. The PSR-4 namespace prefix and autoload configuration from composer.json. Where service classes live and what naming conventions are used. How environment variables are read — vlucas/phpdotenv, symfony/dotenv, $_ENV, or getenv(). Whether deeplcom/deepl-php is already installed or api.deepl.com is already called anywhere.

Step 2 — Install deeplcom/deepl-php

Run `composer require deeplcom/deepl-php`. If you cannot run commands, add `"deeplcom/deepl-php": "^1.9"` to the require section of composer.json and note the developer must run composer install.

Step 3 — Configure the API key

Add DEEPL_API_KEY to the project's environment config using the same pattern already in use for other secrets. Add a placeholder entry to .env.example with a comment that free-tier keys end in :fx. For Laravel, expose it via config/services.php using `env('DEEPL_API_KEY')`. For Symfony, bind it as an environment parameter in services.yaml.

Step 4 — Create the DeepL service class

This is the single class through which the entire project interacts with DeepL. All other prompts will inject and use it without modifying it, so it must expose the full SDK surface. Create it in the location and namespace that matches this project's conventions.

The class should accept the API key via constructor injection, instantiate `new Translator($authKey)`, and throw a `\RuntimeException` immediately if the key is empty.

Expose the following groups of public methods:

Text translation: a method that calls `$translator->translateText($text, $sourceLang, $targetLang, $options)` — pass null as sourceLang to auto-detect — returning the `->text` property from each `TextResult`. Accept both string and array inputs. Batch array inputs by splitting into chunks of 50 and merging results, since that is the per-request limit.

Document translation: a method wrapping `$translator->translateDocument($inputFile, $outputFile, $sourceLang, $targetLang, $options)` for the full flow. Also expose `$translator->uploadDocument($inputFile, $sourceLang, $targetLang, $options)` returning a `DocumentHandle`, `$translator->getDocumentStatus($handle)` returning a `DocumentStatus`, and `$translator->downloadDocument($handle, $outputFile)` for callers that need fine-grained control.

Glossary management: wrap `$translator->createGlossary($name, $sourceLang, $targetLang, $entries)`, `$translator->getGlossary($glossaryId)`, `$translator->listGlossaries()`, `$translator->deleteGlossary($glossaryId)`, `$translator->getGlossaryEntries($glossaryId)`, and `$translator->getGlossaryLanguagePairs()` — expose each as a public method passing through all arguments and return values unchanged.

Utility: expose `$translator->getUsage()`, `$translator->getSourceLanguages()`, and `$translator->getTargetLanguages()`.

Catch `DeepL\AuthorizationException` and `DeepL\QuotaExceededException` at the service boundary and re-throw using the project's error handling conventions. Use the same type declarations and docblock style as the rest of the codebase. If DEEPL_APP_TYPE is library, require the API key as a constructor argument only. If DEEPL_APP_TYPE is web-client, add a prominent comment that this class must only be instantiated from server-side PHP.

Step 5 — Register the service with the container

For Laravel, create a service provider that binds the service class as a singleton using the API key from config/services.php. Register the provider appropriately for the Laravel version in use. For Symfony, configure the service in services.yaml, binding the API key environment parameter to the constructor argument so autowiring works. For other frameworks, follow whatever DI or factory pattern already exists.

Step 6 — Add a translation endpoint if applicable

If the project is a web server or API service, add a controller action or route following the existing structure. Use the same request validation and response format patterns already in use.

Step 7 — Add a validation script

Create a small script or Artisan/console command that calls `$translator->getUsage()` to verify connectivity, then translates "Hello, world!" to German using your service and prints the result. Print the exact command to run at the end of your response.

Step 8 — Update the README

Add DEEPL_API_KEY to the environment variables section. Note that keys ending in :fx are free-tier.

End by printing a summary of every file created or modified and the commands needed to install, configure, and validate.
```
