import React, { useState, useEffect } from 'react';
import { LawArticle, LawSystem } from '../data/lawsData';
import { FontSizeLevel } from './Header';
import { ShareArticleModal } from './ShareArticleModal';
import { 
  Copy, 
  Check,
  Scale,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Share2,
  FileText,
  Maximize2,
  Minimize2,
  Lightbulb,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';

interface ArticleDetailsProps {
  article: LawArticle;
  system: LawSystem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  fontSize: FontSizeLevel;
  onChangeFontSize?: (size: FontSizeLevel) => void;
  onNextArticle?: () => void;
  onPrevArticle?: () => void;
  hasNextArticle?: boolean;
  hasPrevArticle?: boolean;
  currentIndex?: number;
  totalSystemArticles?: number;
}

export const ArticleDetails: React.FC<ArticleDetailsProps> = ({
  article,
  system,
  isFavorite,
  onToggleFavorite,
  fontSize,
  onChangeFontSize,
  onNextArticle,
  onPrevArticle,
  hasNextArticle = false,
  hasPrevArticle = false,
  currentIndex,
  totalSystemArticles
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedCase, setCopiedCase] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Fullscreen reading mode
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Interactive buttons state (Clean & simple: false by default, click reveals text)
  const [showBrief, setShowBrief] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [showBylaw, setShowBylaw] = useState(false);
  const [showCourtCase, setShowCourtCase] = useState(false);
  const [showTip, setShowTip] = useState(false);

  // Listen for Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Listen to browser fullscreenchange event
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, [isFullscreen]);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      if (typeof document !== 'undefined' && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {
          // Gracefully handle iframe restrictions
        });
      }
    } else {
      setIsFullscreen(false);
      if (typeof document !== 'undefined' && document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Text size classes
  const bodyTextClass = {
    normal: 'text-xs sm:text-sm leading-relaxed',
    medium: 'text-sm sm:text-base leading-loose',
    large: 'text-base sm:text-lg leading-loose',
  }[fontSize];



  // Copy full article
  const handleCopyAll = () => {
    const statusLine = article.status === 'amended' 
      ? `⚡ حالة المادة: مادة معدلة (${article.amendmentDetails || 'تم تعديلها بموجب المراسيم الملكية'})\n`
      : article.status === 'repealed'
      ? `🚫 حالة المادة: مادة ملغية (${article.amendmentDetails || 'تم إلغاء أحكامها نظاماً'})\n`
      : `✅ حالة المادة: مادة سارية المفعول\n`;

    const textToCopy = `🏛️ منصة قانون 01 للأنظمة واللوائح السعودية
📜 النظام: ${system.name}
🔖 ${article.articleNumber} - ${article.title}
${statusLine}
1. نص المادة الرسمي:
${article.officialText}

2. اللائحة التنفيذية:
${article.executiveBylaw}

3. الشرح بالعامية:
${article.saudiExplanation}

4. الأمثلة التوضيحية:
${article.practicalExamples.map((ex) => `• ${ex.title}: ${ex.scenario}
النتيجة: ${ex.takeaway}`).join('\n\n')}

5. القضية وحكم المحكمة:
${article.courtCase.caseTitle} (${article.courtCase.court})
الوقائع: ${article.courtCase.facts}
الحكم: ${article.courtCase.judgment}

💡 نصيحة سَدِيد: ${article.sadeedTip}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  // Copy case decision
  const handleCopyCase = () => {
    const caseText = `⚖️ صك وقرار قضائي مرتبط بـ (${article.articleNumber} - ${system.shortName})
🏛️ القضية: ${article.courtCase.caseTitle}
🏢 المحكمة: ${article.courtCase.court}
👥 أطراف الدعوى:
- المدعي: ${article.courtCase.parties.claimant}
- المدعى عليه: ${article.courtCase.parties.defendant}

📜 وقائع النزاع:
${article.courtCase.facts}

⚡ منطوق الحكم القضائي:
${article.courtCase.judgment}

📌 التأسيس والمبدأ القضائي:
${article.courtCase.legalRationale}

منصة سَدِيد للأنظمة في القانون السعودي`;

    navigator.clipboard.writeText(caseText).then(() => {
      setCopiedCase(true);
      setTimeout(() => setCopiedCase(false), 2200);
    });
  };

  // Helper for concise summary of the article
  const getArticleBriefExplanation = (art: LawArticle): string => {
    if (art.briefExplanation) return art.briefExplanation;
    if (art.id === 'labor-m77') {
      return 'تحدد المادة 77 معايير التعويض الإلزامي عن إنهاء عقد العمل لسبب غير مشروع (الفصل التعسفي): أجر 15 يوماً عن كل سنة للعقد غير المحدد، أو أجر المدة المتبقية للعقد المحدد، بحد أدنى أجر شهرين للعامل.';
    }
    if (art.id === 'labor-m84') {
      return 'تحدد المادة 84 استحقاق العامل لمكافأة نهاية الخدمة عند انتهاء العلاقة: أجر نصف شهر عن كل سنة من السنوات الخمس الأولى، وأجر شهر كامل عن كل سنة تالية، محسوبة على أساس الأجر الفعلي الأخير.';
    }
    if (art.id === 'civil-m720') {
      return 'تقنن المادة 720 القواعد الفقهية الكلية الـ 41 الحاكمة للمعاملات المدنية، وأبرزها: الأمور بمقاصدها، العبرة في العقود بالمقاصد والمعاني لا بالألفاظ، العادة محكمة، الأصل براءة الذمة، والضرر يزال.';
    }
    if (art.id === 'civil-m138') {
      return 'تقرر المادة 138 شمول التعويض عن العمل الضار للضرر المعنوي (الحسي والنفسي) الناتج عن المساس بالجسم أو الحرية أو العرض أو السمعة أو المركز الاجتماعي للشخص الطبيعي.';
    }
    if (art.id === 'civil-m32') {
      return 'تحدد المادة 32 أركان التراضي؛ حيث ينعقد العقد بارتباط الإيجاب بالقبول، ويصح التعبير عن الإرادة باللفظ أو الكتابة أو الإشارة المعهودة أو المعاطاة أو الوسائل الإلكترونية المعتمدة.';
    }

    const cleanOfficial = art.officialText.replace(/\s+/g, ' ').trim();
    const sentences = cleanOfficial.split(/[.؛。\n]/).filter(s => s.trim().length > 10);
    const firstSentence = sentences[0] ? sentences[0].trim() : cleanOfficial.slice(0, 140);
    const secondSentence = sentences[1] ? sentences[1].trim() : '';

    return `${firstSentence}${secondSentence ? '؛ ' + secondSentence : ''}.`;
  };

  // Toggle all sections
  const handleToggleAll = () => {
    const allOpen = showBrief && showExplanation && showExamples && showBylaw && showCourtCase && showTip;
    if (allOpen) {
      setShowBrief(false);
      setShowExplanation(false);
      setShowExamples(false);
      setShowBylaw(false);
      setShowCourtCase(false);
      setShowTip(false);
    } else {
      setShowBrief(true);
      setShowExplanation(true);
      setShowExamples(true);
      setShowBylaw(true);
      setShowCourtCase(true);
      setShowTip(true);
    }
  };

  const hasAnyOpen = showBrief || showExplanation || showExamples || showBylaw || showCourtCase || showTip;
  const allOpen = showBrief && showExplanation && showExamples && showBylaw && showCourtCase && showTip;

  // Keyboard shortcuts for article navigation (ArrowRight = Prev, ArrowLeft = Next in RTL)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight' && hasPrevArticle && onPrevArticle) {
        onPrevArticle();
      } else if (e.key === 'ArrowLeft' && hasNextArticle && onNextArticle) {
        onNextArticle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrevArticle, hasNextArticle, onPrevArticle, onNextArticle]);

  // Render article body (used in standard page view and in fullscreen mode)
  const renderArticleBody = (inFullscreen = false) => {
    return (
      <div className={`space-y-5 ${inFullscreen ? 'max-w-4xl lg:max-w-5xl w-full mx-auto pb-16' : 'w-full'}`}>
        
        {/* 1. شريط أدوات المادة: تصميم قانوني هادئ وموحد */}
        <div className="bg-[var(--card-bg)] rounded-xl px-3.5 py-2.5 border border-[var(--border-subtle)] flex items-center justify-between gap-3 flex-wrap">
          
          {/* رقم المادة والمؤشر النقطي النظيف مع جملة حالة المادة */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-[#b38719] dark:text-[#dfb141] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#b38719] dark:bg-[#dfb141]"></span>
              <span>{article.articleNumber}</span>
            </span>
            {currentIndex && totalSystemArticles && (
              <span className="text-xs text-[var(--text-secondary)] font-medium">
                <span className="opacity-40">·</span> مادة {currentIndex} من {totalSystemArticles}
              </span>
            )}
            {/* وسم حالة المادة (معدلة / ملغية / سارية) بدون مستطيل خلفي */}
            {article.status === 'amended' ? (
              <span className="text-xs font-bold text-[#b45309] dark:text-[#fbbf24] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
                <span>مادة معدلة</span>
              </span>
            ) : article.status === 'repealed' ? (
              <span className="text-xs font-bold text-[#dc2626] dark:text-[#f87171] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
                <span>مادة ملغية</span>
              </span>
            ) : (
              <span className="text-xs font-medium text-[#059669] dark:text-[#34d399] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                <span>مادة سارية</span>
              </span>
            )}
          </div>

          {/* أزرار الإجراءات العلوية الموحدة */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* تحكم حجم الخط المباشر داخل شريط المادة */}
            {onChangeFontSize && (
              <div className="flex items-center rounded-lg px-1.5 py-0.5 border border-[var(--border-subtle)] text-[11px] font-bold bg-[var(--container-bg)]">
                <button
                  type="button"
                  onClick={() => onChangeFontSize('normal')}
                  className={`px-1.5 py-0.5 transition cursor-pointer bg-transparent border-0 ${
                    fontSize === 'normal'
                      ? 'text-[#6d1a24] dark:text-[#dfb141] font-bold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                  }`}
                  title="خط عادي"
                >
                  أ
                </button>
                <span className="text-[var(--border-subtle)]">|</span>
                <button
                  type="button"
                  onClick={() => onChangeFontSize('medium')}
                  className={`px-1.5 py-0.5 transition cursor-pointer bg-transparent border-0 ${
                    fontSize === 'medium'
                      ? 'text-[#6d1a24] dark:text-[#dfb141] font-bold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                  }`}
                  title="خط متوسط"
                >
                  أ+
                </button>
                <span className="text-[var(--border-subtle)]">|</span>
                <button
                  type="button"
                  onClick={() => onChangeFontSize('large')}
                  className={`px-1.5 py-0.5 transition cursor-pointer bg-transparent border-0 ${
                    fontSize === 'large'
                      ? 'text-[#6d1a24] dark:text-[#dfb141] font-bold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                  }`}
                  title="خط كبير"
                >
                  أ++
                </button>
              </div>
            )}

            {/* زر الشاشة الكاملة */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className={`h-8 px-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border ${
                isFullscreen
                  ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a] border-[#6d1a24] dark:border-[#dfb141]'
                  : 'bg-[var(--container-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border-[var(--border-subtle)]'
              }`}
              title={isFullscreen ? 'الخروج من الشاشة الكاملة (Esc)' : 'عرض شاشة كاملة للقراءة الهادئة'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">خروج</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span className="hidden sm:inline">شاشة كاملة</span>
                </>
              )}
            </button>

            {/* Share - أيقونة المشاركة المطلوبة */}
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--card-bg-hover)] transition cursor-pointer bg-transparent border border-transparent hover:border-[var(--border-subtle)]"
              title="مشاركة المادة"
              aria-label="مشاركة المادة"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Copy */}
            <button
              type="button"
              onClick={handleCopyAll}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--card-bg-hover)] transition cursor-pointer bg-transparent border border-transparent hover:border-[var(--border-subtle)]"
              title="نسخ المادة والشرح"
              aria-label="نسخ المادة"
            >
              {copied ? (
                <Check className="w-4 h-4 text-[#059669] dark:text-[#34d399]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* 2. بطاقة نص المادة النظامية الرسمي - العناية القصوى بالقراءة والفخامة */}
        <div className="bg-[var(--container-bg)] rounded-2xl p-6 sm:p-7 md:p-8 border border-[var(--border-subtle)] shadow-[0_1px_6px_rgba(0,0,0,0.03)] space-y-4 transition-all">
          
          {/* ترويسة البطاقة: وسم نص المادة الرسمي وحالتها */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-[#b38719] dark:bg-[#dfb141]"></span>
              <span className="text-xs font-bold text-[#b38719] dark:text-[#dfb141] tracking-wide">
                نص المادة الرسمي
              </span>
              {article.status === 'amended' && (
                <span className="text-xs font-bold text-[#b45309] dark:text-[#fbbf24] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
                  <span>مادة معدلة</span>
                </span>
              )}
              {article.status === 'repealed' && (
                <span className="text-xs font-bold text-[#dc2626] dark:text-[#f87171] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
                  <span>مادة ملغية</span>
                </span>
              )}
              {(!article.status || article.status === 'active') && (
                <span className="text-xs font-medium text-[#059669] dark:text-[#34d399] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                  <span>مادة سارية</span>
                </span>
              )}
            </div>
            <span className="text-xs text-[var(--text-secondary)] font-normal">
              {system.name}
            </span>
          </div>

          {/* تفاصيل تعديل أو إلغاء المادة - نص نقي ومباشر بدون أي مستطيل أو خلفية ملونة */}
          {article.status === 'amended' && (
            <div className="pt-0.5 text-xs flex items-start gap-1.5 leading-relaxed text-[var(--text-secondary)] animate-in fade-in duration-150">
              <span className="font-bold text-[#b45309] dark:text-[#fbbf24] shrink-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
                مادة معدلة:
              </span>
              <span>
                {article.amendmentDetails || 'تم تعديل نص هذه المادة بموجب القرارات والمراسيم الملكية المعتمدة والتحديثات التنظيمية.'}
              </span>
            </div>
          )}

          {article.status === 'repealed' && (
            <div className="pt-0.5 text-xs flex items-start gap-1.5 leading-relaxed text-[var(--text-secondary)] animate-in fade-in duration-150">
              <span className="font-bold text-[#dc2626] dark:text-[#f87171] shrink-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
                مادة ملغية:
              </span>
              <span>
                {article.amendmentDetails || 'تم إلغاء أحكام هذه المادة نظاماً بموجب التشريعات والأنظمة القضائية اللاحقة.'}
              </span>
            </div>
          )}

          {/* عنوان المادة البارز */}
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-[var(--text-main)] tracking-tight">
            {article.title}
          </h3>

          {/* نص المادة الأصلي دون تعديل أو تحريف مع مسافات مريحة وارتفاع أسطر فاخر */}
          <div className={`text-[var(--text-main)] font-normal leading-[2.1] sm:leading-[2.2] max-w-4xl text-justify ${bodyTextClass}`}>
            {article.officialText}
          </div>

          {/* شريط أقسام الاستكشاف والشرح - مدمج بانسيابية وفخامة */}
          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3 flex-wrap">
            <div className="flex flex-wrap items-center gap-2">
              
              {/* 1. خيار جديد: شــــرح مختصــــر */}
              <button
                type="button"
                onClick={() => setShowBrief(!showBrief)}
                className={`h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                  showBrief
                    ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a] border-[#6d1a24] dark:border-[#dfb141] shadow-2xs'
                    : 'bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border-[var(--border-subtle)]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>شــــرح مختصــــر</span>
                {showBrief ? <ChevronUp className="w-3 h-3 opacity-80" /> : <ChevronDown className="w-3 h-3 opacity-60" />}
              </button>

              {/* 2. زر وش السالفة */}
              <button
                type="button"
                onClick={() => setShowExplanation(!showExplanation)}
                className={`h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                  showExplanation
                    ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a] border-[#6d1a24] dark:border-[#dfb141] shadow-2xs'
                    : 'bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border-[var(--border-subtle)]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>وش الســــالفة؟ (شــــرح مبسّــــط)</span>
                {showExplanation ? <ChevronUp className="w-3 h-3 opacity-80" /> : <ChevronDown className="w-3 h-3 opacity-60" />}
              </button>

              {/* 3. زر الأمثلة العملية */}
              <button
                type="button"
                onClick={() => setShowExamples(!showExamples)}
                className={`h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                  showExamples
                    ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a] border-[#6d1a24] dark:border-[#dfb141] shadow-2xs'
                    : 'bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border-[var(--border-subtle)]'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>الأمثلــــة العمليــــة</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  showExamples 
                    ? 'bg-white/20 text-white dark:bg-black/20 dark:text-[#0f172a]' 
                    : 'bg-[#b38719]/15 text-[#b38719] dark:bg-[#dfb141]/20 dark:text-[#dfb141]'
                }`}>
                  {article.practicalExamples?.length || 10}
                </span>
                {showExamples ? <ChevronUp className="w-3 h-3 opacity-80" /> : <ChevronDown className="w-3 h-3 opacity-60" />}
              </button>

              {/* 4. زر اللائحة التنفيذية */}
              <button
                type="button"
                onClick={() => setShowBylaw(!showBylaw)}
                className={`h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                  showBylaw
                    ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a] border-[#6d1a24] dark:border-[#dfb141] shadow-2xs'
                    : 'bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border-[var(--border-subtle)]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>اللائحــــة التنفيذيــــة</span>
                {showBylaw ? <ChevronUp className="w-3 h-3 opacity-80" /> : <ChevronDown className="w-3 h-3 opacity-60" />}
              </button>

              {/* 5. زر حكم المحكمة */}
              <button
                type="button"
                onClick={() => setShowCourtCase(!showCourtCase)}
                className={`h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                  showCourtCase
                    ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a] border-[#6d1a24] dark:border-[#dfb141] shadow-2xs'
                    : 'bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border-[var(--border-subtle)]'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>حكــــم المحكمــــة</span>
                {showCourtCase ? <ChevronUp className="w-3 h-3 opacity-80" /> : <ChevronDown className="w-3 h-3 opacity-60" />}
              </button>

              {/* 6. زر التوجيه الوقائي */}
              <button
                type="button"
                onClick={() => setShowTip(!showTip)}
                className={`h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                  showTip
                    ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a] border-[#6d1a24] dark:border-[#dfb141] shadow-2xs'
                    : 'bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border-[var(--border-subtle)]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>التوجيــــه الوقائــــي</span>
                {showTip ? <ChevronUp className="w-3 h-3 opacity-80" /> : <ChevronDown className="w-3 h-3 opacity-60" />}
              </button>
            </div>

            {/* زر فتح الكل / إغلاق الكل */}
            <button
              type="button"
              onClick={handleToggleAll}
              className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-main)] transition cursor-pointer bg-transparent border-0 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-[var(--card-bg)]"
            >
              {allOpen ? 'إغلاق الأقسام' : 'فتح كل الأقسام'}
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. أقسام إيضاح وشرح المادة (Legal Tech Premium Cards) */}
        {/* ======================================================== */}

        {/* قسم الشرح المختصر الجديد */}
        {showBrief && (
          <div className="bg-[var(--container-bg)] rounded-2xl p-5 sm:p-6 border border-[var(--border-subtle)] shadow-xs animate-in fade-in slide-in-from-top-1 duration-150 space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#b38719] dark:text-[#dfb141] shrink-0" />
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
                    شــــرح مختصــــر للمــــادة
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] font-normal">
                    الخلاصة الجوهرية والأثر النظامي المباشر في سطور معدودة
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBrief(false)}
                className="text-xs text-[var(--text-secondary)] hover:text-[#ef4444] flex items-center gap-1 cursor-pointer bg-transparent border-0 px-2.5 py-1 rounded-lg hover:bg-[var(--card-bg)] transition"
                title="إغلاق الشرح المختصر"
              >
                <X className="w-3.5 h-3.5" />
                <span>إغلاق</span>
              </button>
            </div>

            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)] space-y-2">
                <div className="text-xs font-bold text-[#b38719] dark:text-[#dfb141] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b38719] dark:bg-[#dfb141]"></span>
                  <span>خلاصــــة الحكــــم النظامــــي:</span>
                </div>
                <p className={`text-[var(--text-main)] text-xs sm:text-sm leading-relaxed ${bodyTextClass}`}>
                  {getArticleBriefExplanation(article)}
                </p>
              </div>

              {article.practicalExamples && article.practicalExamples.length > 0 && (
                <div className="text-xs text-[var(--text-secondary)] flex items-start gap-2 px-1">
                  <span className="font-bold text-[var(--text-main)] shrink-0">الأثــــر المباشــــر:</span>
                  <span className="leading-relaxed">{article.practicalExamples[0].takeaway}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 1. مستطيل الشرح التفصيلي للمادة (وش السالفة بالعامية) */}
        {showExplanation && (
          <div className="bg-[var(--container-bg)] rounded-2xl p-5 sm:p-6 border border-[var(--border-subtle)] shadow-xs animate-in fade-in slide-in-from-top-1 duration-150 space-y-4">
            
            {/* ترويسة المستطيل - بدون خلفية خلف الأيقونة */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-[#b38719] dark:text-[#dfb141] shrink-0" />
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
                    وش الســــالفة؟ (الشــــرح التفســــيري المبسّــــط)
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] font-normal">
                    تفكيك وتبسيط المادة بلهجة سعودية دارجة مفهومة مباشرة
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExplanation(false)}
                className="text-xs text-[var(--text-secondary)] hover:text-[#ef4444] flex items-center gap-1 cursor-pointer bg-transparent border-0 px-2.5 py-1 rounded-lg hover:bg-[var(--card-bg)] transition"
                title="إغلاق الشرح"
              >
                <X className="w-3.5 h-3.5" />
                <span>إغلاق</span>
              </button>
            </div>
            
            {/* نصوص الشرح: فواصل هادئة بلون موحد وبدون أي خطوط مستقيمة واقفة */}
            <div className={`space-y-4 leading-[2] font-normal ${bodyTextClass}`}>
              {article.saudiExplanation.split('\n\n').map((paragraph, pIdx) => {
                const cleanPara = paragraph.replace(/^\d+\.\s*[^:]*?:\s*/g, "").trim();
                if (!cleanPara) return null;

                let label = "الفكرة والـمـعـنـى الأسـاسـي";
                if (cleanPara.includes('ليش المنظم') || cleanPara.includes('المنظم السعودي') || cleanPara.includes('الهدف')) {
                  label = "مـقـصـد الـمـنـظّـم";
                } else if (cleanPara.includes('كيف تطبق') || cleanPara.includes('الواقع الميداني') || cleanPara.includes('إجراءات')) {
                  label = "الـتـطـبـيـق الـعـمـلـي والـمـيـدانـي";
                } else if (cleanPara.includes('وش يصير') || cleanPara.includes('مخالفة') || cleanPara.includes('فخ') || cleanPara.includes('انتبه')) {
                  label = "الـمـحـاذيـر والآثـار الـنـظـامـيـة";
                } else if (cleanPara.includes('الزبدة') || cleanPara.includes('الوصية')) {
                  label = "الـزبـدة والـخـلاصـة";
                } else if (pIdx > 0) {
                  label = "نـقـطـة جـوهـريـة";
                }

                return (
                  <div key={pIdx} className="space-y-1.5">
                    <div className="font-bold text-xs sm:text-sm text-[#b38719] dark:text-[#dfb141] select-none flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b38719] dark:bg-[#dfb141]"></span>
                      <span>{label}</span>
                    </div>
                    <p className="leading-[2] text-[var(--text-main)] text-sm sm:text-base font-normal">
                      {cleanPara}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                <span>شرح معتمد ومطابق لأحدث نصوص اللائحة التنفيذية</span>
              </span>
              <span className="font-medium text-[var(--text-main)]">
                {system.name}
              </span>
            </div>

          </div>
        )}

        {/* 2. قسم الأمثلة العملية والتطبيقية (10 حالات واقعية) */}
        {showExamples && (
          <div className="bg-[var(--container-bg)] rounded-2xl p-5 sm:p-6 border border-[var(--border-subtle)] shadow-xs animate-in fade-in slide-in-from-top-1 duration-150 space-y-4">
            
            {/* ترويسة قسم الأمثلة */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <Lightbulb className="w-5 h-5 text-[#b38719] dark:text-[#dfb141] shrink-0" />
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                    <span>الأمثلــــة العمليــــة والتطبيقــــات الميدانيــــة</span>
                    <span className="text-xs text-[var(--text-secondary)] font-normal">
                      ({article.practicalExamples.length} حالات واقعية)
                    </span>
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] font-normal">
                    سيناريوهات حية وحالات عملية من واقع النزاعات وسوابق العمل
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExamples(false)}
                className="text-xs text-[var(--text-secondary)] hover:text-[#ef4444] flex items-center gap-1 cursor-pointer bg-transparent border-0 px-2.5 py-1 rounded-lg hover:bg-[var(--card-bg)] transition"
                title="إغلاق الأمثلة"
              >
                <X className="w-3.5 h-3.5" />
                <span>إغلاق</span>
              </button>
            </div>

            {/* شبكة الأمثلة الـ 10 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-1">
              {article.practicalExamples.map((example, i) => (
                <div 
                  key={i} 
                  className="space-y-2 p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)] transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="text-xs sm:text-sm flex items-center gap-1.5 font-bold">
                      <span className="text-[#b38719] dark:text-[#dfb141]">
                        المثال {i + 1}:
                      </span>
                      <span className="text-[var(--text-main)]">{example.title}</span>
                    </div>
                  </div>

                  <p className={`text-[var(--text-main)] text-xs sm:text-sm leading-relaxed ${bodyTextClass}`}>
                    {example.scenario}
                  </p>

                  <div className="text-xs sm:text-sm flex items-start gap-1.5 pt-1.5 border-t border-[var(--border-subtle)]">
                    <span className="font-bold text-[#b38719] dark:text-[#dfb141] shrink-0">
                      📌 النتيجة النظامية:
                    </span>
                    <span className="leading-relaxed text-[var(--text-main)] font-medium">{example.takeaway}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. نص اللائحة التنفيذية */}
        {showBylaw && (
          <div className="bg-[var(--container-bg)] rounded-2xl p-5 sm:p-6 border border-[var(--border-subtle)] shadow-xs animate-in fade-in slide-in-from-top-1 duration-150 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#0284c7] dark:text-[#38bdf8] shrink-0" />
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
                    أحكــــام وضوابــــط اللائحــــة التنفيذيــــة
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] font-normal">
                    القرارات الوزارية والمواد الإجرائية المفسرة لنص المادة
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBylaw(false)}
                className="text-xs text-[var(--text-secondary)] hover:text-[#ef4444] flex items-center gap-1 cursor-pointer bg-transparent border-0 px-2.5 py-1 rounded-lg hover:bg-[var(--card-bg)] transition"
                title="إغلاق اللائحة"
              >
                <X className="w-3.5 h-3.5" />
                <span>إغلاق</span>
              </button>
            </div>
            <div className={`text-[var(--text-main)] font-normal leading-[2.1] max-w-4xl ${bodyTextClass}`}>
              {article.executiveBylaw}
            </div>
          </div>
        )}

        {/* 4. نص حكم وصك المحكمة القضائي */}
        {showCourtCase && (
          <div className="bg-[var(--container-bg)] rounded-2xl p-5 sm:p-6 border border-[var(--border-subtle)] shadow-xs animate-in fade-in slide-in-from-top-1 duration-150 space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-[#6d1a24] dark:text-[#dfb141] shrink-0" />
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
                    {article.courtCase.caseTitle}
                  </h4>
                  <div className="text-xs text-[var(--text-secondary)] font-normal">
                    {article.courtCase.court}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCase}
                  className="px-3 py-1.5 text-xs font-semibold text-[var(--text-main)] bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] rounded-lg border border-[var(--border-subtle)] transition cursor-pointer flex items-center gap-1"
                >
                  {copiedCase ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#059669]" />
                      <span>تم نسخ الصك</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ الصك</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCourtCase(false)}
                  className="text-xs text-[var(--text-secondary)] hover:text-[#ef4444] flex items-center gap-1 cursor-pointer bg-transparent border-0 px-2 py-1 rounded-lg hover:bg-[var(--card-bg)] transition"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>إغلاق</span>
                </button>
              </div>
            </div>

            {/* أطراف الدعوى */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="bg-[var(--card-bg)] p-3 rounded-xl border border-[var(--border-subtle)]">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-0.5">المدعي (صاحب الدعوى):</span>
                <span className="font-semibold text-[var(--text-main)] text-xs sm:text-sm">{article.courtCase.parties.claimant}</span>
              </div>
              <div className="bg-[var(--card-bg)] p-3 rounded-xl border border-[var(--border-subtle)]">
                <span className="text-[11px] text-[var(--text-secondary)] block mb-0.5">المدعى عليه:</span>
                <span className="font-semibold text-[var(--text-main)] text-xs sm:text-sm">{article.courtCase.parties.defendant}</span>
              </div>
            </div>

            {/* الوقائع */}
            <div className="text-xs space-y-1">
              <span className="font-bold text-[var(--text-main)] text-xs sm:text-sm">وقائع النزاع:</span>
              <p className={`text-[var(--text-main)] bg-[var(--card-bg)] p-3 rounded-xl border border-[var(--border-subtle)] leading-relaxed ${bodyTextClass}`}>
                {article.courtCase.facts}
              </p>
            </div>

            {/* منطوق الحكم القضائي والتسبيب */}
            <div className="bg-[var(--card-bg)] p-3.5 rounded-xl border border-[var(--border-subtle)] space-y-2">
              <span className="text-xs sm:text-sm font-bold text-[#b38719] dark:text-[#dfb141] block">
                ⚡ منطوق الحكم الصادر:
              </span>
              <p className={`text-[var(--text-main)] font-semibold leading-relaxed ${bodyTextClass}`}>
                {article.courtCase.judgment}
              </p>
              <div className="text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border-subtle)] leading-relaxed">
                <strong className="text-[var(--text-main)]">التسبيب والمبدأ القضائي:</strong> {article.courtCase.legalRationale}
              </div>
            </div>
          </div>
        )}

        {/* 5. نص وصية وتوجيه قانون 01 */}
        {showTip && (
          <div className="bg-[var(--container-bg)] border border-[var(--border-subtle)] rounded-2xl p-4 sm:p-5 shadow-xs animate-in fade-in slide-in-from-top-1 duration-150 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 font-bold text-[#059669] dark:text-[#34d399] text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>وصية وتوجيه «قانون 01» العملي والوقائي:</span>
              </div>
              <button
                type="button"
                onClick={() => setShowTip(false)}
                className="text-xs text-[var(--text-secondary)] hover:text-[#ef4444] cursor-pointer bg-transparent border-0 px-2 py-1 rounded-lg hover:bg-[var(--card-bg)] transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>إغلاق</span>
              </button>
            </div>
            <div className="text-[var(--text-main)] leading-[2] text-xs sm:text-sm font-medium">
              {article.sadeedTip}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. أسفل المادة: أزرار التنقل السريع بين المواد (44px Height) */}
        {/* ======================================================== */}
        {(hasPrevArticle || hasNextArticle) && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onPrevArticle}
              disabled={!hasPrevArticle}
              className={`h-11 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer border ${
                hasPrevArticle
                  ? 'bg-[var(--container-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border-[var(--border-subtle)] shadow-2xs'
                  : 'opacity-40 cursor-not-allowed bg-[var(--container-bg)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
              }`}
              title={hasPrevArticle ? 'الانتقال إلى المادة السابقة (السهم الأيمن)' : 'لا توجد مادة سابقة'}
            >
              <ChevronRight className="w-4 h-4" />
              <span>المادة السابقة</span>
              <span className="hidden sm:inline text-[10px] text-[var(--text-secondary)] font-normal opacity-70">(→)</span>
            </button>
            <button
              type="button"
              onClick={onNextArticle}
              disabled={!hasNextArticle}
              className={`h-11 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer border ${
                hasNextArticle
                  ? 'bg-[var(--container-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border-[var(--border-subtle)] shadow-2xs'
                  : 'opacity-40 cursor-not-allowed bg-[var(--container-bg)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
              }`}
              title={hasNextArticle ? 'الانتقال إلى المادة التالية (السهم الأيسر)' : 'لا توجد مادة تالية'}
            >
              <span className="hidden sm:inline text-[10px] text-[var(--text-secondary)] font-normal opacity-70">(←)</span>
              <span>المادة التالية</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. الإجراءات السفلية: نسخ المادة ومشاركتها (44px Height) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={handleCopyAll}
            className="w-full h-11 bg-[var(--container-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border border-[var(--border-subtle)] px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#059669] dark:text-[#34d399]" />
                <span className="text-[#059669] dark:text-[#34d399]">تم نسخ المادة والشرح بنجاح</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
                <span>نسخ المادة والشرح الكامل</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="w-full h-11 bg-[#6d1a24] hover:bg-[#531119] text-white dark:bg-[#dfb141] dark:text-[#0f172a] dark:hover:bg-[#c59b27] px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
          >
            <Share2 className="w-4 h-4" />
            <span>مشاركة بطاقة المادة</span>
          </button>
        </div>

      </div>
    );
  };

  return (
    <>
      {/* العرض الافتراضي داخل الصفحة */}
      <div className="w-full print:p-0">
        {renderArticleBody(false)}
      </div>

      {/* ======================================================== */}
      {/* وضع الشاشة الكاملة للقراءة الهادئة بدون تشتيت (FULLSCREEN) */}
      {/* ======================================================== */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-[var(--bg-color)] overflow-y-auto font-['Thmanyah_Sans',sans-serif] animate-in fade-in duration-150">
          
          {/* الشريط العلوي الثابت في الشاشة الكاملة */}
          <div className="sticky top-0 z-20 bg-[var(--container-bg)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 py-2.5 shadow-sm">
            <div className="max-w-4xl lg:max-w-5xl mx-auto flex items-center justify-between gap-3">
              
              {/* تفاصيل المادة */}
              <div className="flex items-center gap-2 overflow-hidden">
                <Scale className="w-5 h-5 text-[#d4af37] dark:text-[#facc15] shrink-0" />
                <div className="truncate">
                  <div className="text-xs sm:text-sm font-bold text-[var(--text-main)] truncate">
                    {system.name}
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] truncate">
                    {article.articleNumber} - {article.title}
                  </div>
                </div>
              </div>

              {/* أزرار التنقل السريع في الشاشة الكاملة */}
              {(hasPrevArticle || hasNextArticle) && (
                <div className="hidden sm:flex items-center gap-1 bg-[var(--card-bg)] px-2 py-1 rounded-xl border border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={onPrevArticle}
                    disabled={!hasPrevArticle}
                    className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                      hasPrevArticle
                        ? 'hover:bg-[var(--container-bg)] text-[var(--text-main)] cursor-pointer'
                        : 'opacity-30 cursor-not-allowed text-[var(--text-muted)]'
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span>السابق</span>
                  </button>
                  {currentIndex && totalSystemArticles && (
                    <span className="text-[11px] text-[var(--text-secondary)] px-2">
                      {currentIndex} / {totalSystemArticles}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={onNextArticle}
                    disabled={!hasNextArticle}
                    className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                      hasNextArticle
                        ? 'hover:bg-[var(--container-bg)] text-[var(--text-main)] cursor-pointer'
                        : 'opacity-30 cursor-not-allowed text-[var(--text-muted)]'
                    }`}
                  >
                    <span>التالي</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* حجم الخط وزر الخروج من الشاشة الكاملة */}
              <div className="flex items-center gap-2">
                {onChangeFontSize && (
                  <div className="hidden sm:flex items-center bg-[var(--card-bg)] rounded-lg p-0.5 border border-[var(--border-subtle)] text-xs">
                    {(['normal', 'medium', 'large'] as FontSizeLevel[]).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => onChangeFontSize(size)}
                        className={`px-2 py-1 rounded-md font-medium transition cursor-pointer ${
                          fontSize === size
                            ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        {size === 'normal' ? 'أ' : size === 'medium' ? 'أ+' : 'أ++'}
                      </button>
                    ))}
                  </div>
                )}

                {/* زر الخروج من الشاشة الكاملة */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="px-3 py-1.5 rounded-xl bg-[#6d1a24] hover:bg-[#531119] text-white dark:bg-[#dfb141] dark:text-[#0f172a] dark:hover:bg-[#c59b27] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  title="إنهاء وضع الشاشة الكاملة (Esc)"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>خروج</span>
                </button>
              </div>

            </div>
          </div>

          {/* محتوى القراءة في الشاشة الكاملة */}
          <div className="py-6 px-4 sm:px-6">
            {renderArticleBody(true)}
          </div>
        </div>
      )}

      {/* نافذة المشاركة */}
      <ShareArticleModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        article={article}
        system={system}
      />
    </>
  );
};
