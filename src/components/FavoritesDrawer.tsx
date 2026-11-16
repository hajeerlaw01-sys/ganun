import React from 'react';
import { LawSystem, LawArticle } from '../data/lawsData';
import { Bookmark, X, Trash2 } from 'lucide-react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  systems: LawSystem[];
  onSelectArticle: (systemId: string, articleId: string) => void;
  onRemoveFavorite: (articleId: string) => void;
  onClearAll: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  systems,
  onSelectArticle,
  onRemoveFavorite,
  onClearAll
}) => {
  if (!isOpen) return null;

  const favoriteArticles: { system: LawSystem; article: LawArticle }[] = [];
  favorites.forEach(favId => {
    systems.forEach(system => {
      const art = system.articles.find(a => a.id === favId);
      if (art) {
        favoriteArticles.push({ system, article: art });
      }
    });
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--container-bg)] rounded-[24px] w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-[var(--border-subtle)] text-[var(--text-main)]">
        
        {/* Header - Distinct ruby bookmark, no background container */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--card-bg)]">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#991b1b] dark:text-[#f43f5e] fill-current" />
            <h3 className="font-bold text-xs sm:text-sm">المواد المحفوظة</h3>
            <span className="text-[11px] bg-[#991b1b] text-white px-2 py-0.5 rounded-full font-bold">
              {favoriteArticles.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[#ef4444] transition bg-transparent border-0 cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5 text-[#ef4444]" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {favoriteArticles.length === 0 ? (
            <div className="text-center py-10 text-[var(--text-secondary)]">
              <Bookmark className="w-10 h-10 text-[var(--border-subtle)] mx-auto mb-2" />
              <p className="text-sm font-semibold text-[var(--text-main)] mb-1">لا توجد مواد محفوظة</p>
              <p className="text-xs">اضغط على زر الإشارة المرجعية عند استعراض أي مادة لحفظها</p>
            </div>
          ) : (
            favoriteArticles.map(({ system, article }) => (
              <div
                key={article.id}
                className="bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] p-3 rounded-xl transition flex items-center justify-between gap-2 border border-[var(--border-subtle)]"
              >
                <div
                  onClick={() => {
                    onSelectArticle(system.id, article.id);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-[#006c35] dark:text-[#10b981] font-bold mb-0.5">
                    <span>{system.shortName}</span>
                    <span>•</span>
                    <span className="text-[#6d1a24] dark:text-[#dfb141]">{article.articleNumber}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[var(--text-main)] line-clamp-1">
                    {article.title}
                  </h4>
                </div>
                <button
                  onClick={() => onRemoveFavorite(article.id)}
                  className="p-1.5 hover:opacity-80 transition bg-transparent border-0 cursor-pointer"
                  title="إزالة"
                >
                  <Trash2 className="w-4 h-4 text-[#e11d48]" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {favoriteArticles.length > 0 && (
          <div className="p-3 bg-[var(--card-bg)] border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
            <button
              onClick={onClearAll}
              className="text-[#e11d48] hover:underline font-semibold"
            >
              مسح الكل
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-[var(--container-bg)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-semibold hover:bg-[var(--card-bg)]"
            >
              إغلاق
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
