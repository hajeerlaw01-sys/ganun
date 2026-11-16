#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
import sys

# Ensure current directory is in sys.path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

from evidence_part1 import register_part1
from evidence_part2 import register_part2
from evidence_part3 import register_part3
from evidence_part4 import register_part4
from evidence_part5 import register_part5

BASE_DIR = os.path.dirname(SCRIPT_DIR)
TARGET_FILE = os.path.join(BASE_DIR, "src", "data", "evidenceLawData.ts")

articles = []

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
    arabic_ordinals = {
        1: "الأولى (1)", 2: "الثانية (2)", 3: "الثالثة (3)", 4: "الرابعة (4)", 5: "الخامسة (5)",
        6: "السادسة (6)", 7: "السابعة (7)", 8: "الثامنة (8)", 9: "التاسعة (9)", 10: "العاشرة (10)",
        11: "الحادية عشرة (11)", 12: "الثانية عشرة (12)", 13: "الثالثة عشرة (13)", 14: "الرابعة عشرة (14)",
        15: "الخامسة عشرة (15)", 16: "السادسة عشرة (16)", 17: "السابعة عشرة (17)", 18: "الثامنة عشرة (18)",
        19: "التاسعة عشرة (19)", 20: "العشرون (20)", 21: "الحادية والعشرون (21)", 22: "الثانية والعشرون (22)",
        23: "الثالثة والعشرون (23)", 24: "الرابعة والعشرون (24)", 25: "الخامسة والعشرون (25)", 26: "السادسة والعشرون (26)",
        27: "السابعة والعشرون (27)", 28: "الثامنة والعشرون (28)", 29: "التاسعة والعشرون (29)", 30: "الثلاثون (30)",
        31: "الحادية والثلاثون (31)", 32: "الثانية والثلاثون (32)", 33: "الثالثة والثلاثون (33)", 34: "الرابعة والثلاثون (34)",
        35: "الخامسة والثلاثون (35)", 36: "السادسة والثلاثون (36)", 37: "السابعة والثلاثون (37)", 38: "الثامنة والثلاثون (38)",
        39: "التاسعة والثلاثون (39)", 40: "الأربعون (40)", 41: "الحادية والأربعون (41)", 42: "الثانية والأربعون (42)",
        43: "الثالثة والأربعون (43)", 44: "الرابعة والأربعون (44)", 45: "الخامسة والأربعون (45)", 46: "السادسة والأربعون (46)",
        47: "السابعة والأربعون (47)", 48: "الثامنة والأربعون (48)", 49: "التاسعة والأربعون (49)", 50: "الخمسون (50)",
        51: "الحادية والخمسون (51)", 52: "الثانية والخمسون (52)", 53: "الثالثة والخمسون (53)", 54: "الرابعة والخمسون (54)",
        55: "الخامسة والخمسون (55)", 56: "السادسة والخمسون (56)", 57: "السابعة والخمسون (57)", 58: "الثامنة والخمسون (58)",
        59: "التاسعة والخمسون (59)", 60: "الستون (60)", 61: "الحادية والستون (61)", 62: "الثانية والستون (62)",
        63: "الثالثة والستون (63)", 64: "الرابعة والستون (64)", 65: "الخامسة والستون (65)", 66: "السادسة والستون (66)",
        67: "السابعة والستون (67)", 68: "الثامنة والستون (68)", 69: "التاسعة والستون (69)", 70: "السبعون (70)",
        71: "الحادية والسبعون (71)", 72: "الثانية والسبعون (72)", 73: "الثالثة والسبعون (73)", 74: "الرابعة والسبعون (74)",
        75: "الخامسة والسبعون (75)", 76: "السادسة والسبعون (76)", 77: "السابعة والسبعون (77)", 78: "الثامنة والسبعون (78)",
        79: "التاسعة والسبعون (79)", 80: "الثمانون (80)", 81: "الحادية والثمانون (81)", 82: "الثانية والثمانون (82)",
        83: "الثالثة والثمانون (83)", 84: "الرابعة والثمانون (84)", 85: "الخامسة والثمانون (85)", 86: "السادسة والثمانون (86)",
        87: "السابعة والثمانون (87)", 88: "الثامنة والثمانون (88)", 89: "التاسعة والثمانون (89)", 90: "التسعون (90)",
        91: "الحادية والتسعون (91)", 92: "الثانية والتسعون (92)", 93: "الثالثة والتسعون (93)", 94: "الرابعة والتسعون (94)",
        95: "الخامسة والتسعون (95)", 96: "السادسة والتسعون (96)", 97: "السابعة والتسعون (97)", 98: "الثامنة والتسعون (98)",
        99: "التاسعة والتسعون (99)", 100: "المائة (100)", 101: "الأولى بعد المائة (101)", 102: "الثانية بعد المائة (102)",
        103: "الثالثة بعد المائة (103)", 104: "الرابعة بعد المائة (104)", 105: "الخامسة بعد المائة (105)", 106: "السادسة بعد المائة (106)",
        107: "السابعة بعد المائة (107)", 108: "الثامنة بعد المائة (108)", 109: "التاسعة بعد المائة (109)", 110: "العاشرة بعد المائة (110)",
        111: "الحادية عشرة بعد المائة (111)", 112: "الثانية عشرة بعد المائة (112)", 113: "الثالثة عشرة بعد المائة (113)",
        114: "الرابعة عشرة بعد المائة (114)", 115: "الخامسة عشرة بعد المائة (115)", 116: "السادسة عشرة بعد المائة (116)",
        117: "السابعة عشرة بعد المائة (117)", 118: "الثامنة عشرة بعد المائة (118)", 119: "التاسعة عشرة بعد المائة (119)",
        120: "العشرون بعد المائة (120)", 121: "الحادية والعشرون بعد المائة (121)", 122: "الثانية والعشرون بعد المائة (122)",
        123: "الثالثة والعشرون بعد المائة (123)", 124: "الرابعة والعشرون بعد المائة (124)", 125: "الخامسة والعشرون بعد المائة (125)",
        126: "السادسة والعشرون بعد المائة (126)", 127: "السابعة والعشرون بعد المائة (127)", 128: "الثامنة والعشرون بعد المائة (128)",
        129: "التاسعة والعشرون بعد المائة (129)"
    }
    
    ord_str = arabic_ordinals.get(num, str(num))
    art_number = f"المادة {ord_str} - {chapter}"
    
    articles.append({
        "id": f"evidence-m{num}",
        "systemId": "evidence",
        "articleNumber": art_number,
        "title": title,
        "keywords": keywords,
        "officialText": official_text,
        "executiveBylaw": bylaw,
        "saudiExplanation": explanation,
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

print("Registering all parts of Evidence Law (129 Articles)...")
register_part1(add_art)
print(f"After Part 1: {len(articles)} articles")
register_part2(add_art)
print(f"After Part 2: {len(articles)} articles")
register_part3(add_art)
print(f"After Part 3: {len(articles)} articles")
register_part4(add_art)
print(f"After Part 4: {len(articles)} articles")
register_part5(add_art)
print(f"After Part 5: {len(articles)} articles")

# Sort by id number
articles.sort(key=lambda a: int(a["id"].replace("evidence-m", "")))

assert len(articles) == 129, f"Expected 129 articles, but got {len(articles)}"

# Verify all numbers from 1 to 129 are present
for i in range(1, 130):
    expected_id = f"evidence-m{i}"
    assert any(a["id"] == expected_id for a in articles), f"Missing article {expected_id}"

print("All 129 articles verified sequentially from 1 to 129!")

evidence_system = {
    "id": "evidence",
    "name": "نظام الإثبات ولائحته التنفيذية (كاملاً: 129 مادة)",
    "shortName": "نظام الإثبات",
    "category": "judiciary",
    "categoryLabel": "الأنظمة القضائية والإجرائية",
    "description": "نظام الإثبات السعودي الشامل (مرسوم ملكي م/43 ولائحته التنفيذية بقرار وزير العدل 3833): يضم كافة مواد النظام الـ 129 كاملة بجميع أبوابه الإحدى عشرة (الأحكام العامة، الإقرار، استجواب الخصوم، اليمين الحاسمة والمتممة، المعاينة، المحررات الرسمية والعادية وشرط الـ 100 ألف، الدليل الرقمي والواتساب والبريد، الشهادة، القرائن القضائية والنظامية، حجية الأمر المقضي، العرف، الخبرة القضائية وبيوت الخبرة، والأحكام الختامية).",
    "issuingAuthority": "مرسوم ملكي رقم م/43 وتاريخ 26/5/1443هـ - لائحة وزير العدل 3833 وتاريخ 19/8/1444هـ",
    "articlesCount": 129,
    "icon": "fact_check",
    "articles": articles
}

ts_content = f"""import {{ LawSystem }} from './types';

export const EVIDENCE_LAW_SYSTEM: LawSystem = {json.dumps(evidence_system, ensure_ascii=False, indent=2)};
"""

with open(TARGET_FILE, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully written {len(articles)} articles to {TARGET_FILE}")
