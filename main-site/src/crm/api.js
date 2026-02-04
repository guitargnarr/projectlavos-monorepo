const API_BASE = import.meta.env.VITE_OUTREACH_API_URL || 'http://localhost:8000';

export const endpoints = {
  login: `${API_BASE}/auth/login`,
  verify: `${API_BASE}/auth/verify`,
  businesses: `${API_BASE}/businesses`,
  business: (id) => `${API_BASE}/businesses/${id}`,
  events: (id) => `${API_BASE}/businesses/${id}/events`,
  metrics: `${API_BASE}/metrics`,
  sync: `${API_BASE}/sync`,
  exportCsv: `${API_BASE}/export/csv`,
  sendEmail: (id) => `${API_BASE}/businesses/${id}/send-email`,
};

export default API_BASE;
