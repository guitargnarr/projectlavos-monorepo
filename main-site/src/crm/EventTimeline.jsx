import { useState } from 'react';

const EVENT_TYPES = [
  { value: 'email_sent', label: 'Email Sent', icon: '@' },
  { value: 'call', label: 'Phone Call', icon: '#' },
  { value: 'meeting', label: 'Meeting', icon: '*' },
  { value: 'follow_up', label: 'Follow Up', icon: '>' },
  { value: 'response', label: 'Response', icon: '<' },
  { value: 'note', label: 'Note', icon: '~' },
];

export default function EventTimeline({ events, onAddEvent }) {
  const [showForm, setShowForm] = useState(false);
  const [eventType, setEventType] = useState('note');
  const [details, setDetails] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAddEvent({ event_type: eventType, details });
    setDetails('');
    setShowForm(false);
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Activity Log
        </span>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-teal-400 hover:text-teal-300 text-xs"
        >
          {showForm ? 'Cancel' : '+ Add Event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-3 space-y-2">
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Details..."
            rows={2}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-slate-500 resize-none"
          />
          <button
            type="submit"
            disabled={!details.trim()}
            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 text-white text-sm rounded transition-colors"
          >
            Log Event
          </button>
        </form>
      )}

      {events.length === 0 ? (
        <p className="text-slate-600 text-xs italic">No events yet</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {events.map((ev) => {
            const typeInfo = EVENT_TYPES.find((t) => t.value === ev.event_type) || {
              label: ev.event_type,
              icon: '?',
            };
            return (
              <div
                key={ev.id}
                className="flex items-start gap-2 text-xs"
              >
                <span className="text-teal-500 font-mono w-4 shrink-0 text-center mt-0.5">
                  {typeInfo.icon}
                </span>
                <div className="min-w-0">
                  <span className="text-slate-300 font-medium">
                    {typeInfo.label}
                  </span>
                  {ev.details && (
                    <p className="text-slate-500 mt-0.5 break-words">
                      {ev.details}
                    </p>
                  )}
                  <p className="text-slate-600 mt-0.5">
                    {new Date(ev.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
