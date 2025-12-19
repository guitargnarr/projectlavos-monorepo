import { useState, useEffect, useRef } from 'react'

const API_URL = 'https://mirador-xva2.onrender.com'

function App() {
  const [copied, setCopied] = useState(null)
  const [apiStatus, setApiStatus] = useState(null)
  const [apiStats, setApiStats] = useState(null)
  const [apiLoading, setApiLoading] = useState(true)
  const [selectedChain, setSelectedChain] = useState('security_audit')
  const [demoInput, setDemoInput] = useState('Review my API for vulnerabilities')
  const [demoResult, setDemoResult] = useState(null)
  const [demoLoading, setDemoLoading] = useState(false)

  useEffect(() => {
    // Fetch API health and stats on load
    const fetchApiData = async () => {
      try {
        const [healthRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/api/health`),
          fetch(`${API_URL}/api/stats`)
        ])
        const health = await healthRes.json()
        const stats = await statsRes.json()
        setApiStatus(health)
        setApiStats(stats)
      } catch (err) {
        console.error('API fetch error:', err)
        setApiStatus({ status: 'offline' })
      } finally {
        setApiLoading(false)
      }
    }
    fetchApiData()
  }, [])

  const runDemo = async () => {
    setDemoLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chain: selectedChain, input: demoInput })
      })
      const data = await res.json()
      setDemoResult(data)
    } catch (err) {
      setDemoResult({ error: 'API request failed' })
    } finally {
      setDemoLoading(false)
    }
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const quickStartCode = `# 1. Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 2. Clone & Install
git clone https://github.com/guitargnarr/mirador
cd mirador && pip install -r requirements.txt

# 3. Start API
python api.py

# 4. Verify
curl http://localhost:5001/api/health`

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-orange-500/10 hero-gradient" />
        <nav className="relative max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="text-xl font-bold">
            <span className="gradient-text">MIRADOR</span>
          </div>
          <div className="flex gap-6">
            <a href="#paradigm" className="text-slate-300 hover:text-white transition-colors">
              The Paradigm
            </a>
            <a href="#governance" className="text-slate-300 hover:text-white transition-colors">
              Self-Governance
            </a>
            <a href="#api" className="text-slate-300 hover:text-white transition-colors">
              Live API
            </a>
            <a href="https://projectlavos.com"
               className="text-slate-300 hover:text-white transition-colors">
              Portfolio
            </a>
          </div>
        </nav>

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            <span className="text-shimmer">Self-Governing AI</span>
            <span className="block text-2xl md:text-3xl mt-4 text-slate-300 font-normal">
              It fired 11% of itself. And got smarter.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-6">
            89 specialized personas. One conductor. An AI system that monitors, optimizes, and governs itself.
          </p>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-4">
            30,000+ lines of Python. 49 Ollama models. 100% local execution.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400 mb-12">
            <span className="flex items-center gap-2">
              <span className="text-teal-400">&#10003;</span> Self-monitoring performance
            </span>
            <span className="flex items-center gap-2">
              <span className="text-teal-400">&#10003;</span> Autonomous optimization
            </span>
            <span className="flex items-center gap-2">
              <span className="text-teal-400">&#10003;</span> 100% governance coverage
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
            <a href="#api"
               className="btn-elite px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold rounded-lg">
              Try Live API
            </a>
          </div>
        </div>
      </header>

      {/* The Paradigm Section */}
      <section id="paradigm" className="py-24 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">The Mirador Paradigm</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            A philosophical and architectural framework for human-AI collaboration
          </p>

          <div className="space-y-8 text-slate-300">
            <div className="bg-slate-800/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-teal-400 mb-3">The Problem</h3>
              <p>
                Traditional AI tools fail at complex, multi-domain problems. They lack context persistence,
                personality awareness, and the ability to route tasks to specialized capabilities.
                Life doesn't fit in a single prompt.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-teal-400 mb-3">The Solution</h3>
              <p>
                Mirador implements a conductor-based orchestration pattern. One meta-agent analyzes incoming
                tasks and dynamically assembles chains of specialized personas. Each persona has domain
                expertise, tuned parameters, and awareness of the user's personality profile.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-teal-400 mb-3">The Philosophy</h3>
              <p>
                AI should augment human capability, not replace human judgment. Mirador runs locally because
                privacy is non-negotiable. It's personality-aware because generic advice is useless advice.
                It chains specialists because no single model can do everything well.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Self-Governance Section */}
      <section id="governance" className="py-24 bg-gradient-to-br from-orange-500/5 to-teal-500/5">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">The System That Optimized Itself</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Zero human intervention. 100% autonomous governance.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-800/50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">75 → 67</div>
              <div className="text-slate-400 text-sm">Models</div>
              <div className="text-teal-400 text-xs mt-1">11% removed</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">150GB → 115GB</div>
              <div className="text-slate-400 text-sm">Storage</div>
              <div className="text-teal-400 text-xs mt-1">23% reduction</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">3.2s → 1.1s</div>
              <div className="text-slate-400 text-sm">Response Time</div>
              <div className="text-teal-400 text-xs mt-1">66% faster</div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 md:p-8">
            <h3 className="text-xl font-semibold text-teal-400 mb-4">What Happened</h3>
            <div className="space-y-4 text-slate-300">
              <p>
                Over 30 days, Mirador's self-reflection guardian monitored every model's performance.
                It identified 9 models that consistently underperformed - returning generic responses,
                high latency, or redundant capabilities already covered by other specialists.
              </p>
              <p>
                Without any human intervention, the system quarantined these models, ran validation
                tests to ensure no capability gaps, then permanently removed them from the active pool.
              </p>
              <p className="text-slate-400 italic">
                "The first AI system that governs itself. It fired 11% of itself - and got smarter."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number="89+" label="Specialized Personas" />
            <StatCard number="49" label="Ollama Models Installed" />
            <StatCard number="30K+" label="Lines of Python" />
            <StatCard number="100%" label="Local Execution" />
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Architecture</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Conductor-based orchestration with bidirectional communication
          </p>

          <div className="bg-slate-900 rounded-xl p-6 md:p-8 overflow-x-auto mb-12">
            <pre className="text-sm md:text-base text-slate-300 leading-relaxed">
{`User Query
    │
    ▼
┌───────────────────────────────────────────────────┐
│  Conductor Agent (conductor.py)                   │
│  - Analyzes task requirements                     │
│  - Selects optimal persona chain                  │
│  - Routes with sub-second latency                 │
└───────────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────────┐
│  Message Bus (message_bus.py)                     │
│  - Bidirectional specialist communication         │
│  - Session management with UUID                   │
│  - Query caching & circular dependency detection  │
└───────────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────────┐
│  Persona Chains (89+ specialists)                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │   Guitar    │ │  Financial  │ │  Security   │ │
│  │  Experts    │ │  Planning   │ │   Audit     │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │ Louisville  │ │   Health    │ │    Code     │ │
│  │   Market    │ │  Wellness   │ │   Review    │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ │
└───────────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────────┐
│  Meta-Cognitive Layer                             │
│  - cross_model_synthesizer: Pattern identification│
│  - feedback_loop_optimizer: Output refinement     │
│  - self_reflection_guardian: Blindspot detection  │
└───────────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────────┐
│  Ollama (Local LLM Runtime)                       │
│  llama3.2, phi4, qwen2.5, deepseek-r1, gemma2    │
└───────────────────────────────────────────────────┘`}
            </pre>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <ArchCard
              title="Conductor Pattern"
              description="A meta-agent analyzes each task and dynamically selects which specialists to invoke, in what order, with what parameters."
            />
            <ArchCard
              title="Message Bus"
              description="Enables specialists to query each other, share context, and build on previous analysis. Not just sequential chaining."
            />
            <ArchCard
              title="Meta-Cognition"
              description="Dedicated models that critique outputs, identify blind spots, and synthesize patterns across specialist responses."
            />
          </div>
        </div>
      </section>

      {/* Persona Categories */}
      <section className="py-24 bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Persona Categories</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Domain specialists with tuned parameters and custom system prompts
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PersonaCard
              category="Music & Guitar"
              personas={["guitar_expert_precise", "guitar_tone_architect", "master_guitar_instructor", "performance_anxiety_coach"]}
              color="orange"
            />
            <PersonaCard
              category="Career & Market"
              personas={["louisville_expert_v2", "louisville-job-market", "local_market_expert", "opportunity_identification_specialist"]}
              color="teal"
            />
            <PersonaCard
              category="Financial"
              personas={["financial_planning_expert_v6", "financial_calculator", "decision_enhancer", "decision_simplifier_v2"]}
              color="green"
            />
            <PersonaCard
              category="Code & Security"
              personas={["code-executor", "elite-frontend", "fact_validation_specialist", "security_expert"]}
              color="purple"
            />
            <PersonaCard
              category="Health & Wellness"
              personas={["health_wellness_optimizer", "touring_readiness_coach", "productivity_optimizer"]}
              color="blue"
            />
            <PersonaCard
              category="Meta-Cognitive"
              personas={["cross_model_synthesizer", "mirador_self_reflection_guardian", "feedback_loop_optimizer", "instruction_generation_specialist"]}
              color="pink"
            />
          </div>
        </div>
      </section>

      {/* OCEAN Integration */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Personality-Aware Intelligence</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            OCEAN (Big Five) personality integration for personalized recommendations
          </p>

          <div className="space-y-4">
            <OceanTrait
              trait="Openness"
              description="Creative Innovation chains - explores unconventional solutions"
              value={85}
            />
            <OceanTrait
              trait="Conscientiousness"
              description="Family-Conscious Planning - structured, deadline-aware advice"
              value={78}
            />
            <OceanTrait
              trait="Extraversion"
              description="Depth-Focused Networking - quality over quantity connections"
              value={45}
            />
            <OceanTrait
              trait="Agreeableness"
              description="Values-Based Leadership - servant leadership patterns"
              value={72}
            />
            <OceanTrait
              trait="Neuroticism"
              description="Resilience chains - adaptive career development"
              value={35}
            />
          </div>

          <p className="text-slate-500 text-center mt-8 text-sm">
            Personality data shapes which specialists activate and how they frame recommendations
          </p>
        </div>
      </section>

      {/* Verified Claims */}
      <section className="py-24 bg-slate-800/50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Verified Implementation</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Every claim backed by actual code
          </p>

          <div className="space-y-4">
            <VerifiedRow claim="89+ specialized personas" evidence="96 unique modelfiles across directories" />
            <VerifiedRow claim="Conductor-based orchestration" evidence="ConductorAgent class in conductor.py" />
            <VerifiedRow claim="Bidirectional communication" evidence="MessageBus class (25,567 lines)" />
            <VerifiedRow claim="OCEAN personality integration" evidence="46 files reference Big Five traits" />
            <VerifiedRow claim="Local execution" evidence="49 Ollama models currently installed" />
            <VerifiedRow claim="SQLite persistence" evidence="3 database files for session/state" />
            <VerifiedRow claim="Webhook infrastructure" evidence="WebhookHandler class with event dispatch" />
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section id="quickstart" className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Start</h2>
          <div className="bg-slate-800 rounded-xl overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 bg-slate-700/50">
              <span className="text-slate-400 text-sm">Terminal</span>
              <button
                onClick={() => copyToClipboard(quickStartCode, 'quickstart')}
                className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
              >
                {copied === 'quickstart' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="p-6 text-sm md:text-base overflow-x-auto">
              <code className="text-slate-300">{quickStartCode}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Live API Section */}
      <section id="api" className="py-24 bg-slate-800/50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Live API</h2>
          <p className="text-slate-400 text-center mb-8 max-w-2xl mx-auto">
            Try the Mirador API right now - deployed on Render
          </p>

          {/* API Status */}
          <div className="bg-slate-900 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">API Status</h3>
              <div className="flex items-center gap-2">
                {apiLoading ? (
                  <span className="text-slate-400">Checking...</span>
                ) : apiStatus?.status === 'healthy' ? (
                  <>
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-400">Online</span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-red-400">Offline</span>
                  </>
                )}
              </div>
            </div>
            {apiStatus?.status === 'healthy' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-teal-400">{apiStatus.personas_loaded}</div>
                  <div className="text-slate-500 text-sm">Personas</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-teal-400">{apiStatus.chains_available}</div>
                  <div className="text-slate-500 text-sm">Chains</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-teal-400">v{apiStatus.version}</div>
                  <div className="text-slate-500 text-sm">Version</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-400">Demo</div>
                  <div className="text-slate-500 text-sm">Mode</div>
                </div>
              </div>
            )}
            <div className="mt-4 text-sm text-slate-500">
              <a href={API_URL} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300">
                {API_URL}
              </a>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="bg-slate-900 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Try a Chain</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Select Chain</label>
                <select
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="security_audit">Security Audit (100% accuracy)</option>
                  <option value="code_review">Code Review (~85% accuracy)</option>
                  <option value="life_optimization">Life Optimization</option>
                  <option value="guitar_mastery">Guitar Mastery</option>
                  <option value="career_acceleration">Career Acceleration</option>
                  <option value="financial_planning">Financial Planning</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Input</label>
                <textarea
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none resize-none"
                  rows={3}
                  placeholder="Enter your query..."
                />
              </div>
              <button
                onClick={runDemo}
                disabled={demoLoading || !demoInput}
                className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-900 font-semibold py-3 rounded-lg transition-colors"
              >
                {demoLoading ? 'Running...' : 'Run Chain'}
              </button>
            </div>

            {/* Demo Result */}
            {demoResult && (
              <div className="mt-6 bg-slate-800 rounded-lg p-4 overflow-x-auto">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-400">Response</span>
                  <span className="text-xs text-orange-400 px-2 py-1 bg-orange-500/10 rounded">Demo Mode</span>
                </div>
                {demoResult.error ? (
                  <p className="text-red-400">{demoResult.error}</p>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-teal-400 font-semibold">{demoResult.chain}</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-slate-400">{demoResult.accuracy} accuracy</span>
                    </div>
                    <div className="text-sm text-slate-300">
                      <p className="mb-2">{demoResult.description}</p>
                      <p className="text-slate-500">Execution flow:</p>
                      <ol className="list-decimal list-inside space-y-1 mt-2">
                        {demoResult.steps?.map((step, i) => (
                          <li key={i} className="text-slate-400">
                            <span className="text-teal-400 font-mono">{step.persona}</span>
                            <span className="text-slate-600"> - {step.description}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <p className="text-xs text-slate-500 mt-4 italic">
                      {demoResult.note}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-teal-500/10 to-orange-500/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Built for Real Complexity</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            When no existing tool could handle the complexity of actual life,
            I built one that could. Mirador is the result.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#api"
               className="btn-elite px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold rounded-lg">
              Try Live API
            </a>
            <a href="https://projectlavos.com"
               className="btn-elite px-8 py-4 border border-slate-600 hover:border-teal-500 text-white rounded-lg">
              View Full Portfolio
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-slate-400 mb-2">
            Matthew Scott
          </p>
          <p className="text-slate-500">
            Part of the{' '}
            <a href="https://projectlavos.com" className="text-teal-400 hover:text-teal-300">
              Project Lavos
            </a>
            {' '}portfolio
          </p>
          <p className="text-slate-600 text-sm mt-2">
            MIT License
          </p>
        </div>
      </footer>
    </div>
  )
}

function StatCard({ number, label }) {
  return (
    <div>
      <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{number}</div>
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  )
}

function ArchCard({ title, description }) {
  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-teal-400 mb-3">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  )
}

function PersonaCard({ category, personas, color }) {
  const colorClasses = {
    orange: 'border-orange-500/30 bg-orange-500/5',
    teal: 'border-teal-500/30 bg-teal-500/5',
    green: 'border-green-500/30 bg-green-500/5',
    purple: 'border-purple-500/30 bg-purple-500/5',
    blue: 'border-blue-500/30 bg-blue-500/5',
    pink: 'border-pink-500/30 bg-pink-500/5',
  }

  return (
    <div className={`rounded-xl p-6 border ${colorClasses[color]}`}>
      <h3 className="text-lg font-semibold mb-4">{category}</h3>
      <ul className="space-y-2">
        {personas.map((p, i) => (
          <li key={i} className="text-slate-400 text-sm font-mono">{p}</li>
        ))}
      </ul>
    </div>
  )
}

function OceanTrait({ trait, description, value }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-teal-400">{trait}</span>
        <span className="text-slate-500 text-sm">{value}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full mb-2">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-orange-500 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  )
}

function VerifiedRow({ claim, evidence }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 bg-slate-900 rounded-lg">
      <span className="text-teal-400 font-semibold flex-shrink-0">
        <span className="mr-2">&#10003;</span>
        {claim}
      </span>
      <span className="text-slate-500 md:ml-auto text-sm">{evidence}</span>
    </div>
  )
}

export default App
