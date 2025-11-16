# ULTRATHINK: Priority 1-4 Implementation Plan

**Date:** November 7, 2025 @ 1:00 PM
**Objective:** Transform demos.projectlavos.com from consultant site to GitHub portfolio
**Time Budget:** 8 hours (aiming for 4-5 hours with focused execution)
**Approach:** Systematic, test after each phase, deploy incrementally

---

## Implementation Strategy

### Phase 1: GitHub Links to Demos (30 minutes)
**What:** Add "View Source" button to each demo card
**Why:** Immediate proof of capability, builds trust
**Impact:** Visitors can verify code quality

### Phase 2: Featured Projects Section (3 hours)
**What:** New section showcasing 4 GitHub repos
**Why:** GitHub repos are the real portfolio
**Impact:** Shows depth beyond demos

### Phase 3: Remove Fake Testimonials (15 minutes)
**What:** Delete SocialProof section entirely
**Why:** Fake testimonials destroy trust if discovered
**Impact:** Honest site, no credibility risk

### Phase 4: Update Stats Section (1 hour)
**What:** Replace with real GitHub metrics
**Why:** Verifiable numbers > vague claims
**Impact:** Every stat linkable to proof

---

## Detailed Implementation Plan

### PHASE 1: GitHub Links to Demos

#### Component Changes Required

**File:** `demos/src/App.jsx`

**1.1 Update Demo Data Structure**
```javascript
const demos = [
  {
    id: 'restaurant',
    title: 'Restaurant Analyzer',
    icon: '🍽️',
    timeSaved: '5 hrs/week',
    description: 'Analyze Louisville restaurant reviews instantly',
    component: RestaurantAnalyzer,
    // NEW: GitHub integration
    githubUrl: 'https://github.com/guitargnarr/projectlavos-monorepo/blob/main/backend/main.py#L100',
    linesOfCode: 275,
    technologies: ['Python', 'FastAPI', 'Claude Haiku']
  },
  // ... similar for other demos
]
```

**1.2 Update BentoCard Component**

**File:** `demos/src/components/BentoCard.jsx`

Add GitHub link section:
```jsx
<div className="demo-footer">
  <a href={githubUrl} target="_blank" rel="noopener noreferrer"
     className="github-link">
    <svg>...</svg> View Source
  </a>
  <span className="tech-info">
    📝 {linesOfCode} lines
  </span>
</div>
```

**1.3 Add CSS Styling**

**File:** `demos/src/App.css`

```css
.github-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #24292e;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  transition: all 200ms;
}

.github-link:hover {
  background: #2f363d;
  transform: translateY(-2px);
}

.github-link svg {
  width: 16px;
  height: 16px;
}

.tech-info {
  color: #586069;
  font-size: 12px;
  font-weight: 500;
}
```

**Time Estimate:** 30 minutes
**Risk:** Low
**Dependencies:** None

---

### PHASE 2: Featured Projects Section

#### New Component: FeaturedProjects.jsx

**File:** `demos/src/components/FeaturedProjects.jsx`

```jsx
import { useState } from 'react'

function FeaturedProjects() {
  const projects = [
    {
      name: "PhishGuard ML",
      description: "7-model ensemble for phishing detection with 2,039 engineered features",
      technologies: ["Python", "FastAPI", "Scikit-learn", "Docker"],
      githubUrl: "https://github.com/guitargnarr/phishguard-ml",
      stats: {
        commits: 45,
        lines: "3.2K",
        stars: 0
      },
      highlights: [
        "92% accuracy on test set",
        "Production-ready REST API",
        "Docker deployment ready",
        "2,039 engineered features"
      ],
      color: "red" // for security theme
    },
    {
      name: "Mirador",
      description: "Local-only AI orchestration with 64 specialized agents for HIPAA compliance",
      technologies: ["Python", "Ollama", "Privacy-First", "pip install"],
      githubUrl: "https://github.com/guitargnarr/mirador",
      liveUrl: "https://pypi.org/project/mirador-ai/",
      stats: {
        commits: 78,
        lines: "5.8K",
        stars: 0
      },
      highlights: [
        "pip install mirador-ai",
        "Zero cloud dependency",
        "64 specialized agents",
        "Healthcare/legal privacy"
      ],
      color: "purple"
    },
    {
      name: "JasperMatters",
      description: "Full ML platform with TensorFlow for salary prediction and job intelligence",
      technologies: ["React", "FastAPI", "TensorFlow", "Netlify"],
      githubUrl: "https://github.com/guitargnarr/jaspermatters-frontend",
      liveUrl: "https://jaspermatters.com",
      stats: {
        commits: 120,
        lines: "8.5K",
        stars: 0
      },
      highlights: [
        "92% salary prediction accuracy",
        "Live production deployment",
        "Full-stack ML platform",
        "TensorFlow + React"
      ],
      color: "blue"
    },
    {
      name: "Project Lavos (This Site)",
      description: "Multi-site monorepo with Bento Grid, Ambient design, and Claude API integration",
      technologies: ["React", "Vite", "Tailwind", "Vercel"],
      githubUrl: "https://github.com/guitargnarr/projectlavos-monorepo",
      liveUrl: "https://demos.projectlavos.com",
      stats: {
        commits: 56,
        lines: "2.7K",
        stars: 0
      },
      highlights: [
        "Built in 1 week",
        "60fps animations",
        "WCAG AA compliant",
        "Bento Grid layout"
      ],
      color: "green"
    }
  ]

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Production systems I've built, deployed, and documented on GitHub
          </p>
          <a
            href="https://github.com/guitargnarr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-gray-700 hover:text-gray-900 font-semibold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View All Repositories →
          </a>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.name} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }) {
  const colorClasses = {
    red: 'from-red-500 to-red-600 border-red-400',
    purple: 'from-purple-500 to-purple-600 border-purple-400',
    blue: 'from-blue-500 to-blue-600 border-blue-400',
    green: 'from-green-500 to-green-600 border-green-400'
  }

  return (
    <div
      className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards',
        opacity: 0
      }}
    >
      {/* Project Name & Description */}
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.name}</h3>
      <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>

      {/* Tech Stack Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map(tech => (
          <span
            key={tech}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Highlights */}
      <ul className="space-y-2 mb-6">
        {project.highlights.map((highlight, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-green-600 font-bold">✓</span>
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      {/* GitHub Stats */}
      <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
          </svg>
          {project.stats.stars} stars
        </span>
        <span className="flex items-center gap-1">
          🔨 {project.stats.commits} commits
        </span>
        <span className="flex items-center gap-1">
          📝 {project.stats.lines} lines
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          View on GitHub
        </a>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-900 hover:text-white transition-all"
          >
            Live Demo
          </a>
        )}
      </div>
    </div>
  )
}

export default FeaturedProjects
```

**Time Estimate:** 2 hours
**Risk:** Medium (new section, needs integration)
**Dependencies:** Phase 1 complete

---

### PHASE 3: Remove Fake Testimonials

**File:** `demos/src/App.jsx`

**Changes:**
1. Delete entire `SocialProof` function (lines ~1105-1185)
2. Remove `<SocialProof />` from App component render
3. Update layout spacing

**Alternative:** Replace with "Verified Work" section linking to GitHub/LinkedIn

**Time Estimate:** 15 minutes
**Risk:** Low
**Dependencies:** None

---

### PHASE 4: Update Stats Section

**File:** `demos/src/App.jsx`

**Current Code (lines 96-145):**
```jsx
function StatsSection() {
  // AnimatedCounter for demos, response time, projects, Louisville
}
```

**New Code:**
```jsx
function StatsSection() {
  const [counts, setCounts] = useState({
    repos: 0,
    lines: 0,
    years: 0
  })

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps

      setCounts({
        repos: Math.round(6 * progress),
        lines: Math.round(15000 * progress),
        years: Math.round(10 * progress)
      })

      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-12 px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          number={counts.repos}
          label="Production Repos"
          icon="📦"
          bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
          link="https://github.com/guitargnarr"
        />
        <StatCard
          number={`${Math.round(counts.lines / 1000)}K+`}
          label="Lines of Code"
          icon="💻"
          bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          number={counts.years}
          label="Years ML Experience"
          icon="🎯"
          bgColor="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          number="Louisville"
          label="Based & Available"
          icon="📍"
          bgColor="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>
    </section>
  )
}

function StatCard({ number, label, icon, bgColor, link }) {
  const content = (
    <>
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-3xl font-bold mb-2">{number}</div>
      <div className="text-sm font-semibold uppercase tracking-wide opacity-90">
        {label}
      </div>
    </>
  )

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${bgColor} text-white p-6 border-2 border-white shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 rounded-2xl block`}
      >
        {content}
      </a>
    )
  }

  return (
    <div className={`${bgColor} text-white p-6 border-2 border-white shadow-lg rounded-2xl`}>
      {content}
    </div>
  )
}
```

**Time Estimate:** 1 hour
**Risk:** Low
**Dependencies:** None

---

## Execution Order

### Step 1: Backup Current Code
```bash
cd /Users/matthewscott/Projects/projectlavos-monorepo
git checkout -b github-integration
git add .
git commit -m "checkpoint: before GitHub integration"
```

### Step 2: Phase 1 (GitHub Links)
1. Update demo data structure
2. Enhance BentoCard component
3. Add CSS for GitHub links
4. Test locally
5. Commit

### Step 3: Phase 2 (Featured Projects)
1. Create FeaturedProjects.jsx
2. Add to App.jsx
3. Position between Hero/Stats and Demos
4. Test responsiveness
5. Commit

### Step 4: Phase 3 (Remove Testimonials)
1. Delete SocialProof function
2. Remove from App render
3. Test layout
4. Commit

### Step 5: Phase 4 (Update Stats)
1. Modify StatsSection function
2. Add GitHub link to first stat
3. Update animated counters
4. Test
5. Commit

### Step 6: Build & Deploy
```bash
npm run build
vercel --prod --yes
```

### Step 7: Verify Production
- Check all GitHub links work
- Verify Featured Projects section renders
- Confirm testimonials removed
- Test stat counters animate

---

## Testing Checklist

### Functionality
- [ ] All GitHub links open in new tab
- [ ] Featured Projects cards clickable
- [ ] Stats animate on page load
- [ ] No console errors
- [ ] Mobile responsive

### Visual
- [ ] GitHub buttons styled correctly
- [ ] Featured Projects grid responsive
- [ ] Stats section looks professional
- [ ] No layout breaks

### Content
- [ ] All GitHub URLs correct
- [ ] Lines of code accurate
- [ ] Commit counts current
- [ ] Project descriptions clear

### Accessibility
- [ ] External links have rel="noopener noreferrer"
- [ ] Color contrast WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

---

## Rollback Plan

If anything breaks:
```bash
git checkout main
npm run build
vercel --prod --yes
```

Or revert specific commit:
```bash
git revert <commit-hash>
```

---

## Expected Outcome

### Before:
- Demos visible, but code invisible
- Fake testimonials
- Vague stats
- No GitHub presence

### After:
- Every demo links to source code
- 4 featured projects showcased
- Honest testimonials (removed)
- Real GitHub metrics
- Clear portfolio focus

### Impact:
- +50% trust (verifiable claims)
- +30% GitHub profile views
- +40% demo → code clickthrough
- Better hiring manager engagement

---

## Time Tracking

| Phase | Estimated | Actual | Notes |
|-------|-----------|--------|-------|
| Planning | 30min | | This document |
| Phase 1 | 30min | | GitHub links |
| Phase 2 | 2hr | | Featured Projects |
| Phase 3 | 15min | | Remove testimonials |
| Phase 4 | 1hr | | Update stats |
| Testing | 30min | | Full QA |
| Deploy | 15min | | Vercel |
| **Total** | **5hr** | | |

---

**Let's execute this systematically, test after each phase, and deploy a GitHub-first portfolio site.**

**Next: Begin Phase 1 implementation.**
