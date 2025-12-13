import { Link } from 'react-router-dom'

const portfolioCore = [
  {
    title: 'Guitar Learning Platform',
    url: 'https://guitar.projectlavos.com',
    description: 'Interactive guitar learning platform with fretboard, lessons, riff generator, and GP5 export. Uses Python for music theory (LLMs can\'t count frets correctly) and AI only for style interpretation.',
    tags: ['React', 'Python', 'FastAPI', 'MIDI', 'Web Audio'],
    insight: 'AI interprets "aggressive metal" into parameters. Python generates correct notes.',
  },
  {
    title: 'PhishGuard',
    url: 'https://phishguard-ui.vercel.app',
    description: 'Security demo - phishing URL analyzer backed by a production-grade ML API (7-model ensemble). Single models aren\'t reliable enough for security classification.',
    tags: ['Python', 'FastAPI', 'ML Ensemble', 'React'],
    insight: '7 models because one model isn\'t enough for security.',
  },
  {
    title: 'Interactive Resume',
    url: 'https://interactive-resume-ten-pi.vercel.app',
    description: 'Next.js/React-based interactive resume with timeline view and skill visualization.',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind'],
    insight: null,
  },
  {
    title: 'JobTrack (Traction)',
    url: 'https://jobtrack-two.vercel.app',
    description: 'Application tracking with pipeline visualization and ATS-focused fields. Built by a job searcher who missed an interview.',
    tags: ['React', 'PostgreSQL', 'CSV Import'],
    insight: null,
  },
  {
    title: 'BA Pathfinder',
    url: 'https://ba-pathfinder.vercel.app',
    description: 'Business analyst career roadmap and skill planning tool.',
    tags: ['React', 'AI', 'Career Tools'],
    insight: null,
  },
  {
    title: 'OurJourney',
    url: 'https://ourjourney-app.vercel.app',
    description: 'Designed for shared goals and planning (React + PostgreSQL backend).',
    tags: ['React', 'PostgreSQL', 'Railway'],
    insight: null,
  },
  {
    title: 'AI Talent Optimizer',
    url: 'https://jobs.projectlavos.com',
    description: 'Job discovery dashboard with 278 verified jobs. Risk badges, tier filtering, and direct employer portal sourcing - no LinkedIn/recruiter scrapes.',
    tags: ['React', 'FastAPI', 'SQLite', 'Tailwind'],
    insight: 'Tier 1 = LOW risk + $200k+. Every URL verified live on employer site.',
  },
]

const workingProjects = [
  {
    title: 'Jaspermatters',
    url: 'https://jaspermatters-job-intelligence.vercel.app',
    description: 'AI/ML job intelligence and labor market analysis dashboard.',
    tags: ['React', 'AI', 'Data Analysis'],
  },
  {
    title: 'Mirador Demo',
    url: 'https://vercel-demo-flame.vercel.app',
    description: 'Demo UI for the Mirador local AI orchestration framework (multi-persona, includes security audit workflows). Found real CORS vulnerability in production code.',
    tags: ['React', 'Ollama', 'Flask', '16 Personas'],
    insight: 'Security audits: 100% accurate. Architecture advice: misses user context.',
  },
  {
    title: '2025 Skills',
    url: 'https://2025-skills-to-know.vercel.app',
    description: 'Skills dashboard and exploration tool for 2025-relevant technologies.',
    tags: ['React', 'Skills Analysis'],
  },
]

const standaloneTools = [
  {
    title: 'ChordGen Pro',
    url: 'https://chordgen-pro.vercel.app',
    description: 'Chord progression generator for songwriting/idea exploration.',
    tags: ['React', 'Music Theory'],
  },
  {
    title: 'FretForge',
    url: 'https://fretforge-showcase.vercel.app',
    description: 'Guitar fretboard visualization and pattern exploration showcase.',
    tags: ['React', 'Canvas', 'SVG'],
  },
  {
    title: 'Apartment Demo',
    url: 'https://frontend-mu-dusky-38.vercel.app',
    description: 'Apartment leasing demo SPA for lead capture and unit browsing.',
    tags: ['React', 'Demo'],
  },
]

const backendServices = [
  {
    title: 'Project Lavos API',
    url: 'https://projectlavos-backend.onrender.com',
    description: 'Handles leads, demo submissions, and content for the portfolio.',
    platform: 'Render',
    tags: ['FastAPI', 'Python'],
  },
  {
    title: 'Guitar Model Lab',
    url: 'https://guitar-model-lab.onrender.com',
    description: 'GP5 generation, tab generation, scales/patterns. Deterministic music theory, not LLM guessing.',
    platform: 'Render',
    tags: ['FastAPI', 'PyGuitarPro', 'Music Theory'],
  },
  {
    title: 'OurJourney API',
    url: 'https://matthew-scott-portfolio-production.up.railway.app',
    description: 'Couples app backend with PostgreSQL. Rate limiting and SQL injection protection added.',
    platform: 'Railway',
    tags: ['Node.js', 'PostgreSQL', 'Express'],
  },
  {
    title: 'AI Talent Optimizer API',
    url: 'https://ai-talent-optimizer.onrender.com',
    description: 'Job data API with tier filtering, risk scoring, and company research. 278 verified jobs from employer portals.',
    platform: 'Render',
    tags: ['FastAPI', 'Python', 'SQLite'],
  },
]

const localOnly = [
  {
    title: 'Mirador',
    path: '~/Projects/Security-Tools/mirador-test',
    description: 'Local AI orchestration framework. 16 personas, 51 models, chains for security audits that actually work.',
    tags: ['Python', 'Ollama', 'Flask', 'SSE'],
    github: 'https://github.com/guitargnarr/mirador',
  },
  {
    title: 'Reflexia',
    path: '~/Projects/reflexia-model-manager',
    description: 'Ollama model manager CLI.',
    tags: ['Python', 'CLI', 'Ollama'],
    github: 'https://github.com/guitargnarr/reflexia',
  },
]

function ProjectCard({ project, showInsight = false }) {
  const isExternal = project.url?.startsWith('http')

  return (
    <a
      href={project.url || project.github || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-teal-500/50 hover:-translate-y-1 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-teal-400 transition-colors">
          {project.title}
        </h3>
        {project.platform && (
          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
            {project.platform}
          </span>
        )}
      </div>
      <p className="text-slate-400 text-sm mb-3 leading-relaxed">
        {project.description}
      </p>
      {showInsight && project.insight && (
        <p className="text-teal-400/80 text-xs mb-3 italic border-l-2 border-teal-500/50 pl-3">
          {project.insight}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {project.tags?.map((tag, i) => (
          <span key={i} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
      {project.path && (
        <p className="text-slate-500 text-xs mt-3 font-mono">
          {project.path}
        </p>
      )}
    </a>
  )
}

function Section({ title, description, children, accent = 'teal' }) {
  const gradientClass = accent === 'orange'
    ? 'from-orange-400 to-teal-400'
    : 'from-teal-400 to-orange-400'

  return (
    <section className="mb-16">
      <h2 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}>
        {title}
      </h2>
      {description && (
        <p className="text-slate-400 text-sm mb-6">{description}</p>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </section>
  )
}

export default function Projects() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
            MS
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
            <a href="https://github.com/guitargnarr" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
              Systems Map
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-4">
            Hybrid systems: AI where it's strong, deterministic code where it's not.
          </p>
          <p className="text-slate-400 leading-relaxed max-w-3xl">
            My guitar platform uses Python for music theory because LLMs can't count frets correctly.
            My security auditor chains 16 AI personas and catches real vulnerabilities - it found a CORS bug in my own production code.
            I care about tools that actually work, not demos that sound impressive.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">

        <Section
          title="Portfolio Core"
          description="Production applications - deployed, maintained, branded."
        >
          {portfolioCore.map((project, i) => (
            <ProjectCard key={i} project={project} showInsight={true} />
          ))}
        </Section>

        <Section
          title="Working Projects"
          description="Active development, functional demos."
          accent="orange"
        >
          {workingProjects.map((project, i) => (
            <ProjectCard key={i} project={project} showInsight={true} />
          ))}
        </Section>

        <Section
          title="Standalone Tools"
          description="Focused utilities and demos."
        >
          {standaloneTools.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </Section>

        <Section
          title="Backend Services"
          description="APIs powering the frontends."
          accent="orange"
        >
          {backendServices.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </Section>

        <Section
          title="Local-Only"
          description="Requires local Ollama installation. Source code on GitHub."
        >
          {localOnly.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </Section>

        {/* Custom Domains */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
            Custom Domains
          </h2>
          <p className="text-slate-400 text-sm mb-6">All under projectlavos.com</p>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-4 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-teal-400">projectlavos.com</span>
                <span className="text-slate-400">Portfolio hub</span>
              </div>
              <div className="flex justify-between">
                <span className="text-teal-400">guitar.projectlavos.com</span>
                <span className="text-slate-400">Guitar platform</span>
              </div>
              <div className="flex justify-between">
                <span className="text-teal-400">jobs.projectlavos.com</span>
                <span className="text-slate-400">Job discovery</span>
              </div>
              <div className="flex justify-between">
                <span className="text-teal-400">demos.projectlavos.com</span>
                <span className="text-slate-400">AI demos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-teal-400">about.projectlavos.com</span>
                <span className="text-slate-400">About page</span>
              </div>
              <div className="flex justify-between">
                <span className="text-teal-400">services.projectlavos.com</span>
                <span className="text-slate-400">Services</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            &copy; 2025 Matthew Scott
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/" className="text-slate-400 hover:text-teal-400 transition-colors">
              Home
            </Link>
            <a href="https://github.com/guitargnarr" className="text-slate-400 hover:text-teal-400 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
