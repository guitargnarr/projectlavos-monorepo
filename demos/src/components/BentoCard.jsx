function BentoCard({
  title,
  icon,
  timeSaved,
  description,
  index,
  onClick,
  isActive
}) {
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
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

      {/* CTA Button */}
      <button className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 relative overflow-hidden group/btn">
        <span className="relative z-10">Try Demo →</span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
      </button>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

      {/* Corner decoration */}
      <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
    </div>
  )
}

export default BentoCard
