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
    { path: '/', label: 'Home', color: 'green' },
    { path: '/fretvision', label: 'FretVision', color: 'green' },
    { path: '/tabplayer', label: 'Tab Player', color: 'blue' },
    { path: '/catalog', label: 'Catalog', color: 'purple' },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center">
            <div className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Guitar Platform
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-1 md:space-x-2 overflow-x-auto">
            {links.map((link) => {
              const isActive = location.pathname === link.path;

              // Color classes for active state
              const activeColors = {
                green: 'bg-green-500 text-gray-900',
                blue: 'bg-blue-500 text-gray-900',
                purple: 'bg-purple-500 text-gray-900',
              };

              // Color classes for hover state
              const hoverColors = {
                green: 'hover:bg-gray-700 hover:text-green-400',
                blue: 'hover:bg-gray-700 hover:text-blue-400',
                purple: 'hover:bg-gray-700 hover:text-purple-400',
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
