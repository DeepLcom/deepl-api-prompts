# tag-handling.md — Enable HTML and XML tag handling in DeepL translation

Finds translation call sites in your codebase that process rich text or HTML and enables tag-aware translation on those calls. Uses the service module from the init prompts.

---

```prompt
You are enabling HTML and XML tag handling in an existing application that already has a DeepL service set up. Do not install any packages and do not modify the DeepL service module. You have full read and write access to this codebase.

Step 1 — Verify the service exists

Search dependency files for the deepl package used by this project. Then search the codebase for the service or wrapper module that imports this package. If either is missing, stop and tell the user to run 0_init.md followed by the appropriate 1_*.md for their language before continuing.

Step 2 — Identify rich-text fields and call sites

Read the codebase for: database columns or schema fields typed as text or string that are known to hold HTML — look for names like body, content, description, html_content, rich_text. Locale file values that contain HTML tags. Template rendering logic that passes untranslated HTML strings to translation calls. Existing translation call sites where the text argument may contain angle brackets or HTML entities.

Step 3 — Audit existing translation calls for HTML content

For each existing translate call site, determine whether the text it processes can contain HTML markup. A call site handles HTML if it reads from a rich-text field, receives input from a WYSIWYG editor, renders into an HTML template without escaping, or its surrounding code shows sanitise or escape operations.

Step 4 — Enable tag handling on HTML call sites

For each confirmed HTML call site, add tagHandling set to html as an option on the translate call. Do not add tagHandling to call sites that process plain text — setting it unnecessarily changes how special characters are handled and can corrupt output.

If the project also uses XML-structured content — XLIFF, TMX, or custom XML formats — set tagHandling to xml on those call sites and set the ignoreTags and splitSentences options appropriate to the format if the project has relevant content structure.

Step 5 — Handle ignore tags if needed

If specific HTML elements must be passed through untranslated — such as code blocks, variable placeholders, or product name spans — add those tag names to the ignoreTags option. Look for existing conventions in the project such as special CSS class names or data attributes that mark do-not-translate regions and map those to ignore tags.

Step 6 — Print a summary

List every file modified, the number of call sites updated, which were set to html and which to xml, and any tags added to ignoreTags.
```
