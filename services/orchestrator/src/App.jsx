import { useState, useEffect } from 'react'

const MIRADOR_API = 'https://mirador-xva2.onrender.com'

// Category icons and colors
const CATEGORY_CONFIG = {
  career: { icon: '💼', color: 'from-blue-500 to-blue-600' },
  development: { icon: '💻', color: 'from-purple-500 to-purple-600' },
  financial: { icon: '💰', color: 'from-green-500 to-green-600' },
  health: { icon: '🏃', color: 'from-pink-500 to-pink-600' },
  meta: { icon: '🧠', color: 'from-indigo-500 to-indigo-600' },
  music: { icon: '🎸', color: 'from-orange-500 to-orange-600' },
  security: { icon: '🔒', color: 'from-red-500 to-red-600' },
  utility: { icon: '🛠️', color: 'from-slate-500 to-slate-600' },
}

function App() {
  const [personas, setPersonas] = useState(null)
  const [chains, setChains] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [workflow, setWorkflow] = useState([])
  const [prompt, setPrompt] = useState('')
  const [results, setResults] = useState([])
  const [executing, setExecuting] = useState(false)
  const [activeTab, setActiveTab] = useState('build')

  useEffect(() => {
    async function fetchData() {
      try {
        const [personasRes, chainsRes] = await Promise.all([
          fetch(`${MIRADOR_API}/api/personas`),
          fetch(`${MIRADOR_API}/api/chains`)
        ])

        if (!personasRes.ok || !chainsRes.ok) {
          throw new Error('Failed to fetch from Mirador API')
        }

        const personasData = await personasRes.json()
        const chainsData = await chainsRes.json()

        setPersonas(personasData)
        setChains(chainsData)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const addToWorkflow = (persona) => {
    if (workflow.length < 5) {
      setWorkflow([...workflow, persona])
    }
  }

  const removeFromWorkflow = (index) => {
    setWorkflow(workflow.filter((_, i) => i !== index))
  }

  const loadChain = (chain) => {
    // Pre-built chains map to specific personas
    const chainPersonas = {
      security_audit: ['security_expert', 'code_reviewer', 'fact_validation_specialist'],
      code_review: ['master_coder', 'code_reviewer', 'debug_specialist', 'elite-frontend'],
      guitar_mastery: ['guitar_expert_precise', 'master_guitar_instructor', 'guitar_tone_architect'],
      career_acceleration: ['louisville_expert_v2', 'barrier-breaker', 'opportunity_identification_specialist', 'humanizer'],
      financial_planning: ['financial_planning_expert_v6', 'financial_calculator', 'decision_enhancer'],
      life_optimization: ['health_wellness_optimizer', 'productivity_optimizer', 'decision_enhancer', 'cross_model_synthesizer'],
    }

    const personaIds = chainPersonas[chain.id] || []
    const newWorkflow = []

    // Find personas by ID across all categories
    if (personas?.by_category) {
      for (const id of personaIds) {
        for (const category of Object.values(personas.by_category)) {
          const found = category.find(p => p.id === id)
          if (found) {
            newWorkflow.push({ ...found, category: Object.keys(personas.by_category).find(k => personas.by_category[k].includes(found)) })
            break
          }
        }
      }
    }

    setWorkflow(newWorkflow)
  }

  const executeWorkflow = async () => {
    if (!prompt.trim() || workflow.length === 0) return

    setExecuting(true)
    setResults([])
    setActiveTab('results')

    let currentPrompt = prompt
    const newResults = []

    for (const persona of workflow) {
      newResults.push({
        persona: persona.id,
        description: persona.description,
        status: 'running',
        input: currentPrompt,
        output: null
      })
      setResults([...newResults])

      try {
        const response = await fetch(`${MIRADOR_API}/api/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            persona_id: persona.id,
            question: currentPrompt
          })
        })

        if (!response.ok) throw new Error('API call failed')

        const data = await response.json()
        newResults[newResults.length - 1].output = data.response
        newResults[newResults.length - 1].status = 'complete'
        currentPrompt = data.response // Chain output to next persona
        setResults([...newResults])
      } catch (err) {
        newResults[newResults.length - 1].status = 'error'
        newResults[newResults.length - 1].output = err.message
        setResults([...newResults])
        break
      }
    }

    setExecuting(false)
  }

  const exportWorkflow = () => {
    const exportData = {
      title: 'Custom Workflow',
      description: `Workflow with ${workflow.length} personas`,
      version: '1.0.0',
      created_at: new Date().toISOString(),
      prompt: prompt,
      personas: workflow.map(p => ({
        id: p.id,
        description: p.description,
        model: p.model
      })),
      results: results.map(r => ({
        persona: r.persona,
        input: r.input,
        output: r.output,
        status: r.status
      }))
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `workflow-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Connecting to Mirador API...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-slate-800 p-8 rounded-xl border border-red-500/50">
          <p className="text-red-400 text-xl mb-2">Connection Error</p>
          <p className="text-slate-400">{error}</p>
          <p className="text-slate-400 text-sm mt-4">Mirador API may be warming up (free tier). Try again in 30 seconds.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-teal-500 hover:bg-teal-400 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
              Prompt Orchestrator
            </h1>
            <p className="text-slate-400 mt-1">Build AI workflows with {personas?.total} specialized personas</p>
          </div>
          <div className="flex gap-2">
            <a
              href="https://mirador.projectlavos.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors text-sm"
            >
              About Mirador
            </a>
            <a
              href="https://prompts.projectlavos.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors text-sm"
            >
              Prompt Factory
            </a>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 bg-slate-800 p-1 rounded-lg inline-flex">
          {['build', 'chains', 'results'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-teal-500 text-slate-900 font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {activeTab === 'build' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Workflow Builder */}
            <div className="lg:col-span-2 space-y-6">
              {/* Prompt Input */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-lg font-semibold text-white mb-4">Your Prompt</h2>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your question or task... This will be processed by each persona in sequence."
                  className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none resize-none"
                />
              </div>

              {/* Workflow Pipeline */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Workflow Pipeline</h2>
                  <span className="text-slate-400 text-sm">{workflow.length}/5 personas</span>
                </div>

                {workflow.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <p>Add personas from the right panel to build your workflow</p>
                    <p className="text-sm mt-2">Or load a pre-built chain from the Chains tab</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {workflow.map((persona, index) => (
                      <div key={index} className="flex items-center gap-3">
                        {index > 0 && (
                          <div className="text-teal-400 text-sm">→</div>
                        )}
                        <div className="flex-1 bg-slate-900 rounded-lg p-3 flex items-center justify-between group">
                          <div>
                            <span className="text-white font-medium">{persona.id}</span>
                            <span className="text-slate-400 text-sm ml-2">({persona.model})</span>
                          </div>
                          <button
                            onClick={() => removeFromWorkflow(index)}
                            className="text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={executeWorkflow}
                    disabled={workflow.length === 0 || !prompt.trim() || executing}
                    className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed rounded-lg font-medium transition-all"
                  >
                    {executing ? 'Executing...' : 'Execute Workflow'}
                  </button>
                  <button
                    onClick={() => setWorkflow([])}
                    disabled={workflow.length === 0}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Persona Selector */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 max-h-[600px] overflow-y-auto">
              <h2 className="text-lg font-semibold text-white mb-4">Available Personas</h2>

              {personas?.by_category && Object.entries(personas.by_category).map(([category, categoryPersonas]) => (
                <div key={category} className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{CATEGORY_CONFIG[category]?.icon || '📦'}</span>
                    <span className="text-slate-300 font-medium capitalize">{category}</span>
                    <span className="text-slate-400 text-sm">({categoryPersonas.length})</span>
                  </div>
                  <div className="space-y-2">
                    {categoryPersonas.map(persona => (
                      <button
                        key={persona.id}
                        onClick={() => addToWorkflow({ ...persona, category })}
                        disabled={workflow.length >= 5 || workflow.some(p => p.id === persona.id)}
                        className="w-full text-left p-3 bg-slate-900 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors group"
                      >
                        <div className="text-white text-sm font-medium group-hover:text-teal-400 transition-colors">
                          {persona.id}
                        </div>
                        <div className="text-slate-400 text-xs mt-1">{persona.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chains' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chains?.chains?.map(chain => (
              <div
                key={chain.id}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-teal-500/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{chain.id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                <p className="text-slate-400 text-sm mb-4">{chain.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-slate-400 text-sm">
                    {chain.persona_count} personas • {chain.accuracy}
                  </div>
                  <button
                    onClick={() => {
                      loadChain(chain)
                      setActiveTab('build')
                    }}
                    className="px-3 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 rounded-lg text-sm transition-colors"
                  >
                    Load
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-4">
            {results.length === 0 ? (
              <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
                <p className="text-slate-400">Execute a workflow to see results here</p>
              </div>
            ) : (
              <>
                <div className="flex justify-end">
                  <button
                    onClick={exportWorkflow}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-400 rounded-lg text-sm font-medium transition-colors"
                  >
                    Export Workflow JSON
                  </button>
                </div>
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`bg-slate-800 rounded-xl p-6 border ${
                      result.status === 'running' ? 'border-teal-500' :
                      result.status === 'error' ? 'border-red-500' :
                      'border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-teal-400 font-mono">Step {index + 1}</span>
                        <span className="text-white font-medium">{result.persona}</span>
                        <span className="text-slate-400 text-sm">{result.description}</span>
                      </div>
                      <span className={`text-sm ${
                        result.status === 'running' ? 'text-teal-400' :
                        result.status === 'error' ? 'text-red-400' :
                        'text-green-400'
                      }`}>
                        {result.status === 'running' && '● Running...'}
                        {result.status === 'complete' && '✓ Complete'}
                        {result.status === 'error' && '✕ Error'}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="text-slate-400 text-xs uppercase mb-1">Input</div>
                      <div className="bg-slate-900 rounded-lg p-3 text-slate-300 text-sm max-h-24 overflow-y-auto">
                        {result.input.length > 300 ? result.input.substring(0, 300) + '...' : result.input}
                      </div>
                    </div>

                    {result.output && (
                      <div>
                        <div className="text-slate-400 text-xs uppercase mb-1">Output</div>
                        <div className="bg-slate-900 rounded-lg p-3 text-slate-300 text-sm max-h-48 overflow-y-auto whitespace-pre-wrap">
                          {result.output}
                        </div>
                      </div>
                    )}

                    {result.status === 'running' && (
                      <div className="flex items-center gap-2 mt-4 text-teal-400">
                        <div className="animate-spin w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full"></div>
                        <span className="text-sm">Processing with {result.persona}...</span>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-12 text-center text-slate-400 text-sm">
        <p>Powered by <a href="https://mirador.projectlavos.com" className="text-teal-400 hover:text-teal-300">Mirador API</a> • Built with React</p>
        <p className="mt-1">Part of <a href="https://projectlavos.com" className="text-orange-400 hover:text-orange-300">Project Lavos</a></p>
      </footer>
    </div>
  )
}

export default App
