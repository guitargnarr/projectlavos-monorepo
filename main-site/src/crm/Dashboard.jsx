import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useApi } from './useApi';
import { endpoints } from './api';
import AuthModal from './AuthModal';
import StatCard from './StatCard';
import FunnelChart from './FunnelChart';
import DonutChart from './DonutChart';
import ActivityChart from './ActivityChart';
import PipelineTable from './PipelineTable';
import BusinessForm from './BusinessForm';

export default function Dashboard() {
  const { token, isAuthenticated, loading: authLoading, login, logout } = useAuth();
  const { request } = useApi(token);
  const [businesses, setBusinesses] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editBiz, setEditBiz] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [bizList, metricsData] = await Promise.all([
        request(endpoints.businesses),
        request(endpoints.metrics),
      ]);
      // Fetch events for each business (lazy - only first page)
      const bizWithEvents = await Promise.all(
        bizList.map(async (b) => {
          try {
            const detail = await request(endpoints.business(b.id));
            return detail;
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
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  const handleUpdate = async (id, data) => {
    await request(endpoints.business(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    fetchData();
  };

  const handleDelete = async (id) => {
    await request(endpoints.business(id), { method: 'DELETE' });
    fetchData();
  };

  const handleSave = async (data) => {
    if (editBiz) {
      await request(endpoints.business(editBiz.id), {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } else {
      await request(endpoints.businesses, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
    setEditBiz(null);
    setShowAddForm(false);
    fetchData();
  };

  const handleAddEvent = async (bizId, eventData) => {
    await request(endpoints.events(bizId), {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
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

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Not authenticated - show auth modal
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950">
        <AuthModal onLogin={login} onClose={() => window.history.back()} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top bar */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">
            Outreach Command Center
          </h1>
          <p className="text-slate-500 text-sm">Client pipeline management</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium rounded transition-colors"
          >
            + Add Business
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 text-slate-500 hover:text-red-400 text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Businesses"
                value={metrics?.total || 0}
                sub={`${metrics?.by_priority?.hot || 0} hot`}
                color="teal"
              />
              <StatCard
                label="Active Outreach"
                value={metrics?.active_outreach || 0}
                sub="contacted + responded + meeting"
                color="orange"
              />
              <StatCard
                label="Response Rate"
                value={`${metrics?.response_rate || 0}%`}
                sub="of contacted businesses"
                color="blue"
              />
              <StatCard
                label="Meetings Set"
                value={metrics?.meetings_set || 0}
                sub={`${metrics?.total_events || 0} total events`}
                color="green"
              />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <FunnelChart data={metrics?.by_status || {}} />
              <DonutChart
                data={metrics?.by_category || {}}
                title="By Category"
              />
              <DonutChart
                data={metrics?.by_priority || {}}
                title="By Priority"
              />
            </div>

            {/* Activity chart */}
            <ActivityChart data={metrics?.weekly_activity || {}} />

            {/* Pipeline table */}
            <PipelineTable
              businesses={businesses}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onEdit={(biz) => setEditBiz(biz)}
              onAddEvent={handleAddEvent}
              onRefresh={fetchData}
            />
          </>
        )}
      </main>

      {/* Business form modal */}
      {(showAddForm || editBiz) && (
        <BusinessForm
          business={editBiz}
          onSave={handleSave}
          onClose={() => {
            setEditBiz(null);
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
}
