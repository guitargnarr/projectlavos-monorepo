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
- NO vercel.json files (Vercel auto-detects Vite)

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

## Guitar Platform (services.projectlavos.com)
- **Goal:** Passive revenue (tabs, lessons, AI tools)
- **Content:** 100 Guitar Pro files (~/Library/Mobile Documents/.../Desktop/GP)
- **Stack:** React + Vite + Tailwind v3 + Supabase auth
- **Existing code:** FretVision (chord viz), guitar_consciousness (tab player)
- **Catalog.jsx:** Central hub - favorites, progress, sharing, navigation all integrate here
- **E2E Tests:** Run on push/PR (15 min), can cancel if not needed to stop email spam

## Common Pitfalls
- **Merge conflicts in worktrees:** Conflict markers can remain after resolution - always grep before commit
- **E2E test emails:** Tests trigger on every push - cancel unnecessary runs via GitHub Actions UI
- **Catalog.jsx changes:** Multiple features use this file - coordinate icon positioning (heart: top-3, share: top-12)

## Parallel Development (Proven 2025-11-16)
- **Success rate:** 4/4 PRs, <3 min execution, 100% deployed
- **Use for:** 2-4 independent features (navigation, favorites, progress, sharing)
- **Playbook:** @~/.claude/reference/parallel-development-playbook.md
- **Key:** Test each PR's build before merging to catch conflict markers

## Documentation References
- Anthropic workflows: @~/.claude/archive/WORKFLOWS.md
