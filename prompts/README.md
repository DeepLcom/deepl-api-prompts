# Prompts

> Copy-paste prompts for AI assistants (Claude, ChatGPT, GitHub Copilot, Cursor, etc.)

Paste any prompt below directly into your AI assistant of choice. Each prompt is self-contained — it includes the relevant DeepL API context so the model can generate accurate, working code without needing extra files.

---

## Available Prompts

| File | What it generates |
|---|---|
| [translate.md](./translate.md) | Translate one or many strings via the DeepL API |
| [detect-language.md](./detect-language.md) | Detect the source language of arbitrary text |
| [glossary.md](./glossary.md) | Use an existing glossary in a translation request |
| [create-glossary.md](./create-glossary.md) | Create and populate a DeepL glossary |
| [manage-glossary.md](./manage-glossary.md) | List, inspect, and delete glossaries |
| [document-translation.md](./document-translation.md) | Upload and translate a whole document (PDF, DOCX, PPTX) |
| [formality.md](./formality.md) | Control the formality register of translations |
| [context.md](./context.md) | Pass surrounding context to improve translation quality |
| [tag-handling.md](./tag-handling.md) | Translate HTML/XML while preserving markup |

---

## How to use these prompts

1. Open your AI assistant.
2. Open the prompt file you want.
3. Copy the fenced `prompt` block.
4. Paste it into the chat, optionally appending: *"Use \<language\>"* or *"Add error handling for quota exceeded"*.
5. The assistant will generate ready-to-run code.

---

## Tips for better results

- **Specify your runtime** up front: *"…in Python using the official deepl SDK"* vs *"…in Node.js using raw fetch"*.
- **Mention your framework** if relevant: *"…inside an Express middleware"* or *"…as a Next.js API route"*.
- **Ask for tests**: append *"Also write a Jest test"* or *"Add a pytest fixture"* to any prompt.
- All prompts assume `DEEPL_API_KEY` is available in the environment. If yours is stored differently, append *"The key is in an AWS Secrets Manager secret named `deepl/key`"*.
