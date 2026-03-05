# document-translation.md — Integrate DeepL document translation into your application

Finds file upload or document handling flows in your codebase and integrates the DeepL document translation lifecycle using the existing service module from the init prompts.

---

```prompt
You are adding document translation to an existing application that already has a DeepL service set up. Do not install any packages and do not modify the DeepL service module. You have full read and write access to this codebase.

Step 1 — Verify the service exists

Search dependency files for the deepl package used by this project. Then search the codebase for the service or wrapper module that imports this package. If either is missing, stop and tell the user to run 0_init.md followed by the appropriate 1_*.md for their language before continuing.

Step 2 — Read the codebase

Identify: where file uploads are received or stored — file system paths, cloud storage objects, database blobs, or temporary upload directories. What file types are handled — DOCX, PPTX, PDF, XLSX, HTML, or plain text. Whether background job processing exists — Sidekiq, Celery, BullMQ, Hangfire, or similar. How translated files will be delivered — download endpoint, email attachment, cloud storage URL, or written back to a record.

Step 3 — Choose a document translation pattern

DeepL document translation is always asynchronous at the API level — the flow is always upload, poll for completion, then download. If the project has a background job framework, translate documents in a job: upload in the job, store the document_id and key, then poll via a separate scheduled job or recursive re-enqueue until status is done. If no background framework exists, use the service's convenience method that handles the full lifecycle with a blocking poll, and call it from an existing async handler or worker thread.

Step 4 — Implement the integration

Add a translation step to the existing file handling flow. Call the service's document translation method — pass in the source file path or stream, the output path, and the source and target languages determined from the existing content metadata or user selection. Follow the project's conventions for where translated files are stored and how their locations are tracked. If a glossary is available from the project's glossary config, pass the glossary ID as an option.

Step 5 — Expose a status and download mechanism

Add status tracking if the background pattern is used — store pending, processing, or done on the relevant record. Add a download or retrieval endpoint following the project's existing API or file delivery conventions. If the project sends notifications on job completion, hook document translation completion into that system.

Step 6 — Handle errors

On authentication or quota errors, mark the record as failed with a clear error message. On document format errors from the API, return a structured error to the caller. Clean up any temporary files written during the process regardless of success or failure.

Step 7 — Print a summary

List every file created or modified and describe the end-to-end document translation flow as it will work after these changes.
```
