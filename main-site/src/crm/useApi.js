import { useCallback } from 'react';

export function useApi(token) {
  const request = useCallback(
    async (url, options = {}) => {
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };
      const res = await fetch(url, { ...options, headers });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || 'Request failed');
      }
      if (res.headers.get('content-type')?.includes('text/csv')) {
        return res.text();
      }
      return res.json();
    },
    [token]
  );

  return { request };
}
