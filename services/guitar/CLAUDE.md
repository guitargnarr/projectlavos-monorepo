# Guitar Learning Platform

## Quick Commands
```bash
# Test locally before deploy
npm run build && npm run preview

# Deploy to production (auto via GitHub Actions)
git push origin main  # Triggers on services/guitar/** changes

# Manual deploy (if needed)
vercel --prod --yes
```

## Critical Rules
- **ALWAYS** check for merge conflict markers before commit: `git diff --cached | grep -E "^(\+.*<<<<<<|^(\+.*======|^(\+.*>>>>>>)"`
- **Catalog.jsx is a conflict hotspot** - 6/8 recent PRs modified this file
- **Icon positioning** (avoid overlap):
  - Favorite heart: `top-3 right-3`
  - Share button: `top-12 right-3`
  - Completion: `bottom-3 right-3`
- **NO vercel.json** - Vite auto-detects SPA routing

## Component Architecture
- **App.jsx** - Router and auth wrapper
- **Navigation.jsx** - Sticky nav (73 lines)
- **Home.jsx** - Landing page with feature cards
- **FretVision.jsx** - Interactive fretboard visualization
- **TabPlayer.jsx** - MIDI playback with tab display (328 lines)
- **Catalog.jsx** - Central hub (543 lines) - favorites, progress, sharing, search all integrate here

## localStorage Keys
- `guitar-favorites` - Array of favorited lesson IDs
- `guitar-progress` - Object mapping lesson IDs to completion status

## Deployment
- **Auto-deploy**: Push to main triggers GitHub Actions
- **Path filter**: Only deploys when `services/guitar/**` changes
- **Build time**: ~1-2 minutes
- **Vercel project**: guitar (prj_Kezj3mqqNaN9Kolv7V8mtgAuOl4s)
- **Live URL**: https://guitar.projectlavos.com

## Testing
- **E2E tests**: 328 guitar-specific navigation tests
- **Run manually**: `npx playwright test tests/specs/guitar-navigation.spec.js`
- **CI behavior**: Auto-runs on push (can cancel if testing docs/comments only)
- **Known issue**: E2E runs trigger email notifications - cancel unnecessary runs via GitHub Actions UI

## Parallel Development
- **Sweet spot**: 2-4 independent features simultaneously
- **Avoid**: Multiple PRs modifying Catalog.jsx (high conflict risk)
- **Success rate**: 8/8 PRs merged in last 2 days (4x faster than sequential)
- **Playbook**: @~/.claude/reference/parallel-development-playbook.md (v4.0)
