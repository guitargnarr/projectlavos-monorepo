# Guitar Learning Platform

**Music Domain: Learning Path Synthesis**

Structured guitar education that maps the chaos of scattered tabs, random YouTube videos, and unclear progressions into navigable learning paths.

[![Live Demo](https://img.shields.io/badge/Live-Demo-teal)](https://guitar.projectlavos.com)
[![Lessons](https://img.shields.io/badge/Lessons-100%2B-green)](https://guitar.projectlavos.com)

---

## The Problem

**Learning guitar online is chaos.**

- Tabs scattered across UltimateGuitar, Songsterr, random PDFs
- YouTube tutorials with no progression structure
- No way to know if you're playing it right
- "Learn this song!" but no path from beginner to advanced
- Progress tracking? Non-existent.

Learners waste hours searching instead of practicing. They don't know what to learn next.

---

## The Synthesis Approach

I mapped the guitar learning domain:

1. **Cataloged learning resources** - 100+ lessons organized by difficulty and technique
2. **Built validation feedback** - MIDI playback so you hear what it should sound like
3. **Created progression paths** - Clear routes from beginner chords to advanced techniques
4. **Added progress tracking** - Know what you've learned, what's next

**Result:** Structured guitar education with audio validation, not scattered tabs with no feedback.

---

## Features

- **Interactive Tab Player** - alphaTab rendering with MIDI synthesis
- **Lesson Catalog** - 100+ lessons organized by difficulty
- **Progress Tracking** - localStorage-based completion tracking
- **Favorites System** - Save what you're working on
- **Subscription Tiers** - Free/Pro/Premium content levels
- **Mobile Responsive** - Practice anywhere

---

## How It Works

```
Lesson Selection → Tab Display → MIDI Playback → Practice → Mark Complete
        ↓
   Organized by:
   - Difficulty level
   - Technique type
   - Genre
   - Skill progression
```

**The learner (operator) validates their playing against the MIDI reference.** The system provides structure; the guitarist executes.

---

## Tech Stack

- **Frontend:** React, Vite
- **Tab Rendering:** alphaTab
- **Audio:** Web Audio API, MIDI synthesis
- **Auth:** Supabase
- **State:** localStorage + React Context
- **Deployment:** Vercel

---

## The Method

This project demonstrates domain synthesis:

1. **Enter unfamiliar domain** (guitar education online)
2. **Map patterns and structures** (lessons, difficulty levels, techniques, progressions)
3. **Build validation system** (MIDI playback for audio feedback)
4. **Deliver operator-ready artifact** (learners navigate structured paths)

The chaos of "I want to learn guitar online" becomes a structured, progressive system.

---

## Quick Start

```bash
cd services/guitar
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Environment Variables

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## Architecture

```
services/guitar/
├── src/
│   ├── pages/
│   │   ├── Home.jsx        # Landing with feature cards
│   │   ├── Catalog.jsx     # Lesson browser (modular)
│   │   ├── TabPlayer.jsx   # MIDI playback engine
│   │   └── FretVision.jsx  # Interactive fretboard
│   ├── catalog/            # 8 modular catalog components
│   └── context/            # Auth context
├── public/
│   └── tabs/               # Guitar Pro files
└── README.md
```

---

## Why This Exists

I've played guitar for 20+ years. Watched the learning landscape fragment into chaos - tabs here, videos there, no structure anywhere.

This is what guitar education should look like: organized, progressive, with feedback.

---

## Author

**Matthew Scott** - AI-Enabled Strategist & Synthesist

Mapping complex domains into structured, navigable systems.

- [Portfolio](https://resume.projectlavos.com)
- [GitHub](https://github.com/guitargnarr)
- [LinkedIn](https://linkedin.com/in/mscott77)

---

## Related Documentation

- [Monorepo README](../../README.md)
- [Auth Setup](../SETUP-AUTH.md)
- [Implementation Summary](../IMPLEMENTATION-SUMMARY.md)

---

## License

MIT
