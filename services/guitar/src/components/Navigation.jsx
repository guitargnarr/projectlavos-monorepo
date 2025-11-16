import { Link, useLocation } from 'react-router-dom';

/**
 * Navigation component - Persistent navigation bar across all pages
 * Features:
 * - Active route highlighting
 * - Responsive design (horizontal scroll on mobile)
 * - Dark theme matching the app design
 */
export default function Navigation() {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home' },
    { path: '/fretvision', label: 'FretVision' },
    { path: '/tabplayer', label: 'Tab Player' },
    { path: '/catalog', label: 'Catalog' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand/Logo */}
          <div className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Guitar Platform
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto">
            {links.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-green-500 text-gray-900 shadow-md shadow-green-500/50'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
