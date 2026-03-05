# Prompt: DeepL Setup — Start Here

**Run this first, before any other prompt.** It asks you three quick questions about your project, stores your answers as session variables, and sends you to the right language-specific setup prompt.

This prompt does **not** write code — it is purely a questionnaire. All code generation happens in the SDK-specific init prompt it points you to at the end.

---

## How to use

1. Open your AI assistant (GitHub Copilot in VS Code, Cursor, Claude, ChatGPT, etc.).
2. You do **not** need to open your project for this step — just paste and answer.
3. Copy the prompt block below and send it.
4. Answer each question by **number** or by **name** — both work (e.g. `1` or `Node.js` are equally valid).
5. The assistant will confirm your choices, store them as session variables, and give you a direct link to the right next prompt.

---

```prompt
You are helping a developer set up DeepL in their project. Do NOT write any code yet — this is a questionnaire only.

Ask the following three questions. Present all questions at once so the developer can answer them in one reply. Accept answers by number (1, 2, 3…) or by name (e.g. "Python", "web app", "existing") — both are valid and you must handle either.

---

**Question 1 — Which language or SDK will you use?**

DeepL has official SDKs for these languages. Pick the one that matches your project:

| # | Language / Runtime | Package |
|---|---|---|
| 1 | Node.js / TypeScript | `deepl-node` (npm) |
| 2 | Python | `deepl` (pip) |
| 3 | .NET / C# | `DeepL.net` (NuGet) |
| 4 | Java / Kotlin | `deepl-java` (Maven / Gradle) |
| 5 | PHP | `deeplcom/deepl-php` (Composer) |
| 6 | Go | raw `net/http` (no official SDK) |
| 7 | Ruby | `deepl-rb` (Bundler) |
| 8 | Other / I'll use the REST API directly | |

---

**Question 2 — What kind of application is this?**

| # | Type |
|---|---|
| 1 | Web app — server-side (Next.js, Express, Django, Rails, Laravel, Spring Boot, etc.) |
| 2 | Web app — client-side / SPA (React, Vue, Angular running in the browser) |
| 3 | Backend API / microservice |
| 4 | CLI tool or script |
| 5 | Mobile app (iOS, Android, React Native, Flutter) |
| 6 | Desktop app |
| 7 | Background worker / data pipeline |
| 8 | Library or SDK (your code will be used by other developers) |

---

**Question 3 — Is this a new project or an existing one?**

| # | Answer |
|---|---|
| 1 | New project — starting from scratch |
| 2 | Existing project — adding DeepL to code that already exists |

---

Once the developer has answered all three, do the following:

## After receiving answers

### 1 — Validate and normalise

Accept flexible input. Examples of what you should recognise:
- Q1: `1`, `node`, `nodejs`, `node.js`, `typescript`, `ts`, `js` → Node.js
- Q1: `2`, `python`, `py`, `fastapi`, `django`, `flask` → Python
- Q1: `3`, `.net`, `dotnet`, `c#`, `csharp`, `asp.net`, `aspnet` → .NET
- Q1: `4`, `java`, `kotlin`, `spring`, `spring boot`, `gradle`, `maven` → Java
- Q1: `5`, `php`, `laravel`, `symfony`, `composer` → PHP
- Q1: `6`, `go`, `golang` → Go
- Q1: `7`, `ruby`, `rails`, `bundler`, `gem` → Ruby
- Q1: `8`, `other`, `rest`, `http`, `curl` → Other

If an answer is ambiguous or unrecognised, ask for clarification once with examples of valid answers.

### 2 — Show a warning for client-side web apps

If the answer to Question 2 is option 2 (client-side / SPA / browser):

Show this warning before the summary:

> ⚠️  **Security warning — do not call the DeepL API directly from browser-side code.**
>
> Your `DEEPL_API_KEY` would be visible to anyone who opens the browser dev tools, allowing them to consume your quota or run up charges on your account.
>
> **The correct approach:** create a thin server-side proxy endpoint in your backend (e.g. `POST /api/translate`) that holds the API key and calls DeepL. Your frontend calls your own endpoint. This keeps the key secret and lets you add rate limiting and caching.
>
> This prompt will set up the **server-side proxy endpoint**. You will need a server-side runtime — even a simple one (e.g. a Vercel/Netlify serverless function, a small Express server, a Cloudflare Worker). If you don't have one, consider adding one before continuing.
>
> Which server-side language should the proxy use? (Answer with a language from Question 1 — this overrides your earlier answer for the server component.)

Wait for the developer to confirm or update their language choice before proceeding.

Show a similar (less urgent) note for mobile app (option 5) and library (option 8):
- Mobile: "Do not embed `DEEPL_API_KEY` in your app binary — it can be extracted. Use a server-side proxy endpoint for all DeepL calls made on behalf of users."
- Library: "Do not hard-code or bundle a `DEEPL_API_KEY` in your library. Require callers to inject the key at initialisation time."

### 3 — Store session variables

State explicitly that you are storing these values for the rest of this conversation:

```
📌 Session variables set:
  DEEPL_SDK          = "<normalised SDK name from the table below>"
  DEEPL_APP_TYPE     = "<normalised app type>"
  DEEPL_PROJECT_STATE = "new" | "existing"
```

Normalised SDK name must be one of exactly: `node`, `python`, `dotnet`, `java`, `php`, `go`, `ruby`, `other`.
Normalised app type must be one of exactly: `web-server`, `web-client`, `api-service`, `cli`, `mobile`, `desktop`, `worker`, `library`.

Tell the developer: "I will use these values for the rest of this chat session. Any prompt you paste next will benefit from these already being set."

### 4 — Print a summary

Print a clean summary box:

```
┌─────────────────────────────────────────────┐
│  Your DeepL Setup Profile                   │
├─────────────────────────────────────────────┤
│  SDK / Language:  <full name + package>     │
│  App type:        <human-readable label>    │
│  Project state:   New project / Existing    │
└─────────────────────────────────────────────┘
```

### 5 — Link to the next prompt

Tell the developer:

"Your next step is to paste the **[SDK name] init prompt** into this same chat session (so it can see the session variables above). Here is the direct link:"

Use the correct link from this table:

| SDK | Next prompt URL |
|---|---|
| node | https://github.com/DeepLcom/ai/blob/main/prompts/0_init_node.md |
| python | https://github.com/DeepLcom/ai/blob/main/prompts/0_init_python.md |
| dotnet | https://github.com/DeepLcom/ai/blob/main/prompts/0_init_dotnet.md |
| java | https://github.com/DeepLcom/ai/blob/main/prompts/0_init_java.md |
| php | https://github.com/DeepLcom/ai/blob/main/prompts/0_init_php.md |
| go | https://github.com/DeepLcom/ai/blob/main/prompts/0_init_go.md |
| ruby | https://github.com/DeepLcom/ai/blob/main/prompts/0_init_ruby.md |
| other | https://github.com/DeepLcom/ai/blob/main/prompts/0_init_other.md |

Then say: "Once that init prompt is complete, you can run any of the feature prompts from https://github.com/DeepLcom/ai/tree/main/prompts in this same session."
```
