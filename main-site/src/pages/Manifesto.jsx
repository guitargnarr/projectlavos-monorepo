import { useEffect, useState, useRef } from 'react';

export default function Manifesto() {
  const [visibleSections, setVisibleSections] = useState({});
  const heroRef = useRef(null);

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
          <h1 className="heading-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up">
            <span className="gradient-text">What One Person</span>
            <br />
            <span className="text-white">Can Build</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 animate-fade-in-up delay-200">
            This is not a portfolio. It's <span className="text-teal-400">proof</span>.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* The Evidence */}
        <section
          id="evidence"
          className={`mb-20 transition-all duration-700 ${visibleSections.evidence ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-2xl font-bold text-teal-400 mb-8 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-gradient-to-r from-teal-400 to-transparent" />
            The Evidence
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 card-elite glow-border">
              <div className="text-5xl font-bold text-white mb-2 neon-text">51</div>
              <div className="text-slate-300 font-medium">websites built for Louisville businesses</div>
              <div className="text-slate-500 text-sm mt-2">Live, deployed, working.</div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 card-elite glow-border">
              <div className="text-5xl font-bold text-white mb-2 neon-text">51</div>
              <div className="text-slate-300 font-medium">AI models trained for specific domains</div>
              <div className="text-slate-500 text-sm mt-2">Career, code, guitar, analysis.</div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 card-elite glow-border">
              <div className="text-5xl font-bold text-white mb-2 neon-text">96</div>
              <div className="text-slate-300 font-medium">live URLs verified</div>
              <div className="text-slate-500 text-sm mt-2">All HTTP 200.</div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 card-elite glow-border">
              <div className="text-5xl font-bold mb-2 neon-text-orange">1</div>
              <div className="text-slate-300 font-medium">person</div>
              <div className="text-slate-500 text-sm mt-2">With AI collaboration.</div>
            </div>
          </div>
        </section>

        {/* The Scripts */}
        <section
          id="scripts"
          className={`mb-20 transition-all duration-700 delay-100 ${visibleSections.scripts ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid md:grid-cols-2 gap-12">
            <div className="transform md:-translate-x-4">
              <h2 className="text-xl font-bold text-slate-500 mb-6 flex items-center gap-3">
                <span className="w-6 h-[2px] bg-slate-600" />
                The Old Script
              </h2>
              <ul className="space-y-3 text-slate-500">
                <li className="line-through opacity-60">Get credentials</li>
                <li className="line-through opacity-60">Ask permission</li>
                <li className="line-through opacity-60">Wait to be chosen</li>
                <li className="line-through opacity-60">Prove you belong</li>
              </ul>
            </div>
            <div className="transform md:translate-x-4">
              <h2 className="text-xl font-bold text-teal-400 mb-6 flex items-center gap-3">
                <span className="w-6 h-[2px] bg-gradient-to-r from-teal-400 to-orange-400" />
                The New Script
              </h2>
              <ul className="space-y-3 text-white font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  Build it
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  Ship it
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  Show the proof
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  Let them come
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
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-slate-700/50 section-glow">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">What This Proves</h2>
            <p className="text-xl md:text-2xl text-slate-300 mb-6 leading-relaxed">
              A solo developer with AI collaboration can operate at <span className="text-teal-400 font-semibold">agency scale</span>.
            </p>
            <p className="text-slate-400 text-lg">
              Not in theory. In production. The systems are documented. The workflows are repeatable. The results are verifiable.
            </p>
          </div>
        </section>

        {/* The Method */}
        <section
          id="method"
          className={`mb-20 transition-all duration-700 delay-300 ${visibleSections.method ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-2xl font-bold text-teal-400 mb-10 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-gradient-to-r from-teal-400 to-transparent" />
            The Method
          </h2>
          <div className="space-y-8">
            {[
              { title: 'Parallel Development', desc: '4 features simultaneously, 100% success rate.' },
              { title: 'Ground Truth Verification', desc: 'Every claim tested. Screenshots. HTTP checks. No interpretation without evidence.' },
              { title: 'Fix First', desc: "Don't ask. Fix. Show the fix working." },
              { title: 'Trust the Filter', desc: 'The right people recognize real work. Everyone else is noise.' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="border-l-2 border-teal-400 pl-6 py-2 transition-all duration-300 hover:border-orange-400 hover:pl-8"
              >
                <h3 className="font-bold text-white text-lg">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What I'm Showing */}
        <section
          id="showing"
          className={`mb-20 transition-all duration-700 delay-400 ${visibleSections.showing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold text-slate-500 mb-6">What I'm Not Selling</h2>
              <ul className="space-y-3 text-slate-500">
                <li className="flex items-center gap-2">
                  <span className="text-slate-600">-</span>
                  Promises
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-slate-600">-</span>
                  Credentials
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-slate-600">-</span>
                  Potential
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-teal-400 mb-6">What I Am Showing</h2>
              <ul className="space-y-3 text-white">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  51 sites you can visit
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  Systems you can read
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  Proof you can verify
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
          <p className="text-slate-500 mb-2 text-lg">Not "can he do this?"</p>
          <p className="text-slate-400 mb-8">The portfolio answers that.</p>
          <p className="text-2xl md:text-3xl text-white font-bold leading-relaxed">
            The question is: <span className="gradient-text">"Do you need what's already built?"</span>
          </p>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className={`border-t border-slate-800/50 pt-16 text-center transition-all duration-700 delay-600 ${visibleSections.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="text-slate-400 mb-2">If you recognize the work, reach out.</p>
          <p className="text-slate-500 mb-10">If you need convincing, I'm not for you.</p>
          <a
            href="mailto:matthewdscott7@gmail.com"
            className="inline-block bg-teal-500 hover:bg-teal-400 text-white font-semibold px-10 py-4 rounded-xl transition-all duration-300 btn-elite shadow-lg shadow-teal-500/25"
          >
            matthewdscott7@gmail.com
          </a>
          <p className="text-slate-600 text-sm mt-16">
            Built with Claude. Documented in public. Standing behind every line.
          </p>
        </section>
      </main>
    </div>
  );
}
