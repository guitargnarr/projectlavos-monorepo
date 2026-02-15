# Project Lavos

## Build & Deploy
```bash
# Test locally (from any subdomain)
npm run build && npm run preview

# Deploy single subdomain
cd [main-site|demos|about|services] && vercel --prod --yes

# Deploy all via GitHub
git push origin main  # Path-based CI deploys only changed subdomains
```

## Critical Rules
- **ALWAYS** `git add public/` after generating assets
- **YOU MUST** test builds locally before deploying
- **YOU MUST** check for merge conflict markers before committing: `git diff --cached | grep -E "^(\+.*<<<<<<|^(\+.*======|^(\+.*>>>>>>)"`
- Minimal vercel.json OK for SPA routing (simple rewrites required for React Router BrowserRouter)

## Project Structure
- 4 subdomains: main-site/, demos/, about/, services/
- Each = independent Vercel project with own package.json
- Backend: FastAPI on Render
- **services/** = Guitar platform (@guitargnar, 1,700 followers)

## Code Style
- React + Vite, Tailwind v3 (NOT v4)
- Absolute URLs for cross-subdomain asset references
- API keys in Render env vars (never commit .env)

## Architecture
- **Pattern:** Microservices (frontend subdomains + backend API)
- **Frontend:** Static sites (Vercel) with client-side routing
- **Backend:** FastAPI REST API (Render)
- **Communication:** HTTP/REST for all frontend→backend

## Manual Review Required
Changes requiring human verification before claiming done:
- Deployment configuration changes
- Cross-subdomain navigation logic
- API endpoint modifications
- Environment variable changes

## Guitar Platform (guitar.projectlavos.com)
- **Goal:** Educational demonstration platform (showing what AI-enabled solo dev can build)
- **Secondary:** Passive revenue potential (tabs, lessons, AI tools)
- **Vision:** @services/guitar/CLAUDE.md (detailed philosophy and purpose)
- **Content:** 100 Guitar Pro files (~/Library/Mobile Documents/.../Desktop/GP)
- **Stack:** React + Vite + Tailwind v3 + Supabase auth + PropTypes validation
- **Components:** Modular catalog/* architecture (8 components + FretVision + TabPlayer + Navigation)
- **Catalog.jsx:** Refactored orchestrator (543→263 lines) - delegates to modular components
- **E2E Tests:** 328 guitar-specific tests, path-filtered CI/CD (runs only on guitar/** changes)

## Common Pitfalls
- **Merge conflicts in worktrees:** Conflict markers can remain after resolution - always grep before commit
- **E2E test emails:** Tests trigger on every push - cancel unnecessary runs via GitHub Actions UI
- **Catalog.jsx changes:** Multiple features use this file - coordinate icon positioning (heart: top-3, share: top-12)

## Parallel Development (Proven 2025-11-16)
- **Success rate:** 4/4 PRs, <3 min execution, 100% deployed
- **Use for:** 2-4 independent features (navigation, favorites, progress, sharing)
- **Playbook:** @~/.claude/reference/parallel-development-playbook.md
- **Key:** Test each PR's build before merging to catch conflict markers

## CRM Dashboard (projectlavos.com/dashboard)
- **Access:** Charioteer logo in footer -> passphrase auth
- **Backend:** outreach-api-miha.onrender.com (FastAPI + Neon PostgreSQL)
- **Frontend:** main-site/src/crm/ (lazy-loaded at /dashboard)
- **Data:** 43 Louisville businesses (16 hot, 6 warm, 21 cold)
- **Post-deploy sync:** After deploying a new client demo site AND adding it to projectlavos.com, POST to `/sync` endpoint with new business data
- **Deploy:** `vercel --prod --yes` (CRM uses edge proxy `/api/outreach/` in production -- no env var needed since Feb 2026)

## Documentation References
- Anthropic workflows: @~/.claude/archive/WORKFLOWS.md
