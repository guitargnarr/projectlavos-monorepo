import AnimatedCounter from './AnimatedCounter'

function FeaturedProjects() {
  const projects = [
    {
      name: "PhishGuard ML",
      description: "7-model ensemble for phishing detection with 2,039 engineered features",
      technologies: ["Python", "FastAPI", "Scikit-learn", "Docker"],
      githubUrl: "https://github.com/guitargnarr/phishguard-ml",
      stats: {
        commits: 45,
        lines: 3200,
        linesDisplay: "3.2K",
        stars: 0
      },
      highlights: [
        "92% accuracy on test set",
        "Production-ready REST API",
        "Docker deployment ready",
        "2,039 engineered features"
      ],
      gradient: "from-red-500 to-red-600",
      borderColor: "border-red-400"
    },
    {
      name: "Mirador",
      description: "Local-only AI orchestration with 64 specialized agents for HIPAA compliance",
      technologies: ["Python", "Ollama", "Privacy-First", "pip install"],
      githubUrl: "https://github.com/guitargnarr/mirador",
      liveUrl: "https://pypi.org/project/mirador-ai/",
      stats: {
        commits: 78,
        lines: 5800,
        linesDisplay: "5.8K",
        stars: 0
      },
      highlights: [
        "pip install mirador-ai",
        "Zero cloud dependency",
        "64 specialized agents",
        "Healthcare/legal privacy"
      ],
      gradient: "from-purple-500 to-purple-600",
      borderColor: "border-purple-400"
    },
    {
      name: "JasperMatters",
      description: "Full ML platform with TensorFlow for salary prediction and job intelligence",
      technologies: ["React", "FastAPI", "TensorFlow", "Netlify"],
      githubUrl: "https://github.com/guitargnarr/jaspermatters-frontend",
      liveUrl: "https://jaspermatters.com",
      stats: {
        commits: 120,
        lines: 8500,
        linesDisplay: "8.5K",
        stars: 0
      },
      highlights: [
        "92% salary prediction accuracy",
        "Live production deployment",
        "Full-stack ML platform",
        "TensorFlow + React"
      ],
      gradient: "from-blue-500 to-blue-600",
      borderColor: "border-blue-400"
    },
    {
      name: "Project Lavos (This Site)",
      description: "Multi-site monorepo with Bento Grid, Ambient design, and Claude API integration",
      technologies: ["React", "Vite", "Tailwind", "Vercel"],
      githubUrl: "https://github.com/guitargnarr/projectlavos-monorepo",
      liveUrl: "https://demos.projectlavos.com",
      stats: {
        commits: 56,
        lines: 2700,
        linesDisplay: "2.7K",
        stars: 0
      },
      highlights: [
        "Built in 1 week",
        "60fps animations",
        "WCAG AA compliant",
        "Bento Grid layout"
      ],
      gradient: "from-green-500 to-green-600",
      borderColor: "border-green-400"
    }
  ]

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
            Production systems I've built, deployed, and documented on GitHub
          </p>
          <a
            href="https://github.com/guitargnarr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 hover:shadow-lg"
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

        {/* Portfolio Summary */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-black text-gray-900 mb-2">
                <AnimatedCounter value={6} />
              </div>
              <div className="text-sm text-gray-600">Production Repos</div>
            </div>
            <div>
              <div className="text-3xl font-black text-gray-900 mb-2">
                <AnimatedCounter value={15} />K+
              </div>
              <div className="text-sm text-gray-600">Lines of Code</div>
            </div>
            <div>
              <div className="text-3xl font-black text-gray-900 mb-2">
                <AnimatedCounter value={10} />
              </div>
              <div className="text-sm text-gray-600">Years ML Experience</div>
            </div>
            <div>
              <div className="text-3xl font-black text-gray-900 mb-2">
                100%
              </div>
              <div className="text-sm text-gray-600">Open Source</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }) {
  return (
    <div
      className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards',
        opacity: 0
      }}
    >
      {/* Colored accent bar */}
      <div className={`h-2 w-16 bg-gradient-to-r ${project.gradient} rounded-full mb-6`}></div>

      {/* Project Name & Description */}
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {project.name}
      </h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>

      {/* Tech Stack Badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.technologies.map(tech => (
          <span
            key={tech}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Highlights */}
      <ul className="space-y-2 mb-6">
        {project.highlights.map((highlight, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-green-600 font-bold mt-0.5">✓</span>
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      {/* GitHub Stats */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
        <span className="flex items-center gap-1 text-sm text-gray-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
          </svg>
          <AnimatedCounter value={project.stats.stars} duration={800} />
        </span>
        <span className="flex items-center gap-1 text-sm text-gray-600">
          🔨 <AnimatedCounter value={project.stats.commits} duration={1000} />
        </span>
        <span className="flex items-center gap-1 text-sm text-gray-600">
          📝 {project.stats.linesDisplay}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-3 border-2 ${project.borderColor} bg-gradient-to-r ${project.gradient} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200`}
          >
            Live Demo →
          </a>
        )}
      </div>
    </div>
  )
}

export default FeaturedProjects
