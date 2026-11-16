with open("src/components/ArticleDetails.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Replace the explanation rendering block with styled structured lines
target_old = """        {/* نص الشرح بالعامية */}
        {showExplanation && (
          <div className="bg-[var(--container-bg)] rounded-xl p-4 border border-[#6d1a24]/30 dark:border-[#dfb141]/30 shadow-xs animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#6d1a24] dark:text-[#dfb141]" />
                <h4 className="text-xs sm:text-sm font-bold text-[#6d1a24] dark:text-[#dfb141]">
                  الشرح بالعامية (وش السالفة؟)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowExplanation(false)}
                className="text-[11px] text-[var(--text-secondary)] hover:text-[#ef4444] flex items-center gap-1 cursor-pointer bg-transparent border-0"
                title="إغلاق الشرح"
              >
                <X className="w-3.5 h-3.5" />
                <span>إغلاق</span>
              </button>
            </div>
            <div className={`text-[var(--text-main)] whitespace-pre-line font-normal leading-relaxed ${bodyTextClass}`}>
              {article.saudiExplanation}
            </div>
          </div>
        )}"""

target_new = """        {/* نص الشرح بالعامية - شرح مفصل لا يقل عن 7 أسطر */}
        {showExplanation && (
          <div className="bg-[var(--container-bg)] rounded-xl p-4 border border-[#6d1a24]/30 dark:border-[#dfb141]/30 shadow-xs animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#6d1a24] dark:text-[#dfb141]" />
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-bold text-[#6d1a24] dark:text-[#dfb141]">
                    الشرح المفصل بالعامية (وش السالفة؟)
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6d1a24]/10 dark:bg-[#dfb141]/20 text-[#6d1a24] dark:text-[#dfb141] font-semibold">
                    شرح شامل (8 محاور رئيسية)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExplanation(false)}
                className="text-[11px] text-[var(--text-secondary)] hover:text-[#ef4444] flex items-center gap-1 cursor-pointer bg-transparent border-0"
                title="إغلاق الشرح"
              >
                <X className="w-3.5 h-3.5" />
                <span>إغلاق</span>
              </button>
            </div>
            
            {/* عرض أسطر الشرح المنظمة بشكل مريح وواضح للعين */}
            <div className={`text-[var(--text-main)] ${bodyTextClass} space-y-2`}>
              {article.saudiExplanation.split('\\n').filter(Boolean).map((line, idx) => {
                const colonIdx = line.indexOf(':');
                if (colonIdx > 0 && colonIdx < 50) {
                  const header = line.slice(0, colonIdx + 1);
                  const body = line.slice(colonIdx + 1);
                  return (
                    <div 
                      key={idx} 
                      className="p-2.5 rounded-lg bg-[var(--card-bg)] border border-[var(--border-subtle)] leading-relaxed transition-colors hover:border-[#6d1a24]/30 dark:hover:border-[#dfb141]/40"
                    >
                      <span className="font-bold text-[#6d1a24] dark:text-[#dfb141] ml-1.5 inline-block">
                        {header}
                      </span>
                      <span className="font-normal text-[var(--text-main)]">
                        {body}
                      </span>
                    </div>
                  );
                }
                return (
                  <p key={idx} className="p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-subtle)] leading-relaxed">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        )}"""

if target_old in text:
    text = text.replace(target_old, target_new)
    print("Replaced explanation block with beautiful multi-line cards!")
else:
    print("target_old not matched directly")

# Also update button label
btn_old = "<span>الشرح بالعامية</span>"
btn_new = "<span>الشرح بالعامية (مفصل)</span>"
if btn_old in text:
    text = text.replace(btn_old, btn_new, 1)
    print("Updated button label with (مفصل)!")

with open("src/components/ArticleDetails.tsx", "w", encoding="utf-8") as f:
    f.write(text)

print("ArticleDetails.tsx updated!")
