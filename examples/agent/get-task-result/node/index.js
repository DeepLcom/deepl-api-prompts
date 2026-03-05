// Poll an Agent API task until it completes, then retrieve the result.
// Requires a DeepL API Pro subscription (Enterprise only).
// Set DEEPL_API_KEY and TASK_ID environment variables before running.

const authKey = process.env.DEEPL_API_KEY;
const taskId = process.env.TASK_ID;

console.log(`Polling task ${taskId}...`);

let task;

while (true) {
  const response = await fetch(
    `https://api.deepl.com/v1/unstable/agent/tasks/${taskId}`,
    {
      method: "GET",
      headers: { Authorization: `DeepL-Auth-Key ${authKey}` },
    }
  );

  task = await response.json();
  const status = task.status;
  console.log(`Status: ${status}`);

  if (status === "Completed") {
    break;
  }

  await new Promise((resolve) => setTimeout(resolve, 5000));
}

// The result contains presigned URLs valid for 5 minutes.
const contentUrl = task?.result?.content_url;
if (contentUrl) {
  const contentResponse = await fetch(contentUrl);
  const content = await contentResponse.json();
  console.log(`\nResult language: ${content.language}`);
  console.log(`Result content:  ${content.content ?? "N/A"}`);
} else {
  console.log(`\nTask result: ${JSON.stringify(task, null, 2)}`);
}
