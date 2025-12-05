import { useState } from 'react'
import './App.css'

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
]

const skills = [
  { category: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Next.js'] },
  { category: 'Backend', items: ['Python', 'FastAPI', 'Node.js', 'PostgreSQL', 'Supabase'] },
  { category: 'DevOps', items: ['Vercel', 'Railway', 'Docker', 'GitHub Actions', 'AWS'] },
  { category: 'AI/ML', items: ['TensorFlow', 'Ollama', 'Claude API', 'LangChain'] },
]

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <Hero />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="border-b border-slate-700/50 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-bold bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
          MS
        </a>
        <nav className="flex gap-6 text-sm">
          <a href="#projects" className="text-slate-400 hover:text-white transition-colors">Projects</a>
          <a href="#skills" className="text-slate-400 hover:text-white transition-colors">Skills</a>
          <a href="#contact" className="text-slate-400 hover:text-white transition-colors">Contact</a>
          <a
            href="https://github.com/guitargnarr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
            Matthew Scott
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-4">
          Full Stack Developer
        </p>
        <p className="text-lg text-slate-400 mb-8">
          Louisville, KY
        </p>
        <p className="text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
          Building practical tools with modern technology. 10 years healthcare IT experience at Humana,
          now focused on shipping production-ready applications that solve real problems.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="#projects"
            className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="border border-slate-600 hover:border-teal-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="py-20 px-6 bg-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
            Featured Projects
          </span>
        </h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
          Production applications deployed and actively maintained. Each project demonstrates
          full-stack capabilities from concept to deployment.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-teal-500/50 hover:-translate-y-1 transition-all duration-200 group"
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
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag, i) => (
          <span key={i} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
    </a>
  )
}

function Skills() {
  return (
    <section id="skills" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
            Technical Skills
          </span>
        </h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
          Technologies I use to build production applications.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-teal-400 mb-4">{skill.category}</h3>
              <ul className="space-y-2">
                {skill.items.map((item, i) => (
                  <li key={i} className="text-slate-300 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
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
    <section id="contact" className="py-20 px-6 bg-slate-800/50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
            Get in Touch
          </span>
        </h2>
        <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
          Open to opportunities and collaborations. Let's build something together.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={copyEmail}
            className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            {copied ? 'Copied!' : 'matthewdscott7@gmail.com'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          </button>

          <a
            href="https://github.com/guitargnarr"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-slate-600 hover:border-teal-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            GitHub
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>

          <a
            href="https://linkedin.com/in/matthew-d-scott"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-slate-600 hover:border-teal-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            LinkedIn
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
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
    <footer className="border-t border-slate-700/50 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-400 text-sm">
          &copy; 2025 Matthew Scott. Built with React + Vite.
        </p>
        <div className="flex gap-6 text-sm">
          <a href="https://guitar.projectlavos.com" className="text-slate-400 hover:text-teal-400 transition-colors">
            Guitar Platform
          </a>
          <a href="https://github.com/guitargnarr" className="text-slate-400 hover:text-teal-400 transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}

export default App
