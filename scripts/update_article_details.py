import re

content = '''import React, { useState, useEffect, useRef } from 'react';
import { LawArticle, LawSystem } from '../data/lawsData';
import { cleanTextForSpeech, getBestArabicVoice } from '../utils/speechHelper';
import { FontSizeLevel } from './Header';
import { ShareArticleModal } from './ShareArticleModal';
import { 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  Bookmark, 
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
  const [showExplanation, setShowExplanation] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [showBylaw, setShowBylaw] = useState(false);
  const [showCourtCase, setShowCourtCase] = useState(false);
  const [showTip, setShowTip] = useState(false);

  // Audio Speech state
  const [audioState, setAudioState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Reset audio on article change
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setAudioState('idle');
    }
  }, [article.id]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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

  // Text-to-speech
  const handleStartSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('المتصفح لا يدعم القراءة الصوتية');
      return;
    }
    window.speechSynthesis.cancel();
    const cleanedText = cleanTextForSpeech(
      `المادة ${article.articleNumber}. ${article.title}. نص المادة: ${article.officialText}. الشرح بالعامية: ${article.saudiExplanation}`
    );
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    const bestVoice = getBestArabicVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
    }
    utterance.onstart = () => setAudioState('playing');
    utterance.onend = () => setAudioState('idle');
    utterance.onerror = () => setAudioState('idle');
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setAudioState('playing');
  };

  const handlePauseSpeech = () => {
    if ('speechSynthesis' in window && audioState === 'playing') {
      window.speechSynthesis.pause();
      setAudioState('paused');
    }
  };

  const handleResumeSpeech = () => {
    if ('speechSynthesis' in window && audioState === 'paused') {
      window.speechSynthesis.resume();
      setAudioState('playing');
    } else {
      handleStartSpeech();
    }
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setAudioState('idle');
    }
  };

  // Copy full article
  const handleCopyAll = () => {
    const textToCopy = `🏛️ سديد للأنظمة في القانون السعودي
📜 النظام: ${system.name}
🔖 ${article.articleNumber} - ${article.title}

1. نص المادة الرسمي:
${article.officialText}

2. اللائحة التنفيذية:
${article.executiveBylaw}

3. الشرح بالعامية:
${article.saudiExplanation}

4. الأمثلة التوضيحية:
${article.practicalExamples.map((ex) => `• ${ex.title}: ${ex.scenario}\nالنتيجة: ${ex.takeaway}`).join('\\n\\n')}

5. القضية وحكم المحكمة:
${article.courtCase.caseTitle} (${article.courtCase.court})
الوقائع: ${article.courtCase.facts}
الحكم: ${article.courtCase.judgment}

💡 نصيحة سديد: ${article.sadeedTip}`;

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

منصة سديد للأنظمة في القانون السعودي`;

    navigator.clipboard.writeText(caseText).then(() => {
      setCopiedCase(true);
      setTimeout(() => setCopiedCase(false), 2200);
    });
  };

  // Toggle all sections
  const handleToggleAll = () => {
    const allOpen = showExplanation && showExamples && showBylaw && showCourtCase && showTip;
    if (allOpen) {
      setShowExplanation(false);
      setShowExamples(false);
      setShowBylaw(false);
      setShowCourtCase(false);
      setShowTip(false);
    } else {
      setShowExplanation(true);
      setShowExamples(true);
      setShowBylaw(true);
      setShowCourtCase(true);
      setShowTip(true);
    }
  };

  const hasAnyOpen = showExplanation || showExamples || showBylaw || showCourtCase || showTip;
  const allOpen = showExplanation && showExamples && showBylaw && showCourtCase && showTip;

  // Render article body (used in standard page view and in fullscreen mode)
  const renderArticleBody = (inFullscreen = false) => {
    return (
      <div className={`space-y-3.5 ${inFullscreen ? 'max-w-3xl w-full mx-auto pb-16' : 'w-full'}`}>
        
        {/* 1. الشريط العلوي: الصوت، الشاشة الكاملة، المفضلة، النسخ، المشاركة */}
        <div className="bg-[var(--card-bg)] rounded-xl p-2 sm:p-2.5 border border-[var(--border-subtle)] flex items-center justify-between gap-2 flex-wrap">
          
          {/* رقم المادة والمؤشر */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#6d1a24] dark:text-[#dfb141] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#6d1a24] dark:bg-[#dfb141]"></span>
              <span>{article.articleNumber}</span>
            </span>
            {currentIndex && totalSystemArticles && (
              <span className="text-[11px] text-[var(--text-secondary)] bg-[var(--container-bg)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)] font-mono">
                {currentIndex} / {totalSystemArticles}
              </span>
            )}
          </div>

          {/* أزرار الإجراءات العلوية */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Audio Button */}
            {audioState === 'idle' ? (
              <button
                type="button"
                onClick={handleStartSpeech}
                className="p-1.5 text-xs text-[var(--text-secondary)] hover:opacity-80 transition cursor-pointer flex items-center gap-1 bg-transparent border-0"
                title="استمع للمادة صوتياً"
              >
                <Volume2 className="w-4 h-4 text-[#059669] dark:text-[#34d399]" />
                <span className="hidden sm:inline text-[11px] font-medium text-[var(--text-main)]">استمع</span>
              </button>
            ) : (
              <div className="flex items-center gap-0.5 bg-transparent px-1 py-0.5">
                {audioState === 'playing' ? (
                  <button onClick={handlePauseSpeech} className="p-1 text-[#059669] hover:opacity-80 bg-transparent border-0 cursor-pointer" title="إيقاف مؤقت">
                    <Pause className="w-3.5 h-3.5 text-[#059669] dark:text-[#34d399]" />
                  </button>
                ) : (
                  <button onClick={handleResumeSpeech} className="p-1 text-[#059669] hover:opacity-80 bg-transparent border-0 cursor-pointer" title="استئناف">
                    <Play className="w-3.5 h-3.5 text-[#059669] dark:text-[#34d399]" />
                  </button>
                )}
                <button onClick={handleStopSpeech} className="p-1 text-[#ef4444] hover:opacity-80 bg-transparent border-0 cursor-pointer" title="إيقاف">
                  <VolumeX className="w-3.5 h-3.5 text-[#ef4444]" />
                </button>
              </div>
            )}

            {/* زر الشاشة الكاملة (Fullscreen) */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                isFullscreen
                  ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a] border-[#6d1a24] dark:border-[#dfb141]'
                  : 'bg-[var(--container-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border-[var(--border-subtle)]'
              }`}
              title={isFullscreen ? 'الخروج من الشاشة الكاملة (Esc)' : 'عرض شاشة كاملة'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">إنهاء الشاشة الكاملة</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-[#6d1a24] dark:text-[#dfb141]" />
                  <span>شاشة كاملة</span>
                </>
              )}
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="p-1.5 hover:opacity-80 transition cursor-pointer bg-transparent border-0"
              title="مشاركة المادة"
            >
              <Share2 className="w-4 h-4 text-[#0284c7] dark:text-[#38bdf8]" />
            </button>

            {/* Bookmark */}
            <button
              type="button"
              onClick={onToggleFavorite}
              className="p-1.5 hover:opacity-80 transition cursor-pointer bg-transparent border-0"
              title={isFavorite ? 'محفوظ في المفضلة' : 'حفظ'}
            >
              <Bookmark className={`w-4 h-4 text-[#991b1b] dark:text-[#f43f5e] ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Copy */}
            <button
              type="button"
              onClick={handleCopyAll}
              className="p-1.5 hover:opacity-80 transition cursor-pointer bg-transparent border-0"
              title="نسخ المادة"
            >
              {copied ? (
                <Check className="w-4 h-4 text-[#059669] dark:text-[#34d399]" />
              ) : (
                <Copy className="w-4 h-4 text-[#64748b] dark:text-[#94a3b8]" />
              )}
            </button>
          </div>
        </div>

        {/* 2. نص المادة الرسمي - واضح ومريح في القراءة */}
        <div className="bg-[var(--container-bg)] rounded-xl p-4 border border-[var(--border-subtle)] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6d1a24] dark:bg-[#dfb141]"></span>
              <h3 className="text-xs sm:text-sm font-bold text-[var(--text-main)]">
                نص المادة الرسمي
              </h3>
            </div>
            <span className="text-[11px] font-medium text-[var(--text-secondary)]">
              {system.shortName}
            </span>
          </div>
          
          <h4 className="text-sm sm:text-base font-bold text-[#6d1a24] dark:text-[#dfb141] mb-2">
            {article.title}
          </h4>

          <div className={`text-[var(--text-main)] font-normal leading-relaxed ${bodyTextClass}`}>
            {article.officialText}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. أزرار الشرح والأمثلة الأنيقة المبسطة (دون أي تعقيد أو تشتيت) */}
        {/* ======================================================== */}
        <div className="bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--border-subtle)] space-y-2.5">
          <div className="flex items-center justify-between px-0.5 text-xs">
            <span className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#dfb141]" />
              <span>اضغط أي زر لعرض النص التوضيحي:</span>
            </span>
            <button
              type="button"
              onClick={handleToggleAll}
              className="text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-main)] transition cursor-pointer bg-transparent border-0 flex items-center gap-1"
            >
              {allOpen ? 'إخفاء الكل' : 'عرض الكل'}
            </button>
          </div>

          {/* شريط الأزرار الواضح والمباشر */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* 1. زر الشرح بالعامية */}
            <button
              type="button"
              onClick={() => setShowExplanation(!showExplanation)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                showExplanation
                  ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a] border-[#6d1a24] dark:border-[#dfb141] shadow-xs'
                  : 'bg-[var(--container-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border-[var(--border-subtle)]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>الشرح بالعامية</span>
              {showExplanation ? <ChevronUp className="w-3 h-3 opacity-80" /> : <ChevronDown className="w-3 h-3 opacity-60" />}
            </button>

            {/* 2. زر الأمثلة العملية */}
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
            </button>

            {/* 3. زر اللائحة التنفيذية */}
            <button
              type="button"
              onClick={() => setShowBylaw(!showBylaw)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                showBylaw
                  ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a] border-[#6d1a24] dark:border-[#dfb141] shadow-xs'
                  : 'bg-[var(--container-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border-[var(--border-subtle)]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>اللائحة التنفيذية</span>
              {showBylaw ? <ChevronUp className="w-3 h-3 opacity-80" /> : <ChevronDown className="w-3 h-3 opacity-60" />}
            </button>

            {/* 4. زر حكم المحكمة */}
            <button
              type="button"
              onClick={() => setShowCourtCase(!showCourtCase)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                showCourtCase
                  ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a] border-[#6d1a24] dark:border-[#dfb141] shadow-xs'
                  : 'bg-[var(--container-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border-[var(--border-subtle)]'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>حكم المحكمة</span>
              {showCourtCase ? <ChevronUp className="w-3 h-3 opacity-80" /> : <ChevronDown className="w-3 h-3 opacity-60" />}
            </button>

            {/* 5. زر نصيحة سديد */}
            <button
              type="button"
              onClick={() => setShowTip(!showTip)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                showTip
                  ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a] border-[#6d1a24] dark:border-[#dfb141] shadow-xs'
                  : 'bg-[var(--container-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-main)] border-[var(--border-subtle)]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>نصيحة سديد</span>
              {showTip ? <ChevronUp className="w-3 h-3 opacity-80" /> : <ChevronDown className="w-3 h-3 opacity-60" />}
            </button>

          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. النصوص المنبثقة عند الضغط على الأزرار (مرتبة ومريحة للعين) */}
        {/* ======================================================== */}

        {/* نص الشرح بالعامية */}
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
        )}

        {/* نص الأمثلة العملية */}
        {showExamples && (
          <div className="bg-[var(--container-bg)] rounded-xl p-4 border border-[#d97706]/30 dark:border-[#fbbf24]/30 shadow-xs animate-in fade-in slide-in-from-top-1 duration-150 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#d97706] dark:text-[#fbbf24]" />
                <h4 className="text-xs sm:text-sm font-bold text-[#d97706] dark:text-[#fbbf24]">
                  أمثلة وتطبيقات عملية
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowExamples(false)}
                className="text-[11px] text-[var(--text-secondary)] hover:text-[#ef4444] flex items-center gap-1 cursor-pointer bg-transparent border-0"
                title="إغلاق الأمثلة"
              >
                <X className="w-3.5 h-3.5" />
                <span>إغلاق</span>
              </button>
            </div>
            <div className="space-y-2">
              {article.practicalExamples.map((example, i) => (
                <div key={i} className="bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--border-subtle)]">
                  <div className="font-bold text-xs sm:text-sm text-[var(--text-main)] mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]"></span>
                    <span>{example.title}</span>
                  </div>
                  <p className={`text-[var(--text-muted)] mb-2 ${bodyTextClass}`}>
                    {example.scenario}
                  </p>
                  <div className="text-xs font-semibold text-[#6d1a24] dark:text-[#dfb141] bg-[var(--container-bg)] p-2 rounded-lg border border-[var(--border-subtle)]">
                    📌 النتيجة والأثر: {example.takeaway}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* نص اللائحة التنفيذية */}
        {showBylaw && (
          <div className="bg-[var(--container-bg)] rounded-xl p-4 border border-[#0284c7]/30 dark:border-[#38bdf8]/30 shadow-xs animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0284c7] dark:text-[#38bdf8]" />
                <h4 className="text-xs sm:text-sm font-bold text-[#0284c7] dark:text-[#38bdf8]">
                  أحكام اللائحة التنفيذية
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowBylaw(false)}
                className="text-[11px] text-[var(--text-secondary)] hover:text-[#ef4444] flex items-center gap-1 cursor-pointer bg-transparent border-0"
                title="إغلاق اللائحة"
              >
                <X className="w-3.5 h-3.5" />
                <span>إغلاق</span>
              </button>
            </div>
            <div className={`text-[var(--text-main)] font-normal leading-relaxed ${bodyTextClass}`}>
              {article.executiveBylaw}
            </div>
          </div>
        )}

        {/* نص حكم وصك المحكمة */}
        {showCourtCase && (
          <div className="bg-[var(--container-bg)] rounded-xl p-4 border border-[#991b1b]/30 dark:border-[#f43f5e]/30 shadow-xs animate-in fade-in slide-in-from-top-1 duration-150 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#991b1b] dark:text-[#f43f5e]" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--text-main)]">
                    {article.courtCase.caseTitle}
                  </h4>
                  <div className="text-[11px] text-[var(--text-secondary)]">
                    {article.courtCase.court}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCase}
                  className="px-2 py-1 text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-main)] bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] rounded-md border border-[var(--border-subtle)] transition cursor-pointer"
                >
                  {copiedCase ? 'تم نسخ الحكم' : 'نسخ الصك'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCourtCase(false)}
                  className="text-[11px] text-[var(--text-secondary)] hover:text-[#ef4444] flex items-center gap-1 cursor-pointer bg-transparent border-0"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>إغلاق</span>
                </button>
              </div>
            </div>

            {/* أطراف الدعوى */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[var(--card-bg)] p-2 rounded-lg border border-[var(--border-subtle)]">
                <span className="text-[10px] text-[var(--text-secondary)] block">المدعي:</span>
                <span className="font-semibold text-[var(--text-main)]">{article.courtCase.parties.claimant}</span>
              </div>
              <div className="bg-[var(--card-bg)] p-2 rounded-lg border border-[var(--border-subtle)]">
                <span className="text-[10px] text-[var(--text-secondary)] block">المدعى عليه:</span>
                <span className="font-semibold text-[var(--text-main)]">{article.courtCase.parties.defendant}</span>
              </div>
            </div>

            {/* الوقائع */}
            <div className="text-xs space-y-1">
              <span className="font-bold text-[var(--text-main)]">وقائع النزاع:</span>
              <p className={`text-[var(--text-muted)] bg-[var(--card-bg)] p-2.5 rounded-lg border border-[var(--border-subtle)] ${bodyTextClass}`}>
                {article.courtCase.facts}
              </p>
            </div>

            {/* منطوق الحكم القضائي والتسبيب */}
            <div className="bg-[var(--card-bg)] p-3 rounded-lg border border-[var(--border-subtle)] space-y-1.5">
              <span className="text-xs font-bold text-[#6d1a24] dark:text-[#dfb141] block">
                ⚡ منطوق الحكم الصادر:
              </span>
              <p className={`text-[var(--text-main)] font-semibold leading-relaxed ${bodyTextClass}`}>
                {article.courtCase.judgment}
              </p>
              <div className="text-[11px] text-[var(--text-secondary)] pt-1.5 border-t border-[var(--border-subtle)]">
                <strong>التسبيب والمبدأ القضائي:</strong> {article.courtCase.legalRationale}
              </div>
            </div>
          </div>
        )}

        {/* نص وصية وتوجيه سديد */}
        {showTip && (
          <div className="bg-[var(--card-bg)] border border-[#059669]/30 rounded-xl p-3.5 text-xs shadow-xs animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 font-bold text-[#059669] dark:text-[#34d399]">
                <ShieldCheck className="w-4 h-4" />
                <span>وصية وتوجيه «سديد» العملي:</span>
              </div>
              <button
                type="button"
                onClick={() => setShowTip(false)}
                className="text-[11px] text-[var(--text-secondary)] hover:text-[#ef4444] cursor-pointer bg-transparent border-0"
              >
                <X className="w-3.5 h-3.5" />
                <span>إغلاق</span>
              </button>
            </div>
            <div className="text-[var(--text-main)] leading-relaxed font-medium">
              {article.sadeedTip}
            </div>
          </div>
        )}

        {/* 5. أسفل المادة: أزرار التنقل السريع بين المواد */}
        {(hasPrevArticle || hasNextArticle) && (
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={onPrevArticle}
              disabled={!hasPrevArticle}
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                hasPrevArticle
                  ? 'bg-[var(--container-bg)] hover:bg-[var(--card-bg)] text-[var(--text-main)] border-[var(--border-subtle)]'
                  : 'opacity-40 cursor-not-allowed bg-[var(--container-bg)] text-[var(--text-muted)] border-[var(--border-subtle)]'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
              <span>المادة السابقة</span>
            </button>
            <button
              type="button"
              onClick={onNextArticle}
              disabled={!hasNextArticle}
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                hasNextArticle
                  ? 'bg-[var(--container-bg)] hover:bg-[var(--card-bg)] text-[var(--text-main)] border-[var(--border-subtle)]'
                  : 'opacity-40 cursor-not-allowed bg-[var(--container-bg)] text-[var(--text-muted)] border-[var(--border-subtle)]'
              }`}
            >
              <span>المادة التالية</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* أزرار النسخ والمشاركة النظيفة أسفل الشاشة */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleCopyAll}
            className="w-full bg-[var(--container-bg)] hover:bg-[var(--card-bg)] text-[var(--text-main)] border border-[var(--border-subtle)] p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#059669] dark:text-[#34d399]" />
                <span>تم نسخ المادة</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ المادة والشرح</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="w-full bg-[#6d1a24] hover:bg-[#531119] text-white dark:bg-[#dfb141] dark:text-[#0f172a] dark:hover:bg-[#c59b27] p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>مشاركة المادة</span>
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
        <div className="fixed inset-0 z-50 bg-[var(--bg-color)] overflow-y-auto font-['IBM_Plex_Sans_Arabic',sans-serif] animate-in fade-in duration-150">
          
          {/* الشريط العلوي الثابت في الشاشة الكاملة */}
          <div className="sticky top-0 z-20 bg-[var(--container-bg)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 py-2.5 shadow-sm">
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
              
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
                    <span className="text-[11px] text-[var(--text-secondary)] px-2 font-mono">
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
'''

with open('src/components/ArticleDetails.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ArticleDetails.tsx successfully!")
