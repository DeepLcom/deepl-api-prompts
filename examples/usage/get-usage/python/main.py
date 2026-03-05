"""Retrieve usage and quota for the current DeepL API billing period."""

import os
import deepl

auth_key = os.environ["DEEPL_API_KEY"]

translator = deepl.Translator(auth_key)

usage = translator.get_usage()

if usage.any_limit_reached:
    print("Translation limit reached.")
else:
    print(f"Characters: {usage.character.count} of {usage.character.limit} used")
