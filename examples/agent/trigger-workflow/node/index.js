// Trigger an Agent API workflow.
// Requires a DeepL API Pro subscription (Enterprise only).
// Set DEEPL_API_KEY and WORKFLOW_ID environment variables before running.
//
// The response contains a task_id that can be used to poll for the result.
// See the get-task-result example for how to retrieve the completed result.

const authKey = process.env.DEEPL_API_KEY;
const workflowId = process.env.WORKFLOW_ID;

const workflowRequest = JSON.stringify({
  input: { text: "Hello, translate and summarise this document." },
});

const formData = new FormData();
formData.append("workflow_request", workflowRequest);

const response = await fetch(
  `https://api.deepl.com/v1/unstable/agent/workflows/${workflowId}/trigger`,
  {
    method: "POST",
    headers: { Authorization: `DeepL-Auth-Key ${authKey}` },
    body: formData,
  }
);

const result = await response.json();

console.log(`Task ID:     ${result.task_id}`);
console.log(`Polling URL: ${result.polling_url ?? "N/A"}`);
console.log(`UI URL:      ${result.ui_url ?? "N/A"}`);
console.log();
console.log(
  `Use the get-task-result example to poll for the result with TASK_ID=${result.task_id}`
);
