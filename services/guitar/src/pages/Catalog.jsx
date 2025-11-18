import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import catalogData from '../../data/catalog.json';
import ProgressBar from '../components/catalog/ProgressBar';
import CatalogSearch from '../components/catalog/CatalogSearch';
import CatalogFilters from '../components/catalog/CatalogFilters';
import LessonCard from '../components/catalog/LessonCard';
import ShareModal from '../components/catalog/ShareModal';
import NotesModal from '../components/catalog/NotesModal';
import ReviewModal from '../components/catalog/ReviewModal';

// Icon positioning constants to prevent overlap
const ICON_POSITIONS = {
  favorite: 'top-3 right-3',
  share: 'top-14 right-3',
  notes: 'bottom-3 left-3',
  rating: 'top-3 left-3',
};

export default function Catalog() {
  const navigate = useNavigate();

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

  // Notes modal state
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [notesLesson, setNotesLesson] = useState(null);

  // Rating modal state
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingLesson, setRatingLesson] = useState(null);

  // Notes state with localStorage persistence
  const [lessonNotes, setLessonNotes] = useState(() => {
    try {
      const stored = localStorage.getItem('guitar-lesson-notes');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error('Failed to load lesson notes:', e);
      return {};
    }
  });

  // Ratings state with localStorage persistence
  const [lessonRatings, setLessonRatings] = useState(() => {
    try {
      const stored = localStorage.getItem('guitar-lesson-ratings');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error('Failed to load lesson ratings:', e);
      return {};
    }
  });

  // Favorites state with localStorage persistence
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

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('guitar-favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  }, [favorites]);

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('guitar-progress', JSON.stringify(completed));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }, [completed]);

  // Save lesson notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('guitar-lesson-notes', JSON.stringify(lessonNotes));
    } catch (e) {
      console.error('Failed to save lesson notes:', e);
    }
  }, [lessonNotes]);

  // Save lesson ratings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('guitar-lesson-ratings', JSON.stringify(lessonRatings));
    } catch (e) {
      console.error('Failed to save lesson ratings:', e);
    }
  }, [lessonRatings]);

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

  // Navigate to TabPlayer with file
  const handlePreview = (filename) => {
    navigate(`/tabplayer?file=${encodeURIComponent(filename)}`);
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

  // Notes handling functions
  const openNotesModal = (filename) => {
    const lesson = catalogData.files.find(f => f.filename === filename);
    if (lesson) {
      setNotesLesson(lesson);
      setNotesModalOpen(true);
    }
  };

  const closeNotesModal = () => {
    setNotesModalOpen(false);
    setNotesLesson(null);
  };

  const saveNote = (filename, noteText) => {
    setLessonNotes(prev => {
      if (!noteText || noteText.trim() === '') {
        // Remove note if empty
        const updated = { ...prev };
        delete updated[filename];
        return updated;
      } else {
        // Save note with timestamp
        return {
          ...prev,
          [filename]: {
            text: noteText,
            timestamp: Date.now(),
            characterCount: noteText.length,
          },
        };
      }
    });
  };

  const exportNotes = () => {
    const dataStr = JSON.stringify(lessonNotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `guitar-lesson-notes-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importNotes = (imported) => {
    if (window.confirm('This will replace all existing notes. Continue?')) {
      setLessonNotes(imported);
    }
  };

  // Rating handling functions
  const openRatingModal = (filename) => {
    const lesson = catalogData.files.find(f => f.filename === filename);
    if (lesson) {
      setRatingLesson(lesson);
      setRatingModalOpen(true);
    }
  };

  const closeRatingModal = () => {
    setRatingModalOpen(false);
    setRatingLesson(null);
  };

  const saveRating = (filename, rating, reviewText) => {
    setLessonRatings(prev => {
      if (rating === 0) {
        // Remove rating if set to 0
        const updated = { ...prev };
        delete updated[filename];
        return updated;
      } else {
        // Save rating with review and timestamp
        return {
          ...prev,
          [filename]: {
            rating,
            review: reviewText.trim(),
            timestamp: new Date().toISOString(),
          },
        };
      }
    });
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
      <ProgressBar completed={completed.length} total={catalogData.total_files} />

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file, index) => (
          <LessonCard
            key={index}
            file={file}
            isFavorite={favorites.includes(file.filename)}
            isCompleted={completed.includes(file.filename)}
            hasNotes={!!lessonNotes[file.filename]}
            rating={lessonRatings[file.filename]?.rating}
            onToggleFavorite={toggleFavorite}
            onToggleCompleted={toggleCompleted}
            onShare={openShareModal}
            onPreview={handlePreview}
            onOpenNotes={openNotesModal}
            onOpenRating={openRatingModal}
            iconPositions={ICON_POSITIONS}
          />
        ))}
      </div>

      {/* No results */}
      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No files match your filters</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
          >
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

      {/* Notes Modal */}
      <NotesModal
        lesson={notesLesson}
        isOpen={notesModalOpen}
        onClose={closeNotesModal}
        onSave={saveNote}
        initialNotes={notesLesson ? lessonNotes[notesLesson.filename]?.text : ''}
        onExport={exportNotes}
        onImport={importNotes}
      />

      {/* Review Modal */}
      <ReviewModal
        lesson={ratingLesson}
        isOpen={ratingModalOpen}
        onClose={closeRatingModal}
        onSave={saveRating}
        initialRating={ratingLesson ? lessonRatings[ratingLesson.filename]?.rating : 0}
        initialReview={ratingLesson ? lessonRatings[ratingLesson.filename]?.review : ''}
      />
    </div>
  );
}
