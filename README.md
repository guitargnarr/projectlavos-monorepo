# Project Lavos - Multi-Site AI Consulting Platform

**Status**: ✅ Live at [projectlavos.com](https://projectlavos.com)

AI consulting platform for Louisville, KY small businesses featuring 5 interactive demos across 4 subdomains.

![Project Lavos Platform](https://img.shields.io/badge/Status-Live-success) ![React](https://img.shields.io/badge/React-19.2-blue) ![Vite](https://img.shields.io/badge/Vite-6.1-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

---

## 🌐 Live Sites

| Subdomain | Purpose | URL |
|-----------|---------|-----|
| **Main** | Landing, overview, contact | [projectlavos.com](https://projectlavos.com) |
| **Demos** | 5 interactive AI demonstrations | [demos.projectlavos.com](https://demos.projectlavos.com) |
| **About** | Bio, credentials, "10-Hour Question" | [about.projectlavos.com](https://about.projectlavos.com) |
| **Services** | Pricing, assessment, retainer options | [services.projectlavos.com](https://services.projectlavos.com) |

---

## 🚀 Features

### 5 Interactive AI Demos

1. **Restaurant Analyzer** - Louisville restaurant review sentiment analysis
2. **Email Scorer** - B2B sales email effectiveness rating (1-10 with suggestions)
3. **Sentiment Analysis** - Real-time text emotion detection
4. **Lead Scoring** - Sales lead qualification calculator
5. **Phishing Detector** - Email security scanner

All powered by Claude Haiku API ($0.001 per analysis vs $0.05 for Opus - 98% cost savings)

---

## 🛠️ Tech Stack

**Frontend (All 4 Sites)**:
- React 19.2 + Vite 6.1
- Tailwind CSS v3.4 (Ambient design system)
- Vercel hosting (8-13s deploys)
- GitHub Actions (automated path-based deployment)

**Backend**:
- Repository: [projectlavos-backend](https://github.com/guitargnarr/projectlavos-backend)
- FastAPI + Anthropic SDK
- Render.com ($7/month starter tier)
- 6 API endpoints (health, restaurant, email, sentiment, lead, phishing)

---

## 📁 Monorepo Structure

```
projectlavos-monorepo/
├── main-site/     → projectlavos.com
├── demos/         → demos.projectlavos.com
├── about/         → about.projectlavos.com
└── services/      → services.projectlavos.com
```

Each subdomain is an independent Vercel project with ~580ms build times.

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

```bash
# Clone the repo
git clone https://github.com/guitargnarr/projectlavos-monorepo.git
cd projectlavos-monorepo

# Choose a subdomain to develop
cd demos  # or main-site, about, services

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🚢 Deployment

**Automatic**: Push to `main` branch triggers GitHub Actions workflow
- Only changed subdomains rebuild (path-based deployment)
- 96% faster than manual deploys (10s vs 4.5min)

**Manual**: `vercel --prod --yes` from subdomain directory

---

## 🎯 Strategic Positioning

**"The 10-Hour Question"** (on about.projectlavos.com):

> Everyone asks: "Should my business use AI?"
> I ask: "What's taking your team 10+ hours per week that you wish was automatic?"

**Framework**:
1. Identify the 10-hour task
2. Try AI demos with actual data
3. Calculate ROI (10h/week × $50/hr = $26K/year saved)
4. Implement or move on

---

## 📊 Performance

- **TTFB**: 154ms (Time to First Byte)
- **Bundle Size**: 71KB compressed
- **Lighthouse**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **API Response**: 3-5s (Claude Haiku analysis time)

---

## 🎨 Design System

**Ambient Design** (Nov 2025):
- Multi-layer soft shadows (not brutal 3D)
- Subtle borders (1px vs 3px)
- Electric blue gradients (#3b82f6)
- Professional polish for 40-60 year old business owners

Replaced Neubrutalism (playful) with Ambient (trustworthy).

---

## 📝 Why I Built This

After being laid off from Humana in August 2025, I pivoted from corporate ML engineering to Louisville AI consulting. Project Lavos validates demand with real business owners before investing in marketing.

**Local Specificity Strategy**: "That's MY restaurant - show me" creates immediate relevance.

---

## 📧 Contact

**Author**: Matthew David Scott
**Email**: matthewdscott7@gmail.com
**Website**: [projectlavos.com](https://projectlavos.com)
**GitHub**: [guitargnarr](https://github.com/guitargnarr)
**Location**: Louisville, KY

---

## 📄 License

Proprietary - © 2025 Matthew David Scott

---

**🤖 Built with Claude Code** - AI-assisted development for rapid prototyping
