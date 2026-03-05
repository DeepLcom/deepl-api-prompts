"""
Translate a document using the DeepL API.
Creates a sample .txt file, translates it to German, and writes the output.
The SDK handles the 3-step upload/poll/download flow automatically.
"""

import os
import pathlib
import deepl

auth_key = os.environ["DEEPL_API_KEY"]

translator = deepl.Translator(auth_key)

input_path = pathlib.Path("document.txt")
output_path = pathlib.Path("document_translated.txt")

# Create a sample input file if it does not already exist.
if not input_path.exists():
    input_path.write_text("Hello, world! This is a sample document for translation.")

translator.translate_document_from_filepath(
    input_path,
    output_path,
    target_lang="DE",
)

print(f"Translated document saved to: {output_path}")
print(f"Contents: {output_path.read_text()}")
