import PropTypes from 'prop-types';
import FavoriteButton from './FavoriteButton';
import ShareButton from './ShareButton';
import CompletionButton from './CompletionButton';
import NotesButton from './NotesButton';

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

export default function LessonCard({
  file,
  isFavorite,
  isCompleted,
  hasNotes,
  onToggleFavorite,
  onToggleCompleted,
  onShare,
  onPreview,
  onOpenNotes,
  iconPositions,
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg relative">
      {/* Favorite Button */}
      <FavoriteButton
        filename={file.filename}
        isFavorite={isFavorite}
        onToggle={onToggleFavorite}
        position={iconPositions.favorite}
      />

      {/* Share Button */}
      <ShareButton
        lesson={file}
        onShare={onShare}
        position={iconPositions.share}
      />

      {/* Notes Button */}
      <NotesButton
        filename={file.filename}
        hasNotes={hasNotes}
        onOpen={onOpenNotes}
        position={iconPositions.notes}
      />

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
        <CompletionButton
          filename={file.filename}
          isCompleted={isCompleted}
          onToggle={onToggleCompleted}
        />

        {/* Preview button */}
        <button
          onClick={() => onPreview(file.filename)}
          className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-sm font-medium min-h-[44px]"
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
    category: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
    techniques: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  isFavorite: PropTypes.bool.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  hasNotes: PropTypes.bool.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onToggleCompleted: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  onOpenNotes: PropTypes.func.isRequired,
  iconPositions: PropTypes.shape({
    favorite: PropTypes.string.isRequired,
    share: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
  }).isRequired,
};
