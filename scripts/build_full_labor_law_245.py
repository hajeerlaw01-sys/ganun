#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
import sys

# Ensure current directory is in sys.path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from labor_part1 import register_part1
from labor_part2 import register_part2
from labor_part3 import register_part3
from labor_part4 import register_part4
from labor_part5 import register_part5

BASE_DIR = os.path.dirname(SCRIPT_DIR)
TARGET_FILE = os.path.join(BASE_DIR, "src", "data", "laborLawData.ts")


def ensure_seven_lines(explanation, title, bylaw, takeaway, rationale, tip, judgment):
    lines = [l for l in explanation.split("\n") if l.strip()]
    if len(lines) >= 7 and "1." in lines[0]:
        return explanation
    cleaned = explanation.replace("💡 **وش السالفة؟:**\n", "").replace("💡 **وش السالفة؟:**", "").strip()
    l1 = f"1. 💡 وش السالفة ومفهوم المادة: {cleaned}"
    l2 = f"2. 🎯 المقصد والغاية التشريعية: وضع المنظم هذا الحكم لتنظيم ({title}) وضمان استقرار العلاقة وحفظ حقوق الأطراف."
    l3 = "3. ⚙️ التطبيق العملي في الميدان: يلتزم الأطراف بتنفيذ مقتضى النص مباشرة وتوثيقه عبر القنوات الرسمية كمنصة قوى ومدد."
    l4 = f"4. 📜 الارتباط باللائحة والضوابط المنفذة: {bylaw if bylaw else 'أوضحت اللائحة التنفيذية الشروط الإجرائية والمدد النظامية الواجب الالتزام بها.'}"
    l5 = f"5. 🚫 الأثر والتبعات عند المخالفة: {('يترتب على المخالفة: ' + rationale) if rationale else 'أي شرط أو اتفاق يخالف هذه المادة يقع باطلاً نظاماً.'}"
    l6 = f"6. 🔍 خطأ شائع يقع فيه الكثير: {('الاعتقاد بجواز مخالفته، بينما المآل الصحيح هو: ' + takeaway) if takeaway else 'الاعتقاد بأن الاتفاق الودي يلغي حكم النظام، بينما نصوصه قطعية وآمرة.'}"
    l7 = f"7. 🛡️ توجيه «سديد» العملي لحفظ حقك: {tip if tip else 'احرص على توثيق كافة التعاملات كتابياً لحفظ حقوقك كاملة.'}"
    l8 = f"8. ⚖️ السند والتوجه القضائي: {('استقر قضاء المحاكم على: ' + judgment) if judgment else 'تتجه المحاكم والدوائر العمالية إلى تطبيق صريح النص النظامي.'}"
    return "\n".join([l1, l2, l3, l4, l5, l6, l7, l8])

articles = []

def arabic_ordinal(n):
    units = ['', 'الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة', 'السابعة', 'الثامنة', 'التاسعة', 'العاشرة']
    teens = ['', 'الحادية عشرة', 'الثانية عشرة', 'الثالثة عشرة', 'الرابعة عشرة', 'الخامسة عشرة', 'السادسة عشرة', 'السابعة عشرة', 'الثامنة عشرة', 'التاسعة عشرة']
    tens = ['', '', 'العشرون', 'الثلاثون', 'الأربعون', 'الخمسون', 'الستون', 'السبعون', 'الثمانون', 'التسعون']
    
    if n <= 10:
        return f"{units[n]} ({n})"
    elif 11 <= n <= 19:
        return f"{teens[n-10]} ({n})"
    elif n < 100:
        u = n % 10
        t = n // 10
        if u == 0:
            return f"{tens[t]} ({n})"
        else:
            unit_prefix = {1: 'الحادية', 2: 'الثانية', 3: 'الثالثة', 4: 'الرابعة', 5: 'الخامسة', 6: 'السادسة', 7: 'السابعة', 8: 'الثامنة', 9: 'التاسعة'}
            return f"{unit_prefix[u]} و{tens[t]} ({n})"
    elif n == 100:
        return f"المائة (100)"
    elif 101 <= n < 200:
        rem = n - 100
        base = arabic_ordinal(rem).split(" (")[0]
        return f"{base} بعد المائة ({n})"
    elif n == 200:
        return f"المائتان (200)"
    elif 201 <= n <= 245:
        rem = n - 200
        base = arabic_ordinal(rem).split(" (")[0]
        return f"{base} بعد المائتين ({n})"
    return f"({n})"

def add_art(
    num,
    chapter,
    title,
    keywords,
    official_text,
    bylaw,
    explanation,
    scenario_title,
    scenario,
    takeaway,
    case_title,
    court,
    claimant,
    defendant,
    facts,
    claimant_arg,
    defendant_arg,
    judgment,
    rationale,
    tip
):
    ord_str = arabic_ordinal(num)
    art_number = f"المادة {ord_str} - {chapter}"
    
    articles.append({
        "id": f"labor-m{num}",
        "systemId": "labor",
        "articleNumber": art_number,
        "title": title,
        "keywords": keywords,
        "officialText": official_text,
        "executiveBylaw": bylaw,
        "saudiExplanation": ensure_seven_lines(explanation, title, bylaw, takeaway, rationale, tip, judgment),
        "practicalExamples": [
            {
                "title": scenario_title,
                "scenario": scenario,
                "takeaway": takeaway
            }
        ],
        "courtCase": {
            "caseTitle": case_title,
            "court": court,
            "parties": {
                "claimant": claimant,
                "defendant": defendant
            },
            "facts": facts,
            "arguments": {
                "claimantArg": claimant_arg,
                "defendantArg": defendant_arg
            },
            "judgment": judgment,
            "legalRationale": rationale
        },
        "sadeedTip": tip
    })

print("Registering Labor Law Part 1 (1-41)...")
register_part1(add_art)
print("Registering Labor Law Part 2 (42-88)...")
register_part2(add_art)
print("Registering Labor Law Part 3 (89-148)...")
register_part3(add_art)
print("Registering Labor Law Part 4 (149-195)...")
register_part4(add_art)
print("Registering Labor Law Part 5 (196-245)...")
register_part5(add_art)

# Sort articles by number
articles.sort(key=lambda a: int(a["id"].replace("labor-m", "")))

print(f"Total articles registered: {len(articles)}")
expected_nums = set(range(1, 246))
actual_nums = set(int(a["id"].replace("labor-m", "")) for a in articles)

missing = expected_nums - actual_nums
if missing:
    print(f"ERROR: Missing article numbers: {sorted(missing)}")
    sys.exit(1)

duplicates = len(articles) - len(actual_nums)
if duplicates > 0:
    print(f"ERROR: Found {duplicates} duplicate articles!")
    sys.exit(1)

labor_system = {
    "id": "labor",
    "name": "نظام العمل السعودي ولائحته التنفيذية (كافة الأبواب والمواد الـ 245 كاملة)",
    "shortName": "نظام العمل",
    "category": "labor",
    "categoryLabel": "أنظمة العمل والتوظيف",
    "description": "نظام العمل السعودي الشامل ولائحته التنفيذية الصادر بالمرسوم الملكي رقم (م/51) وتاريخ 1426/8/23هـ وتعديلاته: تنظيم العقود والتوظيف، فترة التجربة، الإشعار، الفصل والتعويض (المادة 77)، حالات الفسخ (المادة 80 و81)، مكافأة نهاية الخدمة (84 و85)، ساعات العمل والإضافي، الإجازات، تشغيل النساء والأحداث، العمل البحري، المناجم والمحاجر، تفتيش العمل، المحاكم العمالية، والعقوبات.",
    "issuingAuthority": "مرسوم ملكي رقم م/51 وتاريخ 1426/8/23هـ وتعديلاته ولائحته التنفيذية - وزارة الموارد البشرية والتنمية الاجتماعية",
    "articlesCount": 245,
    "icon": "work",
    "articles": articles
}

ts_content = f"""import {{ LawSystem }} from './types';

export const LABOR_LAW_SYSTEM: LawSystem = {json.dumps(labor_system, ensure_ascii=False, indent=2)};
"""

with open(TARGET_FILE, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully generated {TARGET_FILE} with {len(articles)} articles!")
