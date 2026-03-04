import { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SubPageFooter from '../components/SubPageFooter.jsx';
import { LOUISVILLE_CATEGORIES, CATEGORY_ORDER } from '../data/louisville-pages.js';
import portfolioData from '../../public/portfolio-urls.json';

// Preview filename overrides where slug != filename
const PREVIEW_OVERRIDES = {
  'cottage-cafe-eight': 'cottagecafe',
  'jw-cafe-bakery': 'jwcafe',
  'headliners-louisville': 'headliners-music-hall',
  'fableandflows': 'fableflow',
  'camp-j-lovat': 'camp-j',
  'rejuvenation-med-spa': 'rejuvenation',
  'credit-union-template-demo': 'credit-union-template',
};

function getPreviewPath(url) {
  const slug = url.replace('https://', '').replace('.vercel.app', '');
  const filename = PREVIEW_OVERRIDES[slug] || slug;
  return `/previews/${filename}.png`;
}

export default function LouisvilleCategory() {
  const { category } = useParams();
  const [visibleSections, setVisibleSections] = useState({});

  const cat = LOUISVILLE_CATEGORIES[category];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  useEffect(() => {
    setVisibleSections({});
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
    const timer = setTimeout(() => {
      document.querySelectorAll('section[id]').forEach((section) => observer.observe(section));
    }, 100);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [category]);

  if (!cat) return <Navigate to="/louisville" replace />;

  const sites = portfolioData.louisvilleBusinesses[cat.dataKey] || [];
  const relatedCategories = cat.relatedKeys
    .map((key) => LOUISVILLE_CATEGORIES[key])
    .filter(Boolean);
  const otherCategories = CATEGORY_ORDER
    .filter((slug) => slug !== category && !cat.relatedKeys.includes(slug))
    .map((slug) => LOUISVILLE_CATEGORIES[slug]);

  const sectionClass = (id) =>
    `transition-all duration-700 ${visibleSections[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Helmet>
        <title>{cat.title}</title>
        <meta name="description" content={cat.metaDescription} />
        <link rel="canonical" href={`https://projectlavos.com/louisville/${cat.slug}`} />
        <meta property="og:title" content={cat.title} />
        <meta property="og:description" content={cat.metaDescription} />
        <meta property="og:url" content={`https://projectlavos.com/louisville/${cat.slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://projectlavos.com/og-image.png" />
      </Helmet>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-6 pt-8">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li><Link to="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/louisville" className="hover:text-teal-400 transition-colors">Louisville</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-slate-300" aria-current="page">{cat.displayName}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section id="hero" className={`max-w-5xl mx-auto px-6 pt-12 pb-12 ${sectionClass('hero')}`}>
        <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl text-white tracking-[-0.02em] mb-4">
          {cat.h1}
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl">
          {cat.proof.count} deployed demo sites for real Louisville {cat.displayName.toLowerCase()} businesses.
          Every site is live -- click any one and see it working.
        </p>
      </section>

      {/* Proof Grid */}
      <section id="proof" className={`max-w-5xl mx-auto px-6 pb-16 ${sectionClass('proof')}`}>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
          Louisville {cat.displayName} Sites We&apos;ve Built
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sites.map((site) => (
            <a
              key={site.url}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-slate-800 overflow-hidden relative">
                <img
                  src={getPreviewPath(site.url)}
                  alt={`${site.name} website preview`}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div className="absolute inset-0 items-center justify-center bg-slate-800 hidden">
                  <span className="text-slate-500 text-sm">{site.name}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 right-3 bg-teal-500/90 text-white text-xs font-medium px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Visit Live Site
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white group-hover:text-teal-400 transition-colors mb-1">
                  {site.name}
                </h3>
                <p className="text-sm text-slate-400 line-clamp-2">{site.description}</p>
                {site.neighborhood && site.neighborhood !== 'Louisville' && (
                  <p className="text-xs text-teal-500 mt-2">{site.neighborhood}</p>
                )}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* What You Get */}
      <section id="features" className={`max-w-5xl mx-auto px-6 pb-16 ${sectionClass('features')}`}>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
          What You Get With a Louisville {cat.displayName} Website
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cat.proof.features.map((feature) => (
            <div key={feature} className="flex items-start gap-3 bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
              <span className="text-teal-400 mt-0.5 shrink-0" aria-hidden="true">&#10003;</span>
              <span className="text-sm text-slate-300">{feature}</span>
            </div>
          ))}
          {[
            'Mobile-first responsive design',
            'SEO optimized for Louisville searches',
            'Google Analytics and speed insights',
            'Custom domain setup',
          ].map((feature) => (
            <div key={feature} className="flex items-start gap-3 bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
              <span className="text-teal-400 mt-0.5 shrink-0" aria-hidden="true">&#10003;</span>
              <span className="text-sm text-slate-300">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={`max-w-5xl mx-auto px-6 pb-16 ${sectionClass('faq')}`}>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
          {cat.displayName} Web Design Questions for Louisville Businesses
        </h2>
        <div className="space-y-4">
          {cat.faq.map(({ q, a }) => (
            <details key={q} className="bg-slate-800/50 border border-slate-700/50 rounded-xl group">
              <summary className="flex items-center justify-between p-5 cursor-pointer text-white font-medium hover:text-teal-400 transition-colors">
                <span>{q}</span>
                <span className="text-slate-500 group-open:rotate-45 transition-transform ml-4 shrink-0" aria-hidden="true">+</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">
                {a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Related Categories */}
      {relatedCategories.length > 0 && (
        <section id="related" className={`max-w-5xl mx-auto px-6 pb-12 ${sectionClass('related')}`}>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Related Louisville Services</h2>
          <div className="flex flex-wrap gap-3">
            {relatedCategories.map((rc) => (
              <Link
                key={rc.slug}
                to={`/louisville/${rc.slug}`}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-5 py-3 hover:border-teal-500/50 hover:text-teal-400 transition-all text-sm text-slate-300"
              >
                {rc.displayName} ({rc.proof.count} sites)
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Other Categories */}
      <section id="other" className={`max-w-5xl mx-auto px-6 pb-12 ${sectionClass('other')}`}>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Other Louisville Industries</h2>
        <div className="flex flex-wrap gap-3">
          {otherCategories.map((oc) => (
            <Link
              key={oc.slug}
              to={`/louisville/${oc.slug}`}
              className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 hover:border-teal-500/50 hover:text-teal-400 transition-all text-sm text-slate-300"
            >
              {oc.displayName}
            </Link>
          ))}
        </div>
      </section>

      {/* Neighborhoods */}
      <section id="neighborhoods" className={`max-w-5xl mx-auto px-6 pb-12 ${sectionClass('neighborhoods')}`}>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Louisville Neighborhoods We Cover</h2>
        <div className="flex flex-wrap gap-2">
          {portfolioData.neighborhoods.map((n) => (
            <span key={n} className="bg-slate-800/50 border border-slate-700/50 rounded-full px-3 py-1.5 text-xs text-slate-400">
              {n}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className={`max-w-5xl mx-auto px-6 pb-20 ${sectionClass('cta')}`}>
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-2xl p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Get a {cat.displayName} Website for Your Louisville Business
          </h2>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            See what we&apos;ve built above. Ready to talk about yours? No commitment, no pressure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg transition-colors"
            >
              View Pricing
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
