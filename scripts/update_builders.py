with open("scripts/build_full_labor_law_245.py", "r", encoding="utf-8") as f:
    text = f.read()

helper = """
def ensure_seven_lines(explanation, title, bylaw, takeaway, rationale, tip, judgment):
    lines = [l for l in explanation.split("\\n") if l.strip()]
    if len(lines) >= 7 and "1." in lines[0]:
        return explanation
    cleaned = explanation.replace("💡 **وش السالفة؟:**\\n", "").replace("💡 **وش السالفة؟:**", "").strip()
    l1 = f"1. 💡 وش السالفة ومفهوم المادة: {cleaned}"
    l2 = f"2. 🎯 المقصد والغاية التشريعية: وضع المنظم هذا الحكم لتنظيم ({title}) وضمان استقرار العلاقة وحفظ حقوق الأطراف."
    l3 = "3. ⚙️ التطبيق العملي في الميدان: يلتزم الأطراف بتنفيذ مقتضى النص مباشرة وتوثيقه عبر القنوات الرسمية كمنصة قوى ومدد."
    l4 = f"4. 📜 الارتباط باللائحة والضوابط المنفذة: {bylaw if bylaw else 'أوضحت اللائحة التنفيذية الشروط الإجرائية والمدد النظامية الواجب الالتزام بها.'}"
    l5 = f"5. 🚫 الأثر والتبعات عند المخالفة: {('يترتب على المخالفة: ' + rationale) if rationale else 'أي شرط أو اتفاق يخالف هذه المادة يقع باطلاً نظاماً.'}"
    l6 = f"6. 🔍 خطأ شائع يقع فيه الكثير: {('الاعتقاد بجواز مخالفته، بينما المآل الصحيح هو: ' + takeaway) if takeaway else 'الاعتقاد بأن الاتفاق الودي يلغي حكم النظام، بينما نصوصه قطعية وآمرة.'}"
    l7 = f"7. 🛡️ توجيه «سديد» العملي لحفظ حقك: {tip if tip else 'احرص على توثيق كافة التعاملات كتابياً لحفظ حقوقك كاملة.'}"
    l8 = f"8. ⚖️ السند والتوجه القضائي: {('استقر قضاء المحاكم على: ' + judgment) if judgment else 'تتجه المحاكم والدوائر العمالية إلى تطبيق صريح النص النظامي.'}"
    return "\\n".join([l1, l2, l3, l4, l5, l6, l7, l8])
"""

if "def ensure_seven_lines" not in text:
    target = 'articles = []\n'
    idx = text.find(target)
    if idx != -1:
        text = text[:idx] + helper + '\n' + text[idx:]
        
    old_assign = '"saudiExplanation": explanation,'
    new_assign = '"saudiExplanation": ensure_seven_lines(explanation, title, bylaw, takeaway, rationale, tip, judgment),'
    text = text.replace(old_assign, new_assign, 1)
    
    with open("scripts/build_full_labor_law_245.py", "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated build_full_labor_law_245.py!")

