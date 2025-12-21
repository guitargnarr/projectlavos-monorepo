import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navigation component - Simplified responsive navigation bar for FretVision
 *
 * Structure:
 * - Main Nav (6): Home, Riff Gen, Fretboard, Tab Player, Chords, About
 * - "More" Dropdown (7): Tuner, Metronome, Catalog, Scales, Backing, Ear, Pricing
 * - Mobile: Full hamburger menu with all items
 */
export default function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Main navigation links (always visible on desktop)
  const mainLinks = [
    { path: '/', label: 'Home', color: 'teal' },
    { path: '/riff-generator', label: 'Riff Gen', color: 'teal' },
    { path: '/fretvision', label: 'Fretboard', color: 'teal' },
    { path: '/tabplayer', label: 'Tab Player', color: 'orange' },
    { path: '/chords', label: 'Chords', color: 'teal' },
    { path: '/about', label: 'About', color: 'teal' },
  ];

  // "More" dropdown links
  const moreLinks = [
    { path: '/tuner', label: 'Tuner', color: 'orange' },
    { path: '/metronome', label: 'Metronome', color: 'orange' },
    { path: '/catalog', label: 'Catalog', color: 'teal' },
    { path: '/scales', label: 'Scales', color: 'teal' },
    { path: '/backing', label: 'Backing', color: 'orange' },
    { path: '/ear-training', label: 'Ear Training', color: 'orange' },
    { path: '/pricing', label: 'Pricing', color: 'teal' },
  ];

  // All links for mobile menu
  const allLinks = [...mainLinks, ...moreLinks];

  // Check if current path is in "More" section
  const isMoreActive = moreLinks.some(link => location.pathname === link.path);

  const activeColors = {
    teal: 'nav-link-active-teal',
    orange: 'nav-link-active-orange',
  };

  const hoverColors = {
    teal: 'nav-link-teal',
    orange: 'nav-link-orange',
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMoreDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar-elite sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand - Always links to home */}
          <Link to="/" className="navbar-logo flex items-center min-h-[44px]">
            <div className="text-xl font-bold bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
              FretVision
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Main Links */}
            {mainLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    nav-link px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap
                    ${isActive ? activeColors[link.color] : hoverColors[link.color]}
                  `}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* More Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`
                  nav-link px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1
                  ${isMoreActive ? 'nav-link-active-teal' : 'nav-link-teal'}
                `}
              >
                More
                <svg
                  className={`w-4 h-4 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {moreDropdownOpen && (
                <div className="more-dropdown absolute right-0 mt-2 w-48 py-2 rounded-lg shadow-xl">
                  {moreLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`
                          dropdown-link block px-4 py-2 text-sm
                          ${isActive ? 'dropdown-link-active' : ''}
                        `}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn lg:hidden p-2 rounded-md text-gray-400 hover:text-white focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center"
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
          <div className="mobile-menu lg:hidden pb-4">
            <div className="grid grid-cols-3 gap-2">
              {allLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      mobile-nav-link px-3 py-3 rounded-md text-center text-sm font-medium
                      ${isActive ? activeColors[link.color] : hoverColors[link.color]}
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
