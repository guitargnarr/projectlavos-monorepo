import { useState } from 'react'
import './App.css'

const API_URL = 'https://projectlavos-backend.onrender.com'

function App() {
  return (
    <div className="app">
      <Hero />
      <Demos />
      <About />
    </div>
  )
}

function Hero() {
  return (
    <header className="hero">
      <h1>Matthew Scott</h1>
      <p className="tagline">AI Consultant • Louisville, KY</p>
      <p className="mission">Practical AI tools for real business problems</p>
      <div className="proof-links">
        <a href="https://jaspermatters.com" target="_blank" rel="noopener noreferrer">
          Portfolio: jaspermatters.com
        </a>
        <span className="separator">•</span>
        <a href="https://github.com/guitargnarr" target="_blank" rel="noopener noreferrer">
          GitHub: guitargnarr
        </a>
      </div>
    </header>
  )
}

function Demos() {
  return (
    <section className="demos">
      <h2>Try the Demos</h2>
      <p className="demos-intro">Interactive demonstrations of AI capabilities for Louisville businesses</p>

      <SentimentDemo />
      <LeadScoringDemo />
      <PhishingDemo />
    </section>
  )
}

function SentimentDemo() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    if (!text.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/sentiment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Analysis failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="demo-card">
      <h3>🎯 Sentiment Analysis</h3>
      <p className="demo-description">Understand what your customers are really saying</p>
      <p className="use-case">Use case: Restaurant reviews, customer feedback, social media</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter customer review or feedback... (e.g., 'This restaurant has amazing service!')"
        rows="4"
        className="demo-input"
      />

      <button onClick={analyze} disabled={loading || !text.trim()} className="demo-button">
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

      {result && !result.error && (
        <div className={`result sentiment-${result.sentiment}`}>
          <strong>Result:</strong> {result.sentiment.toUpperCase()} ({Math.round(result.confidence * 100)}% confidence)
          <p>{result.explanation}</p>
        </div>
      )}
      {result && result.error && (
        <div className="result error">{result.error}</div>
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

  const scoreLead = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Scoring failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="demo-card">
      <h3>📊 Lead Scoring</h3>
      <p className="demo-description">Prioritize your best prospects automatically</p>
      <p className="use-case">Use case: Real estate, B2B sales, any sales operation</p>

      <div className="form-grid">
        <input
          type="text"
          placeholder="Name *"
          value={lead.name}
          onChange={(e) => setLead({...lead, name: e.target.value})}
          className="demo-input"
        />
        <input
          type="email"
          placeholder="Email *"
          value={lead.email}
          onChange={(e) => setLead({...lead, email: e.target.value})}
          className="demo-input"
        />
        <input
          type="text"
          placeholder="Company"
          value={lead.company}
          onChange={(e) => setLead({...lead, company: e.target.value})}
          className="demo-input"
        />
        <input
          type="text"
          placeholder="Budget (e.g., 10k, 50k)"
          value={lead.budget}
          onChange={(e) => setLead({...lead, budget: e.target.value})}
          className="demo-input"
        />
        <input
          type="text"
          placeholder="Timeline (e.g., ASAP, this month)"
          value={lead.timeline}
          onChange={(e) => setLead({...lead, timeline: e.target.value})}
          className="demo-input full-width"
        />
      </div>

      <button
        onClick={scoreLead}
        disabled={loading || !lead.name || !lead.email}
        className="demo-button"
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

      {result && !result.error && (
        <div className={`result priority-${result.priority.toLowerCase()}`}>
          <strong>Priority: {result.priority}</strong> (Score: {result.score}/100)
          <p>{result.reasoning}</p>
          <p className="next-action"><strong>Next Action:</strong> {result.next_action}</p>
        </div>
      )}
      {result && result.error && (
        <div className="result error">{result.error}</div>
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

  const checkPhishing = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/phishing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(email)
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Detection failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="demo-card">
      <h3>🛡️ Phishing Detection</h3>
      <p className="demo-description">Protect your team from email threats</p>
      <p className="use-case">Use case: Legal firms, financial services, any business with email risk</p>

      <input
        type="email"
        placeholder="From: sender@example.com"
        value={email.sender}
        onChange={(e) => setEmail({...email, sender: e.target.value})}
        className="demo-input"
      />
      <input
        type="text"
        placeholder="Subject: (e.g., 'Urgent: Verify your account')"
        value={email.subject}
        onChange={(e) => setEmail({...email, subject: e.target.value})}
        className="demo-input"
      />
      <textarea
        value={email.body}
        onChange={(e) => setEmail({...email, body: e.target.value})}
        placeholder="Email body... (e.g., 'Dear customer, click here to verify your account immediately')"
        rows="4"
        className="demo-input"
      />

      <button
        onClick={checkPhishing}
        disabled={loading || !email.sender || !email.subject || !email.body}
        className="demo-button"
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

      {result && !result.error && (
        <div className={`result risk-${result.risk_level.toLowerCase()}`}>
          <strong>Risk Level: {result.risk_level}</strong> ({Math.round(result.confidence * 100)}% confidence)
          <ul className="indicators">
            {result.indicators.map((indicator, i) => (
              <li key={i}>{indicator}</li>
            ))}
          </ul>
          <p className="recommendation"><strong>Recommendation:</strong> {result.recommendation}</p>
        </div>
      )}
      {result && result.error && (
        <div className="result error">{result.error}</div>
      )}
    </div>
  )
}

function About() {
  return (
    <section className="about">
      <h2>About</h2>
      <div className="about-content">
        <p>
          I'm <strong>Matthew Scott</strong>, a Louisville-based AI consultant. I help local businesses
          and individuals understand and implement AI tools that solve real problems.
        </p>
        <p>
          With 10 years of healthcare IT experience and proven ML engineering capabilities, I focus on
          practical AI applications - no hype, no inflated promises. Just tools that work.
        </p>
        <div className="proof-section">
          <h3>Proof of Work</h3>
          <ul>
            <li><a href="https://jaspermatters.com" target="_blank" rel="noopener noreferrer">jaspermatters.com</a> - Full-stack ML platform (TensorFlow, React, FastAPI)</li>
            <li><a href="https://github.com/guitargnarr/phishguard-ml" target="_blank" rel="noopener noreferrer">phishguard-ml</a> - 7-model ensemble phishing detector</li>
            <li><a href="https://github.com/guitargnarr/mirador" target="_blank" rel="noopener noreferrer">mirador</a> - Privacy-first AI orchestration framework</li>
            <li><a href="https://github.com/guitargnarr" target="_blank" rel="noopener noreferrer">GitHub Portfolio</a> - 8 public repositories</li>
          </ul>
        </div>
        <div className="contact-section">
          <h3>Get in Touch</h3>
          <p>Email: <a href="mailto:matthewdscott7@gmail.com">matthewdscott7@gmail.com</a></p>
          <p>Free 1-hour AI assessment for Louisville businesses</p>
        </div>
      </div>
    </section>
  )
}

export default App
