# Guitar Learning Platform

Educational demonstration platform built with React + Vite + Supabase.

**Live:** https://guitar.projectlavos.com

---

## Features

- 🎵 Interactive guitar tab player with MIDI playback (alphaTab)
- 📊 Progress tracking with localStorage
- ❤️ Favorites system
- 🔐 Supabase authentication (Free/Pro/Premium tiers)
- 📱 Mobile responsive design
- 🎨 Dark theme UI

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Configuration

Create `.env` file in this directory:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

See `../SETUP-AUTH.md` for full Supabase configuration guide.

---

## Architecture

### Key Components
- `App.jsx` - Router and auth wrapper
- `Navigation.jsx` - Sticky nav bar (73 lines)
- `pages/Home.jsx` - Landing page with feature cards
- `pages/Catalog.jsx` - Lesson browser (263 lines, refactored)
- `pages/TabPlayer.jsx` - MIDI playback with alphaTab (328 lines)
- `pages/FretVision.jsx` - Interactive fretboard visualization
- `catalog/*` - 8 modular catalog components

### State Management
- `localStorage` for favorites and progress
- Supabase Auth Context for user sessions
- React Router for navigation

---

## Deployment

```bash
# Deploy to Vercel
vercel --prod --yes
```

### Environment Variables
Set in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Build Settings
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

---

## Testing

E2E tests located in `../../tests/specs/guitar-navigation.spec.js`

```bash
# Run from monorepo root
npm test
```

---

## Documentation

- **[CLAUDE.md](CLAUDE.md)** - Project-specific configuration
- **[Parent README](../../README.md)** - Full monorepo documentation
- **[Setup Auth](../SETUP-AUTH.md)** - Authentication configuration
- **[Implementation Summary](../IMPLEMENTATION-SUMMARY.md)** - Detailed architecture

---

## Known Issues

See [GitHub Issues](https://github.com/guitargnarr/projectlavos-monorepo/issues):
- Issue #17: Debug console.log statements
- Issue #18: Bundle size optimization (1.29MB)
- Issue #23: Guitar navigation test timeouts

---

**Last Updated:** 2025-11-21
