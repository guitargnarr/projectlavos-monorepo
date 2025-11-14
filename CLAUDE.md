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

## Documentation References
- Parallel dev: @~/.claude/reference/parallel-development-playbook.md
- Anthropic workflows: @~/.claude/archive/WORKFLOWS.md
