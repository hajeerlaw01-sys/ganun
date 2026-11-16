with open("src/App.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# Add currentArticleIndex and navigation handlers
old_part = """  const handleClearAllFavorites = () => {
    setFavorites([]);
  };

  const totalArticles = SAUDI_LAW_SYSTEMS.reduce((acc, sys) => acc + sys.articles.length, 0);"""

new_part = """  const handleClearAllFavorites = () => {
    setFavorites([]);
  };

  // Article navigation within current system
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

  const totalArticles = SAUDI_LAW_SYSTEMS.reduce((acc, sys) => acc + sys.articles.length, 0);"""

if old_part in code:
    code = code.replace(old_part, new_part)
    print("Replaced navigation helpers in App.tsx!")
else:
    print("old_part not found in App.tsx")

old_details = """              {currentArticle && (
                <ArticleDetails
                  article={currentArticle}
                  system={currentSystem}
                  isFavorite={favorites.includes(currentArticle.id)}
                  onToggleFavorite={() => toggleFavorite(currentArticle.id)}
                  fontSize={fontSize}
                />
              )}"""

new_details = """              {currentArticle && (
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
              )}"""

if old_details in code:
    code = code.replace(old_details, new_details)
    print("Replaced ArticleDetails props in App.tsx!")
else:
    print("old_details not found in App.tsx")

with open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write(code)

print("Saved App.tsx successfully.")
