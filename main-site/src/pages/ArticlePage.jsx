import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { articles } from '../data/articles.js';
import SubPageFooter from '../components/SubPageFooter.jsx';

export default function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find(a => a.id === slug);
  const [currentPage, setCurrentPage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState({});
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalPages = article ? article.pages.length : 0;

  const goToPage = useCallback((page) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page);
  }, [totalPages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToPage(currentPage + 1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToPage(currentPage - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, goToPage]);

  // Preload adjacent pages
  useEffect(() => {
    if (!article) return;
    [currentPage - 1, currentPage + 1].forEach(i => {
      if (i >= 0 && i < totalPages) {
        const img = new Image();
        img.src = article.pages[i];
      }
    });
  }, [currentPage, totalPages, article]);

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToPage(currentPage + 1);
      else goToPage(currentPage - 1);
    }
    setTouchStart(null);
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <Helmet>
          <title>Article Not Found | Project Lavos</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="text-center">
          <h1 className="text-2xl mb-4">Article not found</h1>
          <Link to="/blog" className="text-teal-400 hover:text-teal-300 transition-colors">
            &larr; Back to articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      <Helmet>
        <title>{article.title} | {article.subtitle} | Project Lavos</title>
        <meta name="description" content={article.description} />
        <link rel="canonical" href={`https://projectlavos.com/blog/${article.id}`} />
        <meta property="og:title" content={`${article.title} | ${article.subtitle}`} />
        <meta property="og:description" content={article.description} />
        <meta property="og:url" content={`https://projectlavos.com/blog/${article.id}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`https://projectlavos.com${article.coverImage}`} />
        <meta property="og:image:alt" content={`${article.title} — ${article.subtitle}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Project Lavos" />
        <meta property="article:published_time" content={article.dateISO} />
        <meta property="article:modified_time" content={article.dateISO} />
        <meta property="article:author" content="Matthew Scott" />
        <meta property="article:section" content="AI Development" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${article.title} | ${article.subtitle}`} />
        <meta name="twitter:description" content={article.description} />
        <meta name="twitter:image" content={`https://projectlavos.com${article.coverImage}`} />
        <meta name="twitter:image:alt" content={`${article.title} — ${article.subtitle}`} />
      </Helmet>

      {/* Ambient Background */}
      <div className="ambient-bg">
        <div className="orb-3" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link to="/blog" className="text-teal-400 hover:text-teal-300 transition-colors link-vintage">
            &larr; Articles
          </Link>
          <a
            href={article.pdfUrl}
            download
            className="text-slate-500 hover:text-teal-400 text-sm transition-colors"
          >
            Download PDF
          </a>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 text-center">
          <p className="text-teal-400 text-xs tracking-[0.15em] uppercase mb-4">{article.date}</p>
          <h1 className="heading-display text-3xl md:text-5xl text-white mb-4 tracking-[-0.02em]">
            {article.title}
          </h1>
          <p className="text-lg text-slate-400">{article.subtitle}</p>
        </div>
      </header>

      {/* Article Reader */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Page navigation */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-slate-600/50 transition-all duration-300 ${currentPage === 0 ? 'opacity-20 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:border-teal-400/50'}`}
            aria-label="Previous page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-slate-400 text-sm font-mono">{currentPage + 1} / {totalPages}</span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-slate-600/50 transition-all duration-300 ${currentPage === totalPages - 1 ? 'opacity-20 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:border-teal-400/50'}`}
            aria-label="Next page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Page image */}
        <div
          className="max-w-3xl mx-auto"
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
                className={`w-full h-auto rounded-lg shadow-2xl shadow-black/50 ${imageLoaded[currentPage] ? 'block' : 'hidden'}`}
                draggable={false}
                onLoad={() => setImageLoaded(prev => ({ ...prev, [currentPage]: true }))}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-slate-600/50 transition-all duration-300 ${currentPage === 0 ? 'opacity-20 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:border-teal-400/50'}`}
            aria-label="Previous page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-slate-400 text-sm font-mono">{currentPage + 1} / {totalPages}</span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full border border-slate-600/50 transition-all duration-300 ${currentPage === totalPages - 1 ? 'opacity-20 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:border-teal-400/50'}`}
            aria-label="Next page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </main>

      {/* Footer */}
      <SubPageFooter />
    </div>
  );
}
