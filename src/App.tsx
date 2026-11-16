import React, { useState, useEffect } from 'react';
import { SAUDI_LAW_SYSTEMS, LawSystem, LawArticle } from './data/lawsData';
import { Header, FontSizeLevel } from './components/Header';
import { HomePage } from './components/HomePage';
import { SystemSelector } from './components/SystemSelector';
import { ArticleDetails } from './components/ArticleDetails';
import { LawHierarchyMap } from './components/LawHierarchyMap';
import { SearchModal } from './components/SearchModal';
import { LegalCalculatorModal } from './components/LegalCalculatorModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { LegalConsultationModal } from './components/LegalConsultationModal';
import { ContactModal } from './components/ContactModal';
import { BookOpen, Network, X, Scale, Calculator, AtSign } from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Initialize from URL search parameters if available (for direct shared links)
  const [selectedSystemId, setSelectedSystemId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sys = params.get('system');
      if (sys && SAUDI_LAW_SYSTEMS.some(s => s.id === sys)) return sys;
    }
    return 'labor';
  });

  const [selectedArticleId, setSelectedArticleId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sysId = params.get('system') || 'labor';
      const artId = params.get('article');
      const targetSys = SAUDI_LAW_SYSTEMS.find(s => s.id === sysId);
      if (artId && targetSys?.articles.some(a => a.id === artId)) return artId;
    }
    return 'labor-m77';
  });

  // Keep browser URL synchronized with the current system and article for direct link sharing
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('system', selectedSystemId);
        url.searchParams.set('article', selectedArticleId);
        window.history.replaceState({}, '', url.toString());
      } catch {
        // ignore in environments without history support
      }
    }
  }, [selectedSystemId, selectedArticleId]);

  // Main Page View Mode: 'home' (الصفحة الرئيسية الشاملة), 'article' (تصفح المواد), or 'map' (خريطة الأنظمة)
  const [mainViewMode, setMainViewMode] = useState<'home' | 'article' | 'map'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('system') || params.get('article')) {
        return 'article';
      }
    }
    return 'home';
  });

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('sadeed_dark_mode');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sadeed_dark_mode', JSON.stringify(darkMode));
    } catch {}
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Font Size State
  const [fontSize, setFontSize] = useState<FontSizeLevel>(() => {
    try {
      const saved = localStorage.getItem('sadeed_font_size');
      return (saved as FontSizeLevel) || 'normal';
    } catch {
      return 'normal';
    }
  });

  const handleFontSizeChange = (size: FontSizeLevel) => {
    setFontSize(size);
    try {
      localStorage.setItem('sadeed_font_size', size);
    } catch {}
  };

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sadeed_favorites');
      return saved ? JSON.parse(saved) : ['labor-m77', 'civil-m138'];
    } catch {
      return ['labor-m77', 'civil-m138'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sadeed_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // Filtered systems based on category
  const filteredSystems = React.useMemo(() => {
    if (selectedCategory === 'all') return SAUDI_LAW_SYSTEMS;
    return SAUDI_LAW_SYSTEMS.filter(s => s.category === selectedCategory);
  }, [selectedCategory]);

  // Keep system and article valid when category changes
  useEffect(() => {
    if (filteredSystems.length > 0 && !filteredSystems.some(s => s.id === selectedSystemId)) {
      const firstSys = filteredSystems[0];
      setSelectedSystemId(firstSys.id);
      if (firstSys.articles.length > 0) {
        setSelectedArticleId(firstSys.articles[0].id);
      }
    }
  }, [selectedCategory, filteredSystems, selectedSystemId]);

  // Current system and article
  const currentSystem = SAUDI_LAW_SYSTEMS.find(s => s.id === selectedSystemId) || SAUDI_LAW_SYSTEMS[0];
  const currentArticle = currentSystem.articles.find(a => a.id === selectedArticleId) || currentSystem.articles[0];

  const handleSystemChange = (systemId: string) => {
    setSelectedSystemId(systemId);
    const targetSys = SAUDI_LAW_SYSTEMS.find(s => s.id === systemId);
    if (targetSys) {
      if (selectedCategory !== 'all' && targetSys.category !== selectedCategory) {
        setSelectedCategory('all');
      }
      if (targetSys.articles.length > 0) {
        setSelectedArticleId(targetSys.articles[0].id);
      }
    }
  };

  const handleArticleChange = (articleId: string) => {
    setSelectedArticleId(articleId);
  };

  // When clicking an article from search, modal, or the hierarchy map
  const handleSelectFromMapOrModal = (systemId: string, articleId: string) => {
    setSelectedSystemId(systemId);
    setSelectedArticleId(articleId);
    
    const sys = SAUDI_LAW_SYSTEMS.find(s => s.id === systemId);
    if (sys && selectedCategory !== 'all' && sys.category !== selectedCategory) {
      setSelectedCategory('all');
    }

    // Switch view back to article details if on map view
    setMainViewMode('article');
    setIsMapModalOpen(false);

    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (articleId: string) => {
    setFavorites(prev =>
      prev.includes(articleId) ? prev.filter(id => id !== articleId) : [...prev, articleId]
    );
  };

  const handleRemoveFavorite = (articleId: string) => {
    setFavorites(prev => prev.filter(id => id !== articleId));
  };

  const handleClearAllFavorites = () => {
    setFavorites([]);
  };

  const currentArticleIndex = currentSystem.articles.findIndex(a => a.id === selectedArticleId);
  const hasNextArticle = currentArticleIndex >= 0 && currentArticleIndex < currentSystem.articles.length - 1;
  const hasPrevArticle = currentArticleIndex > 0;

  const handleNextArticle = () => {
    if (hasNextArticle) {
      setSelectedArticleId(currentSystem.articles[currentArticleIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevArticle = () => {
    if (hasPrevArticle) {
      setSelectedArticleId(currentSystem.articles[currentArticleIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const totalArticles = SAUDI_LAW_SYSTEMS.reduce((acc, sys) => acc + sys.articles.length, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex flex-col font-['Thmanyah_Sans',sans-serif] transition-colors duration-200">
      
      {/* Top Floating Pill Header matching Tuwaiq screenshot with maroon scale logo */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenConsultation={() => setIsConsultationOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenMap={() => setIsMapModalOpen(true)}
        favoritesCount={favorites.length}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        fontSize={fontSize}
        onChangeFontSize={handleFontSizeChange}
        onSelectSystem={handleSystemChange}
        currentSystemId={selectedSystemId}
        activeMainView={mainViewMode}
        onSetMainView={setMainViewMode}
      />

      {/* Main Container - Spacious layout for laptops & desktops */}
      <main className="flex-1 flex justify-center items-start px-3 sm:px-6 md:px-8 py-3 sm:py-5">
        <div className="w-full max-w-5xl xl:max-w-6xl bg-[var(--container-bg)] p-5 sm:p-7 md:p-8 rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-[var(--border-subtle)] space-y-5 transition-all duration-200">
          
          {/* VIEW MODE 1: الصفحة الرئيسية الشاملة (Legal Portal Homepage) */}
          {mainViewMode === 'home' && (
            <HomePage
              onSelectArticle={handleSelectFromMapOrModal}
              onSelectSystem={(systemId) => {
                handleSystemChange(systemId);
                setMainViewMode('article');
              }}
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenCalculator={() => setIsCalculatorOpen(true)}
              onOpenMap={() => setMainViewMode('map')}
              onOpenConsultation={() => setIsConsultationOpen(true)}
              onOpenContact={() => setIsContactOpen(true)}
            />
          )}

          {/* VIEW MODE 2: تصفح المواد التفصيلي (Article Reader View) */}
          {mainViewMode === 'article' && (
            <div className="space-y-4">
              {/* 1. معلومات النظام المعتمد - مظهر رصين وفاخر */}
              <div className="pb-4 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-5 bg-[#b38719] dark:bg-[#dfb141] rounded-full shrink-0"></span>
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-[var(--text-main)] tracking-tight">
                      {currentSystem.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] pr-4">
                    <span>{currentSystem.issuingAuthority}</span>
                    <span aria-hidden="true" className="text-[var(--border-hover)]">·</span>
                    <span>معتمد ومحدّث وفق أحدث المراسيم والقرارات التنظيمية</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] self-start sm:self-auto pr-4 sm:pr-0">
                  <span className="font-semibold text-[var(--text-main)]">{currentSystem.articles.length} مادة</span>
                  <span aria-hidden="true" className="text-[var(--border-hover)]">·</span>
                  <span className="text-[#059669] dark:text-[#34d399] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#34d399]"></span>
                    نظام نافذ وساري
                  </span>
                </div>
              </div>

              {/* 1. System & Article Selectors + Categories */}
              <SystemSelector
                systems={filteredSystems}
                selectedSystemId={selectedSystemId}
                selectedArticleId={selectedArticleId}
                onSelectSystem={handleSystemChange}
                onSelectArticle={handleArticleChange}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              {/* 2. Article Details Breakdown (Statutory Text, Bylaw, Saudi Dialect Explanation, Court Decisions Tab) */}
              {currentArticle && (
                <ArticleDetails
                  article={currentArticle}
                  system={currentSystem}
                  isFavorite={favorites.includes(currentArticle.id)}
                  onToggleFavorite={() => toggleFavorite(currentArticle.id)}
                  fontSize={fontSize}
                  onChangeFontSize={handleFontSizeChange}
                  onNextArticle={handleNextArticle}
                  onPrevArticle={handlePrevArticle}
                  hasNextArticle={hasNextArticle}
                  hasPrevArticle={hasPrevArticle}
                  currentIndex={currentArticleIndex >= 0 ? currentArticleIndex + 1 : undefined}
                  totalSystemArticles={currentSystem.articles.length}
                />
              )}
            </div>
          )}

          {/* VIEW MODE 3: خريطة الأنظمة الهرمية التفاعلية (Hierarchy Map View) */}
          {mainViewMode === 'map' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <LawHierarchyMap
                onSelectArticle={handleSelectFromMapOrModal}
              />
            </div>
          )}

          {/* تاسعًا: التذييل الهادئ والرصين */}
          <footer className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#34d399]"></span>
              <span className="font-medium text-[var(--text-main)]">منصة قانــــون 01 للأنظمة واللوائح السعودية</span>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span>شروح موثقة ومطابقة للأحكام القضائية السارية</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className="hover:text-[var(--text-main)] font-medium transition flex items-center gap-1.5 bg-transparent border-0 cursor-pointer p-0"
              >
                <AtSign className="w-3.5 h-3.5 text-[#059669] dark:text-[#34d399]" />
                <span>تابعنا</span>
              </button>
              <span aria-hidden="true" className="opacity-30">·</span>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                className="hover:text-[var(--text-main)] font-medium transition flex items-center gap-1.5 bg-transparent border-0 cursor-pointer p-0"
              >
                <Network className="w-3.5 h-3.5 text-[#b38719] dark:text-[#dfb141]" />
                <span>خريطة الأنظمة</span>
              </button>
              <span aria-hidden="true" className="opacity-30">·</span>
              <button
                type="button"
                onClick={() => setIsCalculatorOpen(true)}
                className="hover:text-[var(--text-main)] font-medium transition flex items-center gap-1.5 bg-transparent border-0 cursor-pointer p-0"
              >
                <Calculator className="w-3.5 h-3.5 text-[#059669] dark:text-[#34d399]" />
                <span>حاسبة الحقوق</span>
              </button>
            </div>
          </footer>

        </div>
      </main>

      {/* Hierarchy Map Modal (Opened via Header or Footer) */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-4xl lg:max-w-5xl">
            <LawHierarchyMap
              onSelectArticle={handleSelectFromMapOrModal}
              onClose={() => setIsMapModalOpen(false)}
              isModal={true}
            />
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        systems={SAUDI_LAW_SYSTEMS}
        onSelectArticle={handleSelectFromMapOrModal}
      />

      <LegalCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onNavigateToArticle={handleSelectFromMapOrModal}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        systems={SAUDI_LAW_SYSTEMS}
        onSelectArticle={handleSelectFromMapOrModal}
        onRemoveFavorite={handleRemoveFavorite}
        onClearAll={handleClearAllFavorites}
      />

      <LegalConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

    </div>
  );
}
