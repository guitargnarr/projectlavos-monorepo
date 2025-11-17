# TabPlayer Guitar Pro Integration - Session Handoff

**Date:** November 17, 2025
**Reason for Handoff:** Token preservation (quality > efficiency at 181k tokens)
**Next Session:** Fresh context for deep research + implementation work

---

## Current State

### Platform Status (What's Working)
- **Live:** https://guitar.projectlavos.com
- **Components:** 8 modular catalog components + Navigation + FretVision + TabPlayer + Home
- **Features Complete:**
  - ✅ Catalog browser (100 GP files metadata)
  - ✅ Favorites system (localStorage persistence)
  - ✅ Progress tracking (328 E2E tests)
  - ✅ Social sharing (Twitter/Facebook/Copy)
  - ✅ Enhanced search (debounced multi-field)
  - ✅ Mobile responsive (touch-friendly)
  - ✅ Navigation (sticky, route highlighting)
  - ✅ FretVision (interactive fretboard)

### TabPlayer.jsx Current State
- **File:** `/Users/matthewscott/Projects/projectlavos-monorepo/services/guitar/src/pages/TabPlayer.jsx`
- **Lines:** 328
- **Working:**
  - Basic MIDI playback
  - Control buttons (Play, Stop, Loop)
  - Tempo slider
  - Metronome
  - Quick Exercises menu
- **Issues:**
  - Tab display formatting (chromatic/pentatonic exercises show stacked numbers)
  - Using hardcoded exercise strings, not actual GP files
- **Architecture:** Standalone component, no integration with catalog

### Content Ready
- **Location:** `~/Library/Mobile Documents/.../Desktop/GP`
- **Count:** 100 Guitar Pro files
- **Format:** .gp, .gp3, .gp4, .gp5 (various versions)
- **Catalog:** Metadata in `services/guitar/data/catalog.json` (70 files documented)

---

## Next Task: Guitar Pro File Integration

### Objective
Enable TabPlayer to load, render, and play actual Guitar Pro files from the catalog.

### Why This Matters
**From VALUES.md:**
> "I'd rather build one thing that actually works than ten things that look impressive."

TabPlayer currently shows hardcoded exercises. This task makes it **actually functional**:
- Users can preview real GP files from catalog
- Tab rendering matches professional quality
- Audio playback uses actual GP data
- Platform becomes educational tool (not just demo)

**Strategic value:**
- Demonstrates technical capability (file parsing, audio rendering)
- Completes core learning platform functionality
- Enables future monetization (tier-gated access to premium GP files)
- Proof of concept for employers ("I can build complex integrations")

---

## Research Needed (Start Here)

### Library Options to Investigate

**Option 1: alphaTab** (Recommended)
- **URL:** https://www.alphatab.net
- **Features:** Full GP file parsing, tab rendering, audio synthesis
- **License:** Open source (MPL-2.0)
- **React Support:** Has React integration
- **Pros:** Complete solution, well-documented, active development
- **Cons:** Large bundle size (~400KB), learning curve

**Option 2: guitar-pro (npm)**
- **Package:** `guitar-pro` on npm
- **Features:** GP file parsing only (no rendering/audio)
- **Pros:** Lightweight, parse-only if you want custom rendering
- **Cons:** Need separate rendering solution

**Option 3: Custom Parser**
- **Approach:** Parse GP files manually, render with custom components
- **Pros:** Full control, minimal bundle
- **Cons:** 40+ hours development, reinventing wheel

**Recommendation:** Start with alphaTab research - likely best ROI

### Technical Questions to Answer

1. **File Loading:**
   - How to serve GP files from catalog? (Static in public/ vs dynamic loading)
   - File size constraints? (some GP files are 50KB-1MB)
   - Security considerations? (client-side only, safe)

2. **alphaTab Integration:**
   - How to initialize in React component?
   - How to handle file upload vs direct file path?
   - How to connect to existing controls (play/stop/tempo)?

3. **Audio Rendering:**
   - Does alphaTab handle audio synthesis? (Yes, SoundFont-based)
   - Can we use existing MIDI controls? (May need adapter)
   - What about soundfont loading time? (Lazy load, cache)

4. **Tab Rendering:**
   - Does alphaTab render to Canvas or DOM?
   - Can we style tabs with Tailwind? (Depends on render method)
   - Mobile scrolling behavior? (Horizontal scroll likely)

5. **Integration with Catalog:**
   - How to pass selected GP file from Catalog to TabPlayer?
   - URL structure: `/tabplayer?file=filename.gp`? (Good approach)
   - How to fetch file data? (import or fetch from public/)

---

## Architecture Plan (Preliminary)

### Component Approach

**TabPlayer.jsx Refactor:**
```
TabPlayer.jsx (orchestrator, ~150 lines)
├── components/
    ├── GPFileLoader.jsx (file selection/upload)
    ├── AlphaTabRenderer.jsx (wrapper for alphaTab)
    ├── PlaybackControls.jsx (play/stop/tempo/loop)
    └── TabDisplay.jsx (rendered output from alphaTab)
```

**Or simpler:**
```
TabPlayer.jsx (integrated, ~400 lines)
└── Uses alphaTab directly
```

**Decision point:** Modular vs integrated? (Lean toward modular based on Catalog refactor success)

### File Loading Strategy

**Option A: Static Public Files**
```
services/guitar/public/gp-files/
├── chromatic-exercise.gp
├── pentatonic-scale.gp
└── ... (100 files)
```
**Pros:** Simple, fast loading
**Cons:** 100 files = large deployment, ~50MB

**Option B: Dynamic Import**
```javascript
const loadGPFile = async (filename) => {
  const file = await import(`../../gp-files/${filename}`);
  return file;
};
```
**Pros:** Code-splitting, lazy loading
**Cons:** Vite config needed

**Option C: Fetch from Server**
```javascript
const response = await fetch(`/gp-files/${filename}`);
const arrayBuffer = await response.arrayBuffer();
```
**Pros:** Clean separation, cacheable
**Cons:** Same deployment size as Option A

**Recommendation:** Start with Option C (fetch), simplest to test

---

## Implementation Phases

### Phase 1: Basic alphaTab Integration (2-3 hours)
**Goal:** Load ONE GP file and render it

**Tasks:**
1. Research alphaTab React integration
2. Install: `npm install @coderline/alphatab`
3. Create basic AlphaTabRenderer component
4. Load single hardcoded GP file
5. Render tab in TabPlayer
6. Verify tab displays correctly

**Success:** One GP file visible in browser

### Phase 2: Catalog Integration (1-2 hours)
**Goal:** Link catalog preview button to TabPlayer with GP file

**Tasks:**
1. Update Catalog.jsx preview button (enable it)
2. Add click handler: navigate to `/tabplayer?file={filename}`
3. TabPlayer reads URL param
4. Load corresponding GP file
5. Test with 3-5 different files

**Success:** Click preview in catalog → see GP file in TabPlayer

### Phase 3: Playback Controls (1-2 hours)
**Goal:** Connect alphaTab playback to existing controls

**Tasks:**
1. Wire play/stop buttons to alphaTab API
2. Connect tempo slider to playback speed
3. Implement loop functionality
4. Add metronome integration
5. Test playback accuracy

**Success:** Full playback control from UI

### Phase 4: Polish & Mobile (1 hour)
**Goal:** Production-ready experience

**Tasks:**
1. Tab scrolling behavior (horizontal scroll)
2. Mobile responsive tab display
3. Loading states (file fetch, rendering)
4. Error handling (file not found, parse errors)
5. Test with all 100 GP files (spot check 10-15)

**Success:** Reliable, polished playback experience

---

## Reference Materials (Read These First)

### Philosophy & Values
- `~/.claude/context/VALUES.md` - Why we build (substance over flash)
- `~/.claude/context/working-philosophy.md` - How we work (research→plan→build→test)

### Methodology
- `~/.claude/reference/parallel-development-playbook.md` - Proven 4x velocity approach
- `~/.claude/reference/parallel-development-prompts-v4.md` - Latest templates

### Guitar Platform Context
- `services/guitar/CLAUDE.md` - Platform vision, component architecture
- `/Users/matthewscott/Projects/projectlavos-monorepo/CLAUDE.md` - Project root context

### Technical References
- `services/guitar/src/pages/Catalog.jsx` - 263 lines, modular orchestrator (reference for component patterns)
- `services/guitar/src/pages/TabPlayer.jsx` - 328 lines, needs GP integration
- `services/guitar/data/catalog.json` - 70 GP files metadata

---

## Success Criteria

### Minimum Viable (Ship This)
- [ ] Load at least ONE GP file successfully
- [ ] Tab renders accurately (no formatting issues)
- [ ] Play/stop works with GP file audio
- [ ] Catalog preview button links to TabPlayer with file

### Full Success (Ideal)
- [ ] All 100 GP files load correctly
- [ ] Tempo control works
- [ ] Loop functionality works
- [ ] Mobile responsive
- [ ] Error handling for missing/corrupted files
- [ ] Loading states while file parses

### Quality Gates (Non-Negotiable)
- [ ] Build passes: `npm run build`
- [ ] No console errors in production
- [ ] No conflict markers: `grep -r "<<<<<<" src/`
- [ ] Tests pass (or E2E tests updated to include GP playback)

---

## Known Constraints

### Technical
- **Bundle size:** alphaTab adds ~400KB (acceptable for educational platform)
- **SoundFont:** May need to load ~2-5MB soundfont (lazy load, user-initiated)
- **File parsing:** Some GP files may be corrupted or unsupported versions
- **Mobile:** Tab horizontal scrolling required (most tabs >100 chars wide)

### Time
- **Deep work:** 4-6 hours estimated for full integration
- **Research phase:** 1-2 hours (alphaTab docs, React patterns)
- **Testing:** 1 hour (test with multiple GP files, different versions)

### Philosophy
**From VALUES.md:**
> "Research thoroughly before building. Plan architecture. Test everything. Deploy confidently."

**Don't rush this.** GP integration is foundational. Get it right.

---

## Questions for Next Session

### Before Starting Implementation

1. **Library choice confirmed?** (alphaTab vs guitar-pro vs custom)
2. **File loading strategy?** (static public/ vs dynamic import vs fetch)
3. **Component architecture?** (modular extraction vs integrated TabPlayer)
4. **Soundfont source?** (CDN vs local vs lazy load)
5. **Error handling scope?** (Graceful degradation? Fallback to MIDI-only?)

### During Implementation

6. **Tab rendering method?** (alphaTab's default vs custom styling)
7. **Playback engine?** (alphaTab audio vs separate MIDI)
8. **Mobile experience?** (Horizontal scroll vs responsive rendering)
9. **Performance benchmarks?** (Load time, render time, bundle size acceptable?)

---

## Session Outcome Goals

### What Next Session Should Deliver

**Commit 1: Basic GP Integration**
- alphaTab installed and configured
- Load single GP file successfully
- Tab renders accurately
- Basic playback works

**Commit 2: Catalog Integration**
- Preview button enabled
- Routing to TabPlayer with file param
- Multiple files tested

**Commit 3: Polish (Optional)**
- Tempo/loop controls connected
- Mobile responsive
- Error handling
- Loading states

### What Next Session Should Document

**Update HANDOFF.md with:**
- What worked (library choice, integration approach)
- What didn't work (blockers, pivots)
- Architecture decisions made
- Bundle size impact
- Performance metrics
- Next steps (what's left)

---

## Handoff Process

### Ending This Session
1. Create this HANDOFF document
2. Commit to git with clear message
3. Push to GitHub
4. Close session cleanly

### Starting Next Session
```bash
cd ~/Projects/projectlavos-monorepo/services/guitar
claude

# First message:
> Read HANDOFF_TABPLAYER_GP_INTEGRATION.md
> Read CLAUDE.md for platform context
> Read @~/.claude/context/VALUES.md for philosophy
> Begin Guitar Pro integration research phase
```

**Fresh tokens. Clear objective. Full context.**

---

## Key Reminders for Next Session

**From working-philosophy.md:**
- Research thoroughly (1-2 hours on alphaTab before coding)
- Plan architecture (component boundaries, file loading)
- Build with quality (proper patterns, maintainable)
- Test everything (multiple GP files, error cases)
- Deploy confidently (when quality verified)

**From VALUES.md:**
- Substance over flash (tab rendering accuracy > fancy UI)
- No shortcuts (proper GP parsing > hacky workarounds)
- Educational demonstration (show what's possible)
- Long-term thinking (foundation for future features)

**From parallel-development-playbook.md:**
- If this becomes 4 independent features later, we have proven templates
- Current task: Too research-heavy for parallel, do sequential
- After GP integration works: THEN parallelize polish features

---

## Expected Outcome (Next Session)

**Time:** 4-6 hours deep work
**Commits:** 2-3 (basic integration, catalog link, polish)
**Result:** Working GP file playback from catalog
**Bundle:** +400KB from alphaTab (acceptable)
**Quality:** Production-ready, tested, no shortcuts

**Platform transforms from:**
- "Here's a catalog of GP files you can't actually use" (metadata only)

**To:**
- "Here's a working learning platform with real GP playback" (functional)

**This completes the core educational demonstration.**

---

## Files to Commit Before Handoff

- [ ] This handoff document
- [ ] VALUES.md (already committed)
- [ ] Updated CLAUDE.md files (already committed)
- [ ] Component refactor (already committed)

**All context preserved. Ready for fresh session.**

---

**Next Claude instance will have:**
- Clear task (GP integration)
- Full context (platform status, philosophy, methodology)
- Reference materials (templates, playbooks, values)
- Success criteria (what "done" looks like)
- Fresh tokens (optimal quality)

**This is the right approach.**
