import { useEffect, useState, useRef } from 'react';

export default function Manifesto() {
  const [visibleSections, setVisibleSections] = useState({});
  const [showContactModal, setShowContactModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '', intent: '' });
  const [formStatus, setFormStatus] = useState('idle'); // idle, sending, sent, error
  const heroRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'The Manifesto | Development Philosophy | Project Lavos';
    const meta = {
      description: 'Development philosophy: substance over flash, built to last, measure twice, people over tech. How Matthew Scott approaches web development and AI collaboration.',
      'og:title': 'The Manifesto | Development Philosophy',
      'og:description': 'Substance over flash, built to last, measure twice, people over tech. A development philosophy for the AI era.',
      'og:url': 'https://projectlavos.com/manifesto',
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
      {/* Ambient Background - Same as Homepage */}
      <div className="ambient-bg">
        <div className="orb-3" />
      </div>

      {/* Particles - Same as Homepage */}
      <div className="particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Hero Section */}
      <header ref={heroRef} className="relative z-10 border-b border-slate-800/50">
        {/* Navigation */}
        <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
          <a href="/" className="text-teal-400 hover:text-teal-300 transition-colors link-vintage">
            &larr; Back
          </a>
          <span className="text-slate-500 text-sm">projectlavos.com</span>
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
          <h1 className="heading-display text-4xl md:text-6xl lg:text-7xl mb-6 animate-fade-in-up tracking-[-0.02em]">
            <span className="gradient-text">What One Person</span>
            <br />
            <span className="text-white">Can Build</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-400 animate-fade-in-up delay-200">
            This is not a portfolio. It's <span className="accent-italic">proof</span>.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 md:px-12 py-20">

        {/* The Evidence */}
        <section
          id="evidence"
          className={`mb-20 transition-all duration-700 ${visibleSections.evidence ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="heading-display text-3xl sm:text-4xl md:text-5xl text-teal-400 mb-12 flex items-center gap-4 tracking-[-0.02em]">
            <span className="w-10 h-[2px] bg-gradient-to-r from-teal-400 to-transparent" />
            The Evidence
          </h2>
          <div className="space-y-10">
            <div className="flex items-baseline gap-6 group">
              <span className="heading-display text-5xl sm:text-6xl md:text-7xl text-teal-400 tracking-[-0.02em] min-w-[100px] md:min-w-[140px]">51</span>
              <div className="border-l border-slate-700 pl-6 group-hover:border-teal-400/50 transition-colors">
                <p className="heading-display text-xl sm:text-2xl md:text-3xl text-white tracking-[-0.01em]">websites built for Louisville businesses</p>
                <p className="text-slate-500 text-sm sm:text-base md:text-lg mt-2">Live. Deployed. <span className="accent-italic">Working</span>.</p>
              </div>
            </div>
            <div className="flex items-baseline gap-6 group">
              <span className="heading-display text-5xl sm:text-6xl md:text-7xl text-teal-400 tracking-[-0.02em] min-w-[100px] md:min-w-[140px]">51</span>
              <div className="border-l border-slate-700 pl-6 group-hover:border-teal-400/50 transition-colors">
                <p className="heading-display text-xl sm:text-2xl md:text-3xl text-white tracking-[-0.01em]">AI models trained for specific domains</p>
                <p className="text-slate-500 text-sm sm:text-base md:text-lg mt-2">Career. Code. Guitar. <span className="accent-italic">Analysis</span>.</p>
              </div>
            </div>
            <div className="flex items-baseline gap-6 group">
              <span className="heading-display text-5xl sm:text-6xl md:text-7xl text-teal-400 tracking-[-0.02em] min-w-[100px] md:min-w-[140px]">96</span>
              <div className="border-l border-slate-700 pl-6 group-hover:border-teal-400/50 transition-colors">
                <p className="heading-display text-xl sm:text-2xl md:text-3xl text-white tracking-[-0.01em]">live URLs verified</p>
                <p className="text-slate-500 text-sm sm:text-base md:text-lg mt-2">All HTTP 200. <span className="accent-italic">Every one</span>.</p>
              </div>
            </div>
            <div className="flex items-baseline gap-6 group">
              <span className="heading-display text-5xl sm:text-6xl md:text-7xl text-orange-400 tracking-[-0.02em] min-w-[100px] md:min-w-[140px]">1</span>
              <div className="border-l border-slate-700 pl-6 group-hover:border-orange-400/50 transition-colors">
                <p className="heading-display text-xl sm:text-2xl md:text-3xl text-white tracking-[-0.01em]">person</p>
                <p className="text-slate-500 text-sm sm:text-base md:text-lg mt-2">With AI <span className="accent-italic">collaboration</span>.</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Scripts */}
        <section
          id="scripts"
          className={`mb-20 transition-all duration-700 delay-100 ${visibleSections.scripts ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid md:grid-cols-2 gap-16">
            <div className="transform md:-translate-x-4">
              <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl text-slate-500 mb-8 flex items-center gap-4 tracking-[-0.01em]">
                <span className="w-8 h-[2px] bg-slate-600" />
                The Old Script
              </h2>
              <ul className="space-y-5 text-slate-500">
                <li className="heading-display text-lg sm:text-xl md:text-2xl line-through opacity-50 tracking-[-0.01em]">Get credentials</li>
                <li className="heading-display text-lg sm:text-xl md:text-2xl line-through opacity-50 tracking-[-0.01em]">Ask permission</li>
                <li className="heading-display text-lg sm:text-xl md:text-2xl line-through opacity-50 tracking-[-0.01em]">Wait to be chosen</li>
                <li className="heading-display text-lg sm:text-xl md:text-2xl line-through opacity-50 tracking-[-0.01em]">Prove you belong</li>
              </ul>
            </div>
            <div className="transform md:translate-x-4">
              <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl text-teal-400 mb-8 flex items-center gap-4 tracking-[-0.01em]">
                <span className="w-8 h-[2px] bg-gradient-to-r from-teal-400 to-orange-400" />
                The New Script
              </h2>
              <ul className="space-y-5 text-white">
                <li className="heading-display text-lg sm:text-xl md:text-2xl flex items-center gap-4 tracking-[-0.01em]">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  Build <span className="accent-italic">it</span>
                </li>
                <li className="heading-display text-lg sm:text-xl md:text-2xl flex items-center gap-4 tracking-[-0.01em]">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  Ship <span className="accent-italic">it</span>
                </li>
                <li className="heading-display text-lg sm:text-xl md:text-2xl flex items-center gap-4 tracking-[-0.01em]">
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  Show the <span className="accent-italic">proof</span>
                </li>
                <li className="heading-display text-lg sm:text-xl md:text-2xl flex items-center gap-4 tracking-[-0.01em]">
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  Let them <span className="accent-italic">come</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* What This Proves */}
        <section
          id="proves"
          className={`mb-20 transition-all duration-700 delay-200 ${visibleSections.proves ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-10 md:p-16 border border-slate-700/50 section-glow">
            <h2 className="heading-display text-3xl sm:text-4xl md:text-5xl text-white mb-6 tracking-[-0.02em]">What This Proves</h2>
            <p className="heading-display text-xl sm:text-2xl md:text-3xl text-slate-300 mb-8 leading-relaxed tracking-[-0.01em]">
              A solo developer with AI collaboration can operate at <span className="accent-italic text-teal-400">agency scale</span>.
            </p>
            <p className="text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed">
              Not in theory. In <span className="accent-italic">production</span>. The systems are documented. The workflows are repeatable. The results are verifiable.
            </p>
          </div>
        </section>

        {/* The Method */}
        <section
          id="method"
          className={`mb-20 transition-all duration-700 delay-300 ${visibleSections.method ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="heading-display text-3xl sm:text-4xl md:text-5xl text-teal-400 mb-12 flex items-center gap-4 tracking-[-0.02em]">
            <span className="w-10 h-[2px] bg-gradient-to-r from-teal-400 to-transparent" />
            The Method
          </h2>
          <div className="space-y-10">
            <div className="border-l-2 border-teal-400 pl-8 py-3 transition-all duration-300 hover:border-orange-400 hover:pl-10">
              <h3 className="heading-display text-xl sm:text-2xl md:text-3xl text-white tracking-[-0.01em]">Parallel Development</h3>
              <p className="text-slate-400 text-sm sm:text-base md:text-lg mt-2">4 features <span className="accent-italic">simultaneously</span>, 100% success rate.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-8 py-3 transition-all duration-300 hover:border-orange-400 hover:pl-10">
              <h3 className="heading-display text-xl sm:text-2xl md:text-3xl text-white tracking-[-0.01em]">Ground Truth Verification</h3>
              <p className="text-slate-400 text-sm sm:text-base md:text-lg mt-2">Every claim <span className="accent-italic">tested</span>. Screenshots. HTTP checks. No interpretation without evidence.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-8 py-3 transition-all duration-300 hover:border-orange-400 hover:pl-10">
              <h3 className="heading-display text-xl sm:text-2xl md:text-3xl text-white tracking-[-0.01em]">Fix First</h3>
              <p className="text-slate-400 text-sm sm:text-base md:text-lg mt-2">Don't ask. <span className="accent-italic">Fix</span>. Show the fix working.</p>
            </div>
            <div className="border-l-2 border-teal-400 pl-8 py-3 transition-all duration-300 hover:border-orange-400 hover:pl-10">
              <h3 className="heading-display text-xl sm:text-2xl md:text-3xl text-white tracking-[-0.01em]">Trust the Filter</h3>
              <p className="text-slate-400 text-sm sm:text-base md:text-lg mt-2">The right people recognize <span className="accent-italic">real</span> work. Everyone else is noise.</p>
            </div>
          </div>
        </section>

        {/* What I'm Showing */}
        <section
          id="showing"
          className={`mb-20 transition-all duration-700 delay-400 ${visibleSections.showing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl text-slate-500 mb-8 tracking-[-0.01em]">What I'm Not Selling</h2>
              <ul className="space-y-5 text-slate-500">
                <li className="heading-display text-lg sm:text-xl md:text-2xl flex items-center gap-4 tracking-[-0.01em]">
                  <span className="text-slate-600">—</span>
                  Promises
                </li>
                <li className="heading-display text-lg sm:text-xl md:text-2xl flex items-center gap-4 tracking-[-0.01em]">
                  <span className="text-slate-600">—</span>
                  Credentials
                </li>
                <li className="heading-display text-lg sm:text-xl md:text-2xl flex items-center gap-4 tracking-[-0.01em]">
                  <span className="text-slate-600">—</span>
                  Potential
                </li>
              </ul>
            </div>
            <div>
              <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl text-teal-400 mb-8 tracking-[-0.01em]">What I Am Showing</h2>
              <ul className="space-y-5 text-white">
                <li className="heading-display text-lg sm:text-xl md:text-2xl flex items-center gap-4 tracking-[-0.01em]">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  51 sites you can <span className="accent-italic">visit</span>
                </li>
                <li className="heading-display text-lg sm:text-xl md:text-2xl flex items-center gap-4 tracking-[-0.01em]">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  Systems you can <span className="accent-italic">read</span>
                </li>
                <li className="heading-display text-lg sm:text-xl md:text-2xl flex items-center gap-4 tracking-[-0.01em]">
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  Proof you can <span className="accent-italic">verify</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* The Question */}
        <section
          id="question"
          className={`mb-20 text-center py-16 transition-all duration-700 delay-500 ${visibleSections.question ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        >
          <p className="text-slate-500 mb-3 text-lg sm:text-xl md:text-2xl">Not "can he do this?"</p>
          <p className="text-slate-400 mb-10 text-base sm:text-lg md:text-xl">The portfolio answers that.</p>
          <p className="heading-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-relaxed tracking-[-0.02em]">
            The question is: <span className="gradient-text">"Do you need what's already built?"</span>
          </p>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className={`border-t border-slate-800/50 pt-16 text-center transition-all duration-700 delay-600 ${visibleSections.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="text-slate-400 mb-3 text-lg sm:text-xl md:text-2xl">If you recognize the work, reach out.</p>
          <p className="text-slate-500 mb-12 text-base sm:text-lg md:text-xl">If you need convincing, I'm not for you.</p>
          <button
            onClick={() => setShowContactModal(true)}
            className="inline-block bg-teal-500 hover:bg-teal-400 text-white font-semibold px-10 py-4 rounded-xl transition-all duration-300 btn-elite shadow-lg shadow-teal-500/25 cursor-pointer"
          >
            matthewdscott7@gmail.com
          </button>
          <p className="text-slate-600 text-sm mt-16">
            Documented in public. Standing behind every line.
          </p>
        </section>
      </main>

      {/* Contact Modal */}
      {showContactModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowContactModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative bg-slate-900 border border-slate-700 rounded-2xl p-8 md:p-10 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors text-2xl leading-none"
            >
              ×
            </button>

            <h3 className="heading-display text-2xl sm:text-3xl text-white mb-2 tracking-[-0.01em]">
              Get in Touch
            </h3>
            <p className="text-slate-400 mb-6">
              Direct line. No gatekeepers.
            </p>

            {formStatus === 'sent' ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4 text-teal-400">✓</div>
                <p className="heading-display text-2xl text-white mb-3">Message received.</p>
                <p className="text-slate-400 mb-6">I'll respond within 24 hours.</p>

                {/* Social links after success */}
                <div className="border-t border-slate-800 pt-6 mt-6">
                  <p className="text-slate-500 text-sm mb-4">Or connect directly:</p>
                  <div className="flex justify-center">
                    <a
                      href="https://linkedin.com/in/matthewdscott7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      LinkedIn
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setFormStatus('idle');
                    setFormData({ name: '', email: '', message: '', intent: '' });
                  }}
                  className="mt-6 text-slate-600 hover:text-white transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            ) : formStatus === 'error' ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✗</div>
                <p className="heading-display text-xl text-red-400 mb-2">Something went wrong</p>
                <p className="text-slate-400 text-sm mb-4">Please try again or email directly.</p>
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
                    // Web3Forms - free, 250 submissions/month
                    const formDataObj = new FormData();
                    formDataObj.append('access_key', 'db9cfad8-9fa4-4168-99af-e03cbf8014f2');
                    formDataObj.append('name', formData.name);
                    formDataObj.append('email', formData.email);
                    formDataObj.append('message', formData.message);

                    // Include intent in submission
                    if (formData.intent) {
                      formDataObj.append('intent', formData.intent);
                    }

                    // Customizations - tone: direct, no fluff
                    const intentLabel = formData.intent ? ` [${formData.intent.toUpperCase()}]` : '';
                    formDataObj.append('subject', `${formData.name} recognized the work${intentLabel}`);
                    formDataObj.append('from_name', 'projectlavos.com');
                    formDataObj.append('replyto', formData.email); // Reply goes to sender
                    formDataObj.append('botcheck', ''); // Honeypot spam protection

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
                {/* Honeypot spam protection - hidden from users */}
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                {/* Intent selector */}
                <div>
                  <label className="block text-slate-400 text-sm mb-3">What brings you here?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'hire', label: 'Hiring' },
                      { value: 'project', label: 'Project' },
                      { value: 'collaborate', label: 'Collaborate' },
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
                  <label className="block text-slate-400 text-sm mb-2">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none transition-colors resize-none"
                    placeholder="What can I help you with?"
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
