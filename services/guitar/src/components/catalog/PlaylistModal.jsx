import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function PlaylistModal({
  lesson,
  isOpen,
  onClose,
  playlists,
  onAddToPlaylist,
  onRemoveFromPlaylist,
  onCreatePlaylist,
}) {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setNewPlaylistName('');
      setShowCreateForm(false);
    }
  }, [isOpen]);

  if (!isOpen || !lesson) return null;

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowCreateForm(false);
    }
  };

  const isLessonInPlaylist = (playlistId) => {
    const playlist = playlists.find(p => p.id === playlistId);
    return playlist?.lessonIds.includes(lesson.filename);
  };

  const handleTogglePlaylist = (playlistId) => {
    if (isLessonInPlaylist(playlistId)) {
      onRemoveFromPlaylist(playlistId, lesson.filename);
    } else {
      onAddToPlaylist(playlistId, lesson.filename);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-100">Add to Playlist</h3>
              <p className="text-sm text-gray-400 mt-1 line-clamp-1">{lesson.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors ml-4 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Playlist List */}
        <div className="flex-1 overflow-y-auto p-6">
          {playlists.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-400 text-sm">No playlists yet</p>
              <p className="text-gray-500 text-xs mt-1">Create one to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {playlists.map((playlist) => {
                const isInPlaylist = isLessonInPlaylist(playlist.id);
                return (
                  <label
                    key={playlist.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isInPlaylist}
                      onChange={() => handleTogglePlaylist(playlist.id)}
                      className="w-5 h-5 rounded border-gray-500 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-800 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-100 truncate">{playlist.name}</div>
                      <div className="text-xs text-gray-400">
                        {playlist.lessonIds.length} {playlist.lessonIds.length === 1 ? 'lesson' : 'lessons'}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Create New Playlist Section */}
        <div className="p-6 border-t border-gray-700">
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 min-h-[44px]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Playlist
            </button>
          ) : (
            <form onSubmit={handleCreatePlaylist} className="space-y-3">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                autoFocus
                maxLength={50}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!newPlaylistName.trim()}
                  className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium min-h-[44px]"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewPlaylistName('');
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium min-h-[44px]"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

PlaylistModal.propTypes = {
  lesson: PropTypes.shape({
    filename: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  playlists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      lessonIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  onAddToPlaylist: PropTypes.func.isRequired,
  onRemoveFromPlaylist: PropTypes.func.isRequired,
  onCreatePlaylist: PropTypes.func.isRequired,
};
