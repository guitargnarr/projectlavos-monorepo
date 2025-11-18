import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function NotesModal({
  lesson,
  isOpen,
  onClose,
  onSave,
  initialNotes,
  onExport,
  onImport,
}) {
  const [noteText, setNoteText] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  // Initialize note text when modal opens
  useEffect(() => {
    if (isOpen && lesson) {
      const text = initialNotes || '';
      setNoteText(text);
      setCharacterCount(text.length);
    }
  }, [isOpen, lesson, initialNotes]);

  const handleTextChange = (e) => {
    const text = e.target.value;
    setNoteText(text);
    setCharacterCount(text.length);
  };

  const handleSave = () => {
    onSave(lesson.filename, noteText);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onSave(lesson.filename, '');
      onClose();
    }
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          onImport(imported);
          onClose();
        } catch (err) {
          alert('Failed to import notes. Please ensure the file is valid JSON.');
          console.error('Import error:', err);
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen || !lesson) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 z-10">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold text-gray-100">Lesson Notes</h2>
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
        <div className="p-6 space-y-4">
          {/* Textarea */}
          <div>
            <label htmlFor="note-text" className="block text-sm font-medium text-gray-300 mb-2">
              Your Notes
            </label>
            <textarea
              id="note-text"
              value={noteText}
              onChange={handleTextChange}
              placeholder="Add your personal notes, practice tips, or observations about this lesson..."
              className="w-full h-64 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
              <span>{characterCount} characters</span>
              {initialNotes && (
                <span className="text-xs">
                  Last updated: {new Date().toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              className="flex-1 min-w-[140px] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Save Notes
            </button>
            {initialNotes && (
              <button
                onClick={handleDelete}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Delete Notes
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
          </div>

          {/* Export/Import Section */}
          <div className="border-t border-gray-700 pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Export/Import Notes</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onExport}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export All Notes
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import Notes
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Export creates a JSON file with all your lesson notes. Import to restore from a backup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

NotesModal.propTypes = {
  lesson: PropTypes.shape({
    filename: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialNotes: PropTypes.string,
  onExport: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
};
