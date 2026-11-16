import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LawSystem, LawArticle } from '../data/lawsData';
import { Search, X, ChevronLeft, Scale, CheckCircle2 } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  systems: LawSystem[];
  onSelectArticle: (systemId: string, articleId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  systems,
  onSelectArticle
}) => {
  const [query, setQuery] = useState('');
  const [selectedSystemFilter, setSelectedSystemFilter] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedSystemFilter('all');
    }
  }, [isOpen]);

  const quickSearches = [
    'المادة 77 عمل',
    'المادة 720 قواعد فقهية',
    'المادة 138 تعويض معنوي',
    'رسائل واتساب إثبات',
    'مكافأة نهاية الخدمة',
    'فسخ العقد والشرط الجزائي',
    'عربون',
    'حيازة العقار والشفعة',
    'تستر تجاري',
    'تضامن المدينين',
    'الدعوى غير المباشرة',
    'مرض الموت'
  ];

  // Helper to highlight matched terms
  const highlightMatch = (text: string, search: string) => {
    if (!search.trim() || !text) return text;
    const parts = text.split(new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-[#b38719]/25 text-[#92400e] dark:text-[#fde68a] font-bold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase().trim();
    const numberMatch = lowerQuery.match(/(?:مادة|المادة)?\s*(\d+)/);
    const targetNumber = numberMatch ? numberMatch[1] : null;

    const filteredSystems = selectedSystemFilter === 'all'
      ? systems
      : systems.filter(s => s.id === selectedSystemFilter);

    const exactMatches: { system: LawSystem; article: LawArticle; matchSnippet: string; score: number }[] = [];
    const otherMatches: { system: LawSystem; article: LawArticle; matchSnippet: string; score: number }[] = [];

    filteredSystems.forEach(system => {
      system.articles.forEach(article => {
        let matched = false;
        let snippet = '';
        let score = 0;

        // 1. Direct number match
        if (targetNumber && (article.id.endsWith(`-m${targetNumber}`) || article.articleNumber.includes(targetNumber))) {
          matched = true;
          score = 100;
          snippet = `مطابقة رقم المادة المباشر: ${article.articleNumber}`;
          exactMatches.push({ system, article, matchSnippet: snippet, score });
          return;
        }

        // 2. Title match
        if (article.title.toLowerCase().includes(lowerQuery) || article.articleNumber.toLowerCase().includes(lowerQuery)) {
          matched = true;
          score = 50;
          snippet = article.title;
        } 
        // 3. Article Keywords or System Keywords match
        else if (article.keywords && article.keywords.some(k => k.toLowerCase().includes(lowerQuery))) {
          matched = true;
          score = 30;
          snippet = `الكلمات المفتاحية: ${article.keywords.join('، ')}`;
        }
        else if (system.keywords && system.keywords.some(k => k.toLowerCase().includes(lowerQuery))) {
          matched = true;
          score = 25;
          snippet = `من نظام: ${system.name} (مطابقة الكلمة المفتاحية)`;
        } 
        // 4. Official text match
        else if (article.officialText && article.officialText.toLowerCase().includes(lowerQuery)) {
          matched = true;
          score = 20;
          const idx = article.officialText.toLowerCase().indexOf(lowerQuery);
          const start = Math.max(0, idx - 30);
          const end = Math.min(article.officialText.length, idx + 70);
          snippet = `من النص الرسمي: ...${article.officialText.substring(start, end)}...`;
        } 
        // 5. Saudi explanation match
        else if (article.saudiExplanation && article.saudiExplanation.toLowerCase().includes(lowerQuery)) {
          matched = true;
          score = 15;
          const idx = article.saudiExplanation.toLowerCase().indexOf(lowerQuery);
          const start = Math.max(0, idx - 30);
          const end = Math.min(article.saudiExplanation.length, idx + 70);
          snippet = `من الشرح المبسط: ...${article.saudiExplanation.substring(start, end)}...`;
        } 
        // 6. Court case match
        else if (article.courtCase && (article.courtCase.facts?.toLowerCase().includes(lowerQuery) || article.courtCase.judgment?.toLowerCase().includes(lowerQuery))) {
          matched = true;
          score = 10;
          snippet = `من الحكم القضائي: ${article.courtCase.caseTitle}`;
        }

        if (matched) {
          otherMatches.push({ system, article, matchSnippet: snippet, score });
        }
      });
    });

    otherMatches.sort((a, b) => b.score - a.score);
    return [...exactMatches, ...otherMatches];
  }, [query, selectedSystemFilter, systems]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (searchResults.length > 0) {
        const top = searchResults[0];
        onSelectArticle(top.system.id, top.article.id);
        onClose();
      }
    }
  };

  const handlePrimaryAction = () => {
    if (searchResults.length > 0) {
      const top = searchResults[0];
      onSelectArticle(top.system.id, top.article.id);
      onClose();
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1C1C1E] rounded-3xl shadow-2xl overflow-hidden border border-[#e5e5ea] dark:border-[#2C2C2E] p-6 sm:p-8 flex flex-col max-h-[90vh]">
        
        {/* زر الإغلاق X بأعلى النافذة */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 left-5 p-1 text-black dark:text-white hover:opacity-60 transition cursor-pointer bg-transparent border-0"
          title="إغلاق"
        >
          <X className="w-5 h-5 stroke-[2]" />
        </button>

        {/* الترويسة المتميزة بنمط ثمانية: شعار قانون 01 + السؤال بالخط العريض */}
        <div className="text-center pt-2 pb-5 space-y-1.5">
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">
            قانون 01
          </h2>
          <h3 className="text-base sm:text-lg font-bold text-black dark:text-white pt-1">
            أيـش تبحث عنه؟
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-normal max-w-sm mx-auto">
            ابحث في نصوص ومواد وشروحات الأنظمة واللوائح القضائية
          </p>
        </div>

        {/* حقل الإدخال الهادئ بنمط بطاقة ثمانية */}
        <div className="space-y-3">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب رقم المادة (مثل 77، 720) أو كلمة (تعويض، عربون)..."
              className="w-full bg-white dark:bg-[#2C2C2E] border border-[#d1d1d6] dark:border-[#3A3A3C] py-3.5 pr-11 pl-12 rounded-2xl text-xs sm:text-sm text-black dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-black dark:focus:border-white transition"
            />
            <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-black dark:hover:text-white py-1 px-1.5 rounded transition"
              >
                مسح
              </button>
            )}
          </div>

          {/* فلتر الأنظمة (أزرار هادئة) */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 text-xs">
            <button
              type="button"
              onClick={() => setSelectedSystemFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedSystemFilter === 'all'
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-neutral-100 text-neutral-600 dark:bg-[#2C2C2E] dark:text-neutral-300'
              }`}
            >
              كافة الأنظمة
            </button>
            {systems.slice(0, 5).map(sys => (
              <button
                key={sys.id}
                type="button"
                onClick={() => setSelectedSystemFilter(sys.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedSystemFilter === sys.id
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-neutral-100 text-neutral-600 dark:bg-[#2C2C2E] dark:text-neutral-300'
                }`}
              >
                {sys.shortName}
              </button>
            ))}
          </div>

          {/* الزر الأسود العريض بالكامل (نفس تصميم زر متابعة في الصورة المرفقة) */}
          <button
            type="button"
            onClick={handlePrimaryAction}
            className="w-full bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black py-3.5 rounded-2xl font-bold text-sm transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{searchResults.length > 0 ? `الانتقال إلى المادة (${searchResults[0].article.articleNumber})` : 'متابعـــــة'}</span>
          </button>
        </div>

        {/* الكلمات الشائعة أو نتائج البحث المباشرة */}
        <div className="mt-4 flex-1 overflow-y-auto max-h-[35vh] space-y-2 pr-0.5 pl-0.5">
          {!query ? (
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold text-neutral-400 block">شائع البحث عنه:</span>
              <div className="flex flex-wrap gap-1.5">
                {quickSearches.map((tag, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-[#2C2C2E] dark:hover:bg-[#3A3A3C] text-neutral-700 dark:text-neutral-300 transition cursor-pointer border-0"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 space-y-1">
              <p className="text-sm font-semibold text-black dark:text-white">لم نجد نتائج مطابقة لـ "{query}"</p>
              <p className="text-xs">جرّب البحث برقم المادة أو كلمة مفتاحية أخرى</p>
            </div>
          ) : (
            searchResults.slice(0, 50).map(({ system, article, matchSnippet, score }, idx) => {
              const isDirectHit = score >= 100;
              return (
                <div
                  key={`${system.id}-${article.id}-${idx}`}
                  onClick={() => {
                    onSelectArticle(system.id, article.id);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl cursor-pointer transition border flex items-start justify-between gap-3 group ${
                    isDirectHit
                      ? 'bg-neutral-50 dark:bg-[#2C2C2E] border-black/30 dark:border-white/30'
                      : 'bg-white dark:bg-[#1C1C1E] border-neutral-200 dark:border-[#2C2C2E] hover:border-black/40 dark:hover:border-white/40'
                  }`}
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-bold text-black dark:text-white flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white"></span>
                        {article.articleNumber.split('-')[0]?.trim()}
                      </span>
                      <span className="text-neutral-500 dark:text-neutral-400 font-medium">
                        · {system.shortName}
                      </span>
                      {article.status === 'amended' && (
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                          مادة معدلة
                        </span>
                      )}
                      {article.status === 'repealed' && (
                        <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                          مادة ملغية
                        </span>
                      )}
                      {isDirectHit && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mr-auto flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          مطابقة مباشرة
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-black dark:text-white">
                      {highlightMatch(article.title, query)}
                    </h4>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {highlightMatch(matchSnippet, query)}
                    </p>
                  </div>

                  <div className="self-center p-1 rounded-lg text-neutral-400 group-hover:text-black dark:group-hover:text-white transition">
                    <ChevronLeft className="w-4 h-4" />
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
