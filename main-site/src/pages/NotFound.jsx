import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-6">
      <Helmet>
        <title>Page Not Found | Project Lavos</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="text-center max-w-md">
        <p className="text-teal-400 text-sm tracking-[0.15em] uppercase mb-4">404</p>
        <h1 className="heading-display text-4xl md:text-5xl text-white mb-4 tracking-[-0.02em]">
          Page Not Found
        </h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors text-sm tracking-[0.1em] uppercase"
        >
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
