import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronLeft, 
  Scale, 
  Briefcase,
  Gavel,
  FileCheck,
  Building2,
  Users,
  ShieldAlert,
  ShoppingBag,
  Calculator, 
  Compass, 
  ShieldCheck, 
  X,
  ArrowUpRight,
  AtSign
} from 'lucide-react';
import { SAUDI_LAW_SYSTEMS, LawSystem } from '../data/lawsData';

interface HomePageProps {
  onSelectArticle: (systemId: string, articleId: string) => void;
  onSelectSystem: (systemId: string) => void;
  onOpenSearch: () => void;
  onOpenCalculator: () => void;
  onOpenMap: () => void;
  onOpenConsultation: () => void;
  onOpenContact?: () => void;
}

// Icon mapper with zero background - direct iconic representation
const getSystemIcon = (id: string) => {
  switch (id) {
    case 'civil': return Scale;
    case 'labor': return Briefcase;
    case 'pleadings': return Gavel;
    case 'evidence': return FileCheck;
    case 'companies': return Building2;
    case 'personal_status': return Users;
    case 'cybercrime': return ShieldAlert;
    case 'ecommerce': return ShoppingBag;
    case 'enforcement': return Gavel;
    case 'electronic_transactions': return ShieldCheck;
    case 'evidence_manual': return FileCheck;
    case 'advocacy': return Scale;
    default: return Scale;
  }
};

export const HomePage: React.FC<HomePageProps> = ({
  onSelectArticle,
  onSelectSystem,
  onOpenSearch,
  onOpenCalculator,
  onOpenMap,
  onOpenConsultation,
  onOpenContact,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Total statistics for subtle counter
  const totalArticles = useMemo(() => {
    return SAUDI_LAW_SYSTEMS.reduce((acc, sys) => acc + sys.articles.length, 0);
  }, []);

  // Quick jump suggestions with tatweel
  const quickJumpItems = [
    { label: 'التعامــــلات الإلكترونيــــة (31 مـــادة)', systemId: 'electronic_transactions', articleId: 'etx-m1' },
    { label: 'التجــــارة الإلكترونيــــة (26 مـــادة)', systemId: 'ecommerce', articleId: 'ecom-m1' },
    { label: 'الأدلــــة الإجرائيــــة للإثبــــات (135 مـــادة)', systemId: 'evidence_manual', articleId: 'manual-m1' },
    { label: 'جرائــــم المعلوماتيــــة (16 مـــادة)', systemId: 'cybercrime', articleId: 'cyber-m1' },
    { label: 'نظــــام الشــــركات (281 مـــادة)', systemId: 'companies', articleId: 'comp-m4' },
    { label: 'نظــــام المحامــــاة (56 مـــادة)', systemId: 'advocacy', articleId: 'advocacy-m1' },
    { label: 'نظــــام التنفيــــذ (65 مـــادة)', systemId: 'enforcement', articleId: 'enforce-m7' },
    { label: 'نظــــام الأحــــوال الشخصيــــة (252 مـــادة)', systemId: 'personal_status', articleId: 'personal-m1' },
    { label: 'المعامــــلات المدنيــــة (721 مـــادة)', systemId: 'civil', articleId: 'civil-m1' },
    { label: 'نظــــام العمــــل (المــــادة 77)', systemId: 'labor', articleId: 'labor-m77' },
    { label: 'القواعــــد الفقهيــــة الكليــــة (720)', systemId: 'civil', articleId: 'civil-m720' },
    { label: 'نظــــام المرافعــــات الشـــرعية', systemId: 'pleadings', articleId: 'pleadings-m1' },
    { label: 'نظــــام الإثبــــات', systemId: 'evidence', articleId: 'evidence-m1' },
  ];

  // Filtered systems with keyword and title matching
  const filteredSystems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return SAUDI_LAW_SYSTEMS;

    return SAUDI_LAW_SYSTEMS.filter(sys => {
      const nameMatch = sys.name.toLowerCase().includes(q) || sys.shortName.toLowerCase().includes(q);
      const descMatch = sys.description?.toLowerCase().includes(q) || sys.briefSummary?.toLowerCase().includes(q);
      const keywordMatch = sys.keywords?.some(k => k.toLowerCase().includes(q));

      return nameMatch || descMatch || keywordMatch;
    });
  }, [searchQuery]);

  // Live article matches when typing in search box
  const liveArticleMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const results: Array<{
      systemId: string;
      systemName: string;
      articleId: string;
      articleNumber: string;
      title: string;
      text: string;
    }> = [];

    for (const sys of SAUDI_LAW_SYSTEMS) {
      for (const art of sys.articles) {
        const numMatch = art.articleNumber.toLowerCase().includes(q) ||
          art.articleNumber.replace(/[^\d]/g, '').includes(q.replace(/[^\d]/g, ''));
        const titleMatch = art.title.toLowerCase().includes(q);
        const textMatch = art.officialText.toLowerCase().includes(q) || art.saudiExplanation.toLowerCase().includes(q);
        const keywordMatch = art.keywords?.some(k => k.toLowerCase().includes(q));

        if (numMatch || titleMatch || textMatch || keywordMatch) {
          results.push({
            systemId: sys.id,
            systemName: sys.name,
            articleId: art.id,
            articleNumber: art.articleNumber,
            title: art.title,
            text: art.officialText.slice(0, 150) + '...'
          });
          if (results.length >= 8) break;
        }
      }
      if (results.length >= 8) break;
    }

    return results;
  }, [searchQuery]);

  return (
    <div className="space-y-7 font-['Thmanyah_Sans',sans-serif] animate-in fade-in duration-200">
      
      {/* ======================================================== */}
      {/* 1. Header & Search Hub (بسيط، مركّز، نصوص وأيقونات فقط) */}
      {/* ======================================================== */}
      <div className="text-center pt-2 sm:pt-4 space-y-3 max-w-2xl mx-auto">
        
        {/* Emblem & Identity */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#b38719] dark:text-[#dfb141]">
          <Scale className="w-4 h-4" />
          <span>منصــــة قانــــون 01 للأنظمــــة واللوائــــح الســـعودية</span>
        </div>

        {/* Title with tatweel - authentic Thmanyah Sans bold weight */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-normal text-[var(--text-main)] leading-snug">
          المرجــــع النظامــــي والقضائــــي الميسّــــر
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          ابحث وتصفح {SAUDI_LAW_SYSTEMS.length} أنظمــــة ســـعودية معتمدة وأكثر من {totalArticles} مـــادة موثقة ومطابقة للأحكام القضائية.
        </p>

        {/* Central Search Bar */}
        <div className="relative pt-1">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute right-4 text-[var(--text-secondary)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحــــث برقــــم المــــادة، اســــم النظــــام، أو الكلمــــة المفتاحيــــة (مثال: 77، 720، تعويــــض، عقــــد، فصــــل)..."
              className="w-full bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] border border-[var(--border-subtle)] focus:border-[#b38719] dark:focus:border-[#dfb141] rounded-xl pr-11 pl-24 py-3 text-xs sm:text-sm text-[var(--text-main)] shadow-xs transition outline-none"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 text-xs text-[var(--text-secondary)] hover:text-[var(--text-main)] p-1 transition bg-transparent border-0 cursor-pointer"
                title="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              /* زر البحث الموسع: نص وأيقونة فقط بدون مستطيل */
              <button
                type="button"
                onClick={onOpenSearch}
                className="absolute left-3 text-xs font-bold text-[#b38719] dark:text-[#dfb141] hover:underline transition flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
              >
                <span>بحــــث موسّــــع</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* وصول سريع: نصوص فقط بدون مستطيلات وبدون إطارات */}
          {!searchQuery && (
            <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5 pt-2.5 text-xs">
              <span className="text-[11px] text-[var(--text-secondary)] font-medium">وصــــول ســــريع:</span>
              {quickJumpItems.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectArticle(item.systemId, item.articleId)}
                  className="text-xs text-[var(--text-secondary)] hover:text-[#b38719] dark:hover:text-[#dfb141] font-semibold transition cursor-pointer bg-transparent border-0 p-0 hover:underline"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. Live Search Results (إذا كان المستخدم يبحث) */}
      {/* ======================================================== */}
      {searchQuery.trim().length >= 2 && (
        <div className="space-y-2.5 p-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs pb-1">
            <span className="font-bold text-[var(--text-main)]">
              نتائــــج البحــــث الفــــوري عن "{searchQuery}" ({liveArticleMatches.length} مـــادة)
            </span>
            <button
              type="button"
              onClick={onOpenSearch}
              className="text-xs font-semibold text-[#b38719] dark:text-[#dfb141] hover:underline cursor-pointer bg-transparent border-0 p-0"
            >
              فتح شاشة البحث الشامل ↵
            </button>
          </div>

          {liveArticleMatches.length > 0 ? (
            <div className="space-y-1">
              {liveArticleMatches.map((res) => (
                <div
                  key={res.articleId}
                  onClick={() => onSelectArticle(res.systemId, res.articleId)}
                  className="py-2 px-2 hover:bg-[var(--card-bg-hover)] rounded-lg cursor-pointer transition flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-[#b38719] dark:text-[#dfb141] shrink-0">
                        {res.articleNumber}
                      </span>
                      <span className="text-[11px] text-[var(--text-secondary)] truncate">
                        {res.systemName}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-main)] font-semibold truncate">
                      {res.title}
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1">
                      {res.text}
                    </p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[#b38719] dark:group-hover:text-[#dfb141] transition shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-[var(--text-secondary)]">
              لم نعثر على مواد مطابقة للبحث المباشر. يمكنك استخدام زر "بحث موسع" للبحث الدلالي.
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. Quick Action Tools (بدون خطوط وبدون مستطيلات: نصوص وأيقونات فقط) */}
      {/* ======================================================== */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8 py-2 text-xs">
        
        {/* أداة 1: الحاسبة */}
        <button
          type="button"
          onClick={onOpenCalculator}
          className="flex items-center gap-2 font-bold text-[var(--text-main)] hover:text-[#b38719] dark:hover:text-[#dfb141] transition cursor-pointer bg-transparent border-0 p-0"
        >
          <Calculator className="w-4 h-4 text-[#b38719] dark:text-[#dfb141] shrink-0" />
          <span>حاسبــــة مكافــــأة نهايــــة الخدمــــة</span>
        </button>

        {/* أداة 2: خريطة الأنظمة الهرمية */}
        <button
          type="button"
          onClick={onOpenMap}
          className="flex items-center gap-2 font-bold text-[var(--text-main)] hover:text-[#0284c7] dark:hover:text-[#38bdf8] transition cursor-pointer bg-transparent border-0 p-0"
        >
          <Compass className="w-4 h-4 text-[#0284c7] dark:text-[#38bdf8] shrink-0" />
          <span>خريطــــة الأنظمــــة الهرميــــة</span>
        </button>


        {/* أداة 3: تابعنا */}
        {onOpenContact && (
          <button
            type="button"
            onClick={onOpenContact}
            className="flex items-center gap-2 font-bold text-[var(--text-main)] hover:text-[#059669] dark:hover:text-[#34d399] transition cursor-pointer bg-transparent border-0 p-0"
          >
            <AtSign className="w-4 h-4 text-[#059669] dark:text-[#34d399] shrink-0" />
            <span>تابعنــــا</span>
          </button>
        )}

      </div>

      {/* ======================================================== */}
      {/* 4. Directory of Saudi Legal Systems (الأنظمة واللوائح السعودية مع أيقونة على يمين النص) */}
      {/* ======================================================== */}
      <div className="space-y-3 pt-1">
        
        {/* ترويسة القسم: أيقونة على يمين النص مع النص فقط بدون خطوط وبدون مربعات تصنيفات */}
        <div className="flex items-center gap-2.5">
          <Scale className="w-5 h-5 text-[#b38719] dark:text-[#dfb141] shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)]">
            الأنظمــــة واللوائــــح الســـعودية
          </h2>
        </div>

        {/* شبكة الأنظمة: نصوص وأيقونات فقط بدون مستطيلات وبخط ثمانية سانس */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5 pt-1">
          {filteredSystems.map(sys => {
            const SystemIcon = getSystemIcon(sys.id);
            return (
              <button
                key={sys.id}
                type="button"
                onClick={() => {
                  onSelectSystem(sys.id);
                  if (sys.articles.length > 0) {
                    onSelectArticle(sys.id, sys.articles[0].id);
                  }
                }}
                className="flex items-center justify-between py-2 px-1 hover:bg-[var(--card-bg-hover)] rounded-lg transition cursor-pointer bg-transparent border-0 text-right group w-full"
              >
                {/* الأيقونة المباشرة واسم النظام */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <SystemIcon className="w-4 h-4 text-[#b38719] dark:text-[#dfb141] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-xs sm:text-sm text-[var(--text-main)] group-hover:text-[#b38719] dark:group-hover:text-[#dfb141] transition truncate">
                    {sys.name}
                  </span>
                </div>
                {/* عدد المواد بخط ثمانية سانس فقط (بدون font-mono) */}
                <span className="text-xs text-[var(--text-secondary)] shrink-0 pr-2">
                  {sys.articles.length} مـــادة
                </span>
              </button>
            );
          })}
        </div>

        {filteredSystems.length === 0 && (
          <div className="p-6 text-center text-xs text-[var(--text-secondary)]">
            لم يتم العثور على أنظمة مطابقة للبحث.
          </div>
        )}

      </div>

    </div>
  );
};
