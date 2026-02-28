import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/blog', label: 'Articles' },
  { to: '/guitar', label: 'Guitar Library' },
  { to: '/manifesto', label: 'Manifesto' },
];

export default function SubPageFooter() {
  const { pathname } = useLocation();

  return (
    <footer className="relative z-10 border-t border-slate-800/50 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <nav aria-label="Site navigation" className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
          {navLinks.map(({ to, label }) =>
            pathname === to ? (
              <span key={to} className="text-slate-500 text-sm" aria-current="page">{label}</span>
            ) : (
              <Link key={to} to={to} className="text-slate-400 hover:text-teal-400 text-sm transition-colors">{label}</Link>
            )
          )}
        </nav>
        <p className="text-slate-500 text-sm text-center">
          &copy; {new Date().getFullYear()} Matthew Scott &middot;{' '}
          <a href="mailto:matthewdscott7@gmail.com" className="hover:text-teal-400 transition-colors">matthewdscott7@gmail.com</a>
        </p>
      </div>
    </footer>
  );
}
