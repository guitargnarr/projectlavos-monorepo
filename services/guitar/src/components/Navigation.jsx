import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navigation component - Responsive navigation bar for Guitar Learning Platform
 *
 * Features:
 * - Links to all pages
 * - Highlights active route
 * - Mobile hamburger menu
 * - Dark theme with teal/orange accents
 */
export default function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { path: '/', label: 'Home', color: 'teal' },
    { path: '/riff-generator', label: 'Riff Gen', color: 'teal' },
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

  const activeColors = {
    teal: 'bg-teal-500 text-gray-900',
    orange: 'bg-orange-500 text-gray-900',
  };

  const hoverColors = {
    teal: 'hover:bg-gray-700 hover:text-teal-400',
    orange: 'hover:bg-gray-700 hover:text-orange-400',
  };

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

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex space-x-1">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium whitespace-nowrap
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

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="grid grid-cols-3 gap-2">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      px-3 py-3 rounded-md text-center text-sm font-medium transition-colors
                      ${isActive
                        ? activeColors[link.color]
                        : `text-gray-300 bg-gray-700/50 ${hoverColors[link.color]}`
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
