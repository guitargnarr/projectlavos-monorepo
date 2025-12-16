import PropTypes from 'prop-types';
import FavoriteButton from './FavoriteButton';
import ShareButton from './ShareButton';
import CompletionButton from './CompletionButton';

export default function LessonCard({
  file,
  isFavorite,
  isCompleted,
  onToggleFavorite,
  onToggleCompleted,
  onShare,
  onPreview,
}) {
  return (
    <div className="catalog-card">
      {/* Favorite Button */}
      <FavoriteButton
        filename={file.filename}
        isFavorite={isFavorite}
        onToggle={onToggleFavorite}
      />

      {/* Share Button */}
      <ShareButton
        lesson={file}
        onShare={onShare}
      />

      {/* Title */}
      <h3 className="catalog-card-title">
        {file.title}
      </h3>

      {/* Description */}
      {file.description && (
        <p className="catalog-card-description">
          {file.description}
        </p>
      )}

      {/* Category */}
      <div className="catalog-card-category">
        {file.category}
      </div>

      {/* Badges */}
      <div className="catalog-card-badges">
        {/* Difficulty badge */}
        <span className={`catalog-badge ${file.difficulty}`}>
          {file.difficulty}
        </span>

        {/* Tier badge */}
        <span className={`catalog-badge tier ${file.tier}`}>
          {file.tier !== 'free' && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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
      <div className="catalog-card-techniques">
        {file.techniques.slice(0, 3).map((technique, i) => (
          <span key={i} className="catalog-technique">
            {technique}
          </span>
        ))}
        {file.techniques.length > 3 && (
          <span className="catalog-technique">
            +{file.techniques.length - 3}
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="catalog-card-actions">
        {/* Completion toggle button */}
        <CompletionButton
          filename={file.filename}
          isCompleted={isCompleted}
          onToggle={onToggleCompleted}
        />

        {/* Preview button */}
        <button
          onClick={() => onPreview(file.filename)}
          className="catalog-preview-btn"
        >
          Preview Tab
        </button>
      </div>
    </div>
  );
}

LessonCard.propTypes = {
  file: PropTypes.shape({
    filename: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
    techniques: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  isFavorite: PropTypes.bool.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onToggleCompleted: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
};
