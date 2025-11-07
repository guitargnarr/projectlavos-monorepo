# projectlavos Monorepo - Remaining Work
## Days 4-7: Three.js Phase 1 + Automation + Polish

**Status as of November 6, 2025 @ 11:30 PM:**
- ✅ Days 1-3 COMPLETE (3 hours, 77% ahead of schedule)
- ⏳ Days 4-7 PENDING (15-17 hours estimated)

**GitHub:** guitargnarr/projectlavos-monorepo
**Live Sites:** projectlavos.com, demos.projectlavos.com, about.projectlavos.com, services.projectlavos.com

---

## ✅ COMPLETED (Days 1-3)

### Infrastructure Foundation
- [x] Created monorepo structure (main-site, demos, about, services)
- [x] Installed Three.js + React Three Fiber + Drei (108 packages)
- [x] Created TestCube.jsx to verify Three.js works
- [x] All 4 projects build successfully (~580ms each)
- [x] Deployed all 4 sites to Vercel
- [x] Configured custom domains + DNS (76.76.21.21)
- [x] Pushed to GitHub (4 clean commits)
- [x] Updated CLAUDE.md documentation

**Time Invested:** 3 hours (planned: 13 hours)
**Git Commits:** 7d4476b, 38ed9f2, 19ddfc6, aebc568

---

## ⏳ DAY 4: Particle Background (4-5 hours)

**Goal:** Add subtle floating particles to Hero section background

### Tasks
- [ ] Create `src/components/three/ParticleBackground.jsx`
  - 200-300 particles
  - Subtle rotation/movement (0.05 speed)
  - Colors: lavos-blue (#3b82f6), lavos-orange (#f97316), lavos-green (#10b981)
- [ ] Configure Canvas settings
  - Camera position: [0, 0, 5]
  - Background: transparent
  - Alpha: true (for layering)
- [ ] Add device detection
  - Reduce particle count on mobile (100 particles)
  - Or disable entirely if performance < 30fps
- [ ] Integrate into Hero component (main-site/src/App.jsx)
  - Position absolutely behind hero content
  - z-index: -10
  - Verify text readability
- [ ] Test performance
  - Desktop: 60fps target (acceptable: 30fps)
  - Mobile: Test on iPhone/Android
- [ ] Deploy main-site to Vercel
  - Verify particles render on production
  - Check bundle size increase (acceptable: +50-100 KB)

**Files to Edit:**
- `main-site/src/components/three/ParticleBackground.jsx` (NEW)
- `main-site/src/App.jsx` (import and add to Hero)

**Reference:**
- Three.js Docs: https://threejs.org/docs/#api/en/objects/Points
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber/

**Success Criteria:**
- ✅ Particles visible in Hero background
- ✅ Text remains readable
- ✅ Performance: 30+ fps on desktop
- ✅ Mobile: acceptable fallback (reduced or disabled)

**Estimated Time:** 4-5 hours

---

## ⏳ DAY 5: 3D Stat Card Icons (4 hours)

**Goal:** Replace emoji stat card icons with 3D rotating models

### Tasks
- [ ] Find 3D icons for: ⚡ (lightning), 🚀 (rocket), 💼 (briefcase), 📍 (pin)
  - Option A: Download from iconshock.com (free tier)
  - Option B: Use @react-three/drei primitives (Box, Sphere, etc.)
  - Format: GLTF/GLB (small file size)
- [ ] Create `src/components/three/Icon3D.jsx`
  - Load GLTF model with useGLTF
  - Subtle rotation on mount (useFrame)
  - Hover effect: tilt 15 degrees
- [ ] Update StatCard component
  - Replace emoji with Icon3D in Canvas
  - Canvas size: 80x80px
  - Keep emoji as fallback (mobile or low-end devices)
- [ ] Add hover animations
  - Rotation speed increase on hover
  - Optional: slight scale up (1.0 → 1.1)
- [ ] Test across devices
  - Desktop: smooth rotation
  - Mobile: emoji fallback if needed
- [ ] Deploy main-site to Vercel

**Files to Edit:**
- `main-site/src/components/three/Icon3D.jsx` (NEW)
- `main-site/src/App.jsx` (update StatCard component)
- `main-site/public/models/` (NEW folder for GLB files)

**Success Criteria:**
- ✅ 4 stat cards have 3D rotating icons
- ✅ Smooth animation (no jank)
- ✅ Hover effects work
- ✅ Mobile fallback functional

**Estimated Time:** 4 hours

---

## ⏳ DAY 6: GitHub Actions Automation (3 hours)

**Goal:** Auto-deploy only changed subdomains when pushing to GitHub

### Tasks
- [ ] Create `.github/workflows/deploy-all.yml`
  - Use dorny/paths-filter to detect changes
  - Separate jobs for main-site, demos, about, services
  - Only run job if that path changed
- [ ] Get Vercel credentials
  - VERCEL_TOKEN: `vercel whoami` to get token
  - VERCEL_ORG_ID: from `vercel.json` or dashboard
  - VERCEL_PROJECT_ID_MAIN: from main-site/.vercel/project.json
  - VERCEL_PROJECT_ID_DEMOS: from demos/.vercel/project.json
  - VERCEL_PROJECT_ID_ABOUT: from about/.vercel/project.json
  - VERCEL_PROJECT_ID_SERVICES: from services/.vercel/project.json
- [ ] Add secrets to GitHub
  - Go to repo → Settings → Secrets → Actions
  - Add all 6 secrets (TOKEN, ORG_ID, 4 PROJECT_IDs)
- [ ] Test workflow
  - Make small change to main-site (e.g., footer text)
  - Commit and push
  - Verify: Only main-site deploys (not demos, about, services)
  - Repeat for other subdomains
- [ ] Document workflow in README

**Files to Create:**
- `.github/workflows/deploy-all.yml` (NEW)

**Success Criteria:**
- ✅ Changing main-site/ only deploys main-site
- ✅ Changing demos/ only deploys demos
- ✅ Workflow completes in <30 seconds
- ✅ All deployments successful

**Estimated Time:** 3 hours

---

## ⏳ DAY 7: Content Differentiation + Testing (4 hours)

**Goal:** Make each subdomain focused and test everything

### Content Differentiation (2 hours)

**demos/ subdomain:**
- [ ] Create focused DemoHub.jsx component
  - Remove: Hero, StatsSection, SocialProof, ServicesAndPricing, About, ContactForm
  - Keep: SentimentDemo, LeadScoringDemo, PhishingDemo
  - Add: Simple header with nav links to other subdomains
  - Add: CTA footer "Book free assessment"

**about/ subdomain:**
- [ ] Create focused AboutPage.jsx component
  - Expand About section with full bio
  - Add tech stack visualization
  - Add GitHub contributions graph/stats
  - Add timeline of projects
  - Simple header/footer with nav

**services/ subdomain:**
- [ ] Create focused ServicesPage.jsx component
  - Expand ServicesAndPricing section
  - Add FAQ section
  - Add ROI calculator (simple)
  - Add detailed service descriptions
  - Simple header/footer with nav

### Testing (2 hours)

**Cross-browser testing:**
- [ ] Safari (desktop) - Mac
- [ ] Chrome (desktop) - Mac
- [ ] Firefox (desktop) - Mac
- [ ] Verify: Layouts, Three.js, navigation, forms

**Mobile testing:**
- [ ] iOS Safari - iPhone
- [ ] Android Chrome - Android device
- [ ] Verify: Touch targets, responsive design, Three.js fallbacks

**Performance testing:**
- [ ] Lighthouse scores (all 4 sites)
  - Target: Performance > 90
  - Verify: Bundle sizes reasonable
- [ ] Check Three.js performance
  - Desktop: 60fps (acceptable: 30fps)
  - Mobile: Verify fallbacks work

**Final deployment:**
- [ ] Deploy all 4 sites to production
- [ ] Verify all custom domains resolve
- [ ] Test navigation between sites
- [ ] Verify all CTAs (Calendly links, email, etc.)

**Files to Edit:**
- `demos/src/App.jsx` (simplify to demo-focused)
- `about/src/App.jsx` (simplify to about-focused)
- `services/src/App.jsx` (simplify to services-focused)

**Success Criteria:**
- ✅ Each subdomain has focused content
- ✅ All sites work in Safari, Chrome, Firefox
- ✅ Mobile responsive and functional
- ✅ Performance scores acceptable
- ✅ All CTAs functional

**Estimated Time:** 4 hours

---

## 📊 Summary

| Day | Task | Status | Time Estimate |
|-----|------|--------|---------------|
| 1-3 | Infrastructure + Deployment | ✅ DONE | 3 hours (actual) |
| 4 | Particle Background | ⏳ PENDING | 4-5 hours |
| 5 | 3D Stat Cards | ⏳ PENDING | 4 hours |
| 6 | GitHub Actions | ⏳ PENDING | 3 hours |
| 7 | Content + Testing | ⏳ PENDING | 4 hours |
| **Total** | **Full 7-day plan** | **35%** | **18-20 hours** |

**Current Status:** 9/32 tasks complete (28%)
**Time Invested:** 3 hours
**Time Remaining:** 15-17 hours

---

## 🎯 Quick Start for Next Session

**If resuming Day 4 (Particle Background):**
```bash
cd ~/Projects/projectlavos-monorepo/main-site
mkdir -p src/components/three
# Create ParticleBackground.jsx component
npm run dev  # Test locally
npm run build && vercel --prod  # Deploy when ready
```

**If resuming Day 5 (3D Icons):**
```bash
cd ~/Projects/projectlavos-monorepo/main-site
mkdir -p public/models
# Download 3D icons or use Drei primitives
# Create Icon3D.jsx component
npm run dev
```

**If resuming Day 6 (GitHub Actions):**
```bash
cd ~/Projects/projectlavos-monorepo
mkdir -p .github/workflows
# Create deploy-all.yml
# Add secrets to GitHub repo settings
git commit && git push  # Test workflow
```

**If resuming Day 7 (Content + Testing):**
```bash
cd ~/Projects/projectlavos-monorepo
# Edit each subdomain's App.jsx
# Test in multiple browsers
# Run Lighthouse audits
```

---

## 📚 Resources

**Three.js Learning:**
- Three.js Fundamentals: https://threejs.org/manual/
- React Three Fiber Docs: https://docs.pmnd.rs/react-three-fiber/
- Drei Helpers: https://github.com/pmndrs/drei

**3D Assets:**
- Free Icons: https://www.iconshock.com/3d-icons/
- Sketchfab: https://sketchfab.com/feed
- React Three Drei Primitives: Built-in Box, Sphere, etc.

**GitHub Actions:**
- Vercel CLI Docs: https://vercel.com/docs/cli
- Paths Filter Action: https://github.com/dorny/paths-filter

---

## ⚠️ Important Notes

**When NOT to continue:**
- If client/interview opportunity arises (revenue > infrastructure)
- If energy is low (quality > speed)
- If you want to validate traffic first (business value > visual polish)

**Alternative paths:**
- Skip Days 4-5 (Three.js) and focus on Week 2 business value (Restaurant Analyzer, Email Scorer)
- Deploy GitHub Actions (Day 6) without Three.js
- Keep sites identical content-wise, add differentiation later based on analytics

**The infrastructure is DONE. Everything else is enhancement.**

---

**Last Updated:** November 6, 2025 @ 11:30 PM
**Next Update:** After completing Day 4, 5, 6, or 7
