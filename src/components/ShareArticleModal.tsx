import React, { useState } from 'react';
import { LawArticle, LawSystem } from '../data/lawsData';
import { 
  X, 
  Copy, 
  Check, 
  Link as LinkIcon, 
  MessageCircle, 
  Send, 
  Smartphone
} from 'lucide-react';

interface ShareArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: LawArticle;
  system: LawSystem;
}

export const ShareArticleModal: React.FC<ShareArticleModalProps> = ({
  isOpen,
  onClose,
  article,
  system
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isOpen) return null;

  // Build direct shareable URL
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const directUrl = `${origin}${pathname}?system=${system.id}&article=${article.id}`;

  const shareTitle = `منصة قانون 01: ${article.articleNumber} - ${article.title} (${system.shortName})`;
  const shareText = `🏛️ منصة قانون 01 للأنظمة في القانون السعودي\n📜 ${system.shortName}: ${article.articleNumber} - ${article.title}\n\n💡 استعرض نص المادة الرسمي، اللائحة التنفيذية، والشرح المعتمد:`;

  // Copy Direct Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(directUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    });
  };

  // Copy Full Summary Text
  const handleCopySummary = () => {
    const fullText = `${shareText}\n${directUrl}\n\n📌 نص المادة:\n${article.officialText.substring(0, 160)}...`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2200);
    });
  };

  // Web Share API (Mobile native share)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `${shareText}\n`,
          url: directUrl
        });
      } catch (err) {
        // User cancelled
      }
    }
  };

  // Social Share URLs
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${directUrl}`)}`;
  const xTwitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareTitle}\n`)}&url=${encodeURIComponent(directUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(directUrl)}&text=${encodeURIComponent(shareTitle)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 font-['Thmanyah_Sans',sans-serif]">
      {/* Modal Card - Exact Thmanyah aesthetic */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#18181b] rounded-3xl p-6 sm:p-9 shadow-2xl border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 flex flex-col items-center text-center space-y-5 animate-in zoom-in-95 duration-150">
        
        {/* Close Button at Corner */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-1.5 text-neutral-500 hover:text-black dark:hover:text-white transition cursor-pointer bg-transparent border-0"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Large Thmanyah Wordmark */}
        <div className="pt-1">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            قانون 01
          </span>
        </div>

        {/* 2. Direct Question & Subtitle */}
        <div className="space-y-1.5 max-w-sm">
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white tracking-tight">
            مشاركــــة المــــادة؟
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed line-clamp-2">
            {system.shortName} · {article.articleNumber}
          </p>
        </div>

        {/* 3. Input Field (Like the email box in Thmanyah modal) */}
        <div className="w-full relative">
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
            <LinkIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            readOnly
            value={directUrl}
            onClick={(e) => (e.target as HTMLInputElement).select()}
            className="w-full h-12 pr-10 pl-4 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-700 dark:text-neutral-200 outline-none focus:border-black dark:focus:border-white transition text-center selection:bg-neutral-200"
          />
        </div>

        {/* 4. Solid Black Thmanyah Primary Action Button */}
        <button
          onClick={handleCopyLink}
          className="w-full h-12 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 rounded-xl font-bold text-sm sm:text-base transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4" />
              <span>تم نسخ الرابط!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>نســــخ الرابــــط</span>
            </>
          )}
        </button>

        {/* 5. Minimal Social Channels & Alternative Actions */}
        <div className="w-full pt-1 space-y-3">
          <div className="flex items-center justify-center gap-5 text-xs text-neutral-600 dark:text-neutral-400">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span className="font-semibold">واتساب</span>
            </a>

            <a
              href={xTwitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition"
            >
              <span className="text-sm font-black">𝕏</span>
              <span className="font-semibold">منصة إكس</span>
            </a>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition"
            >
              <Send className="w-4 h-4 text-[#0088cc]" />
              <span className="font-semibold">تيليجرام</span>
            </a>

            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition bg-transparent border-0 cursor-pointer p-0"
              >
                <Smartphone className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                <span className="font-semibold">الهاتف</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopySummary}
            className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition cursor-pointer bg-transparent border-0 p-0 hover:underline"
          >
            {copiedSummary ? 'تم نسخ ملخص المادة!' : 'نسخ ملخص المادة كاملاً مع الرابط'}
          </button>
        </div>

      </div>
    </div>
  );
};
