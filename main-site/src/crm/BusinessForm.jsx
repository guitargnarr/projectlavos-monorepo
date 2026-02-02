import { useState, useEffect } from 'react';

const CATEGORIES = [
  'Healthcare/Medical', 'Personal Services', 'Food & Beverage',
  'Retail', 'Entertainment', 'Real Estate', 'Professional Services',
  'Conceptual/Demo', 'Other',
];

const STATUSES = [
  'prospect', 'contacted', 'responded', 'meeting', 'closed', 'lost',
];

const PRIORITIES = ['hot', 'warm', 'cold'];

export default function BusinessForm({ business, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    demo_url: '',
    existing_website: '',
    website_quality: 0,
    priority: 'cold',
    status: 'prospect',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    contact_role: '',
    demo_value_prop: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (business) {
      setForm({
        name: business.name || '',
        category: business.category || '',
        demo_url: business.demo_url || '',
        existing_website: business.existing_website || '',
        website_quality: business.website_quality || 0,
        priority: business.priority || 'cold',
        status: business.status || 'prospect',
        contact_name: business.contact_name || '',
        contact_email: business.contact_email || '',
        contact_phone: business.contact_phone || '',
        contact_role: business.contact_role || '',
        demo_value_prop: business.demo_value_prop || '',
        notes: business.notes || '',
      });
    }
  }, [business]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-white mb-4">
          {business ? 'Edit Business' : 'Add Business'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name */}
          <input
            value={form.name}
            onChange={set('name')}
            placeholder="Business Name *"
            required
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-slate-500"
          />

          {/* Category + Priority + Status row */}
          <div className="grid grid-cols-3 gap-2">
            <select value={form.category} onChange={set('category')} className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white">
              <option value="">Category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={form.priority} onChange={set('priority')} className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white">
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={form.status} onChange={set('status')} className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* URLs */}
          <input value={form.demo_url} onChange={set('demo_url')} placeholder="Demo URL" className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-slate-500" />
          <div className="flex gap-2">
            <input value={form.existing_website} onChange={set('existing_website')} placeholder="Existing Website" className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-slate-500" />
            <select value={form.website_quality} onChange={(e) => setForm((p) => ({ ...p, website_quality: parseInt(e.target.value) }))} className="w-20 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white">
              <option value={0}>N/A</option>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}/5</option>)}
            </select>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-2">
            <input value={form.contact_name} onChange={set('contact_name')} placeholder="Contact Name" className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-slate-500" />
            <input value={form.contact_role} onChange={set('contact_role')} placeholder="Role" className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-slate-500" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input value={form.contact_email} onChange={set('contact_email')} placeholder="Email" className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-slate-500" />
            <input value={form.contact_phone} onChange={set('contact_phone')} placeholder="Phone" className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-slate-500" />
          </div>

          {/* Value prop + notes */}
          <textarea value={form.demo_value_prop} onChange={set('demo_value_prop')} placeholder="Demo Value Proposition" rows={2} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-slate-500 resize-none" />
          <textarea value={form.notes} onChange={set('notes')} placeholder="Notes" rows={2} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-slate-500 resize-none" />

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving || !form.name.trim()} className="flex-1 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 text-white font-semibold rounded transition-colors">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
