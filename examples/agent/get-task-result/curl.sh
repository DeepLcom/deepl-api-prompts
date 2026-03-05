#!/bin/bash
# Poll an Agent API task until it completes, then retrieve the result.
# Requires a DeepL API Pro subscription (Enterprise only).
# Set DEEPL_API_KEY and TASK_ID environment variables before running.

while true; do
  STATUS_RESPONSE=$(curl -s -X GET "https://api.deepl.com/v1/unstable/agent/tasks/$TASK_ID" \
    --header "Authorization: DeepL-Auth-Key $DEEPL_API_KEY")

  echo "Task status: $STATUS_RESPONSE"

  STATUS=$(echo "$STATUS_RESPONSE" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
  if [ "$STATUS" = "Completed" ]; then
    break
  fi

  echo "Task not yet complete, waiting 5 seconds..."
  sleep 5
done

echo "Task completed:"
echo "$STATUS_RESPONSE"
