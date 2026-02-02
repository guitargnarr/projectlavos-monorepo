import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useApi } from './useApi';
import { endpoints } from './api';
import AuthModal from './AuthModal';
import PipelineTable from './PipelineTable';
import BusinessForm from './BusinessForm';
import EmailComposer from './EmailComposer';

export default function Dashboard() {
  const { token, isAuthenticated, loading: authLoading, login, logout } = useAuth();
  const { request } = useApi(token);
  const [businesses, setBusinesses] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editBiz, setEditBiz] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [emailBiz, setEmailBiz] = useState(null);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [bizList, metricsData] = await Promise.all([
        request(endpoints.businesses),
        request(endpoints.metrics),
      ]);
      const bizWithEvents = await Promise.all(
        bizList.map(async (b) => {
          try {
            return await request(endpoints.business(b.id));
          } catch {
            return { ...b, events: [] };
          }
        })
      );
      setBusinesses(bizWithEvents);
      setMetrics(metricsData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [token, request]);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated, fetchData]);

  const handleUpdate = async (id, data) => {
    await request(endpoints.business(id), { method: 'PUT', body: JSON.stringify(data) });
    fetchData();
  };

  const handleDelete = async (id) => {
    await request(endpoints.business(id), { method: 'DELETE' });
    fetchData();
  };

  const handleSave = async (data) => {
    if (editBiz) {
      await request(endpoints.business(editBiz.id), { method: 'PUT', body: JSON.stringify(data) });
    } else {
      await request(endpoints.businesses, { method: 'POST', body: JSON.stringify(data) });
    }
    setEditBiz(null);
    setShowAddForm(false);
    fetchData();
  };

  const handleAddEvent = async (bizId, eventData) => {
    await request(endpoints.events(bizId), { method: 'POST', body: JSON.stringify(eventData) });
    fetchData();
  };

  const handleExport = async () => {
    const csv = await request(endpoints.exportCsv);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'outreach_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950">
        <AuthModal onLogin={login} onClose={() => window.history.back()} />
      </div>
    );
  }

  const hot = metrics?.by_priority?.hot || 0;
  const warm = metrics?.by_priority?.warm || 0;
  const contacted = (metrics?.by_status?.contacted || 0) + (metrics?.by_status?.responded || 0) + (metrics?.by_status?.meeting || 0);
  const closed = metrics?.by_status?.closed || 0;
  const total = metrics?.total || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800/60 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">Outreach</h1>
            <p className="text-slate-600 text-xs mt-0.5">
              {total} businesses &middot; {hot} hot &middot; {contacted} in pipeline &middot; {closed} closed
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Add
            </button>
            <button
              onClick={handleExport}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-sm rounded-lg transition-colors"
            >
              Export
            </button>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-slate-600 hover:text-red-400 text-sm transition-colors"
            >
              Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-5">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <PipelineTable
            businesses={businesses}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onEdit={(biz) => setEditBiz(biz)}
            onAddEvent={handleAddEvent}
            onRefresh={fetchData}
            onEmail={(biz) => setEmailBiz(biz)}
          />
        )}
      </main>

      {(showAddForm || editBiz) && (
        <BusinessForm
          business={editBiz}
          onSave={handleSave}
          onClose={() => { setEditBiz(null); setShowAddForm(false); }}
        />
      )}

      {emailBiz && (
        <EmailComposer
          biz={emailBiz}
          onClose={() => setEmailBiz(null)}
        />
      )}
    </div>
  );
}
