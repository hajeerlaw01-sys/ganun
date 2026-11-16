import React, { useState, useRef, useEffect, useMemo } from 'react';
import { LawSystem, SAUDI_LAW_SYSTEMS } from '../data/lawsData';
import { 
  ChevronDown, 
  BookOpen, 
  Hash, 
  Search, 
  X, 
  Check,
  Sparkles,
  Filter
} from 'lucide-react';

interface SystemSelectorProps {
  systems?: LawSystem[];
  selectedSystemId: string;
  selectedArticleId: string;
  onSelectSystem: (systemId: string) => void;
  onSelectArticle: (articleId: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export const SystemSelector: React.FC<SystemSelectorProps> = ({
  selectedSystemId,
  selectedArticleId,
  onSelectSystem,
  onSelectArticle,
}) => {
  const currentSystem = SAUDI_LAW_SYSTEMS.find(s => s.id === selectedSystemId) || SAUDI_LAW_SYSTEMS[0];
  const articles = currentSystem?.articles || [];
  const currentArticle = articles.find(a => a.id === selectedArticleId) || articles[0];

  // Popover state
  const [isSystemOpen, setIsSystemOpen] = useState(false);
  const [isArticleOpen, setIsArticleOpen] = useState(false);

  // Search queries inside dropdowns
  const [systemSearch, setSystemSearch] = useState('');
  const [articleSearch, setArticleSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'amended' | 'repealed'>('all');

  const systemDropdownRef = useRef<HTMLDivElement>(null);
  const articleDropdownRef = useRef<HTMLDivElement>(null);
  const articleSearchInputRef = useRef<HTMLInputElement>(null);
  const systemSearchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (systemDropdownRef.current && !systemDropdownRef.current.contains(e.target as Node)) {
        setIsSystemOpen(false);
      }
      if (articleDropdownRef.current && !articleDropdownRef.current.contains(e.target as Node)) {
        setIsArticleOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when opening dropdown
  useEffect(() => {
    if (isArticleOpen) {
      setTimeout(() => articleSearchInputRef.current?.focus(), 50);
    } else {
      setArticleSearch('');
    }
  }, [isArticleOpen]);

  useEffect(() => {
    if (isSystemOpen) {
      setTimeout(() => systemSearchInputRef.current?.focus(), 50);
    } else {
      setSystemSearch('');
    }
  }, [isSystemOpen]);

  // Filter systems based on search & keywords
  const filteredSystems = useMemo(() => {
    if (!systemSearch.trim()) return SAUDI_LAW_SYSTEMS;
    const q = systemSearch.toLowerCase().trim();
    return SAUDI_LAW_SYSTEMS.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.shortName.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.briefSummary?.toLowerCase().includes(q) ||
      s.keywords?.some(k => k.toLowerCase().includes(q))
    );
  }, [systemSearch]);

  // Filter articles based on search & status filter
  const filteredArticles = useMemo(() => {
    let result = articles;

    if (statusFilter !== 'all') {
      result = result.filter(a => {
        if (statusFilter === 'active') return !a.status || a.status === 'active';
        return a.status === statusFilter;
      });
    }

    if (!articleSearch.trim()) {
      return result;
    }

    const q = articleSearch.toLowerCase().trim();
    // Check if query is just a number (e.g. "77", "138", "720")
    const isNumberQuery = /^\d+$/.test(q);

    return result.filter(art => {
      if (isNumberQuery) {
        // Match article id (civil-m77) or article number string (المادة 77)
        if (art.id.endsWith(`-m${q}`) || art.articleNumber.includes(q)) {
          return true;
        }
      }
      return (
        art.articleNumber.toLowerCase().includes(q) ||
        art.title.toLowerCase().includes(q) ||
        (art.keywords && art.keywords.some(k => k.toLowerCase().includes(q)))
      );
    });
  }, [articles, articleSearch, statusFilter]);

  // Quick jump presets based on current system
  const quickJumpArticles = useMemo(() => {
    if (currentSystem.id === 'civil') {
      return [
        { label: 'المادة 1 (التطبيق)', id: 'civil-m1' },
        { label: 'المادة 32 (العقد والتراضي)', id: 'civil-m32' },
        { label: 'المادة 120 (الفعل الضار)', id: 'civil-m120' },
        { label: 'المادة 138 (الضرر المعنوي)', id: 'civil-m138' },
        { label: 'المادة 178 (الشرط الجزائي)', id: 'civil-m178' },
        { label: 'المادة 307 (البيع)', id: 'civil-m307' },
        { label: 'المادة 407 (الإيجار)', id: 'civil-m407' },
        { label: 'المادة 720 (القواعد الكلية 41)', id: 'civil-m720' },
      ];
    } else if (currentSystem.id === 'pleadings') {
      return [
        { label: 'المادة 1 (الاختصاص)', id: 'pleadings-m1' },
        { label: 'المادة 31 (الاختصاص النوعي)', id: 'pleadings-m31' },
        { label: 'المادة 65 (حضور الخصوم)', id: 'pleadings-m65' },
        { label: 'المادة 169 (الأحكام)', id: 'pleadings-m169' },
        { label: 'المادة 242 (الختامية)', id: 'pleadings-m242' },
      ];
    } else if (currentSystem.id === 'labor') {
      return [
        { label: 'المادة 8 (بطلان التنازل)', id: 'labor-m8' },
        { label: 'المادة 77 (إنهاء العقد)', id: 'labor-m77' },
        { label: 'المادة 80 (الفصل)', id: 'labor-m80' },
        { label: 'المادة 84 (مكافأة نهاية الخدمة)', id: 'labor-m84' },
      ];
    }
    return articles.slice(0, 4).map(a => ({ label: a.articleNumber, id: a.id }));
  }, [currentSystem.id, articles]);

  return (
    <div className="w-full">
      {/* System and Article Selection - Clean, Unified Height, Subtle Borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* ======================================================== */}
        {/* 1. اختيار النظام القانوني - القائمة المنسدلة الذكية */}
        {/* ======================================================== */}
        <div className="bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--border-subtle)] transition relative" ref={systemDropdownRef}>
          <div className="text-xs font-semibold text-[var(--text-secondary)] mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[var(--text-main)]">
              <BookOpen className="w-3.5 h-3.5 text-[#b38719] dark:text-[#dfb141]" />
              <span>النظام القانوني</span>
            </span>
            <span className="text-[11px] text-[var(--text-secondary)] font-normal">
              {SAUDI_LAW_SYSTEMS.length} أنظمة معتمدة
            </span>
          </div>

          {/* Trigger Button */}
          <button
            type="button"
            onClick={() => {
              setIsSystemOpen(!isSystemOpen);
              setIsArticleOpen(false);
            }}
            className="w-full h-11 bg-[var(--container-bg)] border border-[var(--border-subtle)] px-3.5 rounded-lg text-xs sm:text-sm font-medium text-[var(--text-main)] cursor-pointer outline-none flex items-center justify-between transition hover:border-[#b38719] dark:hover:border-[#dfb141] shadow-2xs"
          >
            <span className="truncate pr-1 text-right">
              {currentSystem.name} ({currentSystem.articles.length} مادة)
            </span>
            <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] shrink-0 transition-transform duration-200 ${isSystemOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Popover Dropdown */}
          {isSystemOpen && (
            <div className="absolute right-0 left-0 top-full mt-1.5 z-50 bg-[var(--container-bg)] border border-[var(--border-subtle)] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              {/* Search Inside Systems */}
              <div className="p-2.5 border-b border-[var(--border-subtle)] bg-[var(--card-bg)]">
                <div className="relative">
                  <input
                    ref={systemSearchInputRef}
                    type="text"
                    value={systemSearch}
                    onChange={(e) => setSystemSearch(e.target.value)}
                    placeholder="ابحث عن نظام بالاسم أو المجال..."
                    className="w-full bg-[var(--container-bg)] border border-[var(--border-subtle)] py-1.5 pr-8 pl-7 rounded-lg text-xs font-medium text-[var(--text-main)] outline-none focus:border-[#b38719] dark:focus:border-[#dfb141]"
                  />
                  <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                  {systemSearch && (
                    <button
                      type="button"
                      onClick={() => setSystemSearch('')}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Systems List */}
              <div className="max-h-64 overflow-y-auto divide-y divide-[var(--border-subtle)]">
                {filteredSystems.map(sys => {
                  const isSelected = sys.id === selectedSystemId;
                  return (
                    <button
                      key={sys.id}
                      type="button"
                      onClick={() => {
                        onSelectSystem(sys.id);
                        setIsSystemOpen(false);
                      }}
                      className={`w-full text-right px-3.5 py-2.5 text-xs flex items-center justify-between transition cursor-pointer hover:bg-[var(--card-bg-hover)] ${
                        isSelected ? 'bg-[var(--card-bg)] font-bold text-[#b38719] dark:text-[#dfb141]' : 'text-[var(--text-main)]'
                      }`}
                    >
                      <div className="truncate pr-1">
                        <div className="truncate">{sys.name}</div>
                        <div className="text-[10px] text-[var(--text-secondary)] font-normal">{sys.categoryLabel}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-[var(--text-secondary)]">{sys.articles.length} مادة</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#b38719] dark:text-[#dfb141]" />}
                      </div>
                    </button>
                  );
                })}
                {filteredSystems.length === 0 && (
                  <div className="p-4 text-center text-xs text-[var(--text-secondary)]">
                    لا يوجد نظام مطابق للبحث "{systemSearch}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 2. اختيار المادة النظامية - نافذة البحث والفرز المتطورة */}
        {/* ======================================================== */}
        <div className="bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--border-subtle)] transition relative" ref={articleDropdownRef}>
          <div className="text-xs font-semibold text-[var(--text-secondary)] mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[var(--text-main)]">
              <Hash className="w-3.5 h-3.5 text-[#b38719] dark:text-[#dfb141]" />
              <span>المادة المطلوبة</span>
            </span>
            <span className="text-[11px] text-[var(--text-secondary)] font-normal">
              {articles.length} مادة نظامية
            </span>
          </div>

          {/* Trigger Button */}
          <button
            type="button"
            onClick={() => {
              setIsArticleOpen(!isArticleOpen);
              setIsSystemOpen(false);
            }}
            className="w-full h-11 bg-[var(--container-bg)] border border-[var(--border-subtle)] px-3.5 rounded-lg text-xs sm:text-sm font-medium text-[var(--text-main)] cursor-pointer outline-none flex items-center justify-between transition hover:border-[#b38719] dark:hover:border-[#dfb141] shadow-2xs"
          >
            <div className="truncate pr-1 text-right flex items-center gap-2">
              <span className="font-bold text-[#b38719] dark:text-[#dfb141] shrink-0">
                {currentArticle?.articleNumber?.split('-')[0]?.trim() || 'المادة'}
              </span>
              <span className="truncate text-[var(--text-main)] font-normal">
                {currentArticle?.title || 'اختر المادة'}
              </span>
              {currentArticle?.status === 'amended' && (
                <span className="text-[10px] font-bold text-[#b45309] dark:text-[#fbbf24] shrink-0 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
                  معدلة
                </span>
              )}
              {currentArticle?.status === 'repealed' && (
                <span className="text-[10px] font-bold text-[#dc2626] dark:text-[#f87171] shrink-0 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
                  ملغية
                </span>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] shrink-0 transition-transform duration-200 ${isArticleOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Popover Dropdown for Articles with Instant Number & Text Search */}
          {isArticleOpen && (
            <div className="absolute right-0 left-0 top-full mt-1.5 z-50 bg-[var(--container-bg)] border border-[var(--border-subtle)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 sm:w-[130%] sm:-right-[15%]">
              
              {/* Search Header */}
              <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--card-bg)] space-y-2">
                <div className="relative">
                  <input
                    ref={articleSearchInputRef}
                    type="text"
                    value={articleSearch}
                    onChange={(e) => setArticleSearch(e.target.value)}
                    placeholder="ابحث برقم المادة أو الكلمة (مثال: 720، 77، البيع، التعويض)..."
                    className="w-full bg-[var(--container-bg)] border border-[var(--border-subtle)] py-2 pr-8 pl-7 rounded-lg text-xs font-medium text-[var(--text-main)] outline-none focus:border-[#b38719] dark:focus:border-[#dfb141]"
                  />
                  <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                  {articleSearch && (
                    <button
                      type="button"
                      onClick={() => setArticleSearch('')}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Quick Filters: Status */}
                <div className="flex items-center justify-between text-[11px] pt-1 text-[var(--text-secondary)]">
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    <span className="font-semibold shrink-0">الحالة:</span>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('all')}
                      className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                        statusFilter === 'all' ? 'bg-[#b38719]/15 text-[#b38719] dark:text-[#dfb141] font-bold' : 'hover:bg-[var(--card-bg-hover)]'
                      }`}
                    >
                      الكل ({articles.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('active')}
                      className={`px-2 py-0.5 rounded-md transition cursor-pointer flex items-center gap-1 ${
                        statusFilter === 'active' ? 'bg-[#059669]/15 text-[#059669] dark:text-[#34d399] font-bold' : 'hover:bg-[var(--card-bg-hover)]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                      سارية
                    </button>
                    {articles.some(a => a.status === 'amended') && (
                      <button
                        type="button"
                        onClick={() => setStatusFilter('amended')}
                        className={`px-2 py-0.5 rounded-md transition cursor-pointer flex items-center gap-1 ${
                          statusFilter === 'amended' ? 'bg-[#f59e0b]/15 text-[#b45309] dark:text-[#fbbf24] font-bold' : 'hover:bg-[var(--card-bg-hover)]'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
                        معدلة
                      </button>
                    )}
                    {articles.some(a => a.status === 'repealed') && (
                      <button
                        type="button"
                        onClick={() => setStatusFilter('repealed')}
                        className={`px-2 py-0.5 rounded-md transition cursor-pointer flex items-center gap-1 ${
                          statusFilter === 'repealed' ? 'bg-[#ef4444]/15 text-[#dc2626] dark:text-[#f87171] font-bold' : 'hover:bg-[var(--card-bg-hover)]'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
                        ملغية
                      </button>
                    )}
                  </div>
                  <span className="shrink-0 text-[10px]">
                    {filteredArticles.length} مادة
                  </span>
                </div>

                {/* Quick Presets for Key Articles */}
                {quickJumpArticles.length > 0 && !articleSearch && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none text-[11px]">
                    <span className="shrink-0 text-[10px] text-[var(--text-secondary)] font-medium">سريع:</span>
                    {quickJumpArticles.map(qj => (
                      <button
                        key={qj.id}
                        type="button"
                        onClick={() => {
                          onSelectArticle(qj.id);
                          setIsArticleOpen(false);
                        }}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--container-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] transition cursor-pointer shrink-0 border border-[var(--border-subtle)]"
                      >
                        {qj.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Articles Scrollable List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border-subtle)]">
                {filteredArticles.slice(0, 150).map(art => {
                  const isSelected = art.id === selectedArticleId;
                  return (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => {
                        onSelectArticle(art.id);
                        setIsArticleOpen(false);
                      }}
                      className={`w-full text-right px-3.5 py-2.5 text-xs flex items-start justify-between transition cursor-pointer hover:bg-[var(--card-bg-hover)] ${
                        isSelected ? 'bg-[var(--card-bg)] font-bold text-[#b38719] dark:text-[#dfb141]' : 'text-[var(--text-main)]'
                      }`}
                    >
                      <div className="truncate pr-1 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-[#b38719] dark:text-[#dfb141] shrink-0">
                            {art.articleNumber.split('-')[0]?.trim()}
                          </span>
                          {art.status === 'amended' && (
                            <span className="text-[10px] font-bold text-[#b45309] dark:text-[#fbbf24] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
                              معدلة
                            </span>
                          )}
                          {art.status === 'repealed' && (
                            <span className="text-[10px] font-bold text-[#dc2626] dark:text-[#f87171] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
                              ملغية
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[var(--text-main)] font-medium line-clamp-1">
                          {art.title}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#b38719] dark:text-[#dfb141] shrink-0 mr-2 mt-1" />
                      )}
                    </button>
                  );
                })}

                {filteredArticles.length > 150 && (
                  <div className="p-2 text-center text-[11px] text-[var(--text-secondary)] bg-[var(--card-bg)]">
                    تم عرض أول 150 مادة مطابقة. استخدم البحث في الأعلى لتحديد مادة بعينها.
                  </div>
                )}

                {filteredArticles.length === 0 && (
                  <div className="p-6 text-center text-xs text-[var(--text-secondary)] space-y-1">
                    <p className="font-semibold text-[var(--text-main)]">لم يتم العثور على مادة مطابقة</p>
                    <p className="text-[11px]">جرب البحث برقم المادة مباشرة (مثل: 77 أو 120 أو 720)</p>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
