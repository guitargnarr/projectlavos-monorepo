import PropTypes from 'prop-types';

export default function ShareModal({
  lesson,
  isOpen,
  onClose,
  copiedMessage,
  onTwitterShare,
  onFacebookShare,
  onCopyLink,
}) {
  if (!isOpen || !lesson) return null;

  return (
    <div className="catalog-modal-overlay" onClick={onClose}>
      <div className="catalog-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="catalog-modal-header">
          <h3 className="catalog-modal-title">Share Lesson</h3>
          <button onClick={onClose} className="catalog-modal-close">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lesson Title */}
        <p className="catalog-modal-lesson">{lesson.title}</p>

        {/* Share Buttons */}
        <div className="catalog-share-buttons">
          {/* Twitter */}
          <button onClick={onTwitterShare} className="catalog-share-btn twitter">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
            </svg>
            Share on Twitter
          </button>

          {/* Facebook */}
          <button onClick={onFacebookShare} className="catalog-share-btn facebook">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Share on Facebook
          </button>

          {/* Copy Link */}
          <button onClick={onCopyLink} className="catalog-share-btn copy">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copiedMessage ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
}

ShareModal.propTypes = {
  lesson: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  copiedMessage: PropTypes.bool.isRequired,
  onTwitterShare: PropTypes.func.isRequired,
  onFacebookShare: PropTypes.func.isRequired,
  onCopyLink: PropTypes.func.isRequired,
};
