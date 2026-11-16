import glob, json, os

files = glob.glob("src/data/*LawData.ts")
for fpath in files:
    with open(fpath, "r", encoding="utf-8") as f:
        text = f.read()
    eq_idx = text.find("= {")
    if eq_idx != -1:
        json_part = text[eq_idx + 2:].rstrip()
        if json_part.endswith(";"):
            json_part = json_part[:-1].rstrip()
        try:
            data = json.loads(json_part)
            arts = data.get("articles", [])
            print(f"File {os.path.basename(fpath)}: Valid JSON, {len(arts)} articles.")
        except Exception as e:
            print(f"File {os.path.basename(fpath)}: JSON error - {e}")
    else:
        print(f"File {os.path.basename(fpath)}: '= {{' not found")
