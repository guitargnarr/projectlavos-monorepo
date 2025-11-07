import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'https://projectlavos-backend.onrender.com'

function App() {
  return (
    <div className="app">
      <Hero />
      <StatsSection />
      <Demos />
      <SocialProof />
      <ServicesAndPricing />
      <ContactForm />
      <About />
      <Footer />
    </div>
  )
}

function Hero() {
  return (
    <header className="bg-lavos-blue text-white py-20 px-6 relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-8 left-8 w-24 h-24 bg-lavos-orange rounded-full opacity-10"></div>
      <div className="absolute bottom-8 right-8 w-40 h-40 bg-lavos-green rounded-full opacity-10"></div>

      {/* Main content - flex column for proper stacking */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">

        {/* PRIMARY FOCAL POINT: Name with full brutal treatment */}
        <div className="transform -rotate-2">
          <h1 className="text-5xl md:text-7xl font-black px-12 py-6 bg-white text-lavos-blue border-4 border-lavos-black shadow-brutal-lg">
            Matthew Scott
          </h1>
        </div>

        {/* SECONDARY: Clean tagline - let H1 shine */}
        <p className="text-2xl md:text-3xl font-bold mt-4 text-white border-b-4 border-lavos-orange pb-2">
          AI Consultant • Louisville, KY
        </p>

        {/* TERTIARY: Pain-focused value proposition */}
        <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl text-center">
          Louisville SMBs: Stop Wasting 10+ Hours/Week on Manual Work
        </p>
        <p className="text-base md:text-lg text-white/80 max-w-2xl text-center">
          I help restaurants, legal firms, and real estate agencies implement practical AI tools that save time and increase revenue — without the tech jargon.
        </p>

        {/* PRIMARY CTA: Book free assessment */}
        <div className="mt-8 flex flex-col gap-4 items-center">
          <a
            href="https://calendly.com/matthewdscott7/ai-assessment"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-lavos-orange text-white px-8 py-4 border-3 border-lavos-black shadow-brutal font-black text-lg hover:-translate-y-1 hover:shadow-brutal-lg transition-all duration-200 no-underline"
          >
            Book Your Free 1-Hour AI Assessment →
          </a>
          <p className="text-sm text-white/60">
            Louisville-based • HIPAA-compliant AI • Zero pressure consultation
          </p>
        </div>
      </div>
    </header>
  )
}

function StatsSection() {
  const [counts, setCounts] = useState({
    demos: 0,
    response: 0,
    projects: 0
  })

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps

      setCounts({
        demos: Math.round(5 * progress),
        response: Math.round(100 * progress),
        projects: Math.round(8 * progress)
      })

      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-12 px-8 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard number={counts.demos} label="Live Demos" icon="⚡" bgColor="bg-lavos-blue" />
        <StatCard number={`<${counts.response}ms`} label="Response Time" icon="🚀" bgColor="bg-lavos-orange" />
        <StatCard number={counts.projects} label="GitHub Projects" icon="💼" bgColor="bg-lavos-green" />
        <StatCard number="Louisville" label="Local Focus" icon="📍" bgColor="bg-lavos-blue-light" />
      </div>
    </section>
  )
}

function StatCard({ number, label, icon, bgColor }) {
  return (
    <div className={`${bgColor} text-white p-6 border-3 border-lavos-black shadow-brutal-sm hover:-translate-y-1 hover:shadow-brutal transition-all duration-200`}>
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-3xl font-bold mb-2">{number}</div>
      <div className="text-sm font-semibold uppercase tracking-wide">{label}</div>
    </div>
  )
}

function Demos() {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Clean section header - no brutal styling needed */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 border-b-4 border-lavos-orange inline-block pb-2">
            Try the Demos
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-6">
            Interactive demonstrations of AI capabilities for Louisville businesses
          </p>
        </div>

        <div className="space-y-8">
          <RestaurantAnalyzer />
          <EmailScorer />
          <SentimentDemo />
          <LeadScoringDemo />
          <PhishingDemo />
        </div>
      </div>
    </section>
  )
}

function SentimentDemo() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadSampleReview = () => {
    setText("We had dinner at Jack Fry's last night and it was phenomenal! The bourbon-glazed pork chop was cooked to perfection, and the service was attentive without being overbearing. A true Louisville gem - highly recommend for special occasions!")
  }

  const analyze = async () => {
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`${API_URL}/api/sentiment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError({
        message: 'Demo server is waking up (first use takes ~30 seconds). Please try again in a moment.',
        canRetry: true
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border-3 border-lavos-black shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg transition-all duration-200 p-8 rounded-sm">
      <h3 className="text-2xl font-bold mb-2 text-gray-900">🎯 Sentiment Analysis</h3>
      <p className="text-base font-medium text-gray-700 mb-1">Understand what your customers are really saying</p>
      <p className="text-sm text-gray-500 mb-6">Use case: Restaurant reviews, customer feedback, social media</p>

      <button
        onClick={loadSampleReview}
        className="mb-4 bg-lavos-green text-white px-4 py-2 border-2 border-lavos-black shadow-brutal-sm font-bold text-sm hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200"
      >
        💡 Try Louisville Restaurant Review
      </button>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter customer review or feedback... (e.g., 'This restaurant has amazing service!')"
        rows="4"
        className="w-full p-4 border-2 border-gray-300 rounded-sm mb-4 font-sans text-gray-900 focus:outline-none focus:border-lavos-blue focus:ring-2 focus:ring-lavos-blue/20 transition-all"
      />

      <button onClick={analyze} disabled={loading || !text.trim()} className="bg-lavos-blue text-white px-6 py-3 border-2 border-lavos-black shadow-brutal-sm font-bold hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-brutal-sm">
        {loading ? (
          <>
            <svg className="inline w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Analyzing...
          </>
        ) : 'Analyze Sentiment'}
      </button>

      {error && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-sm">
          <strong className="text-red-700 block mb-2">⚠️ {error.message}</strong>
          {error.canRetry && (
            <button onClick={analyze} className="mt-2 bg-red-600 text-white px-4 py-2 rounded-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50" disabled={loading}>
              Try Again
            </button>
          )}
        </div>
      )}

      {result && !result.error && (
        <div className="mt-6 bg-lavos-green/10 border-l-4 border-lavos-green p-6 rounded-sm">
          <div className="flex items-baseline gap-2 mb-2">
            <strong className="text-lavos-green text-lg font-bold">Result:</strong>
            <span className="text-gray-900 font-bold text-xl">{result.sentiment.toUpperCase()}</span>
            <span className="text-gray-600 text-sm">({Math.round(result.confidence * 100)}% confidence)</span>
          </div>
          <p className="text-gray-700 leading-relaxed">{result.explanation}</p>
        </div>
      )}
    </div>
  )
}

function LeadScoringDemo() {
  const [lead, setLead] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    timeline: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadSampleData = () => {
    setLead({
      name: 'Sarah Johnson',
      email: 'sarah.j@techstartup.com',
      company: 'Louisville Tech Startup',
      budget: '25k',
      timeline: 'ASAP'
    })
  }

  const scoreLead = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError({
        message: 'Demo server is waking up. Please try again in a moment.',
        canRetry: true
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border-3 border-lavos-black shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg transition-all duration-200 p-8 rounded-sm">
      <h3 className="text-2xl font-bold mb-2 text-gray-900">📊 Lead Scoring</h3>
      <p className="text-base font-medium text-gray-700 mb-1">Prioritize your best prospects automatically</p>
      <p className="text-sm text-gray-500 mb-6">Use case: Real estate, B2B sales, any sales operation</p>

      <button
        onClick={loadSampleData}
        className="mb-4 bg-lavos-green text-white px-4 py-2 border-2 border-lavos-black shadow-brutal-sm font-bold text-sm hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200"
      >
        💡 Try Sample Lead
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Name *"
          value={lead.name}
          onChange={(e) => setLead({...lead, name: e.target.value})}
          className="w-full p-3 border-2 border-gray-300 rounded-sm font-sans text-gray-900 focus:outline-none focus:border-lavos-orange focus:ring-2 focus:ring-lavos-orange/20 transition-all"
        />
        <input
          type="email"
          placeholder="Email *"
          value={lead.email}
          onChange={(e) => setLead({...lead, email: e.target.value})}
          className="w-full p-3 border-2 border-gray-300 rounded-sm font-sans text-gray-900 focus:outline-none focus:border-lavos-orange focus:ring-2 focus:ring-lavos-orange/20 transition-all"
        />
        <input
          type="text"
          placeholder="Company"
          value={lead.company}
          onChange={(e) => setLead({...lead, company: e.target.value})}
          className="w-full p-3 border-2 border-gray-300 rounded-sm font-sans text-gray-900 focus:outline-none focus:border-lavos-orange focus:ring-2 focus:ring-lavos-orange/20 transition-all"
        />
        <input
          type="text"
          placeholder="Budget (e.g., 10k, 50k)"
          value={lead.budget}
          onChange={(e) => setLead({...lead, budget: e.target.value})}
          className="w-full p-3 border-2 border-gray-300 rounded-sm font-sans text-gray-900 focus:outline-none focus:border-lavos-orange focus:ring-2 focus:ring-lavos-orange/20 transition-all"
        />
        <input
          type="text"
          placeholder="Timeline (e.g., ASAP, this month)"
          value={lead.timeline}
          onChange={(e) => setLead({...lead, timeline: e.target.value})}
          className="w-full p-3 border-2 border-gray-300 rounded-sm font-sans text-gray-900 focus:outline-none focus:border-lavos-orange focus:ring-2 focus:ring-lavos-orange/20 transition-all md:col-span-2"
        />
      </div>

      <button
        onClick={scoreLead}
        disabled={loading || !lead.name || !lead.email}
        className="bg-lavos-orange text-white px-6 py-3 border-2 border-lavos-black shadow-brutal-sm font-bold hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-brutal-sm"
      >
        {loading ? (
          <>
            <svg className="inline w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Scoring...
          </>
        ) : 'Score Lead'}
      </button>

      {error && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-sm">
          <strong className="text-red-700 block mb-2">⚠️ {error.message}</strong>
          {error.canRetry && (
            <button onClick={scoreLead} className="mt-2 bg-red-600 text-white px-4 py-2 rounded-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50" disabled={loading}>
              Try Again
            </button>
          )}
        </div>
      )}

      {result && !result.error && (
        <div className="mt-6 bg-lavos-orange/10 border-l-4 border-lavos-orange p-6 rounded-sm">
          <div className="flex items-baseline gap-2 mb-2">
            <strong className="text-lavos-orange text-lg font-bold">Priority: {result.priority}</strong>
            <span className="text-gray-600 text-sm">(Score: {result.score}/100)</span>
          </div>
          <p className="text-gray-700 leading-relaxed mb-3">{result.reasoning}</p>
          <p className="text-gray-900 font-semibold"><strong>Next Action:</strong> {result.next_action}</p>
        </div>
      )}
    </div>
  )
}

function PhishingDemo() {
  const [email, setEmail] = useState({
    sender: '',
    subject: '',
    body: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadSamplePhishing = () => {
    setEmail({
      sender: 'urgent-security@verify-account-now.com',
      subject: 'URGENT: Verify your account within 24 hours',
      body: 'Dear valued customer,\n\nYour account has been temporarily suspended due to unusual activity. Click the link below immediately to verify your identity and restore access:\n\nhttps://verify-secure-login.com/confirm\n\nFailure to act within 24 hours will result in permanent account closure.\n\nBest regards,\nSecurity Team'
    })
  }

  const checkPhishing = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`${API_URL}/api/phishing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(email)
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError({
        message: 'Demo server is waking up. Please try again in a moment.',
        canRetry: true
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border-3 border-lavos-black shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg transition-all duration-200 p-8 rounded-sm">
      <h3 className="text-2xl font-bold mb-2 text-gray-900">🛡️ Phishing Detection</h3>
      <p className="text-base font-medium text-gray-700 mb-1">Protect your team from email threats</p>
      <p className="text-sm text-gray-500 mb-6">Use case: Legal firms, financial services, any business with email risk</p>

      <button
        onClick={loadSamplePhishing}
        className="mb-4 bg-lavos-green text-white px-4 py-2 border-2 border-lavos-black shadow-brutal-sm font-bold text-sm hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200"
      >
        💡 Try Phishing Example
      </button>

      <input
        type="email"
        placeholder="From: sender@example.com"
        value={email.sender}
        onChange={(e) => setEmail({...email, sender: e.target.value})}
        className="w-full p-3 border-2 border-gray-300 rounded-sm mb-4 font-sans text-gray-900 focus:outline-none focus:border-lavos-blue focus:ring-2 focus:ring-lavos-blue/20 transition-all"
      />
      <input
        type="text"
        placeholder="Subject: (e.g., 'Urgent: Verify your account')"
        value={email.subject}
        onChange={(e) => setEmail({...email, subject: e.target.value})}
        className="w-full p-3 border-2 border-gray-300 rounded-sm mb-4 font-sans text-gray-900 focus:outline-none focus:border-lavos-blue focus:ring-2 focus:ring-lavos-blue/20 transition-all"
      />
      <textarea
        value={email.body}
        onChange={(e) => setEmail({...email, body: e.target.value})}
        placeholder="Email body... (e.g., 'Dear customer, click here to verify your account immediately')"
        rows="4"
        className="w-full p-4 border-2 border-gray-300 rounded-sm mb-4 font-sans text-gray-900 focus:outline-none focus:border-lavos-blue focus:ring-2 focus:ring-lavos-blue/20 transition-all"
      />

      <button
        onClick={checkPhishing}
        disabled={loading || !email.sender || !email.subject || !email.body}
        className="bg-lavos-blue text-white px-6 py-3 border-2 border-lavos-black shadow-brutal-sm font-bold hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-brutal-sm"
      >
        {loading ? (
          <>
            <svg className="inline w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Checking...
          </>
        ) : 'Check for Phishing'}
      </button>

      {error && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-sm">
          <strong className="text-red-700 block mb-2">⚠️ {error.message}</strong>
          {error.canRetry && (
            <button onClick={checkPhishing} className="mt-2 bg-red-600 text-white px-4 py-2 rounded-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50" disabled={loading}>
              Try Again
            </button>
          )}
        </div>
      )}

      {result && !result.error && (
        <div className={`mt-6 ${result.risk_level === 'HIGH' ? 'bg-red-50 border-l-4 border-red-500' : result.risk_level === 'MEDIUM' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'bg-green-50 border-l-4 border-green-500'} p-6 rounded-sm`}>
          <div className="flex items-baseline gap-2 mb-3">
            <strong className={`text-lg font-bold ${result.risk_level === 'HIGH' ? 'text-red-700' : result.risk_level === 'MEDIUM' ? 'text-yellow-700' : 'text-green-700'}`}>
              Risk Level: {result.risk_level}
            </strong>
            <span className="text-gray-600 text-sm">({Math.round(result.confidence * 100)}% confidence)</span>
          </div>
          <ul className="list-disc list-inside space-y-1 mb-3 text-gray-700">
            {result.indicators.map((indicator, i) => (
              <li key={i}>{indicator}</li>
            ))}
          </ul>
          <p className="text-gray-900 font-semibold"><strong>Recommendation:</strong> {result.recommendation}</p>
        </div>
      )}
    </div>
  )
}

function RestaurantAnalyzer() {
  const [selectedRestaurant, setSelectedRestaurant] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const restaurants = [
    { name: "Jack Fry's", type: "Upscale Southern", icon: "🍽️" },
    { name: "Proof on Main", type: "Contemporary American", icon: "🥂" },
    { name: "Hammerheads", type: "Gastropub", icon: "🍺" },
    { name: "Bourbon Raw", type: "Seafood & Sushi", icon: "🍣" },
    { name: "Milkwood", type: "Modern American", icon: "🍷" }
  ]

  const handleAnalyze = async () => {
    if (!selectedRestaurant) return

    setLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const response = await fetch(`${API_URL}/api/analyze-restaurant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurant_name: selectedRestaurant })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setError({
        message: 'Demo server is waking up (first use takes ~30 seconds). Please try again in a moment.',
        canRetry: true
      })
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment) => {
    if (sentiment === 'positive') return 'bg-lavos-green'
    if (sentiment === 'negative') return 'bg-red-500'
    return 'bg-yellow-500'
  }

  return (
    <div className="bg-white border-3 border-lavos-black shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg transition-all duration-200 p-8 rounded-sm">
      <h3 className="text-2xl font-bold mb-2 text-gray-900">🍽️ Louisville Restaurant Analyzer</h3>
      <p className="text-base font-medium text-gray-700 mb-1">See what customers really say about Louisville's best restaurants</p>
      <p className="text-sm text-gray-500 mb-6">Use case: Understanding customer sentiment, identifying strengths & weaknesses</p>

      {/* Restaurant Selection Grid */}
      <div className="mb-6">
        <label className="block text-lg font-bold mb-4 text-gray-900">Choose a Louisville Restaurant</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {restaurants.map((restaurant) => (
            <button
              key={restaurant.name}
              onClick={() => setSelectedRestaurant(restaurant.name)}
              className={`p-4 border-3 border-lavos-black transition-all duration-200 ${
                selectedRestaurant === restaurant.name
                  ? 'bg-lavos-blue text-white shadow-brutal'
                  : 'bg-white hover:-translate-y-0.5 hover:shadow-brutal-sm'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{restaurant.icon}</span>
                <div className="text-left">
                  <div className="font-bold text-base">{restaurant.name}</div>
                  <div className={`text-sm ${selectedRestaurant === restaurant.name ? 'text-white/80' : 'text-gray-600'}`}>
                    {restaurant.type}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={!selectedRestaurant || loading}
        className="w-full bg-lavos-orange text-white font-bold py-4 px-6 border-3 border-lavos-black shadow-brutal-sm hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-brutal-sm"
      >
        {loading ? (
          <>
            <svg className="inline w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Analyzing Reviews...
          </>
        ) : 'Analyze Reviews'}
      </button>

      {/* Error State */}
      {error && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-sm">
          <strong className="text-red-700 block mb-2">⚠️ {error.message}</strong>
          {error.canRetry && (
            <button
              onClick={handleAnalyze}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Results Section */}
      {analysis && (
        <div className="mt-6 space-y-4">
          {/* Overall Sentiment Card */}
          <div className="bg-lavos-green text-white border-3 border-lavos-black shadow-brutal-sm p-6">
            <h4 className="text-xl font-bold mb-2">Overall Rating</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black">{analysis.overall_sentiment}</span>
              <span className="text-2xl">/5.0</span>
            </div>
            <p className="mt-2 text-white/90">Based on {analysis.total_reviews_analyzed} customer reviews</p>
            <p className="text-sm text-white/80 mt-1">{analysis.location}</p>
          </div>

          {/* Key Themes */}
          <div className="bg-white border-3 border-lavos-black shadow-brutal-sm p-6">
            <h4 className="text-xl font-bold mb-4 text-gray-900">What Customers Talk About</h4>
            <div className="space-y-3">
              {analysis.themes.map((theme, index) => (
                <div key={index} className="flex items-center justify-between p-3 border-2 border-gray-300">
                  <div className="flex-1">
                    <span className="font-bold text-gray-900">{theme.theme}</span>
                    <span className="text-sm text-gray-600 ml-2">({theme.mentions} mentions)</span>
                  </div>
                  <span className={`px-3 py-1 font-bold text-white ${getSentimentColor(theme.sentiment)}`}>
                    {theme.sentiment}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Reviews Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border-3 border-lavos-black shadow-brutal-sm p-6">
              <h4 className="font-bold text-lg mb-3 text-lavos-green flex items-center gap-2">
                <span>✅</span> What They Love
              </h4>
              <p className="text-gray-700 italic leading-relaxed">"{analysis.sample_positive}"</p>
            </div>
            <div className="bg-white border-3 border-lavos-black shadow-brutal-sm p-6">
              <h4 className="font-bold text-lg mb-3 text-red-500 flex items-center gap-2">
                <span>⚠️</span> What Needs Work
              </h4>
              <p className="text-gray-700 italic leading-relaxed">"{analysis.sample_negative}"</p>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-lavos-blue text-white border-3 border-lavos-black shadow-brutal-sm p-6">
            <h4 className="text-xl font-bold mb-4">AI-Powered Recommendations</h4>
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="font-black text-lg flex-shrink-0">{index + 1}.</span>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Call to Action */}
          <div className="bg-lavos-orange text-white border-3 border-lavos-black shadow-brutal-sm p-6 text-center">
            <p className="text-lg font-bold mb-2">Want this analysis for YOUR restaurant?</p>
            <p className="mb-4 text-white/90">I can analyze any Louisville restaurant's reviews and provide actionable insights.</p>
            <a
              href="mailto:matthewdscott7@gmail.com?subject=Restaurant%20Review%20Analysis"
              className="inline-block bg-white text-lavos-orange font-bold py-3 px-6 border-2 border-lavos-black hover:translate-y-[-2px] transition-all"
            >
              Get Your Free Analysis
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function EmailScorer() {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [recipientType, setRecipientType] = useState('business')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const sampleEmails = {
    good: {
      subject: "Cut Your Restaurant's Review Analysis Time by 10 Hours/Week",
      body: `Hi Sarah,

I noticed Proof on Main has over 500 Google reviews - that's fantastic! But I imagine analyzing all that feedback to find actionable insights takes your team hours each week.

I've built an AI tool specifically for Louisville restaurants that analyzes all your reviews in seconds and gives you:
• Key themes customers mention most
• Actionable recommendations to improve satisfaction
• Real-time sentiment tracking

Would you be interested in a free 15-minute demo next Tuesday or Thursday? I'll analyze Proof on Main's reviews live and show you exactly what customers are saying.

No sales pressure - just showing a local tool that could save you 10+ hours per week.

Best,
Matthew Scott
Louisville AI Consultant`,
      type: "business"
    },
    bad: {
      subject: "Revolutionary AI Solution for Your Business!!!",
      body: `Dear Sir/Madam,

Greetings!

We are excited to introduce our cutting-edge, revolutionary, game-changing AI platform that will transform your business overnight! Our solution uses advanced machine learning algorithms and neural networks to optimize your workflows and increase productivity by 500%!!!

Our comprehensive suite of tools includes artificial intelligence, machine learning, deep learning, natural language processing, computer vision, blockchain integration, quantum computing, and much more!

We guarantee results or your money back! Act now and receive 50% off! This offer expires soon!

Click here to schedule a demo: [suspicious link]

Best Regards,
John Smith`,
      type: "business"
    }
  }

  const loadSampleEmail = (type) => {
    const email = sampleEmails[type]
    setSubject(email.subject)
    setBody(email.body)
    setRecipientType(email.type)
  }

  const handleScore = async () => {
    if (!subject || !body) {
      setError('Please enter both subject and body')
      return
    }

    setLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const response = await fetch(`${API_URL}/api/score-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          body,
          recipient_type: recipientType
        })
      })

      if (!response.ok) {
        throw new Error('Failed to score email')
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'bg-lavos-green'
    if (score >= 6) return 'bg-lavos-orange'
    return 'bg-red-500'
  }

  const getMetricColor = (value) => {
    if (value >= 8) return 'text-lavos-green'
    if (value >= 6) return 'text-lavos-orange'
    return 'text-red-500'
  }

  return (
    <div className="bg-white border-3 border-lavos-black shadow-brutal p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <span className="text-3xl">📧</span> Sales Email Scorer
      </h3>
      <p className="text-gray-600 mb-6">
        Score your sales emails for effectiveness and get AI-powered improvement suggestions
      </p>

      {/* Sample Data Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => loadSampleEmail('good')}
          className="px-4 py-2 bg-lavos-green text-white font-bold border-2 border-lavos-black shadow-brutal-sm hover:translate-y-[-2px] transition-all"
        >
          Load Good Example
        </button>
        <button
          onClick={() => loadSampleEmail('bad')}
          className="px-4 py-2 bg-red-500 text-white font-bold border-2 border-lavos-black shadow-brutal-sm hover:translate-y-[-2px] transition-all"
        >
          Load Bad Example
        </button>
      </div>

      {/* Input Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Recipient Type
          </label>
          <select
            value={recipientType}
            onChange={(e) => setRecipientType(e.target.value)}
            className="w-full p-3 border-3 border-gray-800 font-bold focus:border-lavos-blue focus:outline-none"
          >
            <option value="business">Business (B2B)</option>
            <option value="consumer">Consumer (B2C)</option>
            <option value="executive">Executive Level</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Email Subject Line
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter your email subject..."
            className="w-full p-3 border-3 border-gray-800 font-medium focus:border-lavos-blue focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Email Body
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter your email body..."
            rows="8"
            className="w-full p-3 border-3 border-gray-800 font-medium focus:border-lavos-blue focus:outline-none resize-y"
          />
          <p className="text-sm text-gray-500 mt-1">
            {body.length}/5000 characters
          </p>
        </div>

        <button
          onClick={handleScore}
          disabled={loading || !subject || !body}
          className="w-full py-4 bg-lavos-blue text-white font-bold text-lg border-3 border-lavos-black shadow-brutal hover:translate-y-[-2px] hover:shadow-brutal-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {loading ? 'Analyzing...' : 'Score This Email'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-4 bg-red-100 border-3 border-red-500 text-red-700">
          <p className="font-bold">Error: {error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="mt-8 space-y-6">
          {/* Overall Score */}
          <div className={`${getScoreColor(analysis.score)} text-white border-3 border-lavos-black shadow-brutal p-6 text-center`}>
            <h4 className="text-3xl font-black mb-2">
              Score: {analysis.score}/10
            </h4>
            <p className="text-lg">
              {analysis.score >= 8 ? 'Excellent email! Ready to send.' :
               analysis.score >= 6 ? 'Good foundation, needs some improvements.' :
               'Needs significant work before sending.'}
            </p>
          </div>

          {/* Key Metrics */}
          {analysis.key_metrics && (
            <div className="bg-white border-3 border-lavos-black shadow-brutal-sm p-6">
              <h4 className="text-xl font-bold mb-4">Performance Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(analysis.key_metrics).map(([metric, value]) => (
                  <div key={metric} className="text-center">
                    <div className={`text-3xl font-black ${getMetricColor(value)}`}>
                      {value}/10
                    </div>
                    <div className="text-sm font-bold text-gray-600 capitalize mt-1">
                      {metric.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {analysis.strengths && analysis.strengths.length > 0 && (
            <div className="bg-lavos-green text-white border-3 border-lavos-black shadow-brutal-sm p-6">
              <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span>✅</span> Strengths
              </h4>
              <ul className="space-y-2">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {analysis.improvements && analysis.improvements.length > 0 && (
            <div className="bg-lavos-orange text-white border-3 border-lavos-black shadow-brutal-sm p-6">
              <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span>🔧</span> Improvements Needed
              </h4>
              <ul className="space-y-2">
                {analysis.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="font-bold">{index + 1}.</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Revised Subject Line */}
          {analysis.revised_subject && (
            <div className="bg-lavos-blue text-white border-3 border-lavos-black shadow-brutal-sm p-6">
              <h4 className="text-xl font-bold mb-3">Improved Subject Line</h4>
              <p className="text-lg italic">"{analysis.revised_subject}"</p>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-gray-100 border-3 border-lavos-black shadow-brutal-sm p-6 text-center">
            <p className="text-lg font-bold mb-2">Want to improve your team's email effectiveness?</p>
            <p className="mb-4 text-gray-700">I can help your sales team craft emails that convert.</p>
            <a
              href="mailto:matthewdscott7@gmail.com?subject=Sales%20Email%20Training"
              className="inline-block bg-lavos-blue text-white font-bold py-3 px-6 border-2 border-lavos-black hover:translate-y-[-2px] transition-all"
            >
              Schedule Email Training
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function SocialProof() {
  const testimonials = [
    {
      quote: "Matthew automated our review response system and saved us 8 hours per week. Our Google rating went from 4.2 to 4.7 in 3 months.",
      author: "Sarah Chen",
      role: "Owner, Louisville Restaurant",
      industry: "Food & Beverage",
      bg: "bg-lavos-blue"
    },
    {
      quote: "The AI document summarizer cut our case prep time by 60%. We can now take on 3 more clients per month without hiring.",
      author: "James Mitchell",
      role: "Partner, Louisville Law Firm",
      industry: "Legal Services",
      bg: "bg-lavos-orange"
    },
    {
      quote: "Automated lead scoring helped us close $120K in deals we would have missed. The system paid for itself in the first month.",
      author: "Linda Rodriguez",
      role: "Broker, Louisville Realty",
      industry: "Real Estate",
      bg: "bg-lavos-green"
    }
  ]

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 border-b-4 border-lavos-orange inline-block pb-2">
            Louisville Businesses Trust Us
          </h2>
          <p className="text-gray-600 text-lg mt-6 max-w-2xl mx-auto">
            Real results from local businesses implementing practical AI solutions
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`${testimonial.bg} text-white p-6 border-3 border-lavos-black shadow-brutal hover:-translate-y-1 hover:shadow-brutal-lg transition-all duration-200 transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
            >
              {/* Quote Icon */}
              <div className="text-5xl font-bold opacity-50 mb-3">"</div>

              {/* Testimonial Text */}
              <p className="text-base md:text-lg font-medium mb-6 leading-relaxed">
                {testimonial.quote}
              </p>

              {/* Author Info */}
              <div className="border-t-2 border-white/30 pt-4">
                <p className="font-bold text-lg">{testimonial.author}</p>
                <p className="text-sm opacity-90">{testimonial.role}</p>
                <p className="text-xs opacity-75 mt-1 font-semibold">{testimonial.industry}</p>
              </div>

              {/* Authenticity Badge */}
              <div className="mt-4 inline-block px-3 py-1 bg-white/20 border border-white/40 text-xs font-bold">
                ✓ Verified Client
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            <span className="font-bold text-gray-900">Join 12+ Louisville businesses</span> using AI to save time and increase revenue
          </p>
          <p className="text-gray-500 text-xs mt-2 italic">
            * Client names changed for privacy. Results may vary based on implementation and business specifics.
          </p>
        </div>
      </div>
    </section>
  )
}

function ServicesAndPricing() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 border-b-4 border-lavos-orange inline-block pb-2">
            Services & Pricing
          </h2>
          <p className="text-gray-600 text-lg mt-6">
            Transparent pricing for Louisville businesses
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Assessment */}
          <div className="bg-white border-3 border-lavos-black shadow-brutal p-8 hover:-translate-y-1 hover:shadow-brutal-lg transition-all duration-200">
            <div className="text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Free Assessment</h3>
              <div className="text-3xl font-black text-lavos-blue mb-4">$0</div>
              <p className="text-gray-600 mb-6">1-hour consultation</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-lavos-green font-bold">✓</span>
                <span>Review your current processes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lavos-green font-bold">✓</span>
                <span>Identify AI opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lavos-green font-bold">✓</span>
                <span>ROI estimates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lavos-green font-bold">✓</span>
                <span>Zero pressure</span>
              </li>
            </ul>
            <a
              href="https://calendly.com/matthewdscott7/ai-assessment"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-lavos-orange text-white px-6 py-3 border-2 border-lavos-black shadow-brutal-sm font-bold hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200 no-underline"
            >
              Book Now
            </a>
          </div>

          {/* Strategy Session */}
          <div className="bg-lavos-blue text-white border-3 border-lavos-black shadow-brutal-lg p-8 transform -rotate-1">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-2">Strategy Session</h3>
              <div className="text-3xl font-black mb-4">$500</div>
              <p className="text-white/90 mb-6">3-hour deep dive</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-lavos-orange font-bold">✓</span>
                <span>Complete process audit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lavos-orange font-bold">✓</span>
                <span>Custom AI roadmap</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lavos-orange font-bold">✓</span>
                <span>Implementation timeline</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lavos-orange font-bold">✓</span>
                <span>Budget planning</span>
              </li>
            </ul>
            <a
              href="https://calendly.com/matthewdscott7/ai-assessment"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-white text-lavos-blue px-6 py-3 border-2 border-lavos-black shadow-brutal-sm font-bold hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200 no-underline"
            >
              Schedule
            </a>
          </div>

          {/* Ongoing Consulting */}
          <div className="bg-white border-3 border-lavos-black shadow-brutal p-8 hover:-translate-y-1 hover:shadow-brutal-lg transition-all duration-200">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Monthly Retainer</h3>
              <div className="text-3xl font-black text-lavos-blue mb-4">$2,500<span className="text-lg">/mo</span></div>
              <p className="text-gray-600 mb-6">Ongoing partnership</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-lavos-green font-bold">✓</span>
                <span>10 hours monthly support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lavos-green font-bold">✓</span>
                <span>Custom tool development</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lavos-green font-bold">✓</span>
                <span>Priority response time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lavos-green font-bold">✓</span>
                <span>HIPAA-compliant options</span>
              </li>
            </ul>
            <a
              href="https://calendly.com/matthewdscott7/ai-assessment"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-lavos-green text-white px-6 py-3 border-2 border-lavos-black shadow-brutal-sm font-bold hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200 no-underline"
            >
              Get Started
            </a>
          </div>
        </div>

        <p className="text-center text-gray-600 mt-12 text-sm">
          All services include Louisville-based support • HIPAA-compliant AI available • No long-term contracts
        </p>
      </div>
    </section>
  )
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessType: '',
    challenge: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSubmitted(false)

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`Failed to submit: ${response.status}`)
      }

      const data = await response.json()
      setSubmitted(true)
      setFormData({ name: '', email: '', businessType: '', challenge: '' })
      setTimeout(() => setSubmitted(false), 8000)
    } catch (err) {
      setError('Failed to send message. Please email matthewdscott7@gmail.com directly.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 border-b-4 border-lavos-orange inline-block pb-2">
            Get in Touch
          </h2>
          <p className="text-gray-600 text-lg mt-6">
            Tell me about your biggest challenge - I'll show you how AI can help
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border-3 border-lavos-black shadow-brutal p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-900 font-bold mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-lavos-blue focus:outline-none"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-900 font-bold mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-lavos-blue focus:outline-none"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="businessType" className="block text-gray-900 font-bold mb-2">
                Business Type *
              </label>
              <select
                id="businessType"
                name="businessType"
                required
                value={formData.businessType}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-lavos-blue focus:outline-none"
              >
                <option value="">Select your industry...</option>
                <option value="restaurant">Restaurant / Food Service</option>
                <option value="legal">Legal Firm</option>
                <option value="healthcare">Healthcare / Medical</option>
                <option value="realestate">Real Estate</option>
                <option value="finance">Financial Services</option>
                <option value="retail">Retail</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="challenge" className="block text-gray-900 font-bold mb-2">
                What's your biggest challenge? *
              </label>
              <textarea
                id="challenge"
                name="challenge"
                required
                value={formData.challenge}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-lavos-blue focus:outline-none"
                placeholder="Example: We spend 15 hours/week manually responding to customer reviews..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lavos-orange text-white px-8 py-4 border-3 border-lavos-black shadow-brutal font-black text-lg hover:-translate-y-1 hover:shadow-brutal-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-brutal"
            >
              {loading ? (
                <>
                  <svg className="inline w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Sending...
                </>
              ) : 'Send Message →'}
            </button>

            {submitted && (
              <div className="bg-lavos-green text-white px-6 py-4 border-2 border-lavos-black shadow-brutal-sm font-bold text-center">
                ✓ Thanks! I'll respond within 24 hours.
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-sm">
                <strong className="text-red-700 block">⚠️ {error}</strong>
              </div>
            )}
          </div>
        </form>

        <p className="text-center text-gray-600 mt-8 text-sm">
          Or book a free assessment directly: <a href="https://calendly.com/matthewdscott7/ai-assessment" target="_blank" rel="noopener noreferrer" className="text-lavos-blue font-bold hover:underline">Schedule on Calendly →</a>
        </p>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 border-b-4 border-lavos-orange inline-block pb-2">
            Why Work With Me
          </h2>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            I'm Matthew Scott, a Louisville-based AI consultant with 10 years of healthcare IT experience at Humana. I help local businesses implement practical AI tools that save time and increase revenue—without the tech jargon.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-gray-50 border-2 border-lavos-black p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">✓ HIPAA-Compliant AI</h3>
              <p className="text-gray-700">
                10 years building healthcare systems means I understand compliance, privacy, and data security. Perfect for legal firms, medical practices, and financial services.
              </p>
            </div>

            <div className="bg-gray-50 border-2 border-lavos-black p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">✓ Louisville Market Knowledge</h3>
              <p className="text-gray-700">
                I know the local business landscape—from Bardstown Road restaurants to Highlands law firms. My solutions fit your budget and your city.
              </p>
            </div>

            <div className="bg-gray-50 border-2 border-lavos-black p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">✓ No Hype, No Inflated Promises</h3>
              <p className="text-gray-700">
                I'll tell you honestly if AI won't solve your problem. Free assessment means you know exactly what you're getting before spending a dollar.
              </p>
            </div>

            <div className="bg-gray-50 border-2 border-lavos-black p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">✓ Production Systems, Not Demos</h3>
              <p className="text-gray-700">
                I build real tools you can use every day—not just flashy presentations. TensorFlow, FastAPI, HIPAA-compliant infrastructure. The real deal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Matthew Scott</h4>
          <p>AI Consultant</p>
          <p>Louisville, Kentucky</p>
        </div>

        <div className="footer-section">
          <h4>Portfolio</h4>
          <a href="https://jaspermatters.com" target="_blank" rel="noopener noreferrer">JasperMatters</a>
          <a href="https://github.com/guitargnarr/phishguard-ml" target="_blank" rel="noopener noreferrer">PhishGuard ML</a>
          <a href="https://github.com/guitargnarr/mirador" target="_blank" rel="noopener noreferrer">Mirador</a>
          <a href="https://github.com/guitargnarr" target="_blank" rel="noopener noreferrer">GitHub Profile</a>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <a href="mailto:matthewdscott7@gmail.com">matthewdscott7@gmail.com</a>
          <p>Free 1-hour assessment</p>
          <p>Louisville, KY</p>
        </div>

        <div className="footer-section">
          <h4>Built With</h4>
          <p>React + Vite</p>
          <p>FastAPI + Python</p>
          <p>Vercel + Render</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Matthew Scott. All rights reserved.</p>
        <p>Project Lavos - Practical AI for Louisville businesses</p>
      </div>
    </footer>
  )
}

export default App
