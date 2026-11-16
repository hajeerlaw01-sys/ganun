with open("src/components/ArticleDetails.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# Update button text
old_btn = "<span>مستطيل الشرح المفصل</span>"
new_btn = "<span>وش السالفة؟ (شرح مبسط بالعامية)</span>"
if old_btn in code:
    code = code.replace(old_btn, new_btn, 1)

# Update rectangle header
old_hdr = """                  <h4 className="text-sm sm:text-base font-bold text-[#6d1a24] dark:text-[#dfb141]">
                    مستطيل الشرح التفصيلي والتأصيل النظامي
                  </h4>
                  <p className="text-[11px] text-[var(--text-secondary)] font-normal">
                    تحليل وتفكيك شامل لمقتضى المادة وأبعادها الواقعية (بدون ترقيم - قراءة متسلسلة)
                  </p>"""

new_hdr = """                  <h4 className="text-sm sm:text-base font-bold text-[#6d1a24] dark:text-[#dfb141]">
                    وش السالفة؟ (الشرح المبسط باللهجة السعودية)
                  </h4>
                  <p className="text-[11px] text-[var(--text-secondary)] font-normal">
                    تفكيك وتبسيط المادة بلهجة سعودية مفهومة تدخل المعلومة بالراس مباشرة (بدون ترقيم)
                  </p>"""

if old_hdr in code:
    code = code.replace(old_hdr, new_hdr, 1)

# Update paragraph rendering to be clean sub-cards
old_render = """            <div className={`text-[var(--text-main)] ${bodyTextClass} space-y-3 text-justify leading-loose font-normal`}>
              {article.saudiExplanation.split('\\n\\n').map((paragraph, pIdx) => {
                // Remove any numbers or numbering prefixes like 1. 2. 3.
                const cleanPara = paragraph.replace(/^\\d+\\.\\s*[^:]*?:\\s*/g, "").trim();
                if (!cleanPara) return null;
                return (
                  <p key={pIdx} className="leading-loose text-[var(--text-main)]">
                    {cleanPara}
                  </p>
                );
              })}
            </div>"""

new_render = """            <div className={`text-[var(--text-main)] ${bodyTextClass} space-y-2.5 leading-loose font-normal`}>
              {article.saudiExplanation.split('\\n\\n').map((paragraph, pIdx) => {
                const cleanPara = paragraph.replace(/^\\d+\\.\\s*[^:]*?:\\s*/g, "").trim();
                if (!cleanPara) return null;
                return (
                  <div key={pIdx} className="leading-loose text-[var(--text-main)] p-3 rounded-xl bg-[var(--card-bg)]/70 border border-[var(--border-subtle)] hover:border-[#6d1a24]/30 dark:hover:border-[#dfb141]/30 transition-colors">
                    {cleanPara}
                  </div>
                );
              })}
            </div>"""

if old_render in code:
    code = code.replace(old_render, new_render, 1)

with open("src/components/ArticleDetails.tsx", "w", encoding="utf-8") as f:
    f.write(code)

print("ArticleDetails.tsx refined for Saudi dialect presentation!")
