import glob, json, os, re

files = glob.glob("src/data/*LawData.ts")
total_arts = 0
under_7 = 0
for fpath in files:
    with open(fpath, "r", encoding="utf-8") as f:
        text = f.read()
    m = re.search(r'=\s*\{', text)
    if not m:
        print(f"Skipping {fpath}: no '={{'")
        continue
    brace_idx = m.end() - 1
    json_part = text[brace_idx:].strip()
    if json_part.endswith(";"):
        json_part = json_part[:-1].strip()
    try:
        data = json.loads(json_part)
        for art in data.get("articles", []):
            total_arts += 1
            lines = [l for l in art["saudiExplanation"].split("\n") if l.strip()]
            if len(lines) < 7:
                under_7 += 1
                print(f"Under 7 in {os.path.basename(fpath)}: {art.get('id')} has {len(lines)} lines")
    except Exception as e:
        print(f"Error parsing {os.path.basename(fpath)}: {e}")

print(f"\nResult: Total articles checked = {total_arts}, Under 7 lines = {under_7}")
