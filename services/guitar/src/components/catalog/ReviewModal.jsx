import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MAX_REVIEW_LENGTH = 250;

export default function ReviewModal({
  lesson,
  isOpen,
  onClose,
  onSave,
  initialRating,
  initialReview,
}) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  // Initialize rating and review when modal opens
  useEffect(() => {
    if (isOpen && lesson) {
      setRating(initialRating || 0);
      const text = initialReview || '';
      setReviewText(text);
      setCharacterCount(text.length);
    }
  }, [isOpen, lesson, initialRating, initialReview]);

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_REVIEW_LENGTH) {
      setReviewText(text);
      setCharacterCount(text.length);
    }
  };

  const handleSave = () => {
    if (rating === 0) {
      alert('Please select a star rating before saving.');
      return;
    }
    onSave(lesson.filename, rating, reviewText);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this rating and review?')) {
      onSave(lesson.filename, 0, '');
      onClose();
    }
  };

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  if (!isOpen || !lesson) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 z-10">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold text-gray-100">Rate & Review</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-400 text-sm line-clamp-2">{lesson.title}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Your Rating <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => handleStarClick(starValue)}
                  onMouseEnter={() => setHoveredRating(starValue)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                  aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                >
                  <svg
                    className={`w-10 h-10 ${
                      starValue <= (hoveredRating || rating)
                        ? 'text-yellow-400'
                        : 'text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-gray-400 text-sm">
                  {rating} star{rating > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label htmlFor="review-text" className="block text-sm font-medium text-gray-300 mb-2">
              Written Review (Optional)
            </label>
            <textarea
              id="review-text"
              value={reviewText}
              onChange={handleTextChange}
              placeholder="Share your thoughts about this lesson... What did you learn? What was challenging? Would you recommend it?"
              className="w-full h-32 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
              <span>
                {characterCount}/{MAX_REVIEW_LENGTH} characters
              </span>
              {initialRating && (
                <span className="text-xs">
                  Last updated: {new Date().toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 min-w-[140px] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Save Rating
            </button>
            {initialRating > 0 && (
              <button
                onClick={handleDelete}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Delete Rating
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ReviewModal.propTypes = {
  lesson: PropTypes.shape({
    filename: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialRating: PropTypes.number,
  initialReview: PropTypes.string,
};
