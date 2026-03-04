import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SubPageFooter from '../components/SubPageFooter.jsx';
import { LOUISVILLE_CATEGORIES, CATEGORY_ORDER, LOUISVILLE_STATS } from '../data/louisville-pages.js';
import portfolioData from '../../public/portfolio-urls.json';

const CATEGORY_ACCENTS = {
  healthcare: 'border-t-teal-500/50',
  dental: 'border-t-teal-400/50',
  restaurants: 'border-t-orange-500/50',
  'beauty-wellness': 'border-t-pink-400/50',
  'legal-finance': 'border-t-amber-500/50',
  retail: 'border-t-violet-400/50',
  services: 'border-t-sky-400/50',
  'real-estate': 'border-t-emerald-400/50',
  'community-education': 'border-t-indigo-400/50',
};

export default function Louisville() {
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    document.querySelectorAll('section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const sectionClass = (id) =>
    `transition-all duration-700 ${visibleSections[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;

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

      <Helmet>
        <title>Louisville Web Development | 66 Demo Sites | Matthew Scott</title>
        <meta name="description" content="Louisville web developer with 66 deployed demo websites for real local businesses across healthcare, restaurants, legal, retail, beauty, and services. 12 neighborhoods covered. React, mobile-first, SEO-ready." />
        <link rel="canonical" href="https://projectlavos.com/louisville" />
        <meta property="og:title" content="Louisville Web Development | 66 Demo Sites | Matthew Scott" />
        <meta property="og:description" content="Louisville web developer with 66 deployed demo websites for real local businesses. Healthcare, restaurants, legal, retail, beauty, services. 12 neighborhoods." />
        <meta property="og:url" content="https://projectlavos.com/louisville" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://projectlavos.com/og-image.png" />
      </Helmet>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="relative z-10 max-w-5xl mx-auto px-6 pt-8">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li><Link to="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-slate-300" aria-current="page">Louisville</li>
        </ol>
      </nav>

      {/* Hero */}
      <section id="hero" className={`relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-16 text-center ${sectionClass('hero')}`}>
        <span className="eyebrow-label text-teal-500 block mb-4">Louisville, Kentucky</span>
        <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl text-white tracking-[-0.02em] mb-0">
          Louisville Web Development
        </h1>
        <div className="w-16 h-[2px] bg-gradient-to-r from-teal-500 to-teal-400 mx-auto mt-4 mb-6" />
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          {LOUISVILLE_STATS.totalSites} demo sites for{' '}
          <span className="accent-italic">real Louisville businesses</span>.{' '}
          {LOUISVILLE_STATS.neighborhoods} neighborhoods. {LOUISVILLE_STATS.categories} industries.
          Every site deployed, live, and clickable.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
          {[
            { value: LOUISVILLE_STATS.totalSites, label: 'Deployed Sites' },
            { value: LOUISVILLE_STATS.neighborhoods, label: 'Neighborhoods' },
            { value: LOUISVILLE_STATS.categories, label: 'Industries' },
            { value: LOUISVILLE_STATS.tierTemplates, label: 'Tier Templates' },
          ].map(({ value, label }) => (
            <div key={label} className="card-glass-elite rounded-xl p-4 border-t-2 border-t-teal-500/50">
              <div className="text-2xl sm:text-3xl font-bold text-teal-400">{value}</div>
              <div className="text-sm text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Grid */}
      <section id="categories" className={`relative z-10 max-w-5xl mx-auto px-6 pb-16 ${sectionClass('categories')}`}>
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-teal-500" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Browse by Industry</h2>
          <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-teal-500" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORY_ORDER.map((slug, i) => {
            const cat = LOUISVILLE_CATEGORIES[slug];
            const sites = portfolioData.louisvilleBusinesses[cat.dataKey] || [];
            const staggerClass = visibleSections['categories'] ? `section-stagger-${(i % 3) + 1}` : '';
            return (
              <Link
                key={slug}
                to={`/louisville/${slug}`}
                className={`group card-glass-elite rounded-xl p-6 border-t-2 ${CATEGORY_ACCENTS[slug] || 'border-t-teal-500/50'} hover:scale-[1.02] hover:shadow-[0_0_30px_-10px_rgba(20,184,166,0.15)] transition-all duration-300 ${staggerClass}`}
              >
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white group-hover:text-teal-400 transition-colors">
                    {cat.displayName}
                  </h3>
                  <span className="text-sm text-teal-400 font-mono">{sites.length}</span>
                </div>
                <p className="text-sm text-slate-400 mb-3">{cat.subtitle}</p>
                <div className="text-xs text-slate-500">
                  {sites.slice(0, 3).map((s) => s.name).join(', ')}
                  {sites.length > 3 && ` +${sites.length - 3} more`}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Neighborhoods */}
      <section id="neighborhoods" className={`relative z-10 max-w-5xl mx-auto px-6 pb-16 ${sectionClass('neighborhoods')}`}>
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-teal-500" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Louisville Neighborhoods We Cover</h2>
          <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-teal-500" />
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {portfolioData.neighborhoods.map((n) => (
            <span key={n} className="card-glass-elite rounded-full px-4 py-2 text-sm text-slate-300">
              {n}
            </span>
          ))}
        </div>
      </section>

      {/* Why Us */}
      <section id="why" className={`relative z-10 max-w-5xl mx-auto px-6 pb-16 ${sectionClass('why')}`}>
        <span className="eyebrow-label text-teal-500 block text-center mb-3">Why Project Lavos</span>
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-teal-500" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Why Louisville Businesses Choose Project Lavos
          </h2>
          <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-teal-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Real Proof, Not Promises',
              desc: <>{LOUISVILLE_STATS.totalSites} demo sites for real Louisville businesses. Click any one and see it <span className="accent-italic">live</span>. No stock mockups, no &quot;coming soon.&quot;</>,
            },
            {
              title: 'Actually From Louisville',
              desc: <>Based in Louisville, KY 40216. Not a remote agency pretending to serve Louisville with a <span className="accent-italic">geo-targeted landing page</span>.</>,
            },
            {
              title: 'AI-Enabled Solo Developer',
              desc: <>You work with <span className="accent-italic">one person</span> from start to finish. AI collaboration tools let me build at agency speed without agency overhead or pricing.</>,
            },
          ].map(({ title, desc }) => (
            <div key={title} className="card-glass-elite rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className={`relative z-10 max-w-5xl mx-auto px-6 pb-20 text-center ${sectionClass('cta')}`}>
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-2xl p-10 shadow-[0_0_40px_-10px_rgba(20,184,166,0.2)]">
          <h2 className="heading-display text-2xl sm:text-3xl text-white mb-4">
            Ready to See What Your Louisville Business Could Look Like?
          </h2>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            Browse an industry above, or reach out directly. No commitment -- just a conversation about what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="btn-elite inline-flex items-center justify-center px-6 py-3"
            >
              View Services & Pricing
            </Link>
            <a
              href="mailto:matthewdscott7@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 border border-slate-600 hover:border-teal-500 text-slate-300 hover:text-white font-semibold rounded-lg transition-colors"
            >
              matthewdscott7@gmail.com
            </a>
          </div>
        </div>
      </section>

      <SubPageFooter />
    </div>
  );
}
