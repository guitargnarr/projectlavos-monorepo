import PropTypes from 'prop-types';

export default function NotesButton({ filename, hasNotes, onOpen, position }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onOpen(filename);
      }}
      className={`absolute ${position} p-2 hover:scale-110 transition-transform min-w-[44px] min-h-[44px] flex items-center justify-center`}
      aria-label={hasNotes ? 'View lesson notes' : 'Add lesson notes'}
    >
      {hasNotes ? (
        // Filled notebook icon
        <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ) : (
        // Outline notebook icon
        <svg className="w-6 h-6 text-gray-400 hover:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )}
    </button>
  );
}

NotesButton.propTypes = {
  filename: PropTypes.string.isRequired,
  hasNotes: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  position: PropTypes.string.isRequired,
};
