import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import catalogData from '../data/catalog.json';

export default function Playlists() {
  const navigate = useNavigate();

  // Playlists state with localStorage persistence
  const [playlists, setPlaylists] = useState(() => {
    try {
      const stored = localStorage.getItem('guitar-lesson-playlists');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load playlists:', e);
      return [];
    }
  });

  // Completed lessons state for progress tracking
  const [completed, setCompleted] = useState(() => {
    try {
      const stored = localStorage.getItem('guitar-progress');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load progress:', e);
      return [];
    }
  });

  // UI state
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [editingPlaylistId, setEditingPlaylistId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Save playlists to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('guitar-lesson-playlists', JSON.stringify(playlists));
    } catch (e) {
      console.error('Failed to save playlists:', e);
    }
  }, [playlists]);

  // Create new playlist
  const createPlaylist = () => {
    const name = prompt('Enter playlist name:');
    if (name && name.trim()) {
      const newPlaylist = {
        id: Date.now().toString(),
        name: name.trim(),
        lessonIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPlaylists([...playlists, newPlaylist]);
    }
  };

  // Delete playlist
  const deletePlaylist = (playlistId) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      setPlaylists(playlists.filter(p => p.id !== playlistId));
      if (selectedPlaylist?.id === playlistId) {
        setSelectedPlaylist(null);
      }
    }
  };

  // Start editing playlist name
  const startEdit = (playlist) => {
    setEditingPlaylistId(playlist.id);
    setEditingName(playlist.name);
  };

  // Save edited name
  const saveEdit = () => {
    if (editingName.trim()) {
      setPlaylists(playlists.map(p =>
        p.id === editingPlaylistId
          ? { ...p, name: editingName.trim(), updatedAt: new Date().toISOString() }
          : p
      ));
    }
    setEditingPlaylistId(null);
    setEditingName('');
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingPlaylistId(null);
    setEditingName('');
  };

  // Remove lesson from playlist
  const removeLessonFromPlaylist = (playlistId, lessonId) => {
    setPlaylists(playlists.map(p =>
      p.id === playlistId
        ? {
            ...p,
            lessonIds: p.lessonIds.filter(id => id !== lessonId),
            updatedAt: new Date().toISOString(),
          }
        : p
    ));
  };

  // Move lesson up in playlist
  const moveLessonUp = (playlistId, index) => {
    if (index === 0) return;
    setPlaylists(playlists.map(p => {
      if (p.id === playlistId) {
        const newLessonIds = [...p.lessonIds];
        [newLessonIds[index - 1], newLessonIds[index]] = [newLessonIds[index], newLessonIds[index - 1]];
        return { ...p, lessonIds: newLessonIds, updatedAt: new Date().toISOString() };
      }
      return p;
    }));
  };

  // Move lesson down in playlist
  const moveLessonDown = (playlistId, index) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist || index === playlist.lessonIds.length - 1) return;
    setPlaylists(playlists.map(p => {
      if (p.id === playlistId) {
        const newLessonIds = [...p.lessonIds];
        [newLessonIds[index], newLessonIds[index + 1]] = [newLessonIds[index + 1], newLessonIds[index]];
        return { ...p, lessonIds: newLessonIds, updatedAt: new Date().toISOString() };
      }
      return p;
    }));
  };

  // Play all lessons in sequence
  const playPlaylist = (playlistId) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist && playlist.lessonIds.length > 0) {
      // Navigate to first lesson
      navigate(`/tabplayer?file=${encodeURIComponent(playlist.lessonIds[0])}`);
    }
  };

  // Get lesson details by filename
  const getLessonDetails = (filename) => {
    return catalogData.files.find(f => f.filename === filename);
  };

  // Calculate progress for playlist
  const getPlaylistProgress = (playlist) => {
    if (playlist.lessonIds.length === 0) return 0;
    const completedCount = playlist.lessonIds.filter(id => completed.includes(id)).length;
    return Math.round((completedCount / playlist.lessonIds.length) * 100);
  };

  // Filter playlists by search
  const filteredPlaylists = useMemo(() => {
    if (!searchQuery.trim()) return playlists;
    const query = searchQuery.toLowerCase();
    return playlists.filter(p => p.name.toLowerCase().includes(query));
  }, [playlists, searchQuery]);

  // Render playlist card
  const renderPlaylistCard = (playlist) => {
    const progress = getPlaylistProgress(playlist);
    const completedCount = playlist.lessonIds.filter(id => completed.includes(id)).length;
    const previewLessons = playlist.lessonIds.slice(0, 3).map(getLessonDetails).filter(Boolean);

    return (
      <div
        key={playlist.id}
        className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg cursor-pointer"
        onClick={() => setSelectedPlaylist(playlist)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            {editingPlaylistId === playlist.id ? (
              <div onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  className="w-full px-2 py-1 bg-gray-700 border border-purple-500 rounded text-lg font-semibold text-gray-100 focus:outline-none"
                  autoFocus
                  maxLength={50}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={saveEdit}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <h3 className="text-lg font-semibold text-gray-100 truncate">{playlist.name}</h3>
            )}
          </div>
          {editingPlaylistId !== playlist.id && (
            <div className="flex gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => startEdit(playlist)}
                className="p-2 text-gray-400 hover:text-blue-400 transition-colors min-w-[36px] min-h-[36px]"
                aria-label="Edit playlist name"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={() => deletePlaylist(playlist.id)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors min-w-[36px] min-h-[36px]"
                aria-label="Delete playlist"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Lesson count and progress */}
        <div className="mb-3">
          <div className="text-sm text-gray-400 mb-2">
            {playlist.lessonIds.length} {playlist.lessonIds.length === 1 ? 'lesson' : 'lessons'}
            {playlist.lessonIds.length > 0 && (
              <span className="ml-2">
                • {completedCount} completed
              </span>
            )}
          </div>
          {playlist.lessonIds.length > 0 && (
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Preview thumbnails */}
        {previewLessons.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {previewLessons.map((lesson, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs truncate max-w-[120px]"
                title={lesson.title}
              >
                {lesson.title}
              </span>
            ))}
            {playlist.lessonIds.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-700 text-gray-400 rounded text-xs">
                +{playlist.lessonIds.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Play button */}
        {playlist.lessonIds.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              playPlaylist(playlist.id);
            }}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors text-sm font-medium flex items-center justify-center gap-2 min-h-[44px]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            Play Playlist
          </button>
        )}
      </div>
    );
  };

  // Render detailed playlist view
  const renderPlaylistDetail = () => {
    if (!selectedPlaylist) return null;

    const lessons = selectedPlaylist.lessonIds.map(getLessonDetails).filter(Boolean);
    const progress = getPlaylistProgress(selectedPlaylist);
    const completedCount = selectedPlaylist.lessonIds.filter(id => completed.includes(id)).length;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-100 mb-2">{selectedPlaylist.name}</h2>
                <div className="text-sm text-gray-400">
                  {selectedPlaylist.lessonIds.length} {selectedPlaylist.lessonIds.length === 1 ? 'lesson' : 'lessons'}
                  {selectedPlaylist.lessonIds.length > 0 && (
                    <span className="ml-2">• {completedCount} completed ({progress}%)</span>
                  )}
                </div>
                {selectedPlaylist.lessonIds.length > 0 && (
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedPlaylist(null)}
                className="text-gray-400 hover:text-gray-200 transition-colors ml-4 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Lessons list */}
          <div className="flex-1 overflow-y-auto p-6">
            {lessons.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-400">This playlist is empty</p>
                <p className="text-gray-500 text-sm mt-1">Add lessons from the Catalog</p>
              </div>
            ) : (
              <div className="space-y-2">
                {lessons.map((lesson, index) => {
                  const isCompleted = completed.includes(lesson.filename);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                      {/* Position number */}
                      <div className="flex-shrink-0 w-8 text-center text-sm text-gray-400 font-medium">
                        {index + 1}
                      </div>

                      {/* Lesson info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-100 truncate">{lesson.title}</div>
                        <div className="text-xs text-gray-400">
                          {lesson.category} • {lesson.difficulty}
                        </div>
                      </div>

                      {/* Completion badge */}
                      {isCompleted && (
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}

                      {/* Reorder buttons */}
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveLessonUp(selectedPlaylist.id, index)}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Move up"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => moveLessonDown(selectedPlaylist.id, index)}
                          disabled={index === lessons.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Move down"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => navigate(`/tabplayer?file=${encodeURIComponent(lesson.filename)}`)}
                          className="p-2 text-gray-400 hover:text-blue-400 transition-colors min-w-[36px] min-h-[36px]"
                          aria-label="Play lesson"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeLessonFromPlaylist(selectedPlaylist.id, lesson.filename)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors min-w-[36px] min-h-[36px]"
                          aria-label="Remove from playlist"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {lessons.length > 0 && (
            <div className="p-6 border-t border-gray-700">
              <button
                onClick={() => playPlaylist(selectedPlaylist.id)}
                className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 min-h-[44px]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Play All ({lessons.length} lessons)
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          My Playlists
        </h1>
        <p className="text-gray-400">
          Organize your guitar lessons into custom playlists
        </p>
      </div>

      {/* Search and Create */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search playlists..."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <button
          onClick={createPlaylist}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 min-h-[44px] whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Playlist
        </button>
      </div>

      {/* Playlists Grid */}
      {filteredPlaylists.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-24 h-24 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            {searchQuery ? 'No playlists found' : 'No playlists yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? 'Try a different search term'
              : 'Create your first playlist to organize your lessons'
            }
          </p>
          {!searchQuery && (
            <button
              onClick={createPlaylist}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium inline-flex items-center gap-2 min-h-[44px]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Playlist
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlaylists.map(renderPlaylistCard)}
        </div>
      )}

      {/* Playlist detail modal */}
      {renderPlaylistDetail()}
    </div>
  );
}
