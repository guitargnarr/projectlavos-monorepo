import { useState, useCallback, useEffect } from 'react'
import { Github, Terminal, Shield, Cpu, Brain, ExternalLink, ChevronRight, Zap, Code, Lock, Lightbulb, Users, ArrowRight, Wifi, WifiOff, Play, Loader2, Server } from 'lucide-react'

// The 16 Mirador Personas
const personas = [
  { id: 'master_coder', name: 'Master Coder', category: 'development', icon: Code, description: 'Architecture and implementation strategy' },
  { id: 'code_reviewer', name: 'Code Reviewer', category: 'development', icon: Code, description: 'Quality analysis and best practices' },
  { id: 'debug_specialist', name: 'Debug Specialist', category: 'development', icon: Code, description: 'Issue identification and resolution' },
  { id: 'test_architect', name: 'Test Architect', category: 'development', icon: Code, description: 'Testing strategy and coverage' },
  { id: 'security_expert', name: 'Security Expert', category: 'security', icon: Lock, description: 'Vulnerability assessment and hardening' },
  { id: 'performance_optimizer', name: 'Performance Optimizer', category: 'development', icon: Zap, description: 'Speed and efficiency optimization' },
  { id: 'api_designer', name: 'API Designer', category: 'development', icon: Code, description: 'Interface design and documentation' },
  { id: 'database_architect', name: 'Database Architect', category: 'development', icon: Cpu, description: 'Data modeling and query optimization' },
  { id: 'devops_engineer', name: 'DevOps Engineer', category: 'development', icon: Terminal, description: 'Deployment and infrastructure' },
  { id: 'ux_analyst', name: 'UX Analyst', category: 'creative', icon: Lightbulb, description: 'User experience evaluation' },
  { id: 'business_analyst', name: 'Business Analyst', category: 'business', icon: Users, description: 'Requirements and ROI analysis' },
  { id: 'project_manager', name: 'Project Manager', category: 'business', icon: Users, description: 'Timeline and resource planning' },
  { id: 'documentation_writer', name: 'Documentation Writer', category: 'creative', icon: Lightbulb, description: 'Technical writing and guides' },
  { id: 'cross_model_synthesizer', name: 'Cross-Model Synthesizer', category: 'meta', icon: Brain, description: 'Pattern identification across outputs' },
  { id: 'feedback_loop_optimizer', name: 'Feedback Optimizer', category: 'meta', icon: Brain, description: 'Output refinement and improvement' },
  { id: 'self_reflection_guardian', name: 'Self-Reflection Guardian', category: 'meta', icon: Brain, description: 'Blindspot identification' },
]

const categories = {
  development: { name: 'Development', color: 'teal' },
  security: { name: 'Security', color: 'red' },
  business: { name: 'Business', color: 'orange' },
  creative: { name: 'Creative', color: 'purple' },
  meta: { name: 'Meta-Cognitive', color: 'cyan' },
}

// Real Mirador output captured from security_audit chain
const sampleChainOutput = {
  chain: 'security_audit',
  query: "def login(user, pwd): query = f\"SELECT * FROM users WHERE name={user} AND pass={pwd}\"; return db.execute(query)",
  steps: [
    {
      persona: 'Security Expert',
      category: 'security',
      output: `**Vulnerability Analysis**

The provided code snippet is a simplified login function that queries the database to verify user credentials. However, it contains **CRITICAL SQL Injection vulnerability**.

**CVE Classification:** CWE-89 (SQL Injection)
**Severity:** CRITICAL (CVSS 9.8)

**Attack Vector:**
An attacker can input: user = "admin'--" to bypass authentication entirely.
Example payload: name = "' OR '1'='1" AND pass = "anything"

**Immediate Remediation:**
1. Use parameterized queries: db.execute("SELECT * FROM users WHERE name=? AND pass=?", (user, pwd))
2. Implement prepared statements
3. Add input validation with allowlist patterns`
    },
    {
      persona: 'Code Reviewer',
      category: 'development',
      output: `**Code Quality Assessment**

Quality Score: 2/10 (Critical issues found)

**Issues Identified:**
1. F-string SQL construction - NEVER interpolate user input into SQL
2. No password hashing - storing/comparing plaintext passwords
3. No input sanitization or validation
4. No error handling for database failures
5. No logging for security events

**Recommended Pattern:**
\`\`\`python
def login(user: str, pwd: str) -> Optional[User]:
    hashed = hash_password(pwd)
    return db.execute(
        "SELECT * FROM users WHERE name = ? AND pass = ?",
        (sanitize(user), hashed)
    ).fetchone()
\`\`\``
    },
    {
      persona: 'Cross-Model Synthesizer',
      category: 'meta',
      output: `**Meta-Cognitive Pattern Analysis**

SYNTHESIZED FINDINGS FROM PRIOR PERSONAS:

Pattern Detected: "Security-by-Obscurity Anti-Pattern"
- Security Expert identified: SQL injection (root cause)
- Code Reviewer identified: No hashing, no validation (contributing factors)

**Unified Threat Model:**
1. SQL Injection enables: Authentication bypass, data exfiltration
2. Plaintext passwords enable: Credential theft if database compromised
3. No validation enables: Injection attacks to propagate

**Priority Matrix (Impact x Effort):**
| Fix | Impact | Effort | Priority |
|-----|--------|--------|----------|
| Parameterized queries | 10 | Low | P0 |
| Password hashing | 9 | Medium | P1 |
| Input validation | 7 | Low | P2 |`
    },
    {
      persona: 'Self-Reflection Guardian',
      category: 'meta',
      output: `**Blindspot Analysis**

GAPS IN PRIOR ANALYSIS:

1. **Session Management**: No analysis of how sessions are created/stored post-login
   - Are session tokens cryptographically secure?
   - Is session fixation possible?

2. **Rate Limiting**: No discussion of brute-force protection
   - Recommend: Fail2ban pattern, exponential backoff

3. **Audit Trail**: No mention of security logging
   - Failed login attempts should be logged
   - Consider SIEM integration

4. **Defense in Depth**: Single point of failure
   - Add WAF layer
   - Implement 2FA for sensitive accounts

**CONFIDENCE LEVEL:** Analysis 85% complete. Remaining gaps: network security, deployment context.`
    },
  ]
}

// Chain presets from API
const chainPresets = [
  { id: 'quick_review', name: 'Quick Review', description: 'Fast code review with key insights' },
  { id: 'security_audit', name: 'Security Audit', description: 'Comprehensive security analysis' },
  { id: 'code_review', name: 'Code Review', description: 'Full code review with testing' },
  { id: 'architecture', name: 'Architecture', description: 'System design analysis' },
  { id: 'business_analysis', name: 'Business Analysis', description: 'Requirements and planning' },
  { id: 'meta_only', name: 'Meta-Cognitive Only', description: 'Meta evaluation layer' },
  { id: 'full_chain', name: 'Full 16-Persona', description: 'All 16 personas' },
]

function App() {
  const [activePersona, setActivePersona] = useState(null)
  const [showChainDemo, setShowChainDemo] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  // API Connection State
  const [apiUrl, setApiUrl] = useState('http://localhost:5001')
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [apiHealth, setApiHealth] = useState(null)
  const [connectionError, setConnectionError] = useState(null)

  // Live Chain Execution State
  const [selectedChain, setSelectedChain] = useState('quick_review')
  const [inputText, setInputText] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [liveOutputs, setLiveOutputs] = useState([])
  const [currentLiveStep, setCurrentLiveStep] = useState(null)

  // Connect to local API
  const connectToApi = useCallback(async () => {
    setIsConnecting(true)
    setConnectionError(null)
    try {
      const res = await fetch(`${apiUrl}/api/health`)
      const data = await res.json()
      if (data.status === 'healthy') {
        setIsConnected(true)
        setApiHealth(data)
      } else {
        throw new Error('API not healthy')
      }
    } catch (err) {
      setIsConnected(false)
      setConnectionError('Cannot connect. Make sure Mirador API is running locally.')
    }
    setIsConnecting(false)
  }, [apiUrl])

  // Run live chain with SSE
  const runLiveChain = useCallback(async () => {
    if (!inputText.trim() || !isConnected) return

    setIsRunning(true)
    setLiveOutputs([])
    setCurrentLiveStep(null)

    try {
      const response = await fetch(`${apiUrl}/api/chain/${selectedChain}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputText })
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        const lines = text.split('\n').filter(line => line.startsWith('data: '))

        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6))

            if (data.type === 'start') {
              setCurrentLiveStep(data.persona)
              setLiveOutputs(prev => [...prev, {
                persona: data.persona,
                description: data.description,
                category: data.category,
                content: '',
                complete: false
              }])
            } else if (data.type === 'chunk') {
              setLiveOutputs(prev => {
                const updated = [...prev]
                const idx = updated.findIndex(o => o.persona === data.persona && !o.complete)
                if (idx !== -1) {
                  updated[idx] = { ...updated[idx], content: updated[idx].content + data.content }
                }
                return updated
              })
            } else if (data.type === 'complete') {
              setLiveOutputs(prev => {
                const updated = [...prev]
                const idx = updated.findIndex(o => o.persona === data.persona && !o.complete)
                if (idx !== -1) {
                  updated[idx] = { ...updated[idx], complete: true, tokens: data.tokens, time_ms: data.time_ms }
                }
                return updated
              })
            } else if (data.type === 'chain_complete') {
              setCurrentLiveStep(null)
            }
          } catch (e) {
            // Skip malformed lines
          }
        }
      }
    } catch (err) {
      console.error('Chain execution failed:', err)
    }

    setIsRunning(false)
  }, [apiUrl, selectedChain, inputText, isConnected])

  const runChainDemo = () => {
    setShowChainDemo(true)
    setCurrentStep(0)
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= sampleChainOutput.steps.length - 1) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
            MIRADOR
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-2">
            Local-First Multi-Agent AI Framework
          </p>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Chain 16 specialized personas with meta-cognitive evaluation.
            100% local execution for regulated industries.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://github.com/guitargnarr/mirador"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Github size={20} />
              View on GitHub
            </a>
            <a
              href="#live-executor"
              className="inline-flex items-center gap-2 border border-orange-500 hover:border-orange-400 hover:bg-orange-500/10 text-orange-400 px-6 py-3 rounded-lg transition-colors"
            >
              <Play size={20} />
              Run Live Chains
            </a>
          </div>
        </div>
      </header>

      {/* Persona Chain Visualization */}
      <section id="chain-demo" className="py-16 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">The Persona Chain</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Each query flows through specialized agents. Context accumulates.
            Meta-cognitive layer critiques and improves the final output.
          </p>

          {/* Visual Chain Flow */}
          <div className="relative mb-16">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {personas.slice(0, 6).map((persona, idx) => (
                <div key={persona.id} className="flex items-center">
                  <PersonaNode
                    persona={persona}
                    isActive={activePersona === persona.id}
                    onClick={() => setActivePersona(activePersona === persona.id ? null : persona.id)}
                  />
                  {idx < 5 && <ArrowRight className="text-slate-600 mx-1" size={16} />}
                </div>
              ))}
            </div>
            <div className="flex justify-center my-4">
              <ChevronRight className="text-teal-400 rotate-90" size={24} />
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {personas.slice(6, 13).map((persona, idx) => (
                <div key={persona.id} className="flex items-center">
                  <PersonaNode
                    persona={persona}
                    isActive={activePersona === persona.id}
                    onClick={() => setActivePersona(activePersona === persona.id ? null : persona.id)}
                  />
                  {idx < 6 && <ArrowRight className="text-slate-600 mx-1" size={16} />}
                </div>
              ))}
            </div>
            <div className="flex justify-center my-4">
              <ChevronRight className="text-orange-400 rotate-90" size={24} />
            </div>
            {/* Meta-Cognitive Layer */}
            <div className="flex items-center justify-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-cyan-500/30">
              <Brain className="text-cyan-400" size={24} />
              <span className="text-cyan-400 font-semibold">Meta-Cognitive Layer</span>
              <div className="flex gap-2">
                {personas.slice(13).map((persona) => (
                  <PersonaNode
                    key={persona.id}
                    persona={persona}
                    isActive={activePersona === persona.id}
                    onClick={() => setActivePersona(activePersona === persona.id ? null : persona.id)}
                    small
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Persona Detail */}
          {activePersona && (
            <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700">
              {(() => {
                const p = personas.find(x => x.id === activePersona)
                const cat = categories[p.category]
                return (
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-${cat.color}-500/20`}>
                      <p.icon className={`text-${cat.color}-400`} size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{p.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded bg-${cat.color}-500/20 text-${cat.color}-400`}>
                          {cat.name}
                        </span>
                      </div>
                      <p className="text-slate-300">{p.description}</p>
                      <p className="text-slate-500 text-sm mt-2 font-mono">ID: {p.id}</p>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Live Demo Button */}
          <div className="text-center">
            <button
              onClick={runChainDemo}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-400 hover:to-orange-400 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105"
            >
              <Zap size={24} />
              Run Chain Demo
            </button>
          </div>
        </div>
      </section>

      {/* Chain Demo Output */}
      {showChainDemo && (
        <section className="py-16 px-4 bg-slate-800/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Chain Execution Demo</h2>

            {/* Query */}
            <div className="bg-slate-900 rounded-xl p-4 mb-6 border border-slate-700">
              <div className="text-slate-400 text-sm mb-2">Input Query:</div>
              <p className="text-white font-mono">{sampleChainOutput.query}</p>
            </div>

            {/* Chain Steps */}
            <div className="space-y-4">
              {sampleChainOutput.steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`transform transition-all duration-500 ${
                    idx <= currentStep
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
                    <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${idx <= currentStep ? 'bg-teal-400 animate-pulse' : 'bg-slate-600'}`} />
                      <span className="text-teal-400 font-semibold">{step.persona}</span>
                      <span className="text-slate-500 text-sm">Step {idx + 1}</span>
                    </div>
                    <div className="p-4">
                      <p className="text-slate-300 text-sm font-mono">{step.output}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Context Accumulation Indicator */}
            <div className="mt-8 bg-gradient-to-r from-teal-500/20 to-orange-500/20 rounded-xl p-4 border border-teal-500/30">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Context Tokens Accumulated:</span>
                <span className="text-teal-400 font-mono font-bold">
                  {(currentStep + 1) * 847} tokens
                </span>
              </div>
              <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-orange-400 transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / sampleChainOutput.steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Live Chain Executor */}
      <section id="live-executor" className="py-16 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Live Chain Executor</h2>
          <p className="text-slate-400 text-center mb-8">
            Connect to your local Mirador instance and run real chains
          </p>

          {/* Connection Panel */}
          <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700">
            <div className="flex items-center gap-4 mb-4">
              <Server className="text-teal-400" size={24} />
              <h3 className="text-xl font-bold">Local Connection</h3>
              <div className={`ml-auto flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                isConnected ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
              }`}>
                {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white font-mono text-sm"
                placeholder="http://localhost:5001"
              />
              <button
                onClick={connectToApi}
                disabled={isConnecting}
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-600 text-slate-900 font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                {isConnecting ? <Loader2 className="animate-spin" size={18} /> : <Wifi size={18} />}
                {isConnecting ? 'Connecting...' : 'Connect'}
              </button>
            </div>

            {connectionError && (
              <p className="mt-4 text-red-400 text-sm">{connectionError}</p>
            )}

            {isConnected && apiHealth && (
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-900 rounded-lg p-3">
                  <div className="text-slate-400">Personas</div>
                  <div className="text-teal-400 font-bold text-lg">{apiHealth.personas_loaded}</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-3">
                  <div className="text-slate-400">Chains</div>
                  <div className="text-orange-400 font-bold text-lg">{apiHealth.chain_presets}</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-3">
                  <div className="text-slate-400">Models</div>
                  <div className="text-cyan-400 font-bold text-lg">{apiHealth.ollama?.models_available || 0}</div>
                </div>
              </div>
            )}
          </div>

          {/* Chain Executor */}
          {isConnected && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold mb-4">Execute Chain</h3>

              {/* Chain Selection */}
              <div className="mb-4">
                <label className="text-slate-400 text-sm mb-2 block">Chain Preset</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {chainPresets.map(chain => (
                    <button
                      key={chain.id}
                      onClick={() => setSelectedChain(chain.id)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        selectedChain === chain.id
                          ? 'bg-teal-500/20 border-2 border-teal-500 text-teal-400'
                          : 'bg-slate-900 border border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="font-semibold text-sm">{chain.name}</div>
                      <div className="text-xs text-slate-500">{chain.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="mb-4">
                <label className="text-slate-400 text-sm mb-2 block">Input Query</label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white font-mono text-sm resize-none"
                  placeholder="Enter your query... e.g., Review this code for security vulnerabilities"
                />
              </div>

              {/* Execute Button */}
              <button
                onClick={runLiveChain}
                disabled={isRunning || !inputText.trim()}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-400 hover:to-orange-400 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold px-6 py-3 rounded-lg transition-all"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Running {currentLiveStep || 'chain'}...
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Execute Chain
                  </>
                )}
              </button>

              {/* Live Output */}
              {liveOutputs.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-lg font-semibold text-slate-300">Chain Output</h4>
                  {liveOutputs.map((output, idx) => (
                    <div key={idx} className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
                      <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${output.complete ? 'bg-green-400' : 'bg-teal-400 animate-pulse'}`} />
                        <span className="text-teal-400 font-semibold">{output.persona}</span>
                        <span className="text-slate-500 text-sm">{output.description}</span>
                        {output.complete && (
                          <span className="ml-auto text-slate-500 text-xs">
                            {output.tokens} tokens | {(output.time_ms / 1000).toFixed(1)}s
                          </span>
                        )}
                      </div>
                      <div className="p-4 max-h-48 overflow-y-auto">
                        <pre className="text-slate-300 text-sm font-mono whitespace-pre-wrap">{output.content || '...'}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Not Connected Prompt */}
          {!isConnected && (
            <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-dashed border-slate-600">
              <WifiOff className="mx-auto text-slate-500 mb-4" size={48} />
              <p className="text-slate-400 mb-4">Connect to your local Mirador instance to run real chains</p>
              <code className="bg-slate-900 text-teal-400 px-4 py-2 rounded-lg text-sm font-mono">
                python api.py  # Start on localhost:5001
              </code>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Cpu className="text-teal-400" size={32} />}
              title="16 Personas"
              description="Specialized agents for development, security, business analysis, and creative tasks"
            />
            <FeatureCard
              icon={<Brain className="text-teal-400" size={32} />}
              title="Meta-Cognitive"
              description="Models that critique, synthesize, and improve their own outputs"
            />
            <FeatureCard
              icon={<Shield className="text-teal-400" size={32} />}
              title="100% Local"
              description="Zero data leaves your machine. HIPAA and finance ready."
            />
            <FeatureCard
              icon={<Terminal className="text-teal-400" size={32} />}
              title="REST API"
              description="Flask API with webhook support for seamless integration"
            />
          </div>
        </div>
      </section>

      {/* How Context Flows */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How Context Accumulates</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="arch-box text-center">
              <div className="text-4xl font-bold text-teal-400 mb-2">1</div>
              <h3 className="font-semibold mb-2">Initial Query</h3>
              <p className="text-slate-400 text-sm">Your query enters the chain with base context</p>
            </div>
            <div className="arch-box text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">2</div>
              <h3 className="font-semibold mb-2">Chain Execution</h3>
              <p className="text-slate-400 text-sm">Each persona adds analysis to the context window</p>
            </div>
            <div className="arch-box text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">3</div>
              <h3 className="font-semibold mb-2">Meta-Evaluation</h3>
              <p className="text-slate-400 text-sm">Meta-cognitive layer synthesizes and improves output</p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-16 px-4 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Architecture</h2>
          <div className="code-block text-xs md:text-sm leading-relaxed overflow-x-auto">
            <pre className="text-slate-300">
{`User Query
    |
    v
+---------------------------------------------------+
|  Flask API (api.py:5001)                          |
|  - /api/run (chain execution)                     |
|  - /api/run/<persona> (single model)              |
|  - /api/webhooks (event notifications)            |
+---------------------------------------------------+
    |
    v
+---------------------------------------------------+
|  AIFramework (framework.py)                       |
|  - Session management                             |
|  - Chain orchestration                            |
|  - Output persistence                             |
+---------------------------------------------------+
    |
    v
+---------------------------------------------------+
|  Persona Chain (16 specialists)                   |
|  master_coder -> code_reviewer -> ... -> ai_spec  |
+---------------------------------------------------+
    |
    v
+---------------------------------------------------+
|  Meta-Cognitive Layer                             |
|  - cross_model_synthesizer: Pattern ID            |
|  - feedback_loop_optimizer: Refinement            |
|  - self_reflection_guardian: Blindspot ID         |
+---------------------------------------------------+
    |
    v
+---------------------------------------------------+
|  Ollama (Local LLM Runtime)                       |
|  - llama3.2, phi4, gemma2:9b, mistral:7b         |
|  - Custom modelfiles with tuned parameters        |
+---------------------------------------------------+`}
            </pre>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section id="quickstart" className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Start</h2>
          <div className="space-y-4">
            <div className="code-block">
              <div className="text-slate-400 mb-2"># 1. Install Ollama</div>
              <code>curl -fsSL https://ollama.ai/install.sh | sh</code>
            </div>
            <div className="code-block">
              <div className="text-slate-400 mb-2"># 2. Clone & Install</div>
              <code>git clone https://github.com/guitargnarr/mirador{'\n'}cd mirador && pip install -r requirements.txt</code>
            </div>
            <div className="code-block">
              <div className="text-slate-400 mb-2"># 3. Start API</div>
              <code>python api.py</code>
            </div>
            <div className="code-block">
              <div className="text-slate-400 mb-2"># 4. Run a Chain</div>
              <code>{`curl -X POST http://localhost:5001/api/run \\
  -H "Content-Type: application/json" \\
  -d '{"input": "Review my code for security issues"}'`}</code>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="py-16 px-4 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">API Endpoints</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 px-4 text-teal-400">Endpoint</th>
                  <th className="py-3 px-4 text-teal-400">Method</th>
                  <th className="py-3 px-4 text-teal-400">Description</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4 font-mono text-sm">/api/health</td>
                  <td className="py-3 px-4">GET</td>
                  <td className="py-3 px-4">Health check</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4 font-mono text-sm">/api/personas</td>
                  <td className="py-3 px-4">GET</td>
                  <td className="py-3 px-4">List all personas and chain order</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4 font-mono text-sm">/api/run</td>
                  <td className="py-3 px-4">POST</td>
                  <td className="py-3 px-4">Run full chain with input</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4 font-mono text-sm">/api/run/&lt;persona&gt;</td>
                  <td className="py-3 px-4">POST</td>
                  <td className="py-3 px-4">Run single persona</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-sm">/api/webhooks</td>
                  <td className="py-3 px-4">GET/POST</td>
                  <td className="py-3 px-4">Webhook management</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Research Context */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Research Alignment</h2>
          <p className="text-slate-300 text-center mb-8">
            Mirador implements meta-cognitive patterns aligned with current AI agent research:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <ResearchLink
              title="Microsoft AI Agents"
              subtitle="Metacognition Curriculum"
              url="https://microsoft.github.io/ai-agents-for-beginners/09-metacognition/"
            />
            <ResearchLink
              title="Honda Research"
              subtitle="Meta-Cognitive Agentic AI"
              url="https://usa.honda-ri.com/-/meta-cognitive-agentic-ai-systems"
            />
            <ResearchLink
              title="Self-Evolving Agents"
              subtitle="arxiv:2508.00271"
              url="https://arxiv.org/abs/2508.00271"
            />
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 px-4 bg-slate-800/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Requirements</h2>
          <div className="grid grid-cols-3 gap-4 text-slate-300">
            <div className="arch-box">
              <div className="text-2xl font-bold text-teal-400 mb-2">Python</div>
              <div>3.11+</div>
            </div>
            <div className="arch-box">
              <div className="text-2xl font-bold text-teal-400 mb-2">Ollama</div>
              <div>Latest</div>
            </div>
            <div className="arch-box">
              <div className="text-2xl font-bold text-teal-400 mb-2">Disk</div>
              <div>~50GB</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="text-slate-400">
            MIT License
          </div>
          <div className="flex gap-6">
            <a
              href="https://github.com/guitargnarr/mirador"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-teal-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://projectlavos.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-teal-400 transition-colors"
            >
              projectlavos.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function PersonaNode({ persona, isActive, onClick, small = false }) {
  const cat = categories[persona.category]
  const colorMap = {
    teal: 'border-teal-500 bg-teal-500/20 text-teal-400',
    red: 'border-red-500 bg-red-500/20 text-red-400',
    orange: 'border-orange-500 bg-orange-500/20 text-orange-400',
    purple: 'border-purple-500 bg-purple-500/20 text-purple-400',
    cyan: 'border-cyan-500 bg-cyan-500/20 text-cyan-400',
  }

  return (
    <button
      onClick={onClick}
      className={`
        ${small ? 'p-2' : 'p-3'}
        rounded-lg border transition-all cursor-pointer
        ${isActive ? 'ring-2 ring-white scale-110' : 'hover:scale-105'}
        ${colorMap[cat.color]}
      `}
      title={persona.name}
    >
      <persona.icon size={small ? 16 : 20} />
    </button>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="arch-box text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  )
}

function ResearchLink({ title, subtitle, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="arch-box hover:border-teal-400 transition-colors group"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-white group-hover:text-teal-400 transition-colors">
            {title}
          </h3>
          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>
        <ExternalLink size={16} className="text-slate-500 group-hover:text-teal-400" />
      </div>
    </a>
  )
}

export default App
