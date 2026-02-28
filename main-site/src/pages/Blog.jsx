import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles.js';
import SubPageFooter from '../components/SubPageFooter.jsx';

function ArticleCard({ article }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link
      to={`/blog/${article.id}`}
      className="card-glass-elite rounded-xl overflow-hidden text-left group cursor-pointer w-full block transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(20,184,166,0.2)]"
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
        <h2 className="heading-display text-xl text-white mb-2 tracking-[-0.01em] group-hover:text-teal-400 transition-colors duration-300">
          {article.title}
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-3">{article.subtitle}</p>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{article.pageCount} pages</span>
          <span className="text-slate-700">|</span>
          <span>PDF Article</span>
        </div>
      </div>
    </Link>
  );
}

export default function Blog() {
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
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
      <Helmet>
        <title>Articles | Observations on AI Development | Project Lavos</title>
        <meta name="description" content="Articles on AI-assisted development, verification methodology, and what 'working' actually means. By Matthew Scott, Louisville web developer." />
        <link rel="canonical" href="https://projectlavos.com/blog" />
        <meta property="og:title" content="Articles | Observations on AI Development" />
        <meta property="og:description" content="Articles on AI-assisted development, verification methodology, and software development philosophy." />
        <meta property="og:url" content="https://projectlavos.com/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Project Lavos" />
        <meta property="og:image" content="https://projectlavos.com/og-blog.png" />
        <meta property="og:image:alt" content="Beyond the Code — Articles on AI Development by Matthew Scott" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Articles | Observations on AI Development" />
        <meta name="twitter:description" content="Articles on AI-assisted development, verification methodology, and software development philosophy." />
        <meta name="twitter:image" content="https://projectlavos.com/og-blog.png" />
        <meta name="twitter:image:alt" content="Beyond the Code — Articles on AI Development by Matthew Scott" />
      </Helmet>
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
              />
            ))}
          </div>
        </section>
      </main>

      <SubPageFooter />

    </div>
  );
}
