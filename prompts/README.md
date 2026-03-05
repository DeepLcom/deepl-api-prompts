# Prompts

> Drop-in prompts that analyse your existing codebase and integrate DeepL features directly into it.

Each prompt is designed to be pasted into an AI assistant (GitHub Copilot, Cursor, Claude, ChatGPT, etc.) **while your project is open**. The assistant reads your actual code, makes decisions based on your stack, and writes integration code — not isolated demos.

---

## Start here

**[0_init.md](./0_init.md) — Set up DeepL in your project**

Run this first. It asks three questions about your project, warns you about security pitfalls, sets session variables used by all other prompts, and points you to the right SDK-specific setup prompt below.

---

## SDK-specific setup

After running `0_init.md`, run the prompt for your language. It installs the SDK, creates an idiomatic service wrapper, wires it into your framework, and validates the setup.

| Prompt | Language / runtime | SDK |
|---|---|---|
| [1_node.md](./1_node.md) | Node.js / TypeScript | `deepl-node` (npm) |
| [1_python.md](./1_python.md) | Python | `deepl` (pip) |
| [1_dotnet.md](./1_dotnet.md) | .NET / C# | `DeepL.net` (NuGet) |
| [1_java.md](./1_java.md) | Java | `deepl-java` (Maven / Gradle) |
| [1_php.md](./1_php.md) | PHP | `deeplcom/deepl-php` (Composer) |
| [1_go.md](./1_go.md) | Go | raw `net/http` (no official SDK) |
| [1_ruby.md](./1_ruby.md) | Ruby | `deepl-rb` (Bundler) |
| [1_other.md](./1_other.md) | Any other language | DeepL REST API |

`0_init.md` will tell you exactly which one to run based on your answers.

---

## Feature prompts

Run these after `0_init.md`. Each one checks that DeepL is already set up — if not, it will tell you to run `0_init.md` first.

| Prompt | What it does to your codebase |
|---|---|
| [translate.md](./translate.md) | Finds your i18n layer or user-facing text and wires DeepL into it |
| [glossary.md](./glossary.md) | Analyses your app's domain, builds a terminology glossary, and enforces it in translations |
| [formality.md](./formality.md) | Adds a per-user formal/informal language preference and threads it through translation calls |
| [detect-language.md](./detect-language.md) | Finds where user text enters the app and adds automatic language detection |
| [document-translation.md](./document-translation.md) | Integrates DeepL's async document translation into your existing file upload flow |
| [context.md](./context.md) | Improves existing translation calls by adding surrounding context to ambiguous strings |
| [tag-handling.md](./tag-handling.md) | Finds rich text and HTML fields and switches those translation calls to tag-aware mode |
| [voice.md](./voice.md) | Scans for audio infrastructure and integrates real-time speech translation via WebSocket *(Enterprise)* |
| [agent.md](./agent.md) | Scans for content workflows and integrates AI-powered document translation and analysis *(Enterprise)* |

---

## How to use

1. Open your project in an AI assistant that has **file access** to your codebase (GitHub Copilot in VS Code, Cursor, Claude with a project, etc.).
2. Copy the entire contents of a prompt file — or just the fenced ` ```prompt ``` ` block inside it.
3. Paste it into the chat and send. The assistant will read your files, decide what to do, and make changes.
4. Review the summary the assistant prints at the end.

**Always start with `0_init.md`** on a project that doesn't have DeepL yet.

---

## Recommended order for a new integration

```
0_init.md                # Answer three questions, sets session variables
1_node.md (or 1_*.md)   # Install SDK + create the full DeepL service module
translate.md             # Wire it into your i18n / text layer
glossary.md              # Lock down your product terminology
formality.md             # (optional) Per-user register control
detect-language.md       # (optional) Auto-detect incoming text language
tag-handling.md          # (optional) If your app has rich text / HTML content
document-translation.md  # (optional) If your app handles file uploads
context.md               # (optional) Fine-tune quality of short / ambiguous strings
voice.md                 # (optional) If your app streams or records audio
agent.md                 # (optional) If your app processes documents or runs content workflows
```
