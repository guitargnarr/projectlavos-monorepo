import PropTypes from 'prop-types';

export default function PlaylistButton({ lesson, onOpen, position }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onOpen(lesson);
      }}
      className={`absolute ${position} p-2.5 hover:scale-110 transition-transform text-gray-400 hover:text-purple-400 min-w-[44px] min-h-[44px] flex items-center justify-center`}
      aria-label="Add to playlist"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    </button>
  );
}

PlaylistButton.propTypes = {
  lesson: PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
  position: PropTypes.string.isRequired,
};
