import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 gradient-text">About FretVision</h1>
        <p className="text-xl text-gray-400">
          Your complete guitar learning companion
        </p>
      </header>

      {/* Mission Section */}
      <section className="mb-12">
        <div className="settings-panel-elite p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-teal-400 mb-4">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed">
            FretVision is designed to help guitarists of all levels visualize, learn, and master
            the fretboard. Whether you're learning your first scale or exploring advanced music theory,
            our interactive tools make practice engaging and effective.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Core Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="settings-panel-elite p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-teal-400 mb-2">Interactive Fretboard</h3>
            <p className="text-gray-400 text-sm">
              Visualize scales, chords, and patterns across the entire neck with clickable notes and real-time audio feedback.
            </p>
          </div>

          <div className="settings-panel-elite p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-orange-400 mb-2">Tab Player</h3>
            <p className="text-gray-400 text-sm">
              Load and play Guitar Pro files with synchronized notation, cursor tracking, and adjustable playback speed.
            </p>
          </div>

          <div className="settings-panel-elite p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">Riff Generator</h3>
            <p className="text-gray-400 text-sm">
              Generate custom riffs with 12 scales, 8 patterns, and 4 tunings. Export to Tab, MIDI, or GP5 format.
            </p>
          </div>

          <div className="settings-panel-elite p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Practice Tools</h3>
            <p className="text-gray-400 text-sm">
              Chromatic tuner, metronome, backing tracks, and ear training exercises to build your skills.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Built With</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {['React', 'Vite', 'Tailwind CSS', 'alphaTab', 'Web Audio API', 'Tone.js'].map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 bg-slate-800 rounded-full text-sm text-gray-300 border border-slate-700"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <div className="settings-panel-elite p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Start?</h2>
          <p className="text-gray-400 mb-6">
            Explore the fretboard and start your guitar journey today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/fretvision"
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold rounded-lg transition-all"
            >
              Open Fretboard
            </Link>
            <Link
              to="/riff-generator"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-slate-900 font-semibold rounded-lg transition-all"
            >
              Generate Riffs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Credits */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Part of the <a href="https://projectlavos.com" className="text-teal-400 hover:text-teal-300">Project Lavos</a> ecosystem</p>
      </footer>
    </div>
  );
}
