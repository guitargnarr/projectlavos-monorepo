import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import './App.css'
import Projects from './pages/Projects'

// Mobile menu icon components
function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

const projects = [
  {
    title: 'Guitar Learning Platform',
    description: 'Interactive fretboard visualization, 100+ lessons with MIDI playback, progress tracking. Built with React, Vite, and Web Audio API.',
    url: 'https://guitar.projectlavos.com',
    tags: ['React', 'MIDI', 'Web Audio', 'Supabase'],
    status: 'Live',
  },
  {
    title: 'Interactive Resume',
    description: 'React-based portfolio with timeline view, project showcases, and skills visualization. Responsive design with Tailwind CSS.',
    url: 'https://interactive-resume-ten-pi.vercel.app',
    tags: ['React', 'TypeScript', 'Tailwind'],
    status: 'Live',
  },
  {
    title: 'BA Pathfinder',
    description: 'Business analyst career guidance tool with AI-powered recommendations for skill development and career progression.',
    url: 'https://ba-pathfinder.vercel.app',
    tags: ['React', 'AI', 'Career Tools'],
    status: 'Live',
  },
  {
    title: 'Traction',
    description: 'Job application tracking system. Import from LinkedIn, track response rates, identify what works. Built by a job searcher who missed an interview.',
    url: 'https://jobtrack-two.vercel.app',
    tags: ['React', 'PostgreSQL', 'CSV Import'],
    status: 'Live',
  },
  {
    title: 'OurJourney',
    description: 'Relationship milestone tracking app for couples. Timeline view, photo memories, anniversary reminders.',
    url: 'https://ourjourney-app.vercel.app',
    tags: ['React', 'Firebase', 'PWA'],
    status: 'Live',
  },
  {
    title: 'PhishGuard',
    description: 'Email phishing detection using machine learning. Analyzes sender patterns, urgency language, and suspicious links.',
    url: 'https://phishguard-ui.vercel.app',
    tags: ['Python', 'FastAPI', 'ML', 'React'],
    status: 'Live',
  },
  {
    title: 'Mirador',
    description: 'Self-governing AI that fired 11% of itself and got smarter. 30 personas, autonomous optimization, zero human intervention. The first AI system that governs itself.',
    url: 'https://mirador.projectlavos.com',
    tags: ['Python', 'Ollama', 'Self-Governance', 'AI Orchestration'],
    status: 'Live',
  },
]

const skills = [
  { category: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Next.js'] },
  { category: 'Backend', items: ['Python', 'FastAPI', 'Node.js', 'PostgreSQL', 'Supabase'] },
  { category: 'DevOps', items: ['Vercel', 'Railway', 'Docker', 'GitHub Actions', 'AWS'] },
  { category: 'AI/ML', items: ['TensorFlow', 'Ollama', 'Claude API', 'LangChain'] },
]

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  )
}

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main>
        <Hero />
        <FeaturedProjects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '#projects', label: 'Projects', isAnchor: true },
    { href: '/projects', label: 'Systems Map', isLink: true },
    { href: '#skills', label: 'Skills', isAnchor: true },
    { href: '#contact', label: 'Contact', isAnchor: true },
    { href: 'https://github.com/guitargnarr', label: 'GitHub', isExternal: true },
  ]

  return (
    <header className="border-b border-slate-700/50 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent min-h-[44px] min-w-[44px] flex items-center justify-center">
          MS
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-sm" aria-label="Main navigation">
          {navLinks.map((link) => (
            link.isLink ? (
              <Link
                key={link.href}
                to={link.href}
                className="text-slate-400 hover:text-white transition-colors py-2 px-1 min-h-[44px] flex items-center"
              >
                {link.label}
              </Link>
            ) : link.isExternal ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors py-2 px-1 min-h-[44px] flex items-center"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-400 hover:text-white transition-colors py-2 px-1 min-h-[44px] flex items-center"
              >
                {link.label}
              </a>
            )
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-sm" aria-label="Mobile navigation">
          <div className="px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              link.isLink ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-slate-300 hover:text-white hover:bg-slate-800 transition-colors py-3 px-4 rounded-lg min-h-[44px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : link.isExternal ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white hover:bg-slate-800 transition-colors py-3 px-4 rounded-lg min-h-[44px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-slate-300 hover:text-white hover:bg-slate-800 transition-colors py-3 px-4 rounded-lg min-h-[44px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              )
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 hero-gradient">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
          <span className="text-shimmer">
            Matthew Scott
          </span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-4">
          Full Stack Developer
        </p>
        <p className="text-base sm:text-lg text-slate-400 mb-8">
          Louisville, KY
        </p>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed px-2">
          Building practical tools with modern technology. 10 years healthcare IT experience,
          now focused on shipping production-ready applications that solve real problems.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in-up delay-300 px-4">
          <a
            href="#projects"
            className="btn-elite w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-slate-900 px-8 py-3 rounded-lg font-semibold min-h-[48px] flex items-center justify-center"
          >
            View Projects
          </a>
          <Link
            to="/projects"
            className="btn-elite w-full sm:w-auto border border-teal-500 hover:bg-teal-500/10 text-teal-400 px-8 py-3 rounded-lg font-semibold min-h-[48px] flex items-center justify-center"
          >
            Systems Map
          </Link>
          <a
            href="#contact"
            className="btn-elite w-full sm:w-auto border border-slate-600 hover:border-teal-500 text-white px-8 py-3 rounded-lg font-semibold glow-border min-h-[48px] flex items-center justify-center"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  )
}

function FeaturedProjects() {
  return (
    <section id="projects" className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-800/50" aria-labelledby="projects-heading">
      <div className="max-w-6xl mx-auto">
        <h2 id="projects-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
            Featured Projects
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 text-center mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
          Production applications deployed and actively maintained. Each project demonstrates
          full-stack capabilities from concept to deployment.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors py-2 min-h-[44px]"
          >
            View complete Systems Map
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }) {
  return (
    <article className="card-elite bg-slate-800 border border-slate-700 rounded-lg hover:border-teal-500/50 group">
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-white group-hover:text-teal-400 transition-colors">
            {project.title}
          </h3>
          <span className="text-xs bg-teal-500/20 text-teal-400 px-2 py-1 rounded">
            {project.status}
          </span>
        </div>
        <p className="text-slate-400 text-sm mb-4 leading-relaxed">
          {project.description}
        </p>
        <ul className="flex flex-wrap gap-2" aria-label="Technologies used">
          {project.tags.map((tag, i) => (
            <li key={i} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
              {tag}
            </li>
          ))}
        </ul>
      </a>
    </article>
  )
}

function Skills() {
  return (
    <section id="skills" className="py-16 sm:py-20 px-4 sm:px-6" aria-labelledby="skills-heading">
      <div className="max-w-6xl mx-auto">
        <h2 id="skills-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
            Technical Skills
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 text-center mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
          Technologies I use to build production applications.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {skills.map((skill, index) => (
            <article key={index} className="card-elite bg-slate-800 border border-slate-700 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-teal-400 mb-3 sm:mb-4">{skill.category}</h3>
              <ul className="space-y-2" role="list" aria-label={`${skill.category} skills`}>
                {skill.items.map((item, i) => (
                  <li key={i} className="text-slate-300 text-xs sm:text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0" aria-hidden="true"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText('matthewdscott7@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-800/50" aria-labelledby="contact-heading">
      <div className="max-w-4xl mx-auto text-center">
        <h2 id="contact-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
            Get in Touch
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mb-8 max-w-2xl mx-auto px-2">
          Open to opportunities and collaborations. Let's build something together.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
          <button
            onClick={copyEmail}
            className="btn-elite w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-slate-900 px-6 sm:px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 min-h-[48px] text-sm sm:text-base"
          >
            {copied ? 'Copied!' : 'matthewdscott7@gmail.com'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          </button>

          <a
            href="https://github.com/guitargnarr"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto border border-slate-600 hover:border-teal-500 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 min-h-[48px]"
          >
            GitHub
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>

          <a
            href="https://linkedin.com/in/matthew-d-scott"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto border border-slate-600 hover:border-teal-500 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 min-h-[48px]"
          >
            LinkedIn
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate-700/50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-400 text-xs sm:text-sm text-center md:text-left">
          &copy; 2025 Matthew Scott. Built with React + Vite.
        </p>
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm" aria-label="Footer navigation">
          <Link to="/projects" className="text-slate-400 hover:text-teal-400 transition-colors py-2 min-h-[44px] flex items-center">
            Systems Map
          </Link>
          <a href="https://guitar.projectlavos.com" className="text-slate-400 hover:text-teal-400 transition-colors py-2 min-h-[44px] flex items-center">
            Guitar Platform
          </a>
          <a href="https://github.com/guitargnarr" className="text-slate-400 hover:text-teal-400 transition-colors py-2 min-h-[44px] flex items-center">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  )
}

export default App
