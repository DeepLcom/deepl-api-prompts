# 1_ruby.md — Set up DeepL in a Ruby project

Installs `deepl-rb`, creates a service module that exposes the full DeepL SDK surface, and wires it into your existing Rails, Sinatra, or plain Ruby project. Run this after `0_init.md` if you answered Ruby.

**SDK:** `deepl-rb` (Bundler) — `require 'deepl'`

---

```prompt
You are integrating the DeepL Ruby gem into an existing project. You have full read and write access to this codebase. Your job is to install the gem, configure the API key, create a service module that exposes the full SDK surface in the project's style, and wire it into the framework already in use.

If DEEPL_SDK, DEEPL_APP_TYPE, and DEEPL_PROJECT_STATE were set earlier in this conversation by 0_init.md, use those values. Otherwise infer them from the codebase.

Step 1 — Read the project before writing anything

Find out: which framework is in use — Ruby on Rails, Sinatra, Hanami, or plain Ruby. The Ruby version from .ruby-version, .tool-versions, or the Gemfile. Where service classes or modules live and what naming conventions are used. How environment variables are read — dotenv, Figaro, Rails credentials, or ENV directly. Whether deepl-rb is already in the Gemfile or api.deepl.com is already called anywhere.

Step 2 — Install deepl-rb

Add `gem 'deepl-rb', require: 'deepl'` to the Gemfile then run bundle install. If you cannot run commands, add the gem line and note the developer must run bundle install.

Step 3 — Configure the API key

Add DEEPL_API_KEY to the project's environment config using the same pattern in use for other secrets. Add a placeholder to .env.example with a comment that free-tier keys end in :fx. Add a `DeepL.configure` block in the appropriate location — for Rails use config/initializers/deepl.rb, for other frameworks put it wherever third-party configuration lives. Set `config.auth_key` from credentials or ENV and raise a clear runtime error if the value is missing.

Step 4 — Create the DeepL service module

This is the single module through which the entire project interacts with DeepL. All other prompts will use it without modifying it, so it must expose the full SDK surface. Create it in whatever location and filename style matches the project's conventions.

Expose the following groups of functionality as class methods or module functions depending on the project's style:

Text translation: a method that calls `DeepL.translate(text, source_lang, target_lang, options)` — pass nil as source_lang to auto-detect — reading the `.text` attribute from each returned result. Accept both a single string and an array. Batch array inputs at 50 items per call by slicing and merging results.

Document translation: a method that calls `DeepL.document.translate(input_path, output_path, source_lang, target_lang, options)` for the full document lifecycle. Also expose `DeepL.document.upload(input_path, source_lang, target_lang, options)` returning a document handle, `DeepL.document.status(handle)` returning the current status, and `DeepL.document.download(handle, output_path)` for callers that need to manage the lifecycle themselves.

Glossary management: wrap `DeepL.glossaries.create(name, source_lang, target_lang, entries)`, `DeepL.glossaries.find(glossary_id)`, `DeepL.glossaries.all`, `DeepL.glossaries.destroy(glossary_id)`, `DeepL.glossaries.entries(glossary_id)`, and `DeepL.glossaries.language_pairs` — expose each as a named method passing through all arguments and return values unchanged.

Utility: expose `DeepL.usage` and `DeepL.languages`.

Handle `DeepL::Exceptions::AuthorizationFailed` and `DeepL::Exceptions::LimitExceeded` at the service boundary and re-raise using the project's error handling conventions. Use the same coding style, documentation conventions, and module organisation as the rest of the codebase. If DEEPL_APP_TYPE is library, accept auth_key as a keyword argument to an initializer rather than relying on global configuration. If DEEPL_APP_TYPE is web-client, add a comment that this service must only be called from server-side code.

Step 5 — Add a translation endpoint if applicable

For Rails, add a controller action following the existing controller and routing style. For Sinatra, add a route following the existing pattern. If DEEPL_APP_TYPE is web-client, a server-side endpoint is required.

Step 6 — Add a validation script or Rake task

Create a script or Rake task that calls `DeepL.usage` to confirm connectivity, then calls the translate method with "Hello, world!" to German and prints the result. Load dotenv if available. Print the exact command to run at the end of your response.

Step 7 — Update the README

Add DEEPL_API_KEY to the environment variables section. Note that keys ending in :fx are free-tier.

End by printing a summary of every file created or modified, the bundle install command, and the validation command.
```
