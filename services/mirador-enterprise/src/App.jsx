import { useState } from 'react'

const API_URL = 'https://mirador-xva2.onrender.com'

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' })
  const [formStatus, setFormStatus] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Mirador Executive Briefing Request - ${formData.company}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Company: ${formData.company}\n\n` +
      `AI Governance Challenges:\n${formData.message}\n\n` +
      `---\nSent from Mirador Enterprise contact form`
    )
    window.location.href = `mailto:matthewdscott7@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold gradient-text">MIRADOR</span>
            <span className="text-xs text-slate-500 border border-slate-700 px-2 py-0.5 rounded">ENTERPRISE</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm">
            <a href="#problem" className="text-slate-400 hover:text-white transition-colors">The Problem</a>
            <a href="#solution" className="text-slate-400 hover:text-white transition-colors">Solution</a>
            <a href="#results" className="text-slate-400 hover:text-white transition-colors">Results</a>
            <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a>
            <a href="#contact" className="text-slate-400 hover:text-white transition-colors">Contact</a>
          </div>
          <a href="#contact" className="btn-primary text-sm py-2 px-4">
            Schedule Briefing
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-24 px-6 hero-gradient">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
            <span className="text-orange-400 text-sm font-medium">Live Demo Available</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="gradient-text">Self-Governing AI</span>
            <span className="block text-2xl md:text-3xl mt-4 text-slate-300 font-normal">
              The AI System That Optimized Itself
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-8">
            It analyzed 74 models, found redundancies, and improved diversity from 5% to 20%.
            <span className="text-white"> One approval click.</span>
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400 mb-12">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>100% Governance Coverage</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Continuous Self-Optimization</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Full Audit Trail</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="btn-primary">
              Schedule Executive Briefing
            </a>
            <a href={API_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              See Live API
            </a>
          </div>
        </div>
      </header>

      {/* The Problem */}
      <section id="problem" className="py-24 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">
            <span className="text-orange-400">The Enterprise AI Crisis</span>
          </h2>
          <p className="section-subtitle">
            Your organization has invested millions in AI. But can you answer these questions?
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <ProblemCard
              icon="eye-off"
              title="No Visibility"
              description="Which of your 50 AI models performed worst last week? If your team can't answer in 10 seconds, you have a governance problem."
            />
            <ProblemCard
              icon="refresh-off"
              title="No Improvement"
              description="Your AI makes the same mistakes repeatedly. There's no feedback loop, no learning, no optimization. Just hope."
            />
            <ProblemCard
              icon="shield-off"
              title="No Governance"
              description="The EU AI Act is here. US regulation is coming. Ungoverned AI is a lawsuit waiting to happen."
            />
            <ProblemCard
              icon="puzzle"
              title="No Integration"
              description="50 different AI tools that don't talk to each other. Each requires separate monitoring, separate governance, separate headaches."
            />
          </div>

          <div className="bg-slate-900 rounded-xl p-8 border border-orange-500/30">
            <p className="text-lg text-center text-slate-300">
              <span className="text-orange-400 font-semibold">The hard truth:</span> Most enterprise AI deployments are flying blind.
              They've built the rocket but forgot the instruments.
            </p>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section id="solution" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">
            <span className="gradient-text">The Mirador Solution</span>
          </h2>
          <p className="section-subtitle">
            An AI operating system that monitors, optimizes, and governs itself
          </p>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <SolutionCard
              number="01"
              title="Self-Monitoring"
              description="Every model reports its confidence, accuracy, and failures in real-time. Mirador knows when performance drops before your customers do."
              features={['Real-time performance tracking', 'Automatic anomaly detection', 'Failure prediction']}
            />
            <SolutionCard
              number="02"
              title="Self-Optimizing"
              description="Mirador continuously analyzes which components add value and which consume resources. It optimizes itself without human intervention."
              features={['Automatic model retirement', 'Workload redistribution', 'Resource optimization']}
            />
            <SolutionCard
              number="03"
              title="Self-Governing"
              description="Every decision is logged, every optimization is justified, every action is reversible. This isn't black-box AI - it's glass-box AI."
              features={['100% audit trail', 'Human approval gates', 'Compliance-ready reports']}
            />
          </div>

          {/* Architecture Diagram */}
          <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
            <h3 className="text-xl font-semibold text-center mb-6">How It Works</h3>
            <div className="overflow-x-auto">
              <pre className="text-sm md:text-base text-slate-300 leading-relaxed text-center">
{`Your AI Models
      |
      v
+------------------------------------------+
|     Mirador Orchestration Layer          |
|  - Routes requests to optimal models     |
|  - Monitors every response               |
|  - Learns from every interaction         |
+------------------------------------------+
      |              |               |
      v              v               v
+-----------+  +-----------+  +-----------+
|  Model A  |  |  Model B  |  |  Model C  |
+-----------+  +-----------+  +-----------+
      |              |               |
      +-------+------+-------+-------+
              |
              v
    Performance Analytics
              |
              v
    Self-Optimization Engine
              |
              v
    Governance Dashboard`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="py-24 px-6 bg-gradient-to-br from-teal-500/5 to-orange-500/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">
            <span className="gradient-text">Real Results from Real Deployment</span>
          </h2>
          <p className="section-subtitle">
            Not theoretical. Not simulated. Actual production metrics from self-governing AI.
          </p>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <MetricCard before="74" after="8" label="Routing Models" improvement="71 consolidated" />
            <MetricCard before="2GB" after="0" label="Duplicates" improvement="1 removed" />
            <MetricCard before="5%" after="20%" label="Diversity" improvement="4 LLMs added" />
            <MetricCard before="0%" after="100%" label="Governance" improvement="Complete" />
          </div>

          <div className="bg-slate-900 rounded-xl p-8 border border-teal-500/30">
            <h3 className="text-xl font-semibold text-teal-400 mb-4">What Happened</h3>
            <p className="text-slate-300 mb-4">
              Mirador scanned its own model inventory - 74 specialized AI models built over two years.
              It found 1 exact duplicate (llama3.2:3b = llama3.2:latest) wasting 2GB, and identified
              71 models sharing the same base architecture with consolidation potential.
            </p>
            <p className="text-slate-300 mb-4">
              The system proposed routing through 8 universal models instead of 71 specialized variants,
              and adding 4 diverse base LLMs (Gemma, Qwen, Phi-3, Command-R) to reduce single-vendor risk.
              I reviewed the recommendation. Clicked approve. The system executed.
            </p>
            <p className="text-slate-400 italic">
              "The first AI system that audited itself - and got leaner."
            </p>
          </div>
        </div>
      </section>

      {/* Louisville Focus */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">
            Built for Louisville. <span className="gradient-text">Ready for Enterprise.</span>
          </h2>
          <p className="section-subtitle">
            Created by a former Fortune 50 Risk Management Professional who understands enterprise governance
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-teal-400 mb-4">Why Louisville is Ready</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-orange-400 mt-1">&#8226;</span>
                  <span><strong>Logistics Innovation:</strong> UPS drives the need for AI optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-400 mt-1">&#8226;</span>
                  <span><strong>Manufacturing 4.0:</strong> GE Appliances leads in smart manufacturing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-400 mt-1">&#8226;</span>
                  <span><strong>Corporate HQs:</strong> Decision makers are local and accessible</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-400 mt-1">&#8226;</span>
                  <span><strong>Lower Competition:</strong> Less saturated than coastal markets</span>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-teal-400 mb-4">Enterprise-Ready Industries</h3>
              <div className="grid grid-cols-2 gap-4 text-slate-300">
                <IndustryTag>Logistics</IndustryTag>
                <IndustryTag>Manufacturing</IndustryTag>
                <IndustryTag>Financial Services</IndustryTag>
                <IndustryTag>Restaurant Tech</IndustryTag>
                <IndustryTag>Utilities</IndustryTag>
                <IndustryTag>Gaming & Entertainment</IndustryTag>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">
            <span className="gradient-text">Three Ways to Start</span>
          </h2>
          <p className="section-subtitle">
            From discovery to full deployment, choose the path that fits your organization
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            <PricingCard
              tier="Discovery"
              price="Free"
              description="30-minute executive briefing"
              features={[
                'AI governance assessment',
                'Current state analysis',
                'Opportunity identification',
                'No commitment required'
              ]}
              cta="Schedule Briefing"
              ctaLink="#contact"
              featured={false}
            />
            <PricingCard
              tier="Proof of Concept"
              price="$10K"
              description="2-week implementation"
              features={[
                'Your data, your environment',
                'Measurable improvement guarantee',
                'Full governance audit',
                'Technical documentation',
                'ROI analysis report'
              ]}
              cta="Start POC"
              ctaLink="#contact"
              featured={true}
            />
            <PricingCard
              tier="Enterprise"
              price="$150K"
              description="Complete deployment"
              features={[
                'Full Mirador implementation',
                '90-day optimization support',
                'Executive AI dashboard',
                'Quarterly performance reviews',
                'Dedicated success manager',
                'Custom integration support'
              ]}
              cta="Contact Sales"
              ctaLink="#contact"
              featured={false}
            />
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">
            <span className="gradient-text">About the Creator</span>
          </h2>

          <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-orange-500 rounded-full flex items-center justify-center text-4xl font-bold text-slate-900">
                MS
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Matthew Scott</h3>
                <p className="text-teal-400 mb-4">Creator of Mirador | Louisville, KY</p>
                <ul className="space-y-2 text-slate-300">
                  <li>Former Risk Management Professional at Fortune 50</li>
                  <li>Built and deployed 67-model AI ecosystem</li>
                  <li>Pioneer in self-governing AI systems</li>
                  <li>Musician turned AI architect (creativity meets precision)</li>
                </ul>
              </div>
            </div>
            <blockquote className="mt-8 text-lg text-slate-400 italic border-l-4 border-teal-500 pl-6">
              "I built an AI system that found its own redundancies. One approval click later, it was leaner and more diverse.
              Now I'm teaching enterprises to do the same."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 bg-gradient-to-br from-teal-500/10 to-orange-500/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">
            <span className="gradient-text">Schedule Your Executive Briefing</span>
          </h2>
          <p className="section-subtitle">
            30 minutes. No sales pitch. Just a straightforward discussion about making your AI governable.
          </p>

          <div className="bg-slate-900 rounded-xl p-8 border border-slate-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">What are your biggest AI governance challenges?</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none resize-none"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Request Executive Briefing
              </button>
              {formStatus === 'success' && (
                <p className="text-teal-400 text-center">Thank you! We'll be in touch within 24 hours.</p>
              )}
            </form>

            <div className="mt-8 pt-8 border-t border-slate-700">
              <p className="text-slate-400 text-center mb-4">Or reach out directly:</p>
              <div className="flex flex-wrap justify-center gap-6">
                <a href="mailto:matthewdscott7@gmail.com" className="text-teal-400 hover:text-teal-300 transition-colors">
                  matthewdscott7@gmail.com
                </a>
                <a href="https://linkedin.com/in/mscott77" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 transition-colors">
                  LinkedIn
                </a>
                <a href="https://github.com/guitargnarr/mirador" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="text-xl font-bold gradient-text">MIRADOR</span>
              <p className="text-slate-500 text-sm mt-1">Self-Governing AI for Enterprise</p>
            </div>
            <div className="flex gap-8 text-sm text-slate-400">
              <a href="https://mirador-o2wgw9o65-matthew-scotts-projects-1dc9743e.vercel.app" className="hover:text-teal-400 transition-colors">
                Developer Portal
              </a>
              <a href="https://github.com/guitargnarr/mirador" className="hover:text-teal-400 transition-colors">
                Open Source
              </a>
              <a href="https://projectlavos.com" className="hover:text-teal-400 transition-colors">
                Portfolio
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>&copy; 2025 Mirador AI Systems | Louisville, KY</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProblemCard({ icon, title, description }) {
  return (
    <div className="card group">
      <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
        <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon === 'eye-off' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />}
          {icon === 'refresh-off' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />}
          {icon === 'shield-off' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />}
          {icon === 'puzzle' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />}
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  )
}

function SolutionCard({ number, title, description, features }) {
  return (
    <div className="card">
      <div className="text-5xl font-bold text-teal-500/20 mb-4">{number}</div>
      <h3 className="text-xl font-semibold text-teal-400 mb-3">{title}</h3>
      <p className="text-slate-400 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
            <svg className="w-4 h-4 text-teal-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

function MetricCard({ before, after, label, improvement }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 text-center border border-slate-700">
      <div className="text-sm text-slate-500 mb-2">{label}</div>
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-slate-500 line-through">{before}</span>
        <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        <span className="text-3xl font-bold text-orange-400">{after}</span>
      </div>
      <div className="text-xs text-teal-400">{improvement}</div>
    </div>
  )
}

function PricingCard({ tier, price, description, features, cta, ctaLink, featured }) {
  return (
    <div className={`rounded-xl p-8 ${featured ? 'bg-gradient-to-b from-teal-500/10 to-orange-500/10 border-2 border-teal-500' : 'bg-slate-800/50 border border-slate-700'}`}>
      {featured && (
        <div className="text-xs text-teal-400 font-semibold mb-4 uppercase tracking-wide">Most Popular</div>
      )}
      <h3 className="text-xl font-semibold mb-2">{tier}</h3>
      <div className="mb-2">
        <span className="text-4xl font-bold gradient-text">{price}</span>
      </div>
      <p className="text-slate-400 text-sm mb-6">{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
            <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <a href={ctaLink} className={`block text-center py-3 rounded-lg font-semibold transition-colors ${featured ? 'btn-primary' : 'btn-secondary'}`}>
        {cta}
      </a>
    </div>
  )
}

function IndustryTag({ children }) {
  return (
    <span className="bg-slate-700/50 text-slate-300 px-4 py-2 rounded-lg text-sm text-center">
      {children}
    </span>
  )
}

export default App
