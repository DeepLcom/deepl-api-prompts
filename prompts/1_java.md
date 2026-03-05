# 1_java.md — Set up DeepL in a Java project

Adds the `deepl-java` dependency, creates a translation service using the official SDK, and wires it into your existing Spring Boot or plain Java project. Run this after `0_init.md` if you answered Java.

**SDK:** `com.deepl.api:deepl-java` (Maven / Gradle) — `import com.deepl.api.*;`

---

```prompt
You are integrating the DeepL Java SDK into an existing project. You have full read and write access to this codebase. Your job is to add the dependency, configure the API key, create a translation service that matches this project's coding style, and wire it into the framework already in use.

If DEEPL_SDK, DEEPL_APP_TYPE, and DEEPL_PROJECT_STATE were set earlier in this conversation by 0_init.md, use those values. Otherwise infer them from the codebase.

Step 1 — Read the project before writing anything

Find out: whether the build system is Maven (pom.xml) or Gradle (build.gradle or build.gradle.kts). The Java version. Which framework is in use — Spring Boot, Spring Framework, Quarkus, Micronaut, or plain Java. Whether and how dependency injection is used. How configuration is read — Spring application.properties or application.yml, environment variables, or a config class. Where service interfaces and implementations live and what package and naming conventions are used. Whether deepl-java is already a dependency or api.deepl.com is already called anywhere.

Step 2 — Add the deepl-java dependency

Add `com.deepl.api:deepl-java:1.7.0` to the build file. For Maven add it inside the dependencies element. For Gradle add it as an implementation dependency using the syntax appropriate for Groovy or Kotlin DSL. If you cannot run build commands, insert it directly and note the developer must sync.

Step 3 — Configure the API key

Add DEEPL_API_KEY to the project's configuration using the same pattern already in use for other secrets. For Spring Boot, bind it to a `deepl.api-key` property via `@ConfigurationProperties` or `@Value`, with an environment variable placeholder. Validate at startup and throw a clear exception if the key is missing or blank.

Step 4 — Create the DeepL service interface and implementation

This is the single class through which the entire project interacts with DeepL. All other prompts will inject and use it without modifying it, so the interface must expose the full SDK surface. Create the interface and implementation in the package matching this project's service layer conventions.

The implementation should accept the API key via constructor injection, instantiate `new Translator(authKey)`, and throw `IllegalArgumentException` immediately if the key is blank.

The interface and implementation must expose the following groups:

Text translation: a method that calls `translator.translateText(texts, sourceLang, targetLang, options)` — pass null as sourceLang to auto-detect — returning the string from each `TextResult` via `.getText()`. Provide a single-string overload and a list overload. The list overload must split inputs into sublists of 50 and concatenate results, since that is the per-request limit.

Document translation: a method wrapping `translator.translateDocument(inputFile, outputFile, sourceLang, targetLang, options)` for the full flow. Also expose `translator.translateDocumentUpload(inputFile, sourceLang, targetLang, options)` returning a `DocumentHandle`, `translator.translateDocumentGetStatus(handle)` returning a `DocumentStatus`, and `translator.translateDocumentDownload(handle, outputFile)` for callers that need fine-grained control.

Glossary management: wrap `translator.createGlossary(name, sourceLang, targetLang, entries)`, `translator.getGlossary(glossaryId)`, `translator.listGlossaries()`, `translator.deleteGlossary(glossaryId)`, `translator.getGlossaryEntries(glossaryId)`, and `translator.getGlossaryLanguagePairs()` — expose each as an interface method that passes through all arguments and return values unchanged.

Utility: expose `translator.getUsage()`, `translator.getSourceLanguages()`, and `translator.getTargetLanguages()`.

Catch `DeepLException` subclasses including `AuthorizationException`, `QuotaExceededException`, and `TooManyRequestsException` at the service boundary. Use the same Javadoc, annotation, and coding conventions as the rest of the codebase. For Spring, annotate with `@Service`. If DEEPL_APP_TYPE is worker, add `CompletableFuture`-returning async variants alongside the synchronous ones. If DEEPL_APP_TYPE is library, provide a plain constructor without Spring annotations.

Step 5 — Register the service

For Spring Boot, ensure the implementation class is component-scanned or declared as a `@Bean`, and that the configuration properties class is enabled with `@EnableConfigurationProperties`. For other DI frameworks, follow the existing registration pattern. For plain Java, instantiate the service in the entry point using `System.getenv("DEEPL_API_KEY")`.

Step 6 — Add a translation endpoint if applicable

If the project is a web server or API service, add a controller following the existing REST controller style. Inject the service via constructor injection and call the translate method. Use the same request and response object patterns already in use.

Step 7 — Add a validation test

Add an integration test in the test directory. Use `assumeTrue` to skip if DEEPL_API_KEY is not set so CI does not fail. Call `translator.getUsage()` to verify connectivity, then call translate with "Hello, world!" to German and assert the result is non-empty. Use the existing test framework conventions. Print the exact test run command at the end of your response.

Step 8 — Update the README

Document DEEPL_API_KEY in the environment variables or configuration section. Note that keys ending in :fx are free-tier.

End by printing a summary of every file created or modified and the commands needed to build, configure, and validate.
```
