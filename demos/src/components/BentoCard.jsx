function BentoCard({
  title,
  icon,
  timeSaved,
  description,
  index,
  onClick,
  isActive,
  githubUrl,
  linesOfCode,
  technologies
}) {
  const handleGitHubClick = (e) => {
    e.stopPropagation() // Prevent modal from opening
    window.open(githubUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className={`
        relative overflow-hidden cursor-pointer
        bg-white rounded-2xl p-8
        border border-gray-100
        transition-all duration-300
        hover:shadow-xl hover:-translate-y-2
        group
        ${isActive ? 'ring-4 ring-purple-500 scale-105 z-10' : ''}
      `}
      onClick={onClick}
      style={{
        animationDelay: `${index * 75}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards',
        opacity: 0
      }}
    >
      {/* Top gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

      {/* Icon with hover animation */}
      <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm text-purple-600 font-semibold mb-3 flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
        Saves {timeSaved}
      </p>
      <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>

      {/* Tech Stack Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {technologies?.map(tech => (
          <span
            key={tech}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* CTA Button */}
      <button className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 relative overflow-hidden group/btn mb-3">
        <span className="relative z-10">Try Demo →</span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
      </button>

      {/* GitHub Link */}
      <button
        onClick={handleGitHubClick}
        className="w-full py-3 px-4 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 min-h-[44px]"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        View Source ({linesOfCode} lines)
      </button>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

      {/* Corner decoration */}
      <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
    </div>
  )
}

export default BentoCard
