import React from 'react';
import { X, Mail } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 font-['Thmanyah_Sans',sans-serif]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-[400px] bg-white dark:bg-[#1C1C1E] rounded-[28px] p-6 sm:p-7 shadow-2xl border border-neutral-200/80 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* زر الإغلاق الدائري في الأعلى يساراً */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 left-5 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-[#2C2C2E] dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center justify-center transition cursor-pointer border-0"
          title="إغلاق"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>

        {/* الترويسة يميناً مطابقة للتصميم */}
        <div className="text-right space-y-1.5 pt-1 pb-4">
          <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            قانون 01
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100">
            تواصل
          </h3>
        </div>

        {/* قائمة قنوات التواصل */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/90">
          {/* 1. تلقرام */}
          <a
            href="https://t.me/hajeerlaw"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 py-3.5 px-2 -mx-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition text-right"
          >
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="11" fill="#229ED9" />
              <path
                d="M16.95 7.42L6.52 11.44c-.71.29-.71.69-.13.86l2.68.84 6.2-3.91c.29-.18.56-.08.34.11l-5.02 4.53-.19 2.75c.28 0 .4-.13.55-.28l1.33-1.29 2.76 2.04c.51.28.88.14 1.01-.47l1.82-8.57c.19-.75-.28-1.09-.92-.83z"
                fill="#FFFFFF"
              />
            </svg>
            <span className="text-sm sm:text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
              تلقرام (Telegram)
            </span>
          </a>

          {/* 2. سناب شات */}
          <a
            href="https://www.snapchat.com/@hajerlaw.01?share_id=83SMQjG7EqQ&locale=ar-EG"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 py-3.5 px-2 -mx-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition text-right"
          >
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2.75c-3.15 0-5.18 2.08-5.18 5.25 0 .64.08 1.38.17 2-.42.19-.85.15-1.15.05-.26-.08-.54.08-.6.34-.06.25.09.52.35.63.52.22 1.05.38 1.35.6.28.2.23.56-.02.98-.66 1.12-1.78 2.13-3.11 2.59-.32.11-.46.46-.31.76.19.38.75.73 1.72.97.26.07.37.27.43.55.07.3.16.57.49.57.28 0 .64-.12 1.12-.12.66 0 1.21.37 1.85.8.81.54 1.73 1.15 2.9 1.15s2.09-.61 2.9-1.15c.64-.43 1.19-.8 1.85-.8.48 0 .84.12 1.12.12.33 0 .42-.27.49-.57.06-.28.17-.48.43-.55.97-.24 1.53-.59 1.72-.97.15-.3.01-.65-.31-.76-1.33-.46-2.45-1.47-3.11-2.59-.25-.42-.3-.78-.02-.98.3-.22.83-.38 1.35-.6.26-.11.41-.38.35-.63-.06-.26-.34-.42-.6-.34-.3.1-.73.14-1.15-.05.09-.62.17-1.36.17-2 0-3.17-2.03-5.25-5.18-5.25z"
                fill="#FFFC00"
                stroke="#EAB308"
                strokeWidth="0.6"
              />
            </svg>
            <span className="text-sm sm:text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
              سناب شات (Snapchat)
            </span>
          </a>

          {/* 3. تيك توك */}
          <a
            href="https://www.tiktok.com/@hajer.law?is_from_webapp=1&sender_device=pc"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 py-3.5 px-2 -mx-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition text-right"
          >
            <svg
              className="w-6 h-6 shrink-0 text-neutral-950 dark:text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.81a8.27 8.27 0 0 0 4.76 1.5V6.86a4.84 4.84 0 0 1-1-.17z" />
            </svg>
            <span className="text-sm sm:text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
              تيك توك (TikTok)
            </span>
          </a>

          {/* 4. البريد الإلكتروني */}
          <a
            href="mailto:hajeerlaw.01@gmail.com"
            className="flex items-center gap-3.5 py-3.5 px-2 -mx-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition text-right"
          >
            <Mail className="w-6 h-6 shrink-0 text-neutral-900 dark:text-neutral-100 stroke-[1.8]" />
            <span className="text-sm sm:text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
              البريد الإلكتروني
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
