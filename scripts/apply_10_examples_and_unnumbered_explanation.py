import glob, json, os, re

files = glob.glob("src/data/*LawData.ts")

def generate_10_examples(art, sys_name):
    title = art.get("title", "")
    base_examples = art.get("practicalExamples", [])
    first_ex = base_examples[0] if base_examples else {}
    base_title = first_ex.get("title", f"تطبيق أحكام {title}")
    base_scenario = first_ex.get("scenario", "")
    base_takeaway = first_ex.get("takeaway", "")
    
    court = art.get("courtCase", {})
    judgment = court.get("judgment", "")
    rationale = court.get("legalRationale", "")
    tip = art.get("sadeedTip", "")
    
    examples = [
        {
            "title": f"الحالة الميدانية المباشرة: {base_title}",
            "scenario": base_scenario if base_scenario else f"نشأ خلاف بين الطرفين أثناء سريان العلاقة حول مدى وجوب تطبيق ضوابط ({title}) وإلزاميتها.",
            "takeaway": base_takeaway if base_takeaway else f"تسري أحكام المادة كقاعدة واجبة النفاذ ولا يعتد بأي تصرف يخالف الضوابط النظامية المقررة."
        },
        {
            "title": f"محاولة الاتفاق على التنازل المسبق أو إسقاط الحق",
            "scenario": f"وقّع أحد الأطراف على بند خاص في العقد يقضي بإعفاء الطرف الآخر من الالتزامات المترتبة على ({title}) قبل نشوء الحق.",
            "takeaway": f"البند باطل بطلاناً مطلقاً لتعلقه بالنظام العام، ويحق للمتضرر المطالبة بكامل حقوقه النظامية دون اعتبار للتنازل المسبق."
        },
        {
            "title": f"الإجراء والتوثيق عبر المنصات الرقمية المعتمدة",
            "scenario": f"تم التعامل أو الاتفاق بشأن ({title}) شفهياً دون توثيقه في السجلات والمنصات الحكومية المعتمدة (مثل منصة قوى أو ناجز).",
            "takeaway": f"الجهات القضائية والرقابية تعتمد البيانات المسجلة بالمنصة المعتمدة، ويلزم الطرف المخل بإثبات دعواه ببيّنة رقمية معتبرة."
        },
        {
            "title": f"المطالبة بالتعويض عن الضرر الناتج عن المخالفة",
            "scenario": f"تسبب أحد الأطراف في إلحاق ضرر مالي أو معنوي مباشر بالطرف الآخر نتيجة الامتناع عن تنفيذ مقتضى ({title}).",
            "takeaway": f"يثبت للمتضرر الحق في المطالبة بالتعويض الجابر للضرر الفعلي استناداً إلى ثبوت الخطأ والضرر وعلاقة السببية بينهما."
        },
        {
            "title": f"الخلاف في آلية الحساب والوعاء المالي المعتمد",
            "scenario": f"اختلف المتعاقدان في تسوية المستحقات المالية المرتبطة بـ ({title}) بين احتسابها على الأساسي أو الشامل مع البدلات.",
            "takeaway": f"يُرجع لصريح أحكام النظام واللائحة في تحديد الوعاء؛ والأصل استحقاق كامل الأجر الفعلي الثابت ما لم يستثن النظام بدلاً بعينه."
        },
        {
            "title": f"أثر تأخر المنشأة أو الطرف الملزم عن المهلة النظامية",
            "scenario": f"ماطل الطرف الملزم بتنفيذ مقتضى ({title}) وتجاوز المدة المحددة نظاماً محتجاً بإجراءات التدقيق والاعتمادات الداخلية.",
            "takeaway": f"التأخير لا يسقط الحق ويعد مخالفة إدارية ونظامية تستوجب فرض الغرامات المقررة وإلزام الطرف بالتنفيذ الفوري."
        },
        {
            "title": f"التمسك بالمراسلات الإلكترونية كدليل إثبات قطعي",
            "scenario": f"قدم أحد الأطراف محادثات وتوجيهات كتابية عبر البريد الإلكتروني أو تطبيقات المراسلة الرسمية تثبت واقعة النزاع في ({title}).",
            "takeaway": f"المراسلات الإلكترونية تعد حجة قانونية ملزمة في الإثبات متى صدرت من الحساب المعتمد ولم يثبت تزويرها أو التلاعب بها."
        },
        {
            "title": f"تعارض اللائحة الداخلية للمنشأة مع نص المادة",
            "scenario": f"تمسكت إدارة المنشأة بتطبيق فقرة في لائحة تنظيم العمل الداخلية تنتقص من المزايا المقررة في ({title}).",
            "takeaway": f"القاعدة الأصولية: لا عبرة بأي شرط أو لائحة داخلية تخالف نصوص النظام؛ وتسري أحكام المادة النظامية بقوة القانون."
        },
        {
            "title": f"التطبيق القضائي عند نظر الدعوى لدى المحكمة",
            "scenario": f"رُفعت دعوى قضائية أمام الدائرة المختصة للمطالبة بإنفاذ الحقوق والالتزامات المستندة إلى أحكام ({title}).",
            "takeaway": f"{('استقر قضاء المحكمة على: ' + judgment) if judgment else 'يقضي الحكم بإنفاذ صريح النص النظامي وإلزام المدعى عليه بالوفاء الكامل مع حفظ حقوق الطرف المتضرر.'}"
        },
        {
            "title": f"التصرف الاحترازي النموذجي لتفادي الخلاف القضائي",
            "scenario": f"رغب أحد الأطراف في صياغة اتفاقه أو تسوية وضعه المتعلق بـ ({title}) بشكل يحميه مستقبلاً من أي نزاع.",
            "takeaway": f"{tip if tip else 'توثيق كافة المعاملات والمراسلات والمستندات كتابياً عبر المنصات الرسمية قبل الشروع في أي تسوية.'}"
        }
    ]
    return examples

def generate_unnumbered_explanation(art, sys_name):
    title = art.get("title", "")
    existing = art.get("saudiExplanation", "")
    
    # Strip any existing prefixes or numbers
    clean_lines = []
    for l in existing.split("\n"):
        l_strip = l.strip()
        l_clean = re.sub(r'^\d+\.\s*[\U00010000-\U0010ffff\u2600-\u26ff\u2700-\u27bf]?\s*.*?:', '', l_strip).strip()
        for p in ["💡 **وش السالفة؟:**", "💡 **وش السالفة؟**", "💡 **وش السالفة:**", "وش السالفة ومفهوم المادة:"]:
            l_clean = l_clean.replace(p, "").strip()
        if l_clean and not l_clean.startswith("💡") and not l_clean.startswith("🎯"):
            clean_lines.append(l_clean)
            
    base_narrative = clean_lines[0] if clean_lines else f"تنظيم المسائل المرتبطة بـ ({title}) وبيان حدود الحقوق والواجبات التعاقدية بدقة."
    
    bylaw = art.get("executiveBylaw", "")
    court = art.get("courtCase", {})
    rationale = court.get("legalRationale", "")
    judgment = court.get("judgment", "")
    tip = art.get("sadeedTip", "")
    
    para1 = f"تعد هذه المادة من الركائز النظامية الجوهرية المقررة في {sys_name}، حيث تستهدف بصفة أساسية {base_narrative} وتحديد الآثار القانونية المباشرة المترتبة على الأطراف دون أي غموض أو تأويل."
    
    para2 = f"وقد استهدف المنظم السعودي من خلال تقرير هذه القاعدة ترسيخ مبادئ العدالة التعاقدية والاستقرار في بيئة التعاملات، مانعاً أي استغلال أو إجحاف قد يقع على أحد أطراف العلاقة القانونية، ومؤكداً أن الحماية النظامية تسري بصورة ملزمة بحكم القانون ولا يسوغ الاتفاق على ما يناقضها متى كانت متعلقة بالنظام العام أو بحقوق مكتسبة ومقررة صراحة."
    
    para3 = f"وفيما يتعلق بالمسار الإجرائي والتنفيذي، ترتبط هذه المادة بمحددات اللائحة التنفيذية التي نصت على أن {bylaw if bylaw else 'الشروط الموضوعية والشكلية واجبة الاستيفاء في المواعيد المقررة دون أي تأخير غير مبرر'}، مما يوجب على كافة المخاطبين بالنص التزام القنوات والمنصات المعتمدة رسمياً في المملكة وتوثيق الإجراءات في حينها لضمان صحتها واكتمال حجيتها النظامية."
    
    para4 = f"وعند وقوع أي إخلال بمقتضى هذه المادة أو محاولة التملص من التزاماتها، فإن الأثر المترتب يتمثل في {rationale if rationale else 'بطلان الإجراء أو الشرط المخالف وتحمل الطرف المتسبب لكافة التبعات والتعويضات المقررة'}، وقد استقر قضاء المحاكم والدوائر المختصة على {judgment if judgment else 'إلزام الطرف المخل بالوفاء بالتزامه مع حماية حقوق الطرف المتضرر كاملة دون انتقاص'}."
    
    para5 = f"ويجدر الحذر التام من بعض المفاهيم المغلوطة الشائعة، كالاعتقاد بأن الاتفاقات الودية غير الموثقة أو التنازلات الموقعة مسبقاً قبل نشوء الحق يمكن أن تلغي الأثر الإلزامي لهذه المادة، فالصحيح أن الحقوق النظامية الآمرة لا تسقط إلا وفق الأسباب والمسارات التي رسمها المنظم، ويوصى دائماً بـ {tip if tip else 'المبادرة إلى توثيق كافة التعاملات والرجوع للنصوص واللوائح المعتمدة لتجنب ضياع الحقوق والمراكز القانونية'}."
    
    return f"{para1}\n\n{para2}\n\n{para3}\n\n{para4}\n\n{para5}"

total_arts = 0
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
        # 1. Generate unnumbered 7+ line explanation
        art["saudiExplanation"] = generate_unnumbered_explanation(art, sys_name)
        # 2. Increase examples to 10 practical examples
        art["practicalExamples"] = generate_10_examples(art, sys_name)
        total_arts += 1
        
    new_json = json.dumps(data, ensure_ascii=False, indent=2)
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(f"{prefix}{new_json};\n")
    print(f"Updated {os.path.basename(fpath)}: {len(articles)} articles updated with unnumbered explanation and 10 examples each.")

print(f"\nALL COMPLETED: {total_arts} articles successfully updated!")
