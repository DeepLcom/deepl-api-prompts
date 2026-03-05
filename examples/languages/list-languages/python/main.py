"""List all supported source and target languages in the DeepL API."""

import os
import deepl

auth_key = os.environ["DEEPL_API_KEY"]

translator = deepl.Translator(auth_key)

source_languages = translator.get_source_languages()
print("Source languages:")
for lang in source_languages:
    print(f"  {lang.code}: {lang.name}")

target_languages = translator.get_target_languages()
print("\nTarget languages:")
for lang in target_languages:
    formality = " (supports formality)" if lang.supports_formality else ""
    print(f"  {lang.code}: {lang.name}{formality}")
