import { useState } from 'react';
import EventTimeline from './EventTimeline';

const STATUS_COLORS = {
  prospect: 'bg-slate-600',
  contacted: 'bg-teal-600',
  responded: 'bg-cyan-600',
  meeting: 'bg-orange-600',
  closed: 'bg-green-600',
  lost: 'bg-red-600',
};

const PRIORITY_ORDER = { hot: 0, warm: 1, cold: 2 };

const PRIORITY_BADGE = {
  hot: 'bg-red-500/20 text-red-400 border border-red-500/30',
  warm: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  cold: 'bg-slate-500/20 text-slate-500 border border-slate-600/30',
};

const STATUSES = ['prospect', 'contacted', 'responded', 'meeting', 'closed', 'lost'];

function getLastEventDate(biz) {
  if (!biz.events || biz.events.length === 0) return null;
  const sorted = [...biz.events].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return new Date(sorted[0].created_at);
}

function daysSince(date) {
  if (!date) return null;
  const diff = Date.now() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function daysAgoLabel(days) {
  if (days === null) return 'Never';
  if (days === 0) return 'Today';
  if (days === 1) return '1d ago';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function daysAgoColor(days) {
  if (days === null) return 'text-red-400';
  if (days <= 3) return 'text-green-400';
  if (days <= 7) return 'text-teal-400';
  if (days <= 14) return 'text-yellow-400';
  if (days <= 30) return 'text-orange-400';
  return 'text-red-400';
}

export default function PipelineTable({
  businesses,
  onUpdate,
  onDelete,
  onEdit,
  onAddEvent,
  onRefresh,
  onEmail,
}) {
  const [expandedId, setExpandedId] = useState(null);
  const [sortKey, setSortKey] = useState('priority');
  const [sortAsc, setSortAsc] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [search, setSearch] = useState('');

  const filtered = businesses
    .filter((b) => !filterStatus || b.status === filterStatus)
    .filter((b) => !filterPriority || b.priority === filterPriority)
    .filter(
      (b) =>
        !search ||
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === 'priority') {
        const pa = PRIORITY_ORDER[a.priority] ?? 3;
        const pb = PRIORITY_ORDER[b.priority] ?? 3;
        if (pa !== pb) return sortAsc ? pa - pb : pb - pa;
        // Secondary sort by updated_at desc
        return new Date(b.updated_at) - new Date(a.updated_at);
      }
      if (sortKey === 'last_contact') {
        const da = getLastEventDate(a);
        const db = getLastEventDate(b);
        const ta = da ? da.getTime() : 0;
        const tb = db ? db.getTime() : 0;
        return sortAsc ? tb - ta : ta - tb;
      }
      let va = a[sortKey];
      let vb = b[sortKey];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleStatusChange = async (biz, newStatus) => {
    await onUpdate(biz.id, { status: newStatus });
  };

  const priorityCounts = {
    hot: businesses.filter((b) => b.priority === 'hot').length,
    warm: businesses.filter((b) => b.priority === 'warm').length,
    cold: businesses.filter((b) => b.priority === 'cold').length,
  };

  const SortHeader = ({ label, field, className = '' }) => (
    <th
      className={`px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white select-none ${className}`}
      onClick={() => toggleSort(field)}
    >
      {label} {sortKey === field ? (sortAsc ? '^' : 'v') : ''}
    </th>
  );

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-700">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search businesses..."
          className="flex-1 min-w-[180px] px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-slate-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <span className="text-slate-500 text-sm">{filtered.length} results</span>
      </div>

      {/* Priority quick-filter pills */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-700/50">
        <button
          onClick={() => setFilterPriority('')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filterPriority === ''
              ? 'bg-slate-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All ({businesses.length})
        </button>
        <button
          onClick={() => setFilterPriority(filterPriority === 'hot' ? '' : 'hot')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filterPriority === 'hot'
              ? 'bg-red-500/30 text-red-300 border border-red-500/40'
              : 'bg-slate-800 text-red-400 hover:bg-red-500/20'
          }`}
        >
          Hot ({priorityCounts.hot})
        </button>
        <button
          onClick={() => setFilterPriority(filterPriority === 'warm' ? '' : 'warm')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filterPriority === 'warm'
              ? 'bg-orange-500/30 text-orange-300 border border-orange-500/40'
              : 'bg-slate-800 text-orange-400 hover:bg-orange-500/20'
          }`}
        >
          Warm ({priorityCounts.warm})
        </button>
        <button
          onClick={() => setFilterPriority(filterPriority === 'cold' ? '' : 'cold')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filterPriority === 'cold'
              ? 'bg-slate-500/30 text-slate-300 border border-slate-500/40'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-500/20'
          }`}
        >
          Cold ({priorityCounts.cold})
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <SortHeader label="Business" field="name" />
              <SortHeader label="Category" field="category" className="hidden md:table-cell" />
              <SortHeader label="Priority" field="priority" />
              <SortHeader label="Status" field="status" />
              <SortHeader label="Activity" field="last_contact" className="hidden lg:table-cell" />
              <th className="px-3 py-2 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((biz) => (
              <TableRow
                key={biz.id}
                biz={biz}
                expanded={expandedId === biz.id}
                onToggle={() => setExpandedId(expandedId === biz.id ? null : biz.id)}
                onStatusChange={handleStatusChange}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddEvent={onAddEvent}
                onRefresh={onRefresh}
                onEmail={onEmail}
              />
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <p className="text-slate-500 text-sm text-center py-8">
          No businesses found
        </p>
      )}
    </div>
  );
}

function TableRow({ biz, expanded, onToggle, onStatusChange, onEdit, onDelete, onAddEvent, onRefresh, onEmail }) {
  const [detail, setDetail] = useState(null);

  const lastEvent = getLastEventDate(biz);
  const days = daysSince(lastEvent);

  const handleExpand = async () => {
    onToggle();
    if (!expanded && !detail) {
      setDetail(biz);
    }
  };

  return (
    <>
      <tr
        className="border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors"
        onClick={handleExpand}
      >
        <td className="px-3 py-3">
          <div className="text-white text-sm font-medium">{biz.name}</div>
          {biz.demo_url && (
            <a
              href={biz.demo_url.startsWith('http') ? biz.demo_url : `https://${biz.demo_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 text-xs hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              demo
            </a>
          )}
        </td>
        <td className="px-3 py-3 text-slate-400 text-sm hidden md:table-cell">
          {biz.category}
        </td>
        <td className="px-3 py-3">
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${PRIORITY_BADGE[biz.priority] || 'bg-slate-700 text-slate-400'}`}>
            {biz.priority}
          </span>
        </td>
        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
          <select
            value={biz.status}
            onChange={(e) => onStatusChange(biz, e.target.value)}
            className={`px-2 py-1 rounded text-xs text-white border-0 cursor-pointer ${STATUS_COLORS[biz.status] || 'bg-slate-600'}`}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </td>
        <td className="px-3 py-3 hidden lg:table-cell">
          <span className={`text-xs font-medium ${daysAgoColor(days)}`}>
            {daysAgoLabel(days)}
          </span>
        </td>
        <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onEmail(biz)}
            className="text-slate-400 hover:text-cyan-400 text-xs mr-2"
          >
            Mail
          </button>
          <button
            onClick={() => onEdit(biz)}
            className="text-slate-400 hover:text-teal-400 text-xs mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete ${biz.name}?`)) onDelete(biz.id);
            }}
            className="text-slate-400 hover:text-red-400 text-xs"
          >
            Del
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={6} className="px-4 py-3 bg-slate-850">
            <ExpandedRow biz={biz} onAddEvent={onAddEvent} onRefresh={onRefresh} />
          </td>
        </tr>
      )}
    </>
  );
}

function ExpandedRow({ biz, onAddEvent, onRefresh }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Details */}
      <div className="space-y-2 text-xs">
        {biz.contact_name && (
          <div>
            <span className="text-slate-500">Contact:</span>{' '}
            <span className="text-white">{biz.contact_name}</span>
            {biz.contact_role && <span className="text-slate-500"> ({biz.contact_role})</span>}
          </div>
        )}
        {biz.contact_email && (
          <div>
            <span className="text-slate-500">Email:</span>{' '}
            <a href={`mailto:${biz.contact_email}`} className="text-teal-400 hover:underline">
              {biz.contact_email}
            </a>
          </div>
        )}
        {biz.contact_phone && (
          <div>
            <span className="text-slate-500">Phone:</span>{' '}
            <span className="text-white">{biz.contact_phone}</span>
          </div>
        )}
        {biz.contact_linkedin && (
          <div>
            <span className="text-slate-500">LinkedIn:</span>{' '}
            <a href={biz.contact_linkedin.startsWith('http') ? biz.contact_linkedin : `https://${biz.contact_linkedin}`}
              target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">
              {biz.contact_linkedin}
            </a>
          </div>
        )}
        {biz.address && (
          <div>
            <span className="text-slate-500">Address:</span>{' '}
            <span className="text-white">{biz.address}</span>
          </div>
        )}
        {biz.existing_website && (
          <div>
            <span className="text-slate-500">Current site:</span>{' '}
            <a
              href={biz.existing_website.startsWith('http') ? biz.existing_website : `https://${biz.existing_website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:underline"
            >
              {biz.existing_website}
            </a>
            {biz.website_quality > 0 && (
              <span className="text-slate-500 ml-1">({biz.website_quality}/5)</span>
            )}
          </div>
        )}
        {biz.platform && (
          <div>
            <span className="text-slate-500">Platform:</span>{' '}
            <span className="text-white">{biz.platform}</span>
          </div>
        )}
        {biz.demo_value_prop && (
          <div>
            <span className="text-slate-500">Value prop:</span>{' '}
            <span className="text-slate-300">{biz.demo_value_prop}</span>
          </div>
        )}
        {biz.notes && (
          <div>
            <span className="text-slate-500">Notes:</span>{' '}
            <span className="text-slate-300">{biz.notes}</span>
          </div>
        )}
      </div>

      {/* Event timeline */}
      <EventTimeline
        events={biz.events || []}
        onAddEvent={async (eventData) => {
          await onAddEvent(biz.id, eventData);
          if (onRefresh) onRefresh();
        }}
      />
    </div>
  );
}
