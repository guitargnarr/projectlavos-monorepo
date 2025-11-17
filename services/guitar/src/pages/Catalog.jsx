import { useState, useMemo, useEffect } from 'react';
import catalogData from '../../data/catalog.json';

const tierColors = {
  free: 'bg-green-500/20 text-green-400 border-green-500',
  premium: 'bg-blue-500/20 text-blue-400 border-blue-500',
  pro: 'bg-purple-500/20 text-purple-400 border-purple-500',
};

const difficultyColors = {
  beginner: 'bg-emerald-500/20 text-emerald-400',
  intermediate: 'bg-yellow-500/20 text-yellow-400',
  advanced: 'bg-red-500/20 text-red-400',
};

// Icon positioning constants to prevent overlap
// Reserve space: top-3, top-12, top-21 for future icons
const ICON_POSITIONS = {
  favorite: 'top-3 right-3',    // Heart icon
  share: 'top-14 right-3',      // Share button (top-14 = 3.5rem = 56px, allowing 44px touch target + 12px spacing)
  // Reserved for future: top-25 right-3 (if needed)
};

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [progressFilter, setProgressFilter] = useState('all'); // 'all' | 'completed' | 'in-progress'
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareLesson, setShareLesson] = useState(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Load favorites from localStorage on mount
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('guitar-favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load favorites:', e);
      return [];
    }
  });

  // Progress tracking state with localStorage persistence
  const [completed, setCompleted] = useState(() => {
    try {
      const stored = localStorage.getItem('guitar-progress');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load progress:', e);
      return [];
    }
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('guitar-favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  }, [favorites]);

  // Persist completed lessons to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('guitar-progress', JSON.stringify(completed));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }, [completed]);

  // Debounce search query (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Toggle favorite function
  const toggleFavorite = (filename) => {
    setFavorites(prev =>
      prev.includes(filename)
        ? prev.filter(f => f !== filename)
        : [...prev, filename]
    );
  };

  // Toggle lesson completion status
  const toggleCompleted = (filename) => {
    setCompleted(prev =>
      prev.includes(filename)
        ? prev.filter(f => f !== filename)
        : [...prev, filename]
    );
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
    const text = `Check out this guitar lesson: ${shareLesson.title} 🎸`;
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
    } catch (err) {
      console.error('Failed to copy:', err);
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

  const filteredFiles = useMemo(() => {
    return catalogData.files.filter((file) => {
      // Enhanced search across multiple fields
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

      // Progress filter logic
      const matchesProgress =
        progressFilter === 'all' ||
        (progressFilter === 'completed' && completed.includes(file.filename)) ||
        (progressFilter === 'in-progress' && !completed.includes(file.filename));

      return matchesSearch && matchesTier && matchesDifficulty && matchesFavorites && matchesProgress;
    });
  }, [debouncedQuery, selectedTier, selectedDifficulty, showFavorites, favorites, progressFilter, completed]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Guitar Pro Catalog
        </h1>
        <p className="text-gray-400">
          Browse {catalogData.total_files} Guitar Pro files - {filteredFiles.length} matching your filters
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300 font-medium">
            Overall Progress: {completed.length}/{catalogData.total_files} lessons completed
          </span>
          <span className="text-sm font-semibold text-green-400">
            {Math.round((completed.length / catalogData.total_files) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-400 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(completed.length / catalogData.total_files) * 100}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by title, tags, difficulty, tier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pr-10 text-base bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-4">
          {/* Tier filter */}
          <div className="space-x-2">
            <span className="text-sm text-gray-400">Tier:</span>
            {['all', 'free', 'premium', 'pro'].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] ${
                  selectedTier === tier
                    ? 'bg-green-500 text-gray-900'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="space-x-2">
            <span className="text-sm text-gray-400">Difficulty:</span>
            {['all', 'beginner', 'intermediate', 'advanced'].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] ${
                  selectedDifficulty === difficulty
                    ? 'bg-green-500 text-gray-900'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>

          {/* Favorites filter */}
          <div className="space-x-2">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] ${
                showFavorites
                  ? 'bg-pink-500 text-gray-900'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Favorites {favorites.length > 0 && `(${favorites.length})`}
            </button>
          </div>

          {/* Progress filter */}
          <div className="space-x-2">
            <span className="text-sm text-gray-400">Progress:</span>
            {['all', 'completed', 'in-progress'].map((filter) => (
              <button
                key={filter}
                onClick={() => setProgressFilter(filter)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] ${
                  progressFilter === filter
                    ? 'bg-green-500 text-gray-900'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {filter === 'in-progress' ? 'In Progress' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* File Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg relative"
          >
            {/* Heart Icon (top-right corner) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(file.filename);
              }}
              className={`absolute ${ICON_POSITIONS.favorite} p-2 hover:scale-110 transition-transform min-w-[44px] min-h-[44px] flex items-center justify-center`}
              aria-label={favorites.includes(file.filename) ? 'Remove from favorites' : 'Add to favorites'}
            >
              {favorites.includes(file.filename) ? (
                // Filled heart
                <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              ) : (
                // Outline heart
                <svg className="w-6 h-6 text-gray-400 hover:text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>

            {/* Share button (below heart icon) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openShareModal(file);
              }}
              className={`absolute ${ICON_POSITIONS.share} p-2.5 hover:scale-110 transition-transform text-gray-400 hover:text-blue-400 min-w-[44px] min-h-[44px] flex items-center justify-center`}
              aria-label="Share lesson"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>

            {/* Title */}
            <h3 className="text-lg font-semibold mb-3 text-gray-100 line-clamp-2 pr-8">
              {file.title}
            </h3>

            {/* Category */}
            <div className="mb-3">
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {file.category}
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Difficulty badge */}
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  difficultyColors[file.difficulty]
                }`}
              >
                {file.difficulty}
              </span>

              {/* Tier badge */}
              <span
                className={`px-2 py-1 rounded text-xs font-medium border ${
                  tierColors[file.tier]
                } flex items-center gap-1`}
              >
                {file.tier !== 'free' && (
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {file.tier}
              </span>
            </div>

            {/* Techniques */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {file.techniques.slice(0, 3).map((technique, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs"
                  >
                    {technique}
                  </span>
                ))}
                {file.techniques.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-700 text-gray-400 rounded text-xs">
                    +{file.techniques.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-auto">
              {/* Completion toggle button */}
              <button
                onClick={() => toggleCompleted(file.filename)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded text-sm font-medium transition-all flex-shrink-0 min-h-[44px] ${
                  completed.includes(file.filename)
                    ? 'bg-green-500/20 text-green-400 border border-green-500 hover:bg-green-500/30'
                    : 'bg-gray-700 text-gray-400 border border-gray-600 hover:border-green-500 hover:text-green-400'
                }`}
                title={completed.includes(file.filename) ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {completed.includes(file.filename) ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="hidden sm:inline">Done</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden sm:inline">Mark Done</span>
                  </>
                )}
              </button>

              {/* Preview button */}
              <button
                className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm font-medium min-h-[44px]"
                disabled
              >
                Preview (Coming Soon)
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No results */}
      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No files match your filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTier('all');
              setSelectedDifficulty('all');
              setShowFavorites(false);
              setProgressFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && shareLesson && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeShareModal}
        >
          <div
            className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Share Lesson</h3>
              <button
                onClick={closeShareModal}
                className="text-gray-400 hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Lesson Title */}
            <p className="text-gray-300 mb-6">{shareLesson.title}</p>

            {/* Share Buttons */}
            <div className="space-y-3">
              {/* Twitter */}
              <button
                onClick={shareOnTwitter}
                className="w-full flex items-center gap-3 px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
                Share on Twitter
              </button>

              {/* Facebook */}
              <button
                onClick={shareOnFacebook}
                className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Share on Facebook
              </button>

              {/* Copy Link */}
              <button
                onClick={copyLink}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors relative"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copiedMessage ? 'Copied! ✓' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
