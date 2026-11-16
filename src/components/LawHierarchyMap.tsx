import React, { useState, useMemo } from 'react';
import { SAUDI_LAW_SYSTEMS, LawSystem, LawArticle, LAW_CATEGORIES } from '../data/lawsData';
import { 
  Network, 
  Layers, 
  GitFork, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Gavel, 
  Scale, 
  FileText, 
  BookOpen, 
  Check, 
  ArrowLeft, 
  Sparkles, 
  ExternalLink,
  SlidersHorizontal,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface LawHierarchyMapProps {
  onSelectArticle: (systemId: string, articleId: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const LawHierarchyMap: React.FC<LawHierarchyMapProps> = ({
  onSelectArticle,
  onClose,
  isModal = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Expanded nodes state
  const [expandedSystems, setExpandedSystems] = useState<Record<string, boolean>>({
    labor: true,
    civil: true,
    evidence: true
  });
  
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({
    'labor-m77': true
  });

  const [activePreviewArticle, setActivePreviewArticle] = useState<{
    system: LawSystem;
    article: LawArticle;
  } | null>(null);

  // Toggle system expansion
  const toggleSystem = (systemId: string) => {
    setExpandedSystems(prev => ({ ...prev, [systemId]: !prev[systemId] }));
  };

  // Toggle article expansion
  const toggleArticle = (articleId: string) => {
    setExpandedArticles(prev => ({ ...prev, [articleId]: !prev[articleId] }));
  };

  // Expand all / Collapse all
  const handleExpandAll = () => {
    const allSys: Record<string, boolean> = {};
    const allArt: Record<string, boolean> = {};
    SAUDI_LAW_SYSTEMS.forEach(sys => {
      allSys[sys.id] = true;
      sys.articles.forEach(art => {
        allArt[art.id] = true;
      });
    });
    setExpandedSystems(allSys);
    setExpandedArticles(allArt);
  };

  const handleCollapseAll = () => {
    setExpandedSystems({});
    setExpandedArticles({});
  };

  // Filter systems based on category & search
  const filteredSystems = useMemo(() => {
    return SAUDI_LAW_SYSTEMS.filter(sys => {
      const matchCat = selectedCategory === 'all' || sys.category === selectedCategory;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchSys = sys.name.toLowerCase().includes(q) || sys.shortName.toLowerCase().includes(q);
      const matchArt = sys.articles.some(
        a => a.title.toLowerCase().includes(q) || 
             a.articleNumber.toLowerCase().includes(q) ||
             a.courtCase.court.toLowerCase().includes(q) ||
             a.courtCase.caseTitle.toLowerCase().includes(q)
      );
      return matchSys || matchArt;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className={`w-full bg-[var(--container-bg)] ${isModal ? 'p-4 sm:p-6 rounded-[24px] shadow-2xl max-h-[90vh] flex flex-col border border-[var(--border-subtle)]' : 'space-y-4'}`}>
      
      {/* 1. Header: الأيقونة باللون الأسود على اليمين مع نص خريطة الأنظمة فقط من غير نصوص أخرى */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5">
          <Network className="w-5 h-5 text-black dark:text-white shrink-0" />
          <h3 className="font-bold text-base sm:text-lg text-[var(--text-main)]">
            خريطــــة الأنظمــــة
          </h3>
        </div>

        {/* Global Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExpandAll}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border border-[var(--border-subtle)] transition cursor-pointer"
            title="توسيع كافة الفروع"
          >
            توسيع الكل
          </button>
          <button
            onClick={handleCollapseAll}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-secondary)] border border-[var(--border-subtle)] transition cursor-pointer"
            title="طي كافة الفروع"
          >
            طي الكل
          </button>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-main)] rounded-lg hover:bg-[var(--card-bg)] transition cursor-pointer"
              title="إغلاق"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. حقل البحث الهادئ بدون تصنيفات وبدون مستويات */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحــــث في خريطــــة الأنظمــــة..."
          className="w-full bg-[var(--card-bg)] border border-[var(--border-subtle)] py-2 pr-9 pl-4 rounded-xl text-xs sm:text-sm text-[var(--text-main)] outline-none focus:border-[#b38719] dark:focus:border-[#dfb141]"
        />
        <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
      </div>

      {/* 4. الشجرة الهرمية التفاعلية (Interactive Hierarchy Tree) */}
      <div className={`overflow-y-auto ${isModal ? 'flex-1 pr-1 pl-1' : 'max-h-[600px]'} space-y-3.5`}>
        {filteredSystems.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-secondary)]">
            <Layers className="w-10 h-10 mx-auto mb-2 text-[var(--border-subtle)]" />
            <p className="text-sm font-bold text-[var(--text-main)]">لم يتم العثور على أنظمة مطابقة للبحث</p>
            <p className="text-xs">جرب تغيير التصنيف أو كلمات البحث</p>
          </div>
        ) : (
          filteredSystems.map(system => {
            const isSysExpanded = !!expandedSystems[system.id];
            
            return (
              <div 
                key={system.id} 
                className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-subtle)] overflow-hidden transition-all duration-200"
              >
                {/* Level 1: System Node */}
                <div 
                  onClick={() => toggleSystem(system.id)}
                  className="p-3 sm:p-3.5 flex items-center justify-between cursor-pointer hover:bg-[var(--card-bg-hover)] transition select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <Scale className="w-5 h-5 text-[#d4af37] dark:text-[#facc15] shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-[var(--text-main)]">
                          {system.name}
                        </h4>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--container-bg)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                          {system.articles.length} مواد
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        {system.issuingAuthority}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <span className="hidden sm:inline text-[11px]">{isSysExpanded ? 'طي الفروع' : 'فتح الفروع'}</span>
                    {isSysExpanded ? <ChevronDown className="w-4 h-4 text-[#6d1a24] dark:text-[#dfb141]" /> : <ChevronLeft className="w-4 h-4 text-[var(--text-secondary)]" />}
                  </div>
                </div>

                {/* Level 2 & 3 & 4: Sub-Nodes (Articles, Bylaws, Judicial Decisions) */}
                {isSysExpanded && (
                  <div className="p-3 pt-0 space-y-2 border-t border-[var(--border-subtle)] bg-[var(--container-bg)]">
                    <div className="text-[11px] text-[var(--text-secondary)] font-medium pt-2 pb-1 pr-1 flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5 text-[#0284c7] dark:text-[#38bdf8]" />
                      <span>المواد المنبثقة من النظام مع لوائحها وأحكام المحاكم:</span>
                    </div>

                    <div className="space-y-2 pr-2 border-r border-[var(--border-subtle)] mr-1">
                      {system.articles.map(article => {
                        const isArtExpanded = !!expandedArticles[article.id];

                        return (
                          <div 
                            key={article.id}
                            className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-subtle)] p-3 space-y-2 transition-all hover:border-[var(--border-hover)]"
                          >
                            {/* Level 2: Article Node Header */}
                            <div className="flex items-center justify-between gap-2">
                              <div 
                                onClick={() => toggleArticle(article.id)}
                                className="flex-1 flex items-center gap-2 cursor-pointer select-none"
                              >
                                <span className="font-bold text-xs text-[#6d1a24] dark:text-[#dfb141]">
                                  {article.articleNumber}:
                                </span>
                                <span className="font-medium text-xs text-[var(--text-main)] hover:text-[#6d1a24] transition">
                                  {article.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => onSelectArticle(system.id, article.id)}
                                  className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-[var(--container-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border border-[var(--border-subtle)] transition flex items-center gap-1"
                                  title="فتح المادة بالشرح والقضية"
                                >
                                  <span>فتح المادة</span>
                                  <ExternalLink className="w-3 h-3 text-[var(--text-secondary)]" />
                                </button>

                                <button
                                  onClick={() => toggleArticle(article.id)}
                                  className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                                >
                                  {isArtExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>

                            {/* Level 3 & Level 4: When Article is Expanded */}
                            {isArtExpanded && (
                              <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2 text-xs">
                                
                                {/* Level 3: Executive Bylaw Connection */}
                                <div className="bg-[var(--container-bg)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                                  <div className="text-[11px] font-bold text-[var(--text-main)] mb-1">
                                    اللوائح والقرارات التنفيذية المقترنة:
                                  </div>
                                  <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                                    {article.executiveBylaw}
                                  </p>
                                </div>

                                {/* Level 4: Court Decision Connection */}
                                <div 
                                  onClick={() => onSelectArticle(system.id, article.id)}
                                  className="bg-[var(--container-bg)] p-2.5 rounded-lg border border-[var(--border-subtle)] cursor-pointer hover:border-[#6d1a24] dark:hover:border-[#dfb141] transition group"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1 font-bold text-[#6d1a24] dark:text-[#dfb141] text-[11px]">
                                      <Gavel className="w-3.5 h-3.5" />
                                      <span>حكم وقرار قضائي تطبيقي:</span>
                                    </div>
                                    <span className="text-[10px] text-[var(--text-secondary)] group-hover:text-[var(--text-main)] flex items-center gap-0.5">
                                      <span>عرض الصك الكامل</span>
                                      <ChevronLeft className="w-3 h-3" />
                                    </span>
                                  </div>
                                  
                                  <div className="text-[11px] font-bold text-[var(--text-main)] mb-0.5">
                                    {article.courtCase.caseTitle}
                                  </div>
                                  <div className="text-[10px] text-[var(--text-secondary)] mb-1">
                                    {article.courtCase.court}
                                  </div>
                                  <div className="text-[11px] text-[var(--text-muted)] bg-[var(--card-bg)] p-1.5 rounded border border-[var(--border-subtle)] line-clamp-1">
                                    <strong>منطوق الحكم:</strong> {article.courtCase.judgment}
                                  </div>
                                </div>

                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 5. Footer Quick Tip */}
      <div className="pt-2 text-[11px] text-[var(--text-secondary)] flex items-center justify-between border-t border-[var(--border-subtle)]">
        <span>تعتمد الخريطة الهرمية على التدرج التشريعي الرسمي بالمملكة العربية السعودية.</span>
        <span className="font-semibold text-[#006c35] dark:text-[#10b981]">
          {SAUDI_LAW_SYSTEMS.length} أنظمة • {SAUDI_LAW_SYSTEMS.reduce((a, b) => a + b.articles.length, 0)} مواد وقضايا
        </span>
      </div>

    </div>
  );
};
