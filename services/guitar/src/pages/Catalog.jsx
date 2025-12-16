import { useState, useMemo, useEffect } from 'react';
import catalogData from '../../data/catalog.json';
import ProgressBar from '../components/catalog/ProgressBar';
import CatalogSearch from '../components/catalog/CatalogSearch';
import CatalogFilters from '../components/catalog/CatalogFilters';
import LessonCard from '../components/catalog/LessonCard';
import ShareModal from '../components/catalog/ShareModal';
import InlinePlayer from '../components/InlinePlayer';

export default function Catalog() {
  // Selected lesson for inline player
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Filter state
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [progressFilter, setProgressFilter] = useState('all');

  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareLesson, setShareLesson] = useState(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Favorites state with localStorage persistence
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('guitar-favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Progress tracking state with localStorage persistence
  const [completed, setCompleted] = useState(() => {
    try {
      const stored = localStorage.getItem('guitar-progress');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('guitar-favorites', JSON.stringify(favorites));
    } catch {
      // Silent fail - localStorage may be blocked
    }
  }, [favorites]);

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('guitar-progress', JSON.stringify(completed));
    } catch {
      // Silent fail - localStorage may be blocked
    }
  }, [completed]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Toggle functions
  const toggleFavorite = (filename) => {
    setFavorites(prev =>
      prev.includes(filename)
        ? prev.filter(f => f !== filename)
        : [...prev, filename]
    );
  };

  const toggleCompleted = (filename) => {
    setCompleted(prev =>
      prev.includes(filename)
        ? prev.filter(f => f !== filename)
        : [...prev, filename]
    );
  };

  // Open inline player instead of navigating
  const handlePreview = (filename) => {
    const lesson = catalogData.files.find(f => f.filename === filename);
    setSelectedLesson(lesson || { filename, title: filename });
  };

  const closePlayer = () => {
    setSelectedLesson(null);
  };

  // Share URL generation with UTM parameters
  const getShareUrl = (lesson, source = 'direct') => {
    const baseUrl = 'https://guitar.projectlavos.com/catalog';
    const lessonParam = `lesson=${encodeURIComponent(lesson.filename)}`;
    const utmParams = source !== 'direct'
      ? `utm_source=${source}&utm_medium=social&utm_campaign=lesson_share`
      : '';

    return utmParams
      ? `${baseUrl}?${lessonParam}&${utmParams}`
      : `${baseUrl}?${lessonParam}`;
  };

  const openShareModal = (lesson) => {
    setShareLesson(lesson);
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setShareModalOpen(false);
    setShareLesson(null);
    setCopiedMessage(false);
  };

  const shareOnTwitter = () => {
    if (!shareLesson) return;
    const text = `Check out this guitar lesson: ${shareLesson.title}`;
    const url = getShareUrl(shareLesson, 'twitter');
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareOnFacebook = () => {
    if (!shareLesson) return;
    const url = getShareUrl(shareLesson, 'facebook');
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  const copyLink = async () => {
    if (!shareLesson) return;
    const url = getShareUrl(shareLesson);

    try {
      await navigator.clipboard.writeText(url);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };

  // Filter lessons
  const filteredFiles = useMemo(() => {
    return catalogData.files.filter((file) => {
      const query = debouncedQuery.toLowerCase();
      const matchesSearch = !query || (
        file.title.toLowerCase().includes(query) ||
        file.difficulty.toLowerCase().includes(query) ||
        file.tier.toLowerCase().includes(query) ||
        file.category.toLowerCase().includes(query) ||
        file.techniques.some(technique => technique.toLowerCase().includes(query))
      );

      const matchesTier = selectedTier === 'all' || file.tier === selectedTier;
      const matchesDifficulty = selectedDifficulty === 'all' || file.difficulty === selectedDifficulty;
      const matchesFavorites = !showFavorites || favorites.includes(file.filename);

      const matchesProgress =
        progressFilter === 'all' ||
        (progressFilter === 'completed' && completed.includes(file.filename)) ||
        (progressFilter === 'in-progress' && !completed.includes(file.filename));

      return matchesSearch && matchesTier && matchesDifficulty && matchesFavorites && matchesProgress;
    });
  }, [debouncedQuery, selectedTier, selectedDifficulty, showFavorites, favorites, progressFilter, completed]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTier('all');
    setSelectedDifficulty('all');
    setShowFavorites(false);
    setProgressFilter('all');
  };

  return (
    <div className="catalog-page">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="catalog-header">
          <h1 className="catalog-title">Guitar Pro Catalog</h1>
          <p className="catalog-subtitle">
            Browse {catalogData.total_files} Guitar Pro files - {filteredFiles.length} matching your filters
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar completed={completed.length} total={catalogData.total_files} />

        {/* Search and Filters */}
        <div className="catalog-controls">
          <CatalogSearch value={searchQuery} onChange={setSearchQuery} />

          <CatalogFilters
            selectedTier={selectedTier}
            selectedDifficulty={selectedDifficulty}
            showFavorites={showFavorites}
            progressFilter={progressFilter}
            favoriteCount={favorites.length}
            onTierChange={setSelectedTier}
            onDifficultyChange={setSelectedDifficulty}
            onFavoritesToggle={() => setShowFavorites(!showFavorites)}
            onProgressFilterChange={setProgressFilter}
          />
        </div>

        {/* Lesson Grid */}
        <div className="catalog-grid">
          {filteredFiles.map((file, index) => (
            <LessonCard
              key={index}
              file={file}
              isFavorite={favorites.includes(file.filename)}
              isCompleted={completed.includes(file.filename)}
              onToggleFavorite={toggleFavorite}
              onToggleCompleted={toggleCompleted}
              onShare={openShareModal}
              onPreview={handlePreview}
            />
          ))}
        </div>

        {/* No results */}
        {filteredFiles.length === 0 && (
          <div className="catalog-empty">
            <p className="catalog-empty-text">No files match your filters</p>
            <button onClick={clearFilters} className="catalog-clear-btn">
              Clear Filters
            </button>
          </div>
        )}

        {/* Share Modal */}
        <ShareModal
          lesson={shareLesson}
          isOpen={shareModalOpen}
          onClose={closeShareModal}
          copiedMessage={copiedMessage}
          onTwitterShare={shareOnTwitter}
          onFacebookShare={shareOnFacebook}
          onCopyLink={copyLink}
        />

        {/* Inline Player Modal */}
        {selectedLesson && (
          <InlinePlayer
            filename={selectedLesson.filename}
            title={selectedLesson.title}
            onClose={closePlayer}
          />
        )}
      </div>
    </div>
  );
}
