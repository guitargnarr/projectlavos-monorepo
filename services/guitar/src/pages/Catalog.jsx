import { useState, useMemo } from 'react';
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

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const filteredFiles = useMemo(() => {
    return catalogData.files.filter((file) => {
      const matchesSearch = file.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = selectedTier === 'all' || file.tier === selectedTier;
      const matchesDifficulty = selectedDifficulty === 'all' || file.difficulty === selectedDifficulty;
      return matchesSearch && matchesTier && matchesDifficulty;
    });
  }, [searchQuery, selectedTier, selectedDifficulty]);

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

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
          />
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
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
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
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedDifficulty === difficulty
                    ? 'bg-green-500 text-gray-900'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
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
            className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg"
          >
            {/* Title */}
            <h3 className="text-lg font-semibold mb-3 text-gray-100 line-clamp-2">
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

            {/* Preview button */}
            <button
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm font-medium"
              disabled
            >
              Preview (Coming Soon)
            </button>
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
            }}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
