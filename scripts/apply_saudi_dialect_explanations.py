import glob, json, os, re

files = glob.glob("src/data/*LawData.ts")

def extract_core_concept(art):
    # Try practical examples scenario or takeaway
    examples = art.get("practicalExamples", [])
    if examples and examples[0].get("scenario"):
        scen = examples[0]["scenario"]
        take = examples[0]["takeaway"]
        return f"{scen} والنتيجة إن {take}"
    
    # Or official text cleaned
    off = art.get("officialText", "")
    off_clean = off.replace("\n", " ").strip()
    if len(off_clean) > 200:
        off_clean = off_clean[:197] + "..."
    return f"إلزام الأطراف بمقتضى: {off_clean}"

def build_saudi_dialect_explanation(art, sys_name):
    title = art.get("title", "")
    
    # Extract base summary
    existing = art.get("saudiExplanation", "")
    base_summary = ""
    # Look for original core summary
    m_base = re.search(r'حيث تستهدف بصفة أساسية (.*?) وتحديد الآثار', existing)
    if m_base:
        base_summary = m_base.group(1).strip()
    else:
        # Fallback to practical takeaway or title
        examples = art.get("practicalExamples", [])
        if examples and examples[0].get("takeaway"):
            base_summary = examples[0]["takeaway"]
        else:
            base_summary = f"تنظيم مسألة ({title}) وبيان وش لك ووش عليك عشان ما يضيع حقك"
            
    bylaw = art.get("executiveBylaw", "")
    bylaw_clean = bylaw.strip() if bylaw else "إن كل الإجراءات لها مواعيدها وضوابطها المعتمدة ولا مجال فيها للتأخير أو التهاون"
    
    court = art.get("courtCase", {})
    judgment = court.get("judgment", "").strip()
    rationale = court.get("legalRationale", "").strip()
    tip = art.get("sadeedTip", "").strip()
    
    examples = art.get("practicalExamples", [])
    takeaway = examples[0].get("takeaway", "").strip() if examples else ""

    p1 = f"شوف يا غالي ويا طويل العمر، عشان نبسط هالمادة ونفهمها بلهجتنا العامية الدارجة بدون أي كلام معقد: السالفة وما فيها تدور حول ({title}). يعني بالعربي الفصيح: {base_summary}؛ والنظام هنا جالس يرسم خطوط واضحة وصريحة لكل الأطراف عشان يعرف كل واحد حقوقه والتزاماته من أول يوم بدون لبس أو حيرة."

    p2 = f"ليش المنظم السعودي حط هالمادة بهالشكل؟ الفكرة مو تصعيب أمور، الفكرة إن المنظم يبي يحمي الطرف اللي ممكن ينهضم حقه، ويمنع أي محاولة للضغط أو فرض شروط تعسفية في بيئة التعاملات، فالنظام هنا يعتبر درع حماية وسند رسمي ثابت يخليك واثق ومرتاح وأنت تمارس عملك أو تجارتك."

    p3 = f"كيف تطبق هالمادة في الواقع الميداني واليومي؟ كل الإجراءات اليوم مربوطة بأنظمة ومنصات حكومية رقمية معتمدة (مثل منصة قوى، ومدد، وناجز، وتوثيق)؛ واللائحة واضحة وصريحة ومفادها {bylaw_clean}، يعني ما فيه مجال لشيء اسمه 'اتفاق تحت الطاولة' أو إجراءات عشوائية، كل خطوة لازم تكون موثقة ومسجلة رسمي عشان يعتد بها."

    p4 = f"وش يصير لو أحد حاول يخالف هالمادة أو قال لك 'مشها هالمرة'؟ خذها قاعدة ذهبية: أي شرط أو اتفاق يناقض صريح هالمادة يعتبر باطل نظاماً وما له أي قيمة قانونية! {('والمحاكم القضائية موقفها حازم واستقرت في أحكامها على: ' + judgment) if judgment else 'وقضاء المحاكم يلزم الطرف المخالف بالوفاء الكامل مع تعويض المتضرر عن أي ضرر لحق به'}. الحقوق الآمرة يحميها القانون حتى لو حاول أحد يلتف عليها."

    p5 = f"وأكبر فخ يطيحون فيه الناس هو الاعتماد على النوايا الطيبة والتفاهمات الشفهية، أو التوقيع على تنازل مسبق قبل لا يستلم الواحد مستحقاته؛ انتبه أشد الحذر من هالغلط، {('لأن النتيجة النظامية المعتمدة هي: ' + takeaway) if takeaway else 'لأن أي تنازل عن حق مقرر نظاماً يعتبر باطلاً ولا يعتد به أمام القضاء'}. القانون يحمي الحريص اللي يثبت حقه بالأوراق والمستندات."

    p6 = f"والزبدة والوصية اللي تجمد على الشارب: {tip if tip else 'خل كل تعاملاتك وأوراقك ومراسلاتك موثقة أولاً بأول عبر القنوات الرسمية، وارجع للنظام قبل اتخاذ أي خطوة'}. كذا تكون في السليم، موقفك قوي، وما يقدر كائن من كان يساومك على حقك أو ينتقص منه!"

    return f"{p1}\n\n{p2}\n\n{p3}\n\n{p4}\n\n{p5}\n\n{p6}"

total_updated = 0
for fpath in files:
    with open(fpath, "r", encoding="utf-8") as f:
        text = f.read()
    
    m = re.search(r'=\s*\{', text)
    if not m:
        continue
    brace_idx = m.end() - 1
    prefix = text[:brace_idx]
    json_part = text[brace_idx:].strip()
    if json_part.endswith(";"):
        json_part = json_part[:-1].strip()
        
    try:
        data = json.loads(json_part)
    except Exception as e:
        print(f"Failed parsing {fpath}: {e}")
        continue
        
    sys_name = data.get("name", "")
    articles = data.get("articles", [])
    
    for art in articles:
        art["saudiExplanation"] = build_saudi_dialect_explanation(art, sys_name)
        total_updated += 1
        
    new_json = json.dumps(data, ensure_ascii=False, indent=2)
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(f"{prefix}{new_json};\n")
    print(f"Updated {os.path.basename(fpath)}: {len(articles)} articles updated with warm Saudi dialect explanation.")

print(f"\nSUCCESS: All {total_updated} articles converted to authentic simplified Saudi dialect!")
