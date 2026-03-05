# agent.md — Integrate DeepL Agent for content workflow translation

Checks your project for content workflow infrastructure and integrates the DeepL Agent API to trigger and retrieve workflow-based translation jobs. This feature requires a DeepL Enterprise plan.

---

```prompt
You are integrating the DeepL Agent API into an existing application that already has a DeepL service set up. Do not install any packages and do not modify the DeepL service module unless agent methods were not included in it. You have full read and write access to this codebase.

Step 1 — Verify the service exists

Search dependency files for the deepl package used by this project. Then search the codebase for the service or wrapper module that imports this package. If either is missing, stop and tell the user to run 0_init.md followed by the appropriate 1_*.md for their language before continuing.

Step 2 — Check for content workflow infrastructure

Search the codebase for signals that a content workflow or job processing system is present: job queues, webhook receivers, CMS integration, content approval pipelines, scheduled publishing flows, or batch content processing. If none of these are found, stop and tell the user that DeepL Agent is designed for content workflow integration and that this prompt cannot add a content workflow from scratch.

Step 3 — Check the service for agent methods

Look in the DeepL service module for methods that trigger a workflow and retrieve a task result — corresponding to the DeepL Agent API endpoints POST /v2/agent/trigger-workflow and GET /v2/agent/task/{task_id}. If they are missing, add only those two methods to the service following its existing style and expose them with clear names. Note this addition in your summary.

Step 4 — Read the workflow architecture

Understand how content items move through the existing pipeline: how jobs are enqueued and tracked, what identifiers are used to correlate input content with output, how completion is signalled — polling, webhooks, or event publishing.

Step 5 — Implement the agent integration

At the appropriate point in the existing workflow where translation should occur — typically after content approval or before publishing — call the service's trigger workflow method with the content payload and translation parameters. Store the returned task ID against the content record using the existing job tracking pattern. Retrieve results by calling the service's task result method, using polling or a scheduled check in line with how the workflow checks for other async job completions. On completion, write the translated content back into the pipeline using the same path that normal workflow output follows.

Step 6 — Handle errors

On authentication error, fail the workflow step immediately with a clear error. On task timeout or permanent failure status, mark the content item as translation-failed following the existing failure handling pattern and do not block the rest of the pipeline.

Step 7 — Print a summary

List every file created or modified and describe how translation tasks are triggered, tracked, and resolved within the existing workflow.
```
