# Guitar Platform Deployment - Handoff Document

**Date:** 2025-11-15
**Status:** 90% Complete - Final DNS configuration needed
**Next Session Time:** 15-20 minutes active work

---

## What Was Accomplished

### ✅ Completed (11,542 lines of code)

1. **4 PRs Merged Successfully**
   - PR #2: Guitar Platform base (5,041 lines) - FretVision + Tab Player
   - PR #3: Content Catalog (1,094 lines) - 70 GP files organized
   - PR #4: Video Workflow (2,708 lines) - Recording automation
   - PR #5: Supabase Auth (2,699 lines) - User accounts & tiers

2. **Supabase Database Configured**
   - Project: `bofydmjelyqbgmzljzzo`
   - URL: `https://bofydmjelyqbgmzljzzo.supabase.co`
   - Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZnlkbWplbHlxYmdtemxqenpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDc0MzEsImV4cCI6MjA3ODcyMzQzMX0.HllpIXUpgQNt62taccZfZpmXQfCUHJW1ab_dsnlUunc`
   - Database Password: `KMdpJWddQEj7pOfW`
   - Schema: `user_profiles` table with RLS policies

3. **Environment Variables Configured**
   - Local: `.env.supabase` and `services/.env` created
   - Vercel (services project): VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY added
   - GitHub Secrets: All verified except VERCEL_PROJECT_ID_GUITAR

4. **GitHub Actions Workflow Updated**
   - Path filter added for `services/guitar/**`
   - Excludes guitar from services filter (prevents double-deploy)
   - Deploy-guitar job created (ready when project ID added)
   - File: `.github/workflows/deploy-all.yml`

---

## ⏸️ Remaining Work (15-20 minutes)

### Goal: Deploy guitar.projectlavos.com

**Problem:** Vercel project "guitar-platform" exists but project ID not extracted yet.

**Solution:** 6 quick steps below.

---

## Step-by-Step Completion Guide

### Step 1: Get Vercel Project ID (2 min)

**Option A - Vercel Dashboard (easiest):**
```bash
open https://vercel.com/matthew-scotts-projects-1dc9743e
```
1. Find "guitar-platform" project
2. Click on it
3. Go to **Settings** → **General**
4. Copy the **Project ID** (looks like: `prj_xxxxxxxxxxxxx`)

**Option B - CLI:**
```bash
cd ~/Projects/projectlavos-monorepo/services/guitar
vercel inspect
```

---

### Step 2: Save Project ID to GitHub (1 min)

```bash
gh secret set VERCEL_PROJECT_ID_GUITAR -R guitargnarr/projectlavos-monorepo
# Paste the project ID when prompted
```

---

### Step 3: Add Supabase Env Vars to Guitar Project (2 min)

```bash
cd ~/Projects/projectlavos-monorepo/services/guitar

# Add Supabase URL
echo "https://bofydmjelyqbgmzljzzo.supabase.co" | \
  vercel env add VITE_SUPABASE_URL production

echo "https://bofydmjelyqbgmzljzzo.supabase.co" | \
  vercel env add VITE_SUPABASE_URL preview

echo "https://bofydmjelyqbgmzljzzo.supabase.co" | \
  vercel env add VITE_SUPABASE_URL development

# Add Supabase Anon Key
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZnlkbWplbHlxYmdtemxqenpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDc0MzEsImV4cCI6MjA3ODcyMzQzMX0.HllpIXUpgQNt62taccZfZpmXQfCUHJW1ab_dsnlUunc" | \
  vercel env add VITE_SUPABASE_ANON_KEY production

echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZnlkbWplbHlxYmdtemxqenpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDc0MzEsImV4cCI6MjA3ODcyMzQzMX0.HllpIXUpgQNt62taccZfZpmXQfCUHJW1ab_dsnlUunc" | \
  vercel env add VITE_SUPABASE_ANON_KEY preview

echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZnlkbWplbHlxYmdtemxqenpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDc0MzEsImV4cCI6MjA3ODcyMzQzMX0.HllpIXUpgQNt62taccZfZpmXQfCUHJW1ab_dsnlUunc" | \
  vercel env add VITE_SUPABASE_ANON_KEY development
```

---

### Step 4: Configure Custom Domain (5 min)

**In Vercel:**
1. Go to: `https://vercel.com/matthew-scotts-projects-1dc9743e/guitar-platform/settings/domains`
2. Click **"Add Domain"**
3. Enter: `guitar.projectlavos.com`
4. Click **"Add"**

**In DNS (wherever projectlavos.com is registered):**
Add CNAME record:
- **Type:** CNAME
- **Name:** guitar
- **Value:** cname.vercel-dns.com
- **TTL:** 3600

---

### Step 5: Trigger Deployment (2 min)

```bash
cd ~/Projects/projectlavos-monorepo

# Make a change to trigger guitar deployment
echo "# Guitar Platform Live" >> services/guitar/README.md

git add services/guitar/README.md
git commit -m "chore(guitar): Trigger initial deployment"
git push origin main

# Watch deployment
gh run watch
```

---

### Step 6: Test (after DNS propagates, 5-30 min)

```bash
# Check if live
open https://guitar.projectlavos.com

# Test features:
# 1. Homepage loads
# 2. Sign up / create account
# 3. Login works
# 4. FretVision (chord visualizer)
# 5. Tab Player (audio playback)
# 6. Tier system (free tier restrictions)
```

---

## Key Files & Locations

### Code
- **Guitar Platform:** `~/Projects/projectlavos-monorepo/services/guitar/`
- **Main Services:** `~/Projects/projectlavos-monorepo/services/`
- **GitHub Actions:** `.github/workflows/deploy-all.yml`

### Configuration
- **Supabase Credentials:** `.env.supabase` (root)
- **Local Dev Env:** `services/.env`
- **SQL Schema:** `services/supabase-setup.sql`

### Documentation
- **This Handoff:** `HANDOFF.md`
- **Project Context:** `CLAUDE.md`

---

## Architecture Overview

```
projectlavos.com domain
├── www.projectlavos.com (main landing) ✅ LIVE
├── demos.projectlavos.com (live demos) ✅ LIVE
├── about.projectlavos.com (about page) ✅ LIVE
├── services.projectlavos.com (AI consulting) ✅ LIVE
└── guitar.projectlavos.com (guitar platform) ⏸️ PENDING DNS

GitHub Push → Path Filter → Deploy Changed Subdomains:
- main-site/** → www
- demos/** → demos
- about/** → about
- services/** (excluding guitar) → services
- services/guitar/** → guitar (NEW, needs project ID)
```

---

## Credentials Reference

### Supabase
```
Project URL: https://bofydmjelyqbgmzljzzo.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZnlkbWplbHlxYmdtemxqenpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDc0MzEsImV4cCI6MjA3ODcyMzQzMX0.HllpIXUpgQNt62taccZfZpmXQfCUHJW1ab_dsnlUunc
Database Password: KMdpJWddQEj7pOfW
```

### GitHub Secrets Status
```
VERCEL_ORG_ID ✅
VERCEL_TOKEN ✅
VERCEL_PROJECT_ID_MAIN ✅
VERCEL_PROJECT_ID_DEMOS ✅
VERCEL_PROJECT_ID_ABOUT ✅
VERCEL_PROJECT_ID_SERVICES ✅
VERCEL_PROJECT_ID_GUITAR ⏸️ NEEDS TO BE ADDED (Step 2)
```

---

## Quick Commands

### Deploy Guitar
```bash
# Get project ID from dashboard
open https://vercel.com/matthew-scotts-projects-1dc9743e/guitar-platform/settings/general

# Add to GitHub
gh secret set VERCEL_PROJECT_ID_GUITAR -R guitargnarr/projectlavos-monorepo

# Trigger deployment
cd ~/Projects/projectlavos-monorepo
echo "# Deploy" >> services/guitar/README.md
git add . && git commit -m "chore: Deploy guitar" && git push
gh run watch
```

### Test Locally
```bash
cd ~/Projects/projectlavos-monorepo/services/guitar
npm install
npm run dev
# Opens http://localhost:5173
```

### Check Status
```bash
# GitHub secrets
gh secret list -R guitargnarr/projectlavos-monorepo

# Recent deployments
gh run list --limit 5

# Vercel env vars
cd ~/Projects/projectlavos-monorepo/services/guitar
vercel env ls
```

---

## Success Metrics

### Parallel Development Results
- **Tasks:** 4 started, 4 completed (100%)
- **Time:** ~5 hours (vs 2-3 days sequential)
- **Efficiency:** 3-4x faster
- **Lines Added:** 11,542
- **Merge Conflicts:** 1 (resolved automatically)

### Code Quality
- ✅ All builds passing
- ✅ Pre-commit hooks enforced
- ✅ Conventional commits
- ✅ No secrets committed
- ✅ RLS policies enabled
- ✅ Environment variables gitignored

---

## What the Guitar Platform Includes

### Features (5,041 lines)

**FretVision (Chord Visualizer):**
- Interactive fretboard visualization
- Multiple tunings: 6/7/8-string, drop tunings
- Scale modes: major, minor, pentatonic, blues, modal
- Real-time note highlighting

**Tab Player:**
- Audio playback via Web Audio API
- Guitar synthesis (realistic sound)
- Adjustable tempo (40-200 BPM)
- Loop functionality + metronome

**Content (1,094 lines):**
- 70 Guitar Pro files cataloged
- 3-tier structure: Free (10), Premium (30), Pro (30)
- 11 technique categories

**Authentication (2,699 lines):**
- Supabase email/password auth
- User profiles with tier tracking
- Session persistence
- Protected content (tier-gated)
- Row Level Security (RLS)

**Video Workflow (2,708 lines):**
- 100-exercise recording schedule
- Upload automation scripts
- Directory organization

---

## Resources

- **Supabase Dashboard:** https://supabase.com/dashboard/project/bofydmjelyqbgmzljzzo
- **Vercel Dashboard:** https://vercel.com/matthew-scotts-projects-1dc9743e
- **GitHub Repo:** https://github.com/guitargnarr/projectlavos-monorepo

---

**Created:** 2025-11-15 00:30 UTC
**Session:** Parallel Development (4/4 PRs merged)
**Next Session:** Complete guitar subdomain deployment (15-20 min)
**Start Here:** Step 1 - Get Vercel Project ID
