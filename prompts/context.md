# context.md — Improve translation quality with context strings

Finds translation call sites in your codebase where context would reduce ambiguity and adds context strings to those calls. Uses the service module from the init prompts.

---

```prompt
You are improving translation quality in an existing application that already has a DeepL service set up by adding context strings to translation calls. Do not install any packages and do not modify the DeepL service module. You have full read and write access to this codebase.

Step 1 — Verify the service exists

Search dependency files for the deepl package used by this project. Then search the codebase for the service or wrapper module that imports this package. If either is missing, stop and tell the user to run 0_init.md followed by the appropriate 1_*.md for their language before continuing.

Step 2 — Read the codebase and find translation call sites

Find every place in the codebase that calls the service's translate method. For each call site, read the surrounding code to understand what the translated text is used for — is it a button label, an email body, a product description, a form placeholder, an error message, or some other content type.

Step 3 — Identify where context would help

Flag call sites where the source text is short, could be interpreted in multiple ways, is a single word or phrase, or comes from a locale file key that is non-descriptive. These are the candidates for a context string. Strings that are already long, self-explanatory paragraphs do not need context.

Step 4 — Add context strings

For each flagged call site, write a short context string in English that describes the usage — for example a label on a login button, a heading in the invoice PDF, or a system error shown after a failed payment. Add this as the context option to the translate call. The context string is never translated and is never shown to end users — it is only used to help the translation engine resolve ambiguity.

If the call sites translate a batch of strings from a locale file, and all strings in that batch share the same UI context, pass a single shared context string for the whole batch. If strings in a batch have different contexts, split the batch by context group, translate each group separately with its own context string, then merge the results in original order.

Step 5 — Document the convention

Add a short code comment at each modified call site explaining that the context option is a hint to the translation engine and should be updated if the string's usage changes.

Step 6 — Print a summary

List every file modified, the number of call sites updated, and a few examples showing what context strings were added and why.
```
