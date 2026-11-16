import re

with open("src/data/laborLawData.ts", "r", encoding="utf-8") as f:
    text = f.read()

# Check JSON structure
# Find the exported object: export const LABOR_LAW_SYSTEM: LawSystem = { ... };
prefix = "import { LawSystem } from './types';\n\nexport const LABOR_LAW_SYSTEM: LawSystem = "
start_idx = text.find(prefix)
if start_idx != -1:
    json_part = text[start_idx + len(prefix):].rstrip()
    if json_part.endswith(";"):
        json_part = json_part[:-1].rstrip()
    import json
    data = json.loads(json_part)
    print("Successfully parsed LABOR_LAW_SYSTEM with", len(data["articles"]), "articles!")
else:
    print("Prefix not matched exactly, looking for JSON...")
