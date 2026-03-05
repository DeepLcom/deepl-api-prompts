#!/bin/bash
# Trigger an Agent API workflow.
# Requires a DeepL API Pro subscription (Enterprise only).
# Set DEEPL_API_KEY and WORKFLOW_ID environment variables before running.
#
# The response contains a task_id that can be used to poll for results.

curl -X POST "https://api.deepl.com/v1/unstable/agent/workflows/$WORKFLOW_ID/trigger" \
  --header "Authorization: DeepL-Auth-Key $DEEPL_API_KEY" \
  --form "workflow_request={\"input\": {\"text\": \"Hello, translate and summarise this document.\"}}"
