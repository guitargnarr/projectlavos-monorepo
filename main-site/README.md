# Project Lavos -- Main Site

Portfolio hub and CRM dashboard at [projectlavos.com](https://projectlavos.com).

## What It Does

Single-page portfolio site with 3D hero animation (React Three Fiber), cross-subdomain navigation to 14 projectlavos.com subdomains, and a hidden CRM dashboard at `/dashboard` (passphrase-authenticated, backed by the outreach-api on Render).

## Tech Stack

- React 19, Vite 7, TypeScript, Tailwind CSS v3
- React Three Fiber + Three.js (3D hero)
- Framer Motion (page transitions)
- p5.js (generative art components)
- React Router v7 (client-side routing)
- Playwright (E2E tests)
- Vercel Analytics + Speed Insights

## Run Locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc && vite build
npm run preview    # preview production build
```

## Deploy

```bash
vercel --prod --yes
```

Auto-deploys via GitHub Actions on push to `main` when `main-site/**` files change.

## Project Structure

```
main-site/
  src/
    components/    # 19 React components (hero, nav, CRM dashboard)
    pages/         # Route pages
  public/          # Static assets (OG images, favicon)
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  tailwind.config.js
```

## CRM Dashboard

- **Access:** Footer Charioteer logo -> passphrase prompt
- **Backend:** outreach-api-miha.onrender.com (FastAPI + PostgreSQL)
- **Edge proxy:** `/api/outreach/` routes to Render in production (no frontend env var needed)
- **Data:** Louisville business outreach tracking (status, events, email)

## Environment Variables

None required for the frontend. CRM uses edge proxy rewrite -- no `VITE_*` vars.

## Part of the Monorepo

This is one of 4 subdomains in `projectlavos-monorepo/`:

| Subdomain | Path | URL |
|-----------|------|-----|
| main-site | `main-site/` | projectlavos.com |
| demos | `demos/` | demos.projectlavos.com |
| about | `about/` | about.projectlavos.com |
| services | `services/` | guitar/mirador/orchestrator.projectlavos.com |

Each subdomain is an independent Vercel project with its own `package.json`.
