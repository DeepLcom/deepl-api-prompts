#!/bin/bash
# Translate a document using the DeepL API.
# Set DEEPL_API_KEY to your DeepL API key before running.
# For a paid DeepL API account, change the host to api.deepl.com.
#
# Step 1: Upload the document. Replace "document.txt" with your file path.
UPLOAD_RESPONSE=$(curl -X POST "https://api-free.deepl.com/v2/document" \
  --header "Authorization: DeepL-Auth-Key $DEEPL_API_KEY" \
  --form "file=@document.txt" \
  --form "target_lang=DE")

echo "Upload response: $UPLOAD_RESPONSE"

DOCUMENT_ID=$(echo "$UPLOAD_RESPONSE" | grep -o '"document_id":"[^"]*"' | cut -d'"' -f4)
DOCUMENT_KEY=$(echo "$UPLOAD_RESPONSE" | grep -o '"document_key":"[^"]*"' | cut -d'"' -f4)

echo "Document ID: $DOCUMENT_ID"
echo "Document key: $DOCUMENT_KEY"

# Step 2: Poll the document status until it is done.
while true; do
  STATUS_RESPONSE=$(curl -X POST "https://api-free.deepl.com/v2/document/$DOCUMENT_ID" \
    --header "Authorization: DeepL-Auth-Key $DEEPL_API_KEY" \
    --header "Content-Type: application/json" \
    --data "{\"document_key\": \"$DOCUMENT_KEY\"}")

  echo "Status: $STATUS_RESPONSE"

  STATUS=$(echo "$STATUS_RESPONSE" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
  if [ "$STATUS" = "done" ]; then
    break
  elif [ "$STATUS" = "error" ]; then
    echo "Translation failed."
    exit 1
  fi

  echo "Waiting for translation to complete..."
  sleep 5
done

# Step 3: Download the translated document.
curl -X POST "https://api-free.deepl.com/v2/document/$DOCUMENT_ID/result" \
  --header "Authorization: DeepL-Auth-Key $DEEPL_API_KEY" \
  --header "Content-Type: application/json" \
  --data "{\"document_key\": \"$DOCUMENT_KEY\"}" \
  --output "document_translated.txt"

echo "Translated document saved to document_translated.txt"
