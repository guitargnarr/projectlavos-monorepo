import { useState, useEffect, useRef } from 'react'

function App() {
  const [copied, setCopied] = useState(null)

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
            <a href="https://github.com/guitargnarr/mirador" 
               className="text-slate-300 hover:text-white transition-colors"
               target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://projectlavos.com" 
               className="text-slate-300 hover:text-white transition-colors">
              Portfolio
            </a>
          </div>
        </nav>
        
        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            <span className="text-shimmer">AI Security Scanning</span>
            <span className="block text-2xl md:text-3xl mt-4 text-slate-300 font-normal">
              That Never Leaves Your Machine
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-6">
            Your code is sensitive. Cloud AI isn't an option.
          </p>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-4">
            Mirador runs 100% locally via Ollama - HIPAA, SOC2, and finance ready.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400 mb-12">
            <span className="flex items-center gap-2">
              <span className="text-teal-400">&#10003;</span> Found real CORS vulnerability in production
            </span>
            <span className="flex items-center gap-2">
              <span className="text-teal-400">&#10003;</span> 16 AI models review your code in sequence
            </span>
            <span className="flex items-center gap-2">
              <span className="text-teal-400">&#10003;</span> Zero API costs, zero data exposure
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
            <a href="https://github.com/guitargnarr/mirador"
               className="btn-elite px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold rounded-lg"
               target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
            <a href="#quickstart"
               className="btn-elite px-8 py-4 border border-slate-600 hover:border-teal-500 text-white rounded-lg glow-border">
              Quick Start
            </a>
          </div>
        </div>
      </header>

      {/* Who Is This For Section */}
      <section className="py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-8 text-slate-300">Built For Engineers Who Can't Use Cloud AI</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl mb-2">&#127973;</div>
              <h3 className="font-semibold text-teal-400 mb-1">Healthcare / HIPAA</h3>
              <p className="text-sm text-slate-500">Patient data can't leave your network</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">&#128179;</div>
              <h3 className="font-semibold text-teal-400 mb-1">Finance / SOC2</h3>
              <p className="text-sm text-slate-500">Trading algorithms, PII, audit trails</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">&#128274;</div>
              <h3 className="font-semibold text-teal-400 mb-1">Defense / IP</h3>
              <p className="text-sm text-slate-500">Proprietary code stays proprietary</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Send your code to the local API. Get back security findings from 16 specialized AI models that review in sequence and self-critique.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              title="Send Code"
              description="POST your code to localhost:5001 - it never leaves your machine"
              icon="1"
            />
            <FeatureCard 
              title="16 Models Analyze"
              description="Security expert, code reviewer, architect - each adds perspective"
              icon="2"
            />
            <FeatureCard 
              title="Self-Critique"
              description="Meta-cognitive layer identifies blind spots in the analysis"
              icon="3"
            />
            <FeatureCard 
              title="Get Findings"
              description="Structured report of vulnerabilities with severity and fixes"
              icon="4"
            />
          </div>
        </div>
      </section>

      {/* Interactive VHS Demo */}
      <VHSTerminalDemo />

      {/* Real Example Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Real Example: SQL Injection Found</h2>
          <p className="text-slate-400 text-center mb-8 max-w-2xl mx-auto">
            Input vulnerable code, get actionable security findings.
          </p>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input */}
            <div className="bg-slate-800 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-slate-700/50 text-sm text-slate-400">Input: Vulnerable Code</div>
              <pre className="p-4 text-sm overflow-x-auto text-orange-300">
{`def login(user, pwd):
    query = f"SELECT * FROM users 
             WHERE name={user} AND pass={pwd}"
    return db.execute(query)`}
              </pre>
            </div>
            
            {/* Output */}
            <div className="bg-slate-800 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-slate-700/50 text-sm text-slate-400">Output: Security Findings</div>
              <div className="p-4 text-sm space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">CRITICAL</span>
                  <span className="text-slate-300">SQL Injection (CWE-89)</span>
                </div>
                <p className="text-slate-400 text-xs">F-string interpolation allows: user = "admin'--"</p>
                <div className="border-t border-slate-700 pt-3">
                  <span className="text-teal-400 text-xs font-semibold">FIX:</span>
                  <pre className="text-xs text-slate-300 mt-1">cursor.execute("SELECT * FROM users WHERE name=? AND pass=?", (user, pwd))</pre>
                </div>
              </div>
            </div>
          </div>
          
          {/* Accuracy badges */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <ResultCard 
              chain="security_audit"
              accuracy="100%"
              bestFor="SQL injection, CORS, auth, secrets"
              status="recommended"
            />
            <ResultCard 
              chain="architecture"
              accuracy="~70%"
              bestFor="Design review (provide context)"
              status="good"
            />
            <ResultCard 
              chain="code_review"
              accuracy="Weak"
              bestFor="Use Claude Code instead"
              status="not-recommended"
            />
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-24 bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Architecture</h2>
          <div className="bg-slate-900 rounded-xl p-6 md:p-8 overflow-x-auto">
            <pre className="text-sm md:text-base text-slate-300 leading-relaxed">
{`User Query
    │
    ▼
┌───────────────────────────────────────────────┐
│  Flask API (api.py:5001)                      │
│  - /api/run (chain execution)                 │
│  - /api/run/<persona> (single model)          │
│  - /api/webhooks (event notifications)        │
└───────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────┐
│  AIFramework (framework.py)                   │
│  - Session management                         │
│  - Chain orchestration                        │
│  - Output persistence                         │
└───────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────┐
│  Persona Chain (16 specialists)               │
│  master_coder → code_reviewer → ... → ai_spec │
└───────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────┐
│  Meta-Cognitive Layer                         │
│  - cross_model_synthesizer: Patterns          │
│  - feedback_loop_optimizer: Refinement        │
│  - mirador_self_reflection_guardian: Blindspots│
└───────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────┐
│  Ollama (Local LLM Runtime)                   │
│  llama3.2, phi4, gemma2:9b, mistral:7b       │
└───────────────────────────────────────────────┘`}
            </pre>
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

      {/* API Endpoints */}
      <section className="py-24 bg-slate-800/50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">API Endpoints</h2>
          <div className="space-y-4">
            <EndpointRow method="GET" path="/api/health" description="Health check" />
            <EndpointRow method="GET" path="/api/personas" description="List all personas and chain order" />
            <EndpointRow method="GET" path="/api/sessions" description="List available sessions" />
            <EndpointRow method="POST" path="/api/run" description="Run full chain with input" />
            <EndpointRow method="POST" path="/api/run/<persona_id>" description="Run single persona" />
            <EndpointRow method="GET/POST" path="/api/webhooks" description="Webhook management" />
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Research Alignment</h2>
          <p className="text-slate-400 mb-8">
            Mirador implements meta-cognitive patterns aligned with current AI agent research:
          </p>
          <div className="flex flex-col gap-4">
            <a href="https://microsoft.github.io/ai-agents-for-beginners/09-metacognition/" 
               className="text-teal-400 hover:text-teal-300 transition-colors"
               target="_blank" rel="noopener noreferrer">
              Microsoft AI Agents Curriculum - Metacognition
            </a>
            <a href="https://usa.honda-ri.com/-/meta-cognitive-agentic-ai-systems" 
               className="text-teal-400 hover:text-teal-300 transition-colors"
               target="_blank" rel="noopener noreferrer">
              Honda Research - Meta-Cognitive Agentic AI Systems
            </a>
            <a href="https://arxiv.org/abs/2508.00271" 
               className="text-teal-400 hover:text-teal-300 transition-colors"
               target="_blank" rel="noopener noreferrer">
              Self-Evolving Agents (arxiv:2508.00271)
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
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

function FeatureCard({ title, description, icon }) {
  const isNumber = /^[0-9]$/.test(icon)
  return (
    <div className="card-elite bg-slate-800 rounded-xl p-6 hover:bg-slate-700/50">
      {isNumber ? (
        <div className="number-badge w-10 h-10 rounded-full bg-teal-500 text-slate-900 flex items-center justify-center font-bold text-lg mb-4 animate-pulse-glow">{icon}</div>
      ) : (
        <div className="text-4xl mb-4 animate-float">{icon}</div>
      )}
      <h3 className="text-xl font-semibold mb-2 text-teal-400">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  )
}

function ResultCard({ chain, accuracy, bestFor, status }) {
  const statusColors = {
    'recommended': 'bg-teal-500/20 border-teal-500 text-teal-400',
    'good': 'bg-orange-500/20 border-orange-500 text-orange-400',
    'not-recommended': 'bg-slate-500/20 border-slate-500 text-slate-400'
  }
  
  return (
    <div className={`rounded-xl p-6 border ${statusColors[status]}`}>
      <h3 className="text-lg font-mono mb-2">{chain}</h3>
      <div className="text-3xl font-bold mb-2">{accuracy}</div>
      <p className="text-sm opacity-80">{bestFor}</p>
    </div>
  )
}

function EndpointRow({ method, path, description }) {
  const methodColors = {
    'GET': 'bg-teal-500/20 text-teal-400',
    'POST': 'bg-orange-500/20 text-orange-400',
    'GET/POST': 'bg-purple-500/20 text-purple-400'
  }
  
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 bg-slate-900 rounded-lg">
      <span className={`px-3 py-1 rounded text-xs font-mono ${methodColors[method]} w-fit`}>
        {method}
      </span>
      <code className="text-teal-400 font-mono">{path}</code>
      <span className="text-slate-400 md:ml-auto">{description}</span>
    </div>
  )
}

// VHS-style Terminal Demo Component
function VHSTerminalDemo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)
  const terminalRef = useRef(null)

  const demoSteps = [
    { type: 'command', text: '$ curl -X POST http://localhost:5001/api/chain/security_audit \\', delay: 50 },
    { type: 'command', text: '  -H "Content-Type: application/json" \\', delay: 50 },
    { type: 'command', text: `  -d '{"input": "def login(user, pwd): query = f'SELECT * FROM users...'"}'`, delay: 50 },
    { type: 'output', text: '\n', delay: 100 },
    { type: 'status', text: '[Chain: security_audit] Starting 4 personas...', delay: 800 },
    { type: 'output', text: '\n', delay: 200 },
    { type: 'persona', name: 'security_expert', text: 'Analyzing for vulnerabilities...', delay: 600 },
    { type: 'finding', severity: 'CRITICAL', text: 'SQL Injection (CWE-89) - f-string allows: user="admin\'--"', delay: 1200 },
    { type: 'output', text: '\n', delay: 300 },
    { type: 'persona', name: 'code_reviewer', text: 'Reviewing code quality...', delay: 600 },
    { type: 'finding', severity: 'HIGH', text: 'No input validation on user/pwd parameters', delay: 1000 },
    { type: 'output', text: '\n', delay: 300 },
    { type: 'persona', name: 'cross_model_synthesizer', text: 'Synthesizing findings...', delay: 600 },
    { type: 'synthesis', text: 'Pattern: Injection vulnerabilities from string interpolation', delay: 1000 },
    { type: 'synthesis', text: 'Recommendation: Use parameterized queries', delay: 800 },
    { type: 'output', text: '\n', delay: 300 },
    { type: 'persona', name: 'self_reflection_guardian', text: 'Checking for blind spots...', delay: 600 },
    { type: 'blindspot', text: 'Missing: Rate limiting, session management, password hashing', delay: 1000 },
    { type: 'output', text: '\n', delay: 400 },
    { type: 'complete', text: '[Complete] 4 personas, 1258 tokens, 12.3s', delay: 500 },
  ]

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(v => !v)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [displayedText])

  const runDemo = async () => {
    if (isPlaying) return
    setIsPlaying(true)
    setDisplayedText('')
    setCurrentStep(0)

    for (let i = 0; i < demoSteps.length; i++) {
      const step = demoSteps[i]
      setCurrentStep(i)

      if (step.type === 'command') {
        // Type out character by character
        for (let j = 0; j < step.text.length; j++) {
          await new Promise(r => setTimeout(r, step.delay))
          setDisplayedText(prev => prev + step.text[j])
        }
        setDisplayedText(prev => prev + '\n')
      } else if (step.type === 'output') {
        await new Promise(r => setTimeout(r, step.delay))
        setDisplayedText(prev => prev + step.text)
      } else if (step.type === 'status') {
        await new Promise(r => setTimeout(r, step.delay))
        setDisplayedText(prev => prev + `\x1b[33m${step.text}\x1b[0m\n`)
      } else if (step.type === 'persona') {
        await new Promise(r => setTimeout(r, step.delay))
        setDisplayedText(prev => prev + `\x1b[36m[${step.name}]\x1b[0m ${step.text}\n`)
      } else if (step.type === 'finding') {
        await new Promise(r => setTimeout(r, step.delay))
        const color = step.severity === 'CRITICAL' ? '31' : step.severity === 'HIGH' ? '33' : '32'
        setDisplayedText(prev => prev + `  \x1b[${color}m[${step.severity}]\x1b[0m ${step.text}\n`)
      } else if (step.type === 'synthesis') {
        await new Promise(r => setTimeout(r, step.delay))
        setDisplayedText(prev => prev + `  \x1b[35m>\x1b[0m ${step.text}\n`)
      } else if (step.type === 'blindspot') {
        await new Promise(r => setTimeout(r, step.delay))
        setDisplayedText(prev => prev + `  \x1b[33m!\x1b[0m ${step.text}\n`)
      } else if (step.type === 'complete') {
        await new Promise(r => setTimeout(r, step.delay))
        setDisplayedText(prev => prev + `\x1b[32m${step.text}\x1b[0m\n`)
      }
    }

    setIsPlaying(false)
  }

  // Parse ANSI-like codes to JSX
  const renderTerminalText = (text) => {
    const parts = text.split(/(\x1b\[\d+m)/)
    let currentColor = 'text-slate-300'
    const colorMap = {
      '\x1b[31m': 'text-red-400',
      '\x1b[32m': 'text-green-400',
      '\x1b[33m': 'text-yellow-400',
      '\x1b[35m': 'text-purple-400',
      '\x1b[36m': 'text-teal-400',
      '\x1b[0m': 'text-slate-300'
    }

    return parts.map((part, i) => {
      if (colorMap[part]) {
        currentColor = colorMap[part]
        return null
      }
      return <span key={i} className={currentColor}>{part}</span>
    })
  }

  const progress = Math.round((currentStep / (demoSteps.length - 1)) * 100)

  return (
    <section className="py-24 bg-slate-800/50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4">See It In Action</h2>
        <p className="text-slate-400 text-center mb-8">
          Watch a security audit chain analyze vulnerable code in real-time
        </p>

        {/* VHS-style Terminal */}
        <div className="relative">
          {/* VHS tracking lines effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent animate-vhs-scan" />
          </div>

          {/* Terminal window */}
          <div className="terminal-elite bg-slate-950 rounded-xl overflow-hidden border border-slate-700 shadow-2xl relative">
            {/* Terminal header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-slate-500 text-sm font-mono">mirador-demo.tape</span>
              <div className="flex items-center gap-2">
                {isPlaying && (
                  <span className="text-red-400 text-xs animate-pulse flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    REC
                  </span>
                )}
              </div>
            </div>

            {/* Terminal content */}
            <div
              ref={terminalRef}
              className="p-4 h-80 overflow-y-auto font-mono text-sm leading-relaxed"
              style={{ fontFamily: '"Fira Code", "Monaco", monospace' }}
            >
              <pre className="whitespace-pre-wrap">
                {renderTerminalText(displayedText)}
                {cursorVisible && <span className="bg-teal-400 text-slate-900">_</span>}
              </pre>
            </div>

            {/* Progress bar */}
            {isPlaying && (
              <div className="px-4 pb-4">
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-orange-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Play button */}
          <div className="mt-6 text-center">
            <button
              onClick={runDemo}
              disabled={isPlaying}
              className={`btn-elite px-8 py-4 rounded-lg font-semibold ${
                isPlaying
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-900'
              }`}
            >
              {isPlaying ? 'Running Demo...' : 'Run Security Audit Demo'}
            </button>
            <p className="text-slate-500 text-sm mt-3">
              Simulated output - run locally for real analysis
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default App
