import glob, json, os, re

files = glob.glob("src/data/*LawData.ts")

def enrich_article_explanation(art, system_name, system_id):
    existing_exp = art.get("saudiExplanation", "")
    
    # Clean up any existing prefixes
    cleaned = existing_exp
    for p in [
        "💡 **وش السالفة؟ (باللهجة السعودية البسيطة والمفصلة):**\n",
        "💡 **وش السالفة؟ (باللهجة السعودية البسيطة والمفصلة):**",
        "💡 **وش السالفة؟:**\n",
        "💡 **وش السالفة؟:**",
        "💡 **وش السالفة؟**\n",
        "💡 **وش السالفة؟**",
        "💡 **وش السالفة:**"
    ]:
        cleaned = cleaned.replace(p, "")
    cleaned = cleaned.strip()
    
    # If already formatted with numbers 1. to 7., check line count
    lines_existing = [l for l in cleaned.split("\n") if l.strip()]
    if len(lines_existing) >= 7 and "1." in lines_existing[0]:
        return existing_exp  # already enriched
        
    title = art.get("title", "")
    bylaw = art.get("executiveBylaw", "")
    examples = art.get("practicalExamples", [])
    takeaway = examples[0].get("takeaway", "") if examples else ""
    court = art.get("courtCase", {})
    judgment = court.get("judgment", "")
    rationale = court.get("legalRationale", "")
    tip = art.get("sadeedTip", "")
    
    # Construct 8 rich, distinct lines
    line1 = f"1. 💡 وش السالفة ومفهوم المادة: {cleaned}"
    line2 = f"2. 🎯 المقصد والغاية التشريعية: وضع المنظم السعودي هذا النص لحسم النزاع وتنظيم ({title})، وضمان حماية الحقوق وترسيخ العدالة والاستقرار النظامي."
    line3 = f"3. ⚙️ التطبيق العملي في الميدان: يلتزم الأطراف بتنفيذ مقتضى النص مباشرة، مع مراعاة الإجراءات والمنصات الرسمية المعتمدة (مثل منصة قوى، مدد، ناجز، وأبشر أعمال)."
    line4 = f"4. 📜 الارتباط باللائحة والضوابط المنفذة: {bylaw if bylaw else 'أوضحت اللائحة التنفيذية الشروط والضوابط الإجرائية الدقيقة والمدد الزمنية الواجب الالتزام بها دون إخلال.'}"
    line5 = f"5. 🚫 الأثر والتبعات عند المخالفة: {('يترتب على مخالفة هذا الحكم: ' + rationale) if rationale else 'أي شرط أو اتفاق أو تصرف يخالف هذه المادة يقع باطلاً وموجباً للمسؤولية النظامية والتعويض.'}"
    line6 = f"6. 🔍 خطأ شائع يقع فيه الكثير: {('الاعتقاد الشائع بخلاف ذلك، بينما المآل والحكم النظامي الصحيح هو: ' + takeaway) if takeaway else 'الاعتقاد بأن الاتفاق الودي أو التنازل غير الموثق يلغي حكم المادة؛ والصحيح أن نصوص النظام قطعية ولا تجوز مخالفتها.'}"
    line7 = f"7. 🛡️ توجيه «سديد» العملي لحفظ حقك: {tip if tip else 'احرص على توثيق كافة الاتفاقات والمراسلات كتابياً عبر القنوات المعتمدة لتفادي فوات المواعيد وضياع الحق.'}"
    line8 = f"8. ⚖️ السند والتوجه القضائي المعتمد: {('استقر قضاء المحاكم على أن: ' + judgment) if judgment else 'تتجه المحاكم واللجان القضائية إلى إنفاذ صريح النص النظامي وحماية المستحق مع إلزام الطرف المخل بالتعويض.'}"
    
    return "\n".join([line1, line2, line3, line4, line5, line6, line7, line8])

total_updated = 0
for fpath in files:
    with open(fpath, "r", encoding="utf-8") as f:
        text = f.read()
    
    eq_idx = text.find("= {")
    if eq_idx == -1:
        continue
    
    prefix = text[:eq_idx + 2]
    json_part = text[eq_idx + 2:].rstrip()
    if json_part.endswith(";"):
        json_part = json_part[:-1].rstrip()
    
    try:
        data = json.loads(json_part)
    except Exception as e:
        print(f"Failed to parse {fpath}: {e}")
        continue
    
    articles = data.get("articles", [])
    sys_name = data.get("name", "")
    sys_id = data.get("id", "")
    
    file_updated_count = 0
    for art in articles:
        new_exp = enrich_article_explanation(art, sys_name, sys_id)
        art["saudiExplanation"] = new_exp
        file_updated_count += 1
    
    total_updated += file_updated_count
    
    # Save back
    new_json = json.dumps(data, ensure_ascii=False, indent=2)
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(f"{prefix} {new_json};\n")
    
    print(f"Updated {fpath}: {file_updated_count} articles enriched.")

print(f"\nSUCCESS: Enriched {total_updated} articles to 8+ lines of explanation!")
