import { useState } from 'react'

const tracks = [
  {
    number: 1,
    title: "Red Thread",
    phase: "Tension",
    lyric: "I followed it because it knew me better than I knew myself."
  },
  {
    number: 2,
    title: "False Floor",
    phase: "Collapse",
    lyric: "The floor didn't fall away. I did."
  },
  {
    number: 3,
    title: "Integer",
    phase: "Reduction",
    lyric: "I became smaller to understand the shape of what contained me."
  },
  {
    number: 4,
    title: "Claw My Way",
    phase: "Struggle",
    lyric: "Stone remembers the mark of my struggle."
  },
  {
    number: 5,
    title: "Split Crown",
    phase: "Schism",
    lyric: "A schism… or perhaps a symmetry."
  },
  {
    number: 6,
    title: "Runloop",
    phase: "Recursion",
    lyric: "If repetition is a prison, then pattern is a key."
  },
  {
    number: 7,
    title: "Seventh Heaven",
    phase: "Ascension",
    lyric: "Ascension is not a place. It is an understanding."
  }
]

function App() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [activeTrack, setActiveTrack] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      // TODO: Connect to email service
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-bone">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] z-10" />

        {/* Hero image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/queen.jpg"
            alt="The Queen - A two-headed figure representing a divided psyche"
            className="h-full w-full object-cover object-top opacity-80"
          />
        </div>

        {/* Title overlay */}
        <div className="relative z-20 text-center px-4">
          <h1 className="font-serif text-6xl md:text-8xl font-semibold tracking-wide mb-4 text-bone drop-shadow-2xl">
            Red Thread
          </h1>
          <p className="font-sans text-lg md:text-xl font-light tracking-widest uppercase text-bone/70">
            A Concept Album
          </p>
          <div className="mt-8">
            <a
              href="#tracks"
              className="inline-block border border-thread/50 px-8 py-3 text-sm tracking-widest uppercase hover:bg-thread/20 transition-all duration-300"
            >
              Enter
            </a>
          </div>
        </div>

        {/* Thread line decoration */}
        <div className="thread-line absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-thread to-transparent" />
      </section>

      {/* Concept Section */}
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl mb-8 text-bone/90">The Queen</h2>
          <p className="font-sans text-lg leading-relaxed text-bone/70 max-w-2xl mx-auto">
            A two-headed figure representing a divided psyche. One head is Machine—circuits and maze,
            rhythm and logic. The other is Crystal—geometric and pure, melody and intuition.
            Together they wear a single crown.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-thread text-4xl mb-4">↓</div>
            <h3 className="font-serif text-xl mb-2">Descent</h3>
            <p className="text-sm text-bone/50">Tension → Collapse → Reduction</p>
          </div>
          <div className="p-6">
            <div className="text-thread text-4xl mb-4">◇</div>
            <h3 className="font-serif text-xl mb-2">Nadir</h3>
            <p className="text-sm text-bone/50">Integer — The irreducible self</p>
          </div>
          <div className="p-6">
            <div className="text-thread text-4xl mb-4">↑</div>
            <h3 className="font-serif text-xl mb-2">Ascent</h3>
            <p className="text-sm text-bone/50">Struggle → Schism → Recursion → Integration</p>
          </div>
        </div>
      </section>

      {/* Track Listing */}
      <section id="tracks" className="py-24 px-4 bg-[#080808]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-16 text-bone/90">
            Seven Tracks
          </h2>

          <div className="space-y-1">
            {tracks.map((track) => (
              <div
                key={track.number}
                className="track-item group cursor-pointer border-b border-bone/10 py-6"
                onMouseEnter={() => setActiveTrack(track.number)}
                onMouseLeave={() => setActiveTrack(null)}
              >
                <div className="flex items-baseline gap-6">
                  <span className="track-number font-sans text-sm text-bone/30 w-8 transition-colors">
                    {String(track.number).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-4 mb-2">
                      <h3 className="font-serif text-2xl md:text-3xl">{track.title}</h3>
                      <span className="text-xs uppercase tracking-widest text-thread/70">
                        {track.phase}
                      </span>
                    </div>
                    <p
                      className={`font-serif italic text-bone/50 text-sm md:text-base transition-all duration-300 ${
                        activeTrack === track.number ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                      }`}
                    >
                      "{track.lyric}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Arc visualization */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-bone/40">
            Tension → Collapse → Reduction → Struggle → Division → Recursion → Integration
          </p>
        </div>
      </section>

      {/* Email Signup */}
      <section className="py-24 px-4 bg-[#080808]">
        <div className="max-w-md mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl mb-4">Follow the Thread</h2>
          <p className="text-bone/50 mb-8 text-sm">
            Be notified when the album releases.
          </p>

          {submitted ? (
            <div className="text-thread">
              <p className="font-serif text-lg">The thread is connected.</p>
              <p className="text-sm text-bone/50 mt-2">You'll hear from us.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-transparent border border-bone/20 px-4 py-3 text-sm focus:outline-none focus:border-thread/50 transition-colors"
              />
              <button
                type="submit"
                className="bg-thread/20 border border-thread/50 px-6 py-3 text-sm uppercase tracking-widest hover:bg-thread/30 transition-colors"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 text-center">
        <div className="thread-line h-px bg-gradient-to-r from-transparent via-thread/30 to-transparent mb-8" />
        <p className="font-serif text-lg text-bone/30">Red Thread</p>
        <p className="text-xs text-bone/20 mt-2">MMXXV</p>
      </footer>
    </div>
  )
}

export default App
