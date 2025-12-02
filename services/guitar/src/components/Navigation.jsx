import { Link, useLocation } from 'react-router-dom';

/**
 * Navigation component - Persistent navigation bar for Guitar Learning Platform
 *
 * Features:
 * - Links to all 4 main pages (Home, FretVision, TabPlayer, Catalog)
 * - Highlights active route based on current location
 * - Mobile responsive with horizontal layout
 * - Dark theme matching existing design (bg-gray-800, green/blue accents)
 */
export default function Navigation() {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home', color: 'teal' },
    { path: '/fretvision', label: 'FretVision', color: 'teal' },
    { path: '/tabplayer', label: 'Tab Player', color: 'orange' },
    { path: '/chords', label: 'Chords', color: 'teal' },
    { path: '/tuner', label: 'Tuner', color: 'orange' },
    { path: '/metronome', label: 'Metronome', color: 'orange' },
    { path: '/catalog', label: 'Catalog', color: 'teal' },
    { path: '/scales', label: 'Scales', color: 'teal' },
    { path: '/backing', label: 'Backing', color: 'orange' },
    { path: '/ear-training', label: 'Ear', color: 'orange' },
    { path: '/pricing', label: 'Pricing', color: 'teal' },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center">
            <div className="text-xl font-bold bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
              Guitar Platform
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-1 md:space-x-2 overflow-x-auto">
            {links.map((link) => {
              const isActive = location.pathname === link.path;

              // Color classes for active state (teal/orange brand)
              const activeColors = {
                teal: 'bg-teal-500 text-gray-900',
                orange: 'bg-orange-500 text-gray-900',
              };

              // Color classes for hover state
              const hoverColors = {
                teal: 'hover:bg-gray-700 hover:text-teal-400',
                orange: 'hover:bg-gray-700 hover:text-orange-400',
              };

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-3 py-2 rounded-md transition-all duration-200 text-sm md:text-base font-medium whitespace-nowrap
                    ${isActive
                      ? activeColors[link.color]
                      : `text-gray-300 ${hoverColors[link.color]}`
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
