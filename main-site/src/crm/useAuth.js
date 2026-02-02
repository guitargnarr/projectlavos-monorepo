import { useState, useEffect, useCallback } from 'react';
import { endpoints } from './api';

const TOKEN_KEY = 'outreach_jwt';

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }
    fetch(endpoints.verify, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.ok) {
          setIsAuthenticated(true);
        } else {
          logout();
        }
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [token, logout]);

  const login = async (passphrase) => {
    const res = await fetch(endpoints.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passphrase }),
    });
    if (!res.ok) {
      throw new Error('Access denied');
    }
    const data = await res.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setIsAuthenticated(true);
    return data;
  };

  return { token, isAuthenticated, loading, login, logout };
}
