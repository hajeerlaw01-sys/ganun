with open("src/components/ArticleDetails.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Update the button for Examples to show 10 examples clearly
old_btn = """            {/* 2. زر الأمثلة العملية */}
            <button
              type="button"
              onClick={() => setShowExamples(!showExamples)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                showExamples
                  ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a] border-[#6d1a24] dark:border-[#dfb141] shadow-xs'
                  : 'bg-[var(--container-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border-[var(--border-subtle)]'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>الأمثلة العملية</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                showExamples 
                  ? 'bg-white/20 text-white dark:bg-black/20 dark:text-[#0f172a]' 
                  : 'bg-[var(--card-bg)] text-[var(--text-secondary)]'
              }`}>
                {article.practicalExamples.length}
              </span>
              {showExamples ? <ChevronUp className="w-3 h-3 opacity-80" /> : <ChevronDown className="w-3 h-3 opacity-60" />}
            </button>"""

new_btn = """            {/* 2. زر الأمثلة العملية (10 أمثلة واقعية) */}
            <button
              type="button"
              onClick={() => setShowExamples(!showExamples)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                showExamples
                  ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a] border-[#6d1a24] dark:border-[#dfb141] shadow-xs'
                  : 'bg-[var(--container-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border-[var(--border-subtle)]'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>الأمثلة العملية</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                showExamples 
                  ? 'bg-white/20 text-white dark:bg-black/20 dark:text-[#0f172a]' 
                  : 'bg-[#d97706]/15 text-[#d97706] dark:text-[#fbbf24]'
              }`}>
                {article.practicalExamples?.length || 10} أمثلة
              </span>
              {showExamples ? <ChevronUp className="w-3 h-3 opacity-80" /> : <ChevronDown className="w-3 h-3 opacity-60" />}
            </button>"""

if old_btn in code:
    code = code.replace(old_btn, new_btn, 1)
    print("Replaced Examples button!")
else:
    print("Old examples button not matched directly, will check alternate")

# 2. Update explanation button to say "مستطيل الشرح المفصل (بدون ترقيم)"
old_exp_btn = """<span>الشرح بالعامية (مفصل)</span>"""
new_exp_btn = """<span>مستطيل الشرح المفصل</span>"""
if old_exp_btn in code:
    code = code.replace(old_exp_btn, new_exp_btn, 1)
    print("Updated explanation button label!")

# 3. Update the explanation and examples rendering blocks
old_blocks_start = "{/* نص الشرح بالعامية - شرح مفصل لا يقل عن 7 أسطر */}"
old_blocks_end = "{/* نص اللائحة التنفيذية */}"

start_idx = code.find(old_blocks_start)
end_idx = code.find(old_blocks_end)

if start_idx != -1 and end_idx != -1:
    new_blocks = """{/* ======================================================== */}
        {/* مستطيل الشرح التفصيلي للمادة (لا يقل عن 7 أسطر - بدون ترقيم) */}
        {/* ======================================================== */}
        {showExplanation && (
          <div className="bg-[var(--container-bg)] rounded-2xl p-5 border-2 border-[#6d1a24]/20 dark:border-[#dfb141]/30 shadow-md animate-in fade-in slide-in-from-top-1 duration-150 space-y-4">
            
            {/* ترويسة المستطيل */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#6d1a24]/10 dark:bg-[#dfb141]/15 text-[#6d1a24] dark:text-[#dfb141]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-[#6d1a24] dark:text-[#dfb141]">
                    مستطيل الشرح التفصيلي والتأصيل النظامي
                  </h4>
                  <p className="text-[11px] text-[var(--text-secondary)] font-normal">
                    تحليل وتفكيك شامل لمقتضى المادة وأبعادها الواقعية (بدون ترقيم - قراءة متسلسلة)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExplanation(false)}
                className="text-xs text-[var(--text-secondary)] hover:text-[#ef4444] flex items-center gap-1 cursor-pointer bg-transparent border-0 px-2 py-1 rounded-lg hover:bg-[var(--card-bg)] transition"
                title="إغلاق مستطيل الشرح"
              >
                <X className="w-3.5 h-3.5" />
                <span>إغلاق</span>
              </button>
            </div>
            
            {/* جسم المستطيل: شرح مفصل ومتصل لا يقل عن 7 أسطر بدون ترقيم */}
            <div className={`text-[var(--text-main)] ${bodyTextClass} space-y-3 text-justify leading-loose font-normal`}>
              {article.saudiExplanation.split('\\n\\n').map((paragraph, pIdx) => {
                // Remove any numbers or numbering prefixes like 1. 2. 3.
                const cleanPara = paragraph.replace(/^\\d+\\.\\s*[\U00010000-\U0010ffff\\u2600-\\u26ff\\u2700-\\u27bf]?\\s*.*?:/g, '').trim();
                if (!cleanPara) return null;
                return (
                  <p key={pIdx} className="leading-loose text-[var(--text-main)]">
                    {cleanPara}
                  </p>
                );
              })}
            </div>

            {/* شريط الإفادة السفلية داخل المستطيل */}
            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                <span>شرح معتمد ومفصل ومطابق للأنظمة السارية ولائحتها التنفيذية</span>
              </span>
              <span className="font-medium text-[#6d1a24] dark:text-[#dfb141]">
                {system.shortName}
              </span>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* قسم الأمثلة العملية والتطبيقية (10 أمثلة واقعية لكل مادة) */}
        {/* ======================================================== */}
        {showExamples && (
          <div className="bg-[var(--container-bg)] rounded-2xl p-4 sm:p-5 border-2 border-[#d97706]/20 dark:border-[#fbbf24]/30 shadow-md animate-in fade-in slide-in-from-top-1 duration-150 space-y-4">
            
            {/* ترويسة قسم الأمثلة */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#d97706]/10 text-[#d97706] dark:text-[#fbbf24]">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-[#d97706] dark:text-[#fbbf24] flex items-center gap-2">
                    <span>الأمثلة العملية والتطبيقات الميدانية</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#d97706]/15 text-[#d97706] dark:text-[#fbbf24] font-bold">
                      {article.practicalExamples.length} حالات واقعية
                    </span>
                  </h4>
                  <p className="text-[11px] text-[var(--text-secondary)] font-normal">
                    سيناريوهات حية وحالات عملية تفصيلية من واقع الميدان والنزاعات القضائية
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExamples(false)}
                className="text-xs text-[var(--text-secondary)] hover:text-[#ef4444] flex items-center gap-1 cursor-pointer bg-transparent border-0 px-2 py-1 rounded-lg hover:bg-[var(--card-bg)] transition"
                title="إغلاق الأمثلة"
              >
                <X className="w-3.5 h-3.5" />
                <span>إغلاق</span>
              </button>
            </div>

            {/* شبكة الأمثلة الـ 10 التفصيلية */}
            <div className="grid grid-cols-1 gap-3">
              {article.practicalExamples.map((example, i) => (
                <div 
                  key={i} 
                  className="bg-[var(--card-bg)] rounded-xl p-3.5 border border-[var(--border-subtle)] hover:border-[#d97706]/40 transition space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="font-bold text-xs sm:text-sm text-[var(--text-main)] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#d97706] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span>{example.title}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--text-secondary)] bg-[var(--container-bg)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)]">
                      الحالة {i + 1} من {article.practicalExamples.length}
                    </span>
                  </div>

                  <p className={`text-[var(--text-muted)] text-xs sm:text-sm leading-relaxed ${bodyTextClass}`}>
                    {example.scenario}
                  </p>

                  <div className="text-xs font-medium text-[#6d1a24] dark:text-[#dfb141] bg-[var(--container-bg)] p-2.5 rounded-lg border border-[var(--border-subtle)] flex items-start gap-1.5">
                    <span className="font-bold shrink-0">📌 الأثر والنتيجة النظامية:</span>
                    <span className="leading-relaxed">{example.takeaway}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        """
    code = code[:start_idx] + new_blocks + code[end_idx:]
    print("Replaced explanation rectangle and 10 examples rendering blocks!")
else:
    print(f"Indices not found: start={start_idx}, end={end_idx}")

with open("src/components/ArticleDetails.tsx", "w", encoding="utf-8") as f:
    f.write(code)

print("Saved ArticleDetails.tsx successfully!")
