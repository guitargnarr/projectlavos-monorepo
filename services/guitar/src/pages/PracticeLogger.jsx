import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const STORAGE_KEY = 'guitar-practice-sessions';

// Session tags available for categorization
const SESSION_TAGS = [
  'Technique',
  'Song',
  'Theory',
  'Improvisation',
  'Scales',
  'Chords',
  'Reading',
  'Ear Training'
];

/**
 * PracticeLogger - Track practice sessions with analytics
 *
 * Features:
 * - Start/Stop timer for active practice sessions
 * - Manual time entry for past sessions
 * - Session notes and tags
 * - Analytics dashboard with visualizations
 * - Session history with filtering
 * - Export/import data as JSON
 */
export default function PracticeLogger() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [view, setView] = useState('dashboard'); // dashboard, history, new-session
  const [filterTag, setFilterTag] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [editingSession, setEditingSession] = useState(null);

  // Form states for new/manual sessions
  const [sessionNotes, setSessionNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [manualDuration, setManualDuration] = useState(30);
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);

  const timerRef = useRef(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSessions(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse practice sessions:', e);
      }
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  // Timer effect for active session
  useEffect(() => {
    if (activeSession) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - activeSession.startTime);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setElapsedTime(0);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeSession]);

  // Start a practice session
  const startSession = () => {
    setActiveSession({
      startTime: Date.now(),
      notes: '',
      tags: []
    });
    setView('active-session');
  };

  // Stop active session and save it
  const stopSession = () => {
    if (!activeSession) return;

    const newSession = {
      id: Date.now().toString(),
      startTime: activeSession.startTime,
      endTime: Date.now(),
      duration: Math.floor((Date.now() - activeSession.startTime) / 1000 / 60), // minutes
      notes: sessionNotes,
      tags: selectedTags,
      lessonId: null
    };

    setSessions([newSession, ...sessions]);
    setActiveSession(null);
    setSessionNotes('');
    setSelectedTags([]);
    setView('dashboard');
  };

  // Add manual session
  const addManualSession = () => {
    const sessionDate = new Date(manualDate);
    sessionDate.setHours(12, 0, 0, 0);

    const newSession = {
      id: Date.now().toString(),
      startTime: sessionDate.getTime(),
      endTime: sessionDate.getTime() + (manualDuration * 60 * 1000),
      duration: manualDuration,
      notes: sessionNotes,
      tags: selectedTags,
      lessonId: null
    };

    setSessions([newSession, ...sessions]);
    setSessionNotes('');
    setSelectedTags([]);
    setManualDuration(30);
    setView('dashboard');
  };

  // Delete session
  const deleteSession = (id) => {
    if (confirm('Delete this practice session?')) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  // Edit session
  const saveEditedSession = () => {
    if (!editingSession) return;

    setSessions(sessions.map(s =>
      s.id === editingSession.id ? editingSession : s
    ));
    setEditingSession(null);
  };

  // Export sessions as JSON
  const exportSessions = () => {
    const dataStr = JSON.stringify(sessions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `practice-sessions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import sessions from JSON
  const importSessions = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          setSessions([...imported, ...sessions]);
        }
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  // Toggle tag selection
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Format time duration
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Format elapsed time in real-time
  const formatElapsedTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate analytics
  const getAnalytics = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
    const weekSessions = sessions.filter(s => new Date(s.startTime) >= startOfWeek);
    const weekTime = weekSessions.reduce((sum, s) => sum + s.duration, 0);
    const monthSessions = sessions.filter(s => new Date(s.startTime) >= startOfMonth);
    const monthTime = monthSessions.reduce((sum, s) => sum + s.duration, 0);

    const avgSession = sessions.length > 0 ? Math.floor(totalTime / sessions.length) : 0;

    // Calculate streak
    const sortedSessions = [...sessions].sort((a, b) => b.startTime - a.startTime);
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].startTime);
      sessionDate.setHours(0, 0, 0, 0);

      const dayDiff = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));

      if (dayDiff === 0 || dayDiff === 1) {
        if (i === 0 || sessionDate.getTime() !== new Date(sortedSessions[i-1].startTime).setHours(0, 0, 0, 0)) {
          streak++;
          currentDate = sessionDate;
        }
      } else {
        break;
      }
    }

    // Tag distribution
    const tagCounts = {};
    sessions.forEach(s => {
      s.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + s.duration;
      });
    });

    // Day of week distribution
    const dayOfWeekCounts = Array(7).fill(0);
    sessions.forEach(s => {
      const day = new Date(s.startTime).getDay();
      dayOfWeekCounts[day] += s.duration;
    });

    // Calendar heatmap data (last 90 days)
    const heatmapData = {};
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    sessions.forEach(s => {
      const date = new Date(s.startTime);
      if (date >= ninetyDaysAgo) {
        const dateKey = date.toISOString().split('T')[0];
        heatmapData[dateKey] = (heatmapData[dateKey] || 0) + s.duration;
      }
    });

    return {
      totalTime,
      weekTime,
      monthTime,
      avgSession,
      streak,
      tagCounts,
      dayOfWeekCounts,
      heatmapData,
      totalSessions: sessions.length
    };
  };

  // Get filtered sessions
  const getFilteredSessions = () => {
    let filtered = [...sessions];

    if (filterTag !== 'all') {
      filtered = filtered.filter(s => s.tags.includes(filterTag));
    }

    if (filterDateRange !== 'all') {
      const now = new Date();
      let cutoffDate;

      if (filterDateRange === 'week') {
        cutoffDate = new Date(now);
        cutoffDate.setDate(now.getDate() - 7);
      } else if (filterDateRange === 'month') {
        cutoffDate = new Date(now);
        cutoffDate.setMonth(now.getMonth() - 1);
      }

      if (cutoffDate) {
        filtered = filtered.filter(s => new Date(s.startTime) >= cutoffDate);
      }
    }

    return filtered;
  };

  const analytics = getAnalytics();
  const filteredSessions = getFilteredSessions();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
          Practice Logger
        </h1>
        <p className="text-gray-400">Track your practice sessions and analyze your progress</p>
      </div>

      {/* View Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setView('dashboard')}
          className={`px-4 py-2 rounded-lg transition-all ${
            view === 'dashboard'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setView('history')}
          className={`px-4 py-2 rounded-lg transition-all ${
            view === 'history'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          History
        </button>
        <button
          onClick={() => setView('new-session')}
          className={`px-4 py-2 rounded-lg transition-all ${
            view === 'new-session'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Manual Entry
        </button>
        <button
          onClick={startSession}
          disabled={activeSession !== null}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeSession
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          Start Session
        </button>
        <div className="ml-auto flex gap-2">
          <button
            onClick={exportSessions}
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
          >
            Export
          </button>
          <label className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all cursor-pointer">
            Import
            <input
              type="file"
              accept=".json"
              onChange={importSessions}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Dashboard View */}
      {view === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Practice Time"
              value={formatDuration(analytics.totalTime)}
              icon="clock"
              color="orange"
            />
            <StatCard
              label="This Week"
              value={formatDuration(analytics.weekTime)}
              icon="calendar"
              color="blue"
            />
            <StatCard
              label="Current Streak"
              value={`${analytics.streak} days`}
              icon="fire"
              color="red"
            />
            <StatCard
              label="Avg Session"
              value={formatDuration(analytics.avgSession)}
              icon="chart"
              color="green"
            />
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Calendar Heatmap */}
            <CalendarHeatmap data={analytics.heatmapData} />

            {/* Day of Week Chart */}
            <DayOfWeekChart data={analytics.dayOfWeekCounts} />
          </div>

          {/* Tag Distribution */}
          <TagDistribution tagCounts={analytics.tagCounts} totalTime={analytics.totalTime} />
        </div>
      )}

      {/* Active Session View */}
      {view === 'active-session' && activeSession && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-8 border border-orange-500">
            <h2 className="text-2xl font-bold mb-6 text-center">Active Practice Session</h2>

            {/* Timer Display */}
            <div className="text-center mb-8">
              <div className="text-6xl font-mono font-bold text-orange-500 mb-2">
                {formatElapsedTime(elapsedTime)}
              </div>
              <div className="text-gray-400">
                Started at {new Date(activeSession.startTime).toLocaleTimeString()}
              </div>
            </div>

            {/* Session Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Session Notes</label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="What are you practicing today?"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-orange-500"
                rows="4"
              />
            </div>

            {/* Tags */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {SESSION_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Stop Button */}
            <button
              onClick={stopSession}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Stop & Save Session
            </button>
          </div>
        </div>
      )}

      {/* Manual Session Entry View */}
      {view === 'new-session' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Add Past Session</h2>

            <div className="space-y-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Duration: {manualDuration} minutes
                </label>
                <input
                  type="range"
                  min="5"
                  max="240"
                  step="5"
                  value={manualDuration}
                  onChange={(e) => setManualDuration(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5 min</span>
                  <span>240 min (4h)</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Session Notes</label>
                <textarea
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="What did you practice?"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  rows="4"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {SESSION_TAGS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={addManualSession}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Add Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History View */}
      {view === 'history' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 bg-gray-800 p-4 rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Tag</label>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Tags</option>
                {SESSION_TAGS.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Filter by Date</label>
              <select
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Time</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            <div className="ml-auto flex items-end">
              <div className="text-sm text-gray-400">
                {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Session List */}
          <div className="space-y-4">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No practice sessions found. Start tracking your practice!
              </div>
            ) : (
              filteredSessions.map(session => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onDelete={() => deleteSession(session.id)}
                  onEdit={() => setEditingSession({ ...session })}
                  formatDuration={formatDuration}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {editingSession && (
        <EditSessionModal
          session={editingSession}
          onSave={saveEditedSession}
          onCancel={() => setEditingSession(null)}
          onChange={setEditingSession}
          formatDuration={formatDuration}
        />
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, icon, color }) {
  const icons = {
    clock: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    calendar: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    ),
    fire: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    ),
    chart: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    )
  };

  const colors = {
    orange: 'text-orange-500',
    blue: 'text-blue-500',
    red: 'text-red-500',
    green: 'text-green-500'
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-gray-400 text-sm mb-1">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        <svg className={`w-10 h-10 ${colors[color]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icons[icon]}
        </svg>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.oneOf(['clock', 'calendar', 'fire', 'chart']).isRequired,
  color: PropTypes.oneOf(['orange', 'blue', 'red', 'green']).isRequired
};

// Calendar Heatmap Component
function CalendarHeatmap({ data }) {
  const today = new Date();
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(today.getDate() - 89);

  const days = [];
  for (let d = new Date(ninetyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  const maxMinutes = Math.max(...Object.values(data), 1);

  const getColor = (minutes) => {
    if (!minutes) return 'bg-gray-800';
    const intensity = Math.min(minutes / maxMinutes, 1);
    if (intensity > 0.75) return 'bg-orange-600';
    if (intensity > 0.5) return 'bg-orange-500';
    if (intensity > 0.25) return 'bg-orange-400';
    return 'bg-orange-300';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Practice Calendar (Last 90 Days)</h3>
      <div className="grid grid-cols-13 gap-1">
        {days.map((date, i) => {
          const dateKey = date.toISOString().split('T')[0];
          const minutes = data[dateKey] || 0;
          return (
            <div
              key={i}
              className={`w-3 h-3 rounded-sm ${getColor(minutes)}`}
              title={`${dateKey}: ${minutes} minutes`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-gray-800" />
        <div className="w-3 h-3 rounded-sm bg-orange-300" />
        <div className="w-3 h-3 rounded-sm bg-orange-400" />
        <div className="w-3 h-3 rounded-sm bg-orange-500" />
        <div className="w-3 h-3 rounded-sm bg-orange-600" />
        <span>More</span>
      </div>
    </div>
  );
}

CalendarHeatmap.propTypes = {
  data: PropTypes.object.isRequired
};

// Day of Week Chart Component
function DayOfWeekChart({ data }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const maxMinutes = Math.max(...data, 1);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Practice by Day of Week</h3>
      <div className="space-y-3">
        {days.map((day, i) => {
          const minutes = data[i];
          const percentage = (minutes / maxMinutes) * 100;

          return (
            <div key={day} className="flex items-center gap-3">
              <div className="w-12 text-sm text-gray-400">{day}</div>
              <div className="flex-1 bg-gray-900 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-pink-500 h-full flex items-center justify-end px-2 transition-all"
                  style={{ width: `${percentage}%` }}
                >
                  {minutes > 0 && (
                    <span className="text-xs font-semibold text-white">
                      {Math.floor(minutes / 60)}h {minutes % 60}m
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

DayOfWeekChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired
};

// Tag Distribution Component
function TagDistribution({ tagCounts, totalTime }) {
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  if (sortedTags.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Practice by Category</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {sortedTags.map(([tag, minutes]) => {
          const percentage = ((minutes / totalTime) * 100).toFixed(1);
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;

          return (
            <div key={tag} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
              <div>
                <div className="font-medium">{tag}</div>
                <div className="text-sm text-gray-400">
                  {hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}
                </div>
              </div>
              <div className="text-orange-500 font-semibold">{percentage}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

TagDistribution.propTypes = {
  tagCounts: PropTypes.object.isRequired,
  totalTime: PropTypes.number.isRequired
};

// Session Card Component
function SessionCard({ session, onDelete, onEdit, formatDuration }) {
  const sessionDate = new Date(session.startTime);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-lg font-semibold mb-1">
            {sessionDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="text-sm text-gray-400">
            {sessionDate.toLocaleTimeString()} • {formatDuration(session.duration)}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {session.notes && (
        <p className="text-gray-300 mb-3">{session.notes}</p>
      )}

      {session.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {session.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

SessionCard.propTypes = {
  session: PropTypes.shape({
    id: PropTypes.string.isRequired,
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    notes: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    lessonId: PropTypes.string
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  formatDuration: PropTypes.func.isRequired
};

// Edit Session Modal Component
function EditSessionModal({ session, onSave, onCancel, onChange }) {
  const updateField = (field, value) => {
    onChange({ ...session, [field]: value });
  };

  const toggleTag = (tag) => {
    const tags = session.tags.includes(tag)
      ? session.tags.filter(t => t !== tag)
      : [...session.tags, tag];
    updateField('tags', tags);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Edit Session</h2>

        <div className="space-y-6">
          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Duration: {session.duration} minutes
            </label>
            <input
              type="range"
              min="5"
              max="240"
              step="5"
              value={session.duration}
              onChange={(e) => updateField('duration', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Session Notes</label>
            <textarea
              value={session.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:outline-none focus:border-orange-500"
              rows="4"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {SESSION_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    session.tags.includes(tag)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onSave}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Save Changes
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

EditSessionModal.propTypes = {
  session: PropTypes.shape({
    id: PropTypes.string.isRequired,
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    notes: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    lessonId: PropTypes.string
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};
