# Prompt: Translate HTML/XML While Preserving Tags

**Use when:** Your strings contain HTML or XML markup and you need the tags to survive translation intact — neither garbled nor moved to the wrong positions.

---

## Context

By default, DeepL treats `<b>`, `<br>`, `<span>`, etc. as plain text and may translate or misplace them. Set `tag_handling` to opt into structured-markup mode.

**Endpoint:** `POST /v2/translate`

### `tag_handling` values

| Value | Behaviour |
|---|---|
| *(omitted)* | Tags treated as plain text — **do not use with HTML/XML** |
| `html` | DeepL-aware HTML parsing; preserves all standard HTML tags in place |
| `xml` | Generic XML mode; honours `splitting_tags`, `non_splitting_tags`, `ignore_tags` |

### Additional XML-mode parameters

| Parameter | Description | Example |
|---|---|---|
| `splitting_tags` | Tags that mark sentence boundaries | `["p", "br", "li"]` |
| `non_splitting_tags` | Inline tags that should not split sentences | `["b", "i", "em", "strong", "span"]` |
| `ignore_tags` | Tags whose content DeepL must NOT translate | `["code", "pre", "var"]` |
| `outline_detection` | `1` (default) or `0` — auto-detect structure |

### Example input / output

```html
<!-- Input (EN) -->
<p>The <strong>quick</strong> brown fox jumps over the <em>lazy</em> dog.</p>

<!-- Output (DE) -->
<p>Der <strong>schnelle</strong> braune Fuchs springt über den <em>faulen</em> Hund.</p>
```

**Authentication:** `Authorization: DeepL-Auth-Key <key>` header.

---

## Prompt

```prompt
You are an expert software engineer. Generate code that translates HTML and XML strings with the DeepL API, preserving all markup correctly.

Requirements:
1. Read DEEPL_API_KEY from the environment.
2. Auto-select host: :fx → api-free.deepl.com, else api.deepl.com.
3. Implement two functions:
   a. translateHtml(htmlStrings: string[], targetLang: string, sourceLang?: string)
      - Uses tag_handling: "html"
      - Returns translated HTML strings in order
   b. translateXml(xmlStrings: string[], targetLang: string, options: {
        sourceLang?: string,
        splittingTags?: string[],
        nonSplittingTags?: string[],
        ignoreTags?: string[]
      })
      - Uses tag_handling: "xml" with the provided options
      - Returns translated XML strings in order
4. After translation, verify (assert) that the number of opening tags in output matches the number in input for each string. Log a warning if they differ.
5. Handle errors:
   - 403 → AuthError
   - 456 → QuotaError
   - 429 → retry with back-off
   - other non-2xx → ApiError
6. Demo:
   a. Translate an HTML snippet (a <p> with <strong>, <em>, and an <a href> link) from EN to DE. Print before/after.
   b. Translate an XML snippet with a <code> block that must NOT be translated — use ignoreTags: ["code"]. Print before/after and confirm the code block is unchanged.

Use idiomatic code with docstrings/JSDoc and clean output.
```

---

## Example output

```
=== HTML Translation (EN → DE) ===
Input:  <p>The <strong>latest</strong> update is <a href="/changelog">available now</a>.</p>
Output: <p>Das <strong>neueste</strong> Update ist <a href="/changelog">jetzt verfügbar</a>.</p>

=== XML Translation with ignored <code> block (EN → DE) ===
Input:  <p>Call the function <code>deepl.translate()</code> to start.</p>
Output: <p>Rufen Sie die Funktion <code>deepl.translate()</code> auf, um zu beginnen.</p>
✓ <code> block content unchanged
```

---

## Caveats

- `tag_handling: "html"` does not validate whether the input is well-formed HTML. Malformed markup may produce unexpected output.
- Attributes (like `href`, `class`) are **never translated** — only text nodes.
- If you have `<script>` or `<style>` blocks, their contents are ignored automatically in `html` mode.
- In `xml` mode, the document must be well-formed XML (properly closed tags). Pass `outline_detection: 0` if DeepL incorrectly merges sentences across tag boundaries.
- Do not mix `tag_handling` with `split_sentences: 0` — it can cause erratic tag placement.
