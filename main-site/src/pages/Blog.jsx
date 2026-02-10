import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const articles = [
  {
    id: 'verification-gap',
    title: 'The Verification Gap',
    subtitle: 'Why "Looks Right" Isn\'t "Works Right" When Using AI',
    author: 'Matthew Scott',
    date: 'February 2026',
    pageCount: 7,
    coverImage: '/articles/verification-gap/page-1.png',
    pdfUrl: '/articles/verification-gap/the-verification-gap.pdf',
    pages: Array.from({ length: 7 }, (_, i) => `/articles/verification-gap/page-${i + 1}.png`),
  },
];

function ArticleCard({ article, onClick }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      className="card-glass-elite rounded-xl overflow-hidden text-left group cursor-pointer w-full transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(20,184,166,0.2)]"
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-slate-900">
        {!loaded && (
          <div className="absolute inset-0 skeleton skeleton-loader" />
        )}
        <img
          src={article.coverImage}
          alt={`${article.title} cover`}
          className={`w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-5">
        <p className="text-teal-400 text-xs tracking-[0.15em] uppercase mb-2">{article.date}</p>
        <h3 className="heading-display text-xl text-white mb-2 tracking-[-0.01em] group-hover:text-teal-400 transition-colors duration-300">
          {article.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-3">{article.subtitle}</p>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{article.pageCount} pages</span>
          <span className="text-slate-700">|</span>
          <span>PDF Article</span>
        </div>
      </div>
    </button>
  );
}

function ArticleViewer({ article, onClose }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState({});
  const [touchStart, setTouchStart] = useState(null);
  const totalPages = article.pages.length;

  const goToPage = useCallback((page) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page);
  }, [totalPages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToPage(currentPage + 1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToPage(currentPage - 1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, goToPage, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Preload adjacent pages
  useEffect(() => {
    [currentPage - 1, currentPage + 1].forEach(i => {
      if (i >= 0 && i < totalPages) {
        const img = new Image();
        img.src = article.pages[i];
      }
    });
  }, [currentPage, totalPages, article.pages]);

  // Touch swipe handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToPage(currentPage + 1);
      else goToPage(currentPage - 1);
    }
    setTouchStart(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-60 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-slate-600/50 bg-slate-900/80 backdrop-blur-sm text-slate-400 hover:text-white hover:border-teal-400/50 transition-all duration-300 group"
          aria-label="Close article viewer"
        >
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Page counter */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 md:top-6 z-60 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 text-slate-400 text-sm font-mono">
          {currentPage + 1} / {totalPages}
        </div>

        {/* Left arrow */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0}
          className={`absolute left-2 md:left-6 z-60 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-slate-600/50 bg-slate-900/80 backdrop-blur-sm transition-all duration-300 ${currentPage === 0 ? 'opacity-20 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:border-teal-400/50'}`}
          aria-label="Previous page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right arrow */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className={`absolute right-2 md:right-6 z-60 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-slate-600/50 bg-slate-900/80 backdrop-blur-sm transition-all duration-300 ${currentPage === totalPages - 1 ? 'opacity-20 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:border-teal-400/50'}`}
          aria-label="Next page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Page image */}
        <div
          className="relative z-50 w-full max-w-4xl mx-auto px-14 md:px-24"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
            >
              {!imageLoaded[currentPage] && (
                <div className="w-full aspect-[17/22] rounded-lg bg-slate-800/50 animate-pulse" />
              )}
              <img
                src={article.pages[currentPage]}
                alt={`${article.title} - Page ${currentPage + 1}`}
                className={`w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl shadow-black/50 ${imageLoaded[currentPage] ? 'block' : 'hidden'}`}
                draggable={false}
                onLoad={() => setImageLoaded(prev => ({ ...prev, [currentPage]: true }))}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Download link */}
        <a
          href={article.pdfUrl}
          download
          className="absolute bottom-4 left-1/2 -translate-x-1/2 md:bottom-6 z-60 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 text-slate-500 hover:text-teal-400 hover:border-teal-400/50 text-xs transition-all duration-300"
        >
          Download PDF
        </a>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Blog() {
  const [visibleSections, setVisibleSections] = useState({});
  const [activeArticle, setActiveArticle] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Articles | Observations on AI Development | Project Lavos';
    const meta = {
      description: 'Articles on AI-assisted development, verification methodology, and what "working" actually means. By Matthew Scott, Louisville web developer.',
      'og:title': 'Articles | Observations on AI Development',
      'og:description': 'Articles on AI-assisted development, verification methodology, and software development philosophy.',
      'og:url': 'https://projectlavos.com/blog',
    };
    Object.entries(meta).forEach(([key, value]) => {
      const isOg = key.startsWith('og:');
      const selector = isOg ? `meta[property="${key}"]` : `meta[name="${key}"]`;
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', value);
    });
    return () => {
      document.title = 'Louisville Web Developer | Matthew Scott | React & Full-Stack Development';
    };
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Ambient Background */}
      <div className="ambient-bg">
        <div className="orb-3" />
      </div>
      <div className="particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
          <a href="/" className="text-teal-400 hover:text-teal-300 transition-colors link-vintage">
            &larr; Back
          </a>
          <span className="text-slate-500 text-sm">projectlavos.com</span>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
          <h1 className="heading-display text-4xl md:text-6xl text-white mb-6 animate-fade-in-up tracking-[-0.02em]">
            Articles
          </h1>
          <p className="text-lg md:text-xl text-slate-400 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            Observations on building with AI, <span className="accent-italic">verified</span>.
          </p>
        </div>
      </header>

      {/* Article Grid */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <section
          id="articles"
          className={`transition-all duration-700 ${visibleSections.articles ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => setActiveArticle(article)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Matthew Scott
          </p>
        </div>
      </footer>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {activeArticle && (
          <ArticleViewer
            article={activeArticle}
            onClose={() => setActiveArticle(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
