import React, { useState, useRef, useEffect } from 'react';
import { 
  Scale, 
  ChevronDown, 
  Search, 
  Bookmark, 
  Sun, 
  Moon,
  Headphones,
  Menu,
  X,
  Map,
  Calculator,
  Compass,
  AtSign
} from 'lucide-react';
import { SAUDI_LAW_SYSTEMS } from '../data/lawsData';

export type FontSizeLevel = 'normal' | 'medium' | 'large';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenCalculator: () => void;
  onOpenFavorites?: () => void;
  onOpenConsultation?: () => void;
  onOpenContact?: () => void;
  onOpenMap: () => void;
  favoritesCount?: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  fontSize: FontSizeLevel;
  onChangeFontSize: (size: FontSizeLevel) => void;
  onSelectSystem?: (systemId: string) => void;
  currentSystemId?: string;
  activeMainView?: 'home' | 'article' | 'map';
  onSetMainView?: (view: 'home' | 'article' | 'map') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenCalculator,
  onOpenFavorites,
  onOpenConsultation,
  onOpenContact,
  onOpenMap,
  favoritesCount = 0,
  darkMode,
  onToggleDarkMode,
  fontSize,
  onChangeFontSize,
  onSelectSystem,
  currentSystemId,
  activeMainView = 'home',
  onSetMainView
}) => {
  const [isSystemsDropdownOpen, setIsSystemsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSystemsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full sticky top-3 z-40 px-3 sm:px-6 md:px-8 pointer-events-none">
      <div className="max-w-5xl xl:max-w-6xl mx-auto pointer-events-auto">
        
        {/* The floating rounded navigation bar matching the Legal Tech Premium identity */}
        <div className="bg-[var(--container-bg)] border border-[var(--border-subtle)] rounded-full px-4 sm:px-6 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center justify-between gap-3 transition-colors">
          
          {/* 1. Brand Zone: Luminous Gold Scale Logo + Wordmark */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <button
              onClick={() => {
                if (onSetMainView) onSetMainView('home');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-right group cursor-pointer bg-transparent border-0 p-0 focus:outline-none"
              title="قانون 01 للأنظمة واللوائح السعودية"
            >
              <Scale className="w-5 h-5 text-[#b38719] dark:text-[#dfb141] transition-transform group-hover:scale-105 shrink-0" />
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-base sm:text-lg text-[var(--text-main)] tracking-tight">
                  قانون 01
                </span>
                <span className="text-[10px] sm:text-[11px] font-normal text-[var(--text-secondary)] whitespace-nowrap">
                  للأنظمة واللوائح
                </span>
              </div>
            </button>

            {/* 2. Middle Navigation Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-semibold">
              
              {/* الرئيسية */}
              <button
                onClick={() => onSetMainView && onSetMainView('home')}
                className={`px-3 py-1.5 rounded-full transition cursor-pointer bg-transparent border-0 ${
                  activeMainView === 'home'
                    ? 'text-[#6d1a24] dark:text-[#dfb141] font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                }`}
              >
                الرئيسية
              </button>

              {/* المواد النظامية */}
              <button
                onClick={() => onSetMainView && onSetMainView('article')}
                className={`px-3 py-1.5 rounded-full transition cursor-pointer bg-transparent border-0 ${
                  activeMainView === 'article'
                    ? 'text-[#6d1a24] dark:text-[#dfb141] font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                }`}
              >
                المواد النظامية
              </button>

              {/* الأنظمة واللوائح مع قائمة منسدلة */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsSystemsDropdownOpen(!isSystemsDropdownOpen)}
                  className="px-3 py-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-main)] transition cursor-pointer flex items-center gap-1 bg-transparent border-0"
                >
                  <span>الأنظمة واللوائح</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-secondary)] transition-transform duration-200 ${isSystemsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isSystemsDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--container-bg)] border border-[var(--border-subtle)] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto">
                    <div className="px-4 py-2 text-[11px] font-bold text-[var(--text-secondary)] border-b border-[var(--border-subtle)] mb-1 flex items-center justify-between">
                      <span>الأنظمة المتاحة</span>
                      <span className="font-normal text-[10px]">{SAUDI_LAW_SYSTEMS.length} أنظمة</span>
                    </div>
                    {SAUDI_LAW_SYSTEMS.map(sys => {
                      const isCurrent = sys.id === currentSystemId;
                      return (
                        <button
                          key={sys.id}
                          onClick={() => {
                            if (onSelectSystem) onSelectSystem(sys.id);
                            if (onSetMainView) onSetMainView('article');
                            setIsSystemsDropdownOpen(false);
                          }}
                          className={`w-full text-right px-4 py-2.5 text-xs font-medium flex items-center justify-between transition hover:bg-[var(--card-bg-hover)] bg-transparent border-0 cursor-pointer ${
                            isCurrent
                              ? 'text-[#6d1a24] dark:text-[#dfb141] font-bold bg-[var(--card-bg)]'
                              : 'text-[var(--text-main)]'
                          }`}
                        >
                          <span className="truncate pr-1">{sys.name}</span>
                          <span className="text-[10px] text-[var(--text-secondary)] shrink-0 font-normal">
                            {sys.articles.length} مادة
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* خريطة الأنظمة الهرمية */}
              <button
                onClick={() => {
                  if (onSetMainView) onSetMainView('map');
                  else onOpenMap();
                }}
                className={`px-3 py-1.5 rounded-full transition cursor-pointer bg-transparent border-0 ${
                  activeMainView === 'map'
                    ? 'text-[#6d1a24] dark:text-[#dfb141] font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                }`}
              >
                خريطة الأنظمة
              </button>

              {/* حاسبة الحقوق */}
              <button
                onClick={onOpenCalculator}
                className="px-3 py-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-main)] transition cursor-pointer bg-transparent border-0"
              >
                حاسبة الحقوق
              </button>

              {/* تابعنا */}
              {onOpenContact && (
                <button
                  onClick={onOpenContact}
                  className="px-3 py-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-main)] transition cursor-pointer bg-transparent border-0 flex items-center gap-1.5"
                >
                  <AtSign className="w-3.5 h-3.5 text-[#059669] dark:text-[#34d399]" />
                  <span>تابعنا</span>
                </button>
              )}

            </nav>
          </div>

          {/* 3. Action Tools: Text sizing, Search, Dark mode */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* البحث السريع */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-main)] transition cursor-pointer bg-transparent border-0 rounded-full hover:bg-[var(--card-bg-hover)]"
              title="بحث في الأنظمة والمواد (Ctrl + K)"
              aria-label="البحث"
            >
              <Search className="w-4 h-4 text-[var(--text-secondary)] hover:text-[var(--text-main)]" />
            </button>

            {/* تحكم حجم الخط المحسّن والأنيق */}
            <div className="flex items-center bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-full p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => onChangeFontSize('normal')}
                className={`px-2 py-1 rounded-full text-xs font-bold transition cursor-pointer border-0 ${
                  fontSize === 'normal'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                    : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                }`}
                title="حجم خط عادي"
              >
                أ
              </button>
              <button
                type="button"
                onClick={() => onChangeFontSize('medium')}
                className={`px-2 py-1 rounded-full text-xs font-bold transition cursor-pointer border-0 ${
                  fontSize === 'medium'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                    : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                }`}
                title="حجم خط متوسط (+)"
              >
                أ+
              </button>
              <button
                type="button"
                onClick={() => onChangeFontSize('large')}
                className={`px-2 py-1 rounded-full text-xs font-bold transition cursor-pointer border-0 ${
                  fontSize === 'large'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                    : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                }`}
                title="حجم خط كبير (++)"
              >
                أ++
              </button>
            </div>

            {/* الوضع الليلي المريح */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-main)] transition cursor-pointer bg-transparent border-0 rounded-full hover:bg-[var(--card-bg-hover)]"
              title={darkMode ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي المريح'}
              aria-label="تبديل الوضع الليلي"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-[#fbbf24]" />
              ) : (
                <Moon className="w-4 h-4 text-[#6366f1]" />
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-main)] transition cursor-pointer bg-transparent border-0 rounded-full hover:bg-[var(--card-bg-hover)]"
              title="القائمة"
              aria-label="القائمة"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>

        </div>

        {/* Mobile Dropdown Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 bg-[var(--container-bg)] border border-[var(--border-subtle)] rounded-2xl shadow-xl p-3 animate-in fade-in slide-in-from-top-2 duration-150 space-y-2">
            <div className="grid grid-cols-2 gap-1.5 pb-2 border-b border-[var(--border-subtle)]">
              <button
                onClick={() => {
                  if (onSetMainView) onSetMainView('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  activeMainView === 'home'
                    ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a]'
                    : 'bg-[var(--card-bg)] text-[var(--text-main)] hover:bg-[var(--card-bg-hover)]'
                }`}
              >
                <Scale className="w-4 h-4 text-[#b38719] dark:text-[#dfb141]" />
                <span>الرئيسية</span>
              </button>

              <button
                onClick={() => {
                  if (onSetMainView) onSetMainView('article');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  activeMainView === 'article'
                    ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a]'
                    : 'bg-[var(--card-bg)] text-[var(--text-main)] hover:bg-[var(--card-bg-hover)]'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>المواد النظامية</span>
              </button>

              <button
                onClick={() => {
                  if (onSetMainView) onSetMainView('map');
                  else onOpenMap();
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  activeMainView === 'map'
                    ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a]'
                    : 'bg-[var(--card-bg)] text-[var(--text-main)] hover:bg-[var(--card-bg-hover)]'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>خريطة الأنظمة</span>
              </button>

              <button
                onClick={() => {
                  onOpenCalculator();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl text-xs font-semibold flex items-center gap-2 bg-[var(--card-bg)] text-[var(--text-main)] hover:bg-[var(--card-bg-hover)] transition"
              >
                <Calculator className="w-4 h-4 text-[#006c35] dark:text-[#10b981]" />
                <span>حاسبة الحقوق</span>
              </button>

              {onOpenContact && (
                <button
                  onClick={() => {
                    onOpenContact();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-xl text-xs font-semibold flex items-center gap-2 bg-[var(--card-bg)] text-[var(--text-main)] hover:bg-[var(--card-bg-hover)] transition"
                >
                  <AtSign className="w-4 h-4 text-[#059669] dark:text-[#34d399]" />
                  <span>تابعنا</span>
                </button>
              )}
            </div>

            {/* Mobile Font Size Control */}
            <div className="flex items-center justify-between px-2 pt-1">
              <span className="text-xs text-[var(--text-secondary)]">حجم الخط:</span>
              <div className="flex items-center rounded-lg border border-[var(--border-subtle)] text-xs font-bold">
                <button
                  onClick={() => onChangeFontSize('normal')}
                  className={`px-3 py-1 transition ${fontSize === 'normal' ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a]' : 'text-[var(--text-secondary)]'}`}
                >
                  أ
                </button>
                <button
                  onClick={() => onChangeFontSize('medium')}
                  className={`px-3 py-1 transition ${fontSize === 'medium' ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a]' : 'text-[var(--text-secondary)]'}`}
                >
                  أ+
                </button>
                <button
                  onClick={() => onChangeFontSize('large')}
                  className={`px-3 py-1 transition ${fontSize === 'large' ? 'bg-[#6d1a24] text-white dark:bg-[#dfb141] dark:text-[#0f172a]' : 'text-[var(--text-secondary)]'}`}
                >
                  أ++
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
