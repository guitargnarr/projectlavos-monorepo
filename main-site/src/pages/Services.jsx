import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

export default function Services() {
  const [visibleSections, setVisibleSections] = useState({});
  const [showContactModal, setShowContactModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '', intent: '' });
  const [formStatus, setFormStatus] = useState('idle');

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

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const offerings = [
    {
      category: 'Digital Presence',
      tagline: 'Your phone rings while you sleep.',
      problem: 'You have no website, or a bad one. Leads find your competitors instead of you. You\'re invisible online.',
      solution: 'I build you a complete digital system -- website, SEO, ads, analytics, ongoing management -- and hand you a working machine that generates leads without your involvement.',
      alternative: 'Agencies charge $8,000/month for worse results. Most small businesses pay $3,000-$5,000 just for a website that doesn\'t convert.',
      rates: [
        { name: 'Build', price: '$3,500 - $7,500', note: 'Website + SEO + analytics + deployment' },
        { name: 'Managed', price: '$1,500 - $3,000/mo', note: 'Maintenance, SEO, ad management, reporting' },
      ],
    },
    {
      category: 'Data & Intelligence',
      tagline: 'Turn your data into a list of who to call first.',
      problem: 'You have data you can\'t use. Customer lists, market information, federal datasets -- sitting in spreadsheets, producing nothing.',
      solution: 'I take messy data and turn it into a targeting strategy that tells you exactly which customers to pursue, why, ranked and scored, with the evidence to back it up. I mine public data, build knowledge graphs, and produce interactive dashboards that surface the relationships and momentum signals that matter.',
      alternative: 'Data consulting firms charge $150-$300/hour with month-long discovery phases. You need answers, not a statement of work.',
      caseStudy: {
        title: 'Metalcore Index',
        description: '75 artists scored from 7 real data sources (Wikipedia, Deezer, Reddit, Kworb, AudioDB). 726 relationship edges. Knowledge graph with interactive network visualization. Built for a guitar brand to identify unsigned artists with momentum.',
        url: 'https://metalcore-index.vercel.app',
        repoUrl: 'https://github.com/guitargnarr/heavy-music-research',
      },
      rates: [
        { name: 'Intelligence Engagement', price: '$5,000 - $15,000', note: 'Dataset analysis, targeting, scoring, strategic reporting' },
        { name: 'Market Report', price: '$3,000 - $7,500', note: 'Competitive analysis, opportunity identification' },
        { name: 'Knowledge Graph + Dashboard', price: '$7,500 - $15,000', note: 'Define universe, mine public data, build relationship graph, score entities, interactive dashboard' },
        { name: 'Executive Analytics', price: '$5,000 - $10,000 build + $1,500/mo', note: 'KPI/OKR systems, performance dashboards' },
      ],
    },
    {
      category: 'Operations & Compliance',
      tagline: 'The penalties stop.',
      problem: 'Your regulatory obligations are complex. Your teams don\'t follow the workflows. Your KPIs are scattered across five dashboards that nobody checks.',
      solution: 'I translate regulatory requirements into workflows people actually follow, and build measurement systems that tell you whether you\'re winning or losing. I did this for 5.8 million enrollees across 15 departments for a decade at a Fortune 50 healthcare company. Zero compliance penalties. Took a performance metric from 70% to 96%.',
      alternative: 'One compliance failure costs more than a year of consulting. One missed KPI cycle costs you the quarter.',
      rates: [
        { name: 'Consulting', price: '$175/hour', note: 'Regulatory translation, workflow design, KPI systems' },
        { name: 'Engagement', price: '$10,000+', note: 'Scoped project with defined deliverables' },
      ],
    },
    {
      category: 'AI Infrastructure',
      tagline: 'Operate like a team of ten.',
      problem: 'You\'ve heard AI can help but you don\'t trust it. Or you trust it too much and it\'s producing garbage. Either way, you\'re not getting value.',
      solution: 'I don\'t sell you AI. I build the governance and workflow systems that make AI reliable enough to trust with real work. The infrastructure that lets a small team produce at a scale that shouldn\'t be possible.',
      alternative: 'AI consultants sell you demos. I build you systems with guardrails, verification, and repeatable results.',
      rates: [
        { name: 'Infrastructure Design', price: '$200/hour', note: 'Governance systems, orchestration, workflow automation' },
        { name: 'Scoped Project', price: 'Custom', note: 'Based on complexity and integration depth' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      <Helmet>
        <title>Services & Pricing | Project Lavos</title>
        <meta name="description" content="Web development, data intelligence, compliance consulting, and AI infrastructure. Outcome-based pricing. No agencies, no committees, no guesswork." />
        <link rel="canonical" href="https://projectlavos.com/services" />
        <meta property="og:title" content="Services & Pricing | Project Lavos" />
        <meta property="og:description" content="I solve problems. Website that generates leads, data that tells you who to call, compliance that sticks, AI that works. Here's what it costs." />
        <meta property="og:url" content="https://projectlavos.com/services" />
        <meta property="og:type" content="website" />
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
          <h1 className="heading-display text-4xl md:text-6xl lg:text-7xl mb-6 animate-fade-in-up tracking-[-0.02em]">
            <span className="gradient-text">What I</span>
            <br />
            <span className="text-white">Solve</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-400 animate-fade-in-up delay-200">
            Outcomes, not services. Results, not <span className="accent-italic">hours</span>.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 md:px-12 py-20">

        {/* The Spec-Build Pitch */}
        <section
          id="approach"
          className={`mb-24 transition-all duration-700 ${visibleSections.approach ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-10 md:p-16 border border-slate-700/50 section-glow">
            <h2 className="heading-display text-3xl sm:text-4xl md:text-5xl text-white mb-6 tracking-[-0.02em]">How It Starts</h2>
            <p className="heading-display text-xl sm:text-2xl md:text-3xl text-slate-300 mb-6 leading-relaxed tracking-[-0.01em]">
              You describe the problem. I show you the <span className="accent-italic text-teal-400">solution</span>.
            </p>
            <p className="text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed mb-4">
              For websites, I build it before the first conversation -- your name on it, running live. For data and consulting work, I start with a scoped deliverable that proves the approach before you commit to more. No pitch decks. No six-month discovery phases.
            </p>
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed">
              The conversation is always about something real, not something imagined. If it's not what you need, you've spent nothing. If it is, we're already ahead.
            </p>
          </div>
        </section>

        {/* Offerings */}
        {offerings.map((offering, index) => (
          <section
            key={offering.category}
            id={`offering-${index}`}
            className={`mb-20 transition-all duration-700 delay-${(index + 1) * 100} ${visibleSections[`offering-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {/* Category Header */}
            <h2 className="heading-display text-3xl sm:text-4xl md:text-5xl text-teal-400 mb-4 flex items-center gap-4 tracking-[-0.02em]">
              <span className="w-10 h-[2px] bg-gradient-to-r from-teal-400 to-transparent" />
              {offering.category}
            </h2>
            <p className="heading-display text-xl sm:text-2xl text-white mb-10 tracking-[-0.01em]">
              {offering.tagline}
            </p>

            {/* Problem / Solution */}
            <div className="grid md:grid-cols-2 gap-10 mb-10">
              <div>
                <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-3">The Problem</h3>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                  {offering.problem}
                </p>
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-widest text-teal-500 mb-3">What I Do</h3>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                  {offering.solution}
                </p>
              </div>
            </div>

            {/* Alternative Cost */}
            <p className="text-slate-500 text-sm sm:text-base italic mb-8 border-l-2 border-slate-700 pl-6">
              {offering.alternative}
            </p>

            {/* Case Study (if present) */}
            {offering.caseStudy && (
              <div className="mb-10 bg-slate-800/60 rounded-xl border border-teal-500/30 p-6 sm:p-8">
                <h3 className="text-sm uppercase tracking-widest text-teal-500 mb-3">Live Example</h3>
                <p className="heading-display text-lg sm:text-xl text-white mb-2 tracking-[-0.01em]">
                  {offering.caseStudy.title}
                </p>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-4">
                  {offering.caseStudy.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={offering.caseStudy.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 border border-teal-500/40 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    View Dashboard &rarr;
                  </a>
                  {offering.caseStudy.repoUrl && (
                    <a
                      href={offering.caseStudy.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-slate-400 hover:text-white border border-slate-600 hover:border-slate-500 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Rate Card */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              {offering.rates.map((rate, rateIndex) => (
                <div
                  key={rate.name}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 ${rateIndex > 0 ? 'border-t border-slate-700/50' : ''}`}
                >
                  <div className="mb-2 sm:mb-0">
                    <span className="text-white font-semibold">{rate.name}</span>
                    <span className="text-slate-500 text-sm ml-3">{rate.note}</span>
                  </div>
                  <span className="heading-display text-xl sm:text-2xl text-teal-400 tracking-[-0.01em]">
                    {rate.price}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Rapid POC */}
        <section
          id="poc"
          className={`mb-20 transition-all duration-700 ${visibleSections.poc ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="heading-display text-3xl sm:text-4xl md:text-5xl text-teal-400 mb-4 flex items-center gap-4 tracking-[-0.02em]">
            <span className="w-10 h-[2px] bg-gradient-to-r from-teal-400 to-transparent" />
            Rapid Proof of Concept
          </h2>
          <p className="heading-display text-xl sm:text-2xl text-white mb-10 tracking-[-0.01em]">
            See it working before you commit.
          </p>
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5">
              <div>
                <span className="text-white font-semibold">Spec-Build Prototype</span>
                <span className="text-slate-500 text-sm ml-3">Working prototype before the first dollar</span>
              </div>
              <span className="heading-display text-xl sm:text-2xl text-teal-400 tracking-[-0.01em] mt-2 sm:mt-0">
                $2,500 - $5,000
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 border-t border-slate-700/50">
              <div>
                <span className="text-white font-semibold">Content & Documentation Systems</span>
                <span className="text-slate-500 text-sm ml-3">Technical docs, proposals, report pipelines</span>
              </div>
              <span className="heading-display text-xl sm:text-2xl text-teal-400 tracking-[-0.01em] mt-2 sm:mt-0">
                $2,000 - $5,000
              </span>
            </div>
          </div>
        </section>

        {/* The Proof */}
        <section
          id="proof"
          className={`mb-20 transition-all duration-700 ${visibleSections.proof ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-10 md:p-16 border border-slate-700/50 section-glow">
            <h2 className="heading-display text-3xl sm:text-4xl md:text-5xl text-white mb-6 tracking-[-0.02em]">The Proof</h2>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <span className="heading-display text-4xl sm:text-5xl md:text-6xl text-teal-400 tracking-[-0.02em]">69</span>
                <p className="text-slate-500 text-sm mt-2">sites deployed</p>
              </div>
              <div className="text-center">
                <span className="heading-display text-4xl sm:text-5xl md:text-6xl text-teal-400 tracking-[-0.02em]">10</span>
                <p className="text-slate-500 text-sm mt-2">years enterprise experience</p>
              </div>
            </div>
            <p className="text-slate-400 text-center text-base sm:text-lg mb-4">
              Every site is live. Every URL works. <a href="/" className="text-teal-400 hover:text-teal-300 transition-colors">See them all</a>.
            </p>
            <p className="text-slate-500 text-center text-sm">
              One person. Not an agency with overhead. Not a freelancer who disappears. A system built to deliver at scale.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className={`border-t border-slate-800/50 pt-16 text-center transition-all duration-700 ${visibleSections.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="heading-display text-3xl sm:text-4xl md:text-5xl text-white mb-4 tracking-[-0.02em]">
            Let's <span className="accent-italic">Start</span>
          </h2>
          <p className="text-slate-400 mb-3 text-lg sm:text-xl">
            Tell me the problem. I'll tell you if I can solve it.
          </p>
          <p className="text-slate-500 mb-12 text-base sm:text-lg">
            No sales pitch. No pressure. Just a conversation about what you need.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <a
              href="mailto:matthewdscott7@gmail.com"
              className="text-white hover:text-teal-400 transition-colors heading-display text-lg sm:text-xl tracking-[-0.01em]"
            >
              matthewdscott7@gmail.com
            </a>
            <span className="hidden sm:inline text-slate-600">&middot;</span>
            <a
              href="tel:+15023450525"
              className="text-white hover:text-teal-400 transition-colors heading-display text-lg sm:text-xl tracking-[-0.01em]"
            >
              (502) 345-0525
            </a>
          </div>
          <button
            onClick={() => setShowContactModal(true)}
            className="inline-block bg-teal-500 hover:bg-teal-400 text-white font-semibold px-10 py-4 rounded-xl transition-all duration-300 btn-elite shadow-lg shadow-teal-500/25 cursor-pointer"
          >
            Or Send a Message
          </button>

          {/* Footer Nav */}
          <nav className="mt-16 flex items-center justify-center gap-4 heading-display text-base md:text-lg tracking-[-0.01em]">
            <a href="/" className="text-slate-400 hover:text-teal-400 transition-colors">Portfolio</a>
            <span className="text-slate-600">&middot;</span>
            <a href="/manifesto" className="text-slate-400 hover:text-amber-500 transition-colors">
              The <span className="accent-italic">Manifesto</span>
            </a>
            <span className="text-slate-600">&middot;</span>
            <a href="/blog" className="text-slate-400 hover:text-teal-400 transition-colors">Articles</a>
          </nav>

          <p className="text-slate-600 text-sm mt-12">
            Matthew Scott &middot; Louisville, KY &middot; Project Lavos LLC
          </p>
        </section>
      </main>

      {/* Contact Modal */}
      {showContactModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowContactModal(false)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative bg-slate-900 border border-slate-700 rounded-2xl p-8 md:p-10 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors text-2xl leading-none"
            >
              &times;
            </button>

            <h3 className="heading-display text-2xl sm:text-3xl text-white mb-2 tracking-[-0.01em]">
              Get in Touch
            </h3>
            <p className="text-slate-400 mb-6">
              Direct line. No gatekeepers.
            </p>

            {formStatus === 'sent' ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4 text-teal-400">&#10003;</div>
                <p className="heading-display text-2xl text-white mb-3">Message received.</p>
                <p className="text-slate-400 mb-6">I'll respond within 24 hours.</p>
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setFormStatus('idle');
                    setFormData({ name: '', email: '', message: '', intent: '' });
                  }}
                  className="mt-4 text-slate-600 hover:text-white transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            ) : formStatus === 'error' ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">&#10007;</div>
                <p className="heading-display text-xl text-red-400 mb-2">Something went wrong</p>
                <p className="text-slate-400 text-sm mb-4">Please try again or email directly.</p>
                <a href="mailto:matthewdscott7@gmail.com" className="text-teal-400 hover:text-teal-300 transition-colors block mb-4">
                  matthewdscott7@gmail.com
                </a>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="text-teal-400 hover:text-teal-300 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setFormStatus('sending');
                  try {
                    const formDataObj = new FormData();
                    formDataObj.append('access_key', 'db9cfad8-9fa4-4168-99af-e03cbf8014f2');
                    formDataObj.append('name', formData.name);
                    formDataObj.append('email', formData.email);
                    formDataObj.append('message', formData.message);
                    if (formData.intent) {
                      formDataObj.append('intent', formData.intent);
                    }
                    const intentLabel = formData.intent ? ` [${formData.intent.toUpperCase()}]` : '';
                    formDataObj.append('subject', `${formData.name} - Services inquiry${intentLabel}`);
                    formDataObj.append('from_name', 'projectlavos.com/services');
                    formDataObj.append('replyto', formData.email);
                    formDataObj.append('botcheck', '');

                    const response = await fetch('https://api.web3forms.com/submit', {
                      method: 'POST',
                      body: formDataObj,
                    });
                    const data = await response.json();
                    if (data.success) {
                      setFormStatus('sent');
                      setFormData({ name: '', email: '', message: '', intent: '' });
                    } else {
                      setFormStatus('error');
                    }
                  } catch {
                    setFormStatus('error');
                  }
                }}
                className="space-y-5"
              >
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                <div>
                  <label className="block text-slate-400 text-sm mb-3">What are you looking for?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'website', label: 'Website' },
                      { value: 'data', label: 'Data / Analytics' },
                      { value: 'consulting', label: 'Consulting' },
                      { value: 'other', label: 'Other' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, intent: option.value })}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          formData.intent === option.value
                            ? 'bg-teal-500/20 border-teal-500 text-teal-400 border'
                            : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none transition-colors"
                      placeholder="jane@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-sm mb-2">What's the problem you're trying to solve?</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none transition-colors resize-none"
                    placeholder="I need..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-teal-600 disabled:cursor-wait text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/25"
                >
                  {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
