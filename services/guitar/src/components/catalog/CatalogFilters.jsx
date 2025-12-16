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
    <div className="catalog-filters">
      {/* Tier filter */}
      <div className="catalog-filter-group">
        <span className="catalog-filter-label">Tier:</span>
        {['all', 'free', 'premium', 'pro'].map((tier) => (
          <button
            key={tier}
            onClick={() => onTierChange(tier)}
            className={`catalog-filter-btn ${selectedTier === tier ? 'selected' : ''}`}
          >
            {tier.charAt(0).toUpperCase() + tier.slice(1)}
          </button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div className="catalog-filter-group">
        <span className="catalog-filter-label">Difficulty:</span>
        {['all', 'beginner', 'intermediate', 'advanced'].map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => onDifficultyChange(difficulty)}
            className={`catalog-filter-btn ${selectedDifficulty === difficulty ? 'selected' : ''}`}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </button>
        ))}
      </div>

      {/* Favorites filter */}
      <div className="catalog-filter-group">
        <button
          onClick={onFavoritesToggle}
          className={`catalog-filter-btn favorites ${showFavorites ? 'selected' : ''}`}
        >
          Favorites {favoriteCount > 0 && `(${favoriteCount})`}
        </button>
      </div>

      {/* Progress filter */}
      <div className="catalog-filter-group">
        <span className="catalog-filter-label">Progress:</span>
        {['all', 'completed', 'in-progress'].map((filter) => (
          <button
            key={filter}
            onClick={() => onProgressFilterChange(filter)}
            className={`catalog-filter-btn ${progressFilter === filter ? 'selected' : ''}`}
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
