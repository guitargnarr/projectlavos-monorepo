const SERVICES = [
  { name: 'outreach-api', url: 'https://outreach-api-miha.onrender.com/health' },
  { name: 'client-cms-api', url: 'https://client-cms-api.onrender.com/health' },
  { name: 'guitar-model-lab', url: 'https://guitar-model-lab.onrender.com/health' },
];

export default async function handler(req, res) {
  const results = await Promise.allSettled(
    SERVICES.map(async (svc) => {
      const start = Date.now();
      const resp = await fetch(svc.url, { signal: AbortSignal.timeout(25000) });
      return { name: svc.name, status: resp.status, ms: Date.now() - start };
    })
  );

  const summary = results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value;
    return { name: SERVICES[i].name, error: r.reason?.message || 'timeout' };
  });

  res.status(200).json({ ok: true, ts: new Date().toISOString(), services: summary });
}
