import PropTypes from 'prop-types';

export default function CatalogFilters({
  selectedTier,
  selectedDifficulty,
  showFavorites,
  progressFilter,
  favoriteCount,
  onTierChange,
  onDifficultyChange,
  onFavoritesToggle,
  onProgressFilterChange,
}) {
  return (
    <div className="flex flex-wrap gap-4">
      {/* Tier filter */}
      <div className="space-x-2">
        <span className="text-sm text-gray-400">Tier:</span>
        {['all', 'free', 'premium', 'pro'].map((tier) => (
          <button
            key={tier}
            onClick={() => onTierChange(tier)}
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
            onClick={() => onDifficultyChange(difficulty)}
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
          onClick={onFavoritesToggle}
          className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] ${
            showFavorites
              ? 'bg-pink-500 text-gray-900'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Favorites {favoriteCount > 0 && `(${favoriteCount})`}
        </button>
      </div>

      {/* Progress filter */}
      <div className="space-x-2">
        <span className="text-sm text-gray-400">Progress:</span>
        {['all', 'completed', 'in-progress'].map((filter) => (
          <button
            key={filter}
            onClick={() => onProgressFilterChange(filter)}
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
  );
}

CatalogFilters.propTypes = {
  selectedTier: PropTypes.string.isRequired,
  selectedDifficulty: PropTypes.string.isRequired,
  showFavorites: PropTypes.bool.isRequired,
  progressFilter: PropTypes.string.isRequired,
  favoriteCount: PropTypes.number.isRequired,
  onTierChange: PropTypes.func.isRequired,
  onDifficultyChange: PropTypes.func.isRequired,
  onFavoritesToggle: PropTypes.func.isRequired,
  onProgressFilterChange: PropTypes.func.isRequired,
};
