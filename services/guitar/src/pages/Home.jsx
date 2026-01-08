import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12 hero-gradient rounded-xl py-12 px-4" aria-labelledby="hero-heading">
        <h1 id="hero-heading" className="text-5xl font-bold mb-4 gradient-text">
          FretVision
        </h1>
        <p className="text-xl text-gray-300">
          Master your guitar skills with interactive fretboard visualizations and intelligent practice tools
        </p>
      </section>

      <section aria-labelledby="tools-heading" className="max-w-6xl mx-auto">
        <h2 id="tools-heading" className="sr-only">Guitar Learning Tools</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link to="/fretvision" className="group">
          <div className="card-elite bg-gray-800 rounded-lg p-8 border border-gray-700 hover:border-green-500">
            <div className="mb-4">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 group-hover:text-green-400 transition-colors">
              FretVision
            </h2>
            <p className="text-gray-400 mb-4">
              Visualize scales and chords on an interactive fretboard. Explore different tunings,
              scale patterns, and chord voicings across the entire neck.
            </p>
            <div className="flex items-center text-green-500">
              <span className="mr-2">Explore Scales & Chords</span>
              <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        <Link to="/riff-generator" className="group">
          <div className="card-elite bg-gray-800 rounded-lg p-8 border border-gray-700 hover:border-cyan-500">
            <div className="mb-4">
              <svg className="w-16 h-16 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">
              Riff Generator
            </h2>
            <p className="text-gray-400 mb-4">
              Generate custom guitar riffs with 12 scales, 8 patterns, and 4 tunings.
              Interactive fretboard playback and export to Tab/MIDI/GP5.
            </p>
            <div className="flex items-center text-cyan-500">
              <span className="mr-2">Generate Riffs</span>
              <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        <Link to="/tabplayer" className="group">
          <div className="card-elite bg-gray-800 rounded-lg p-8 border border-gray-700 hover:border-blue-500">
            <div className="mb-4">
              <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
              Tab Player
            </h2>
            <p className="text-gray-400 mb-4">
              Practice with an interactive tab player featuring audio playback, adjustable tempo,
              looping, and a built-in metronome for precise timing.
            </p>
            <div className="flex items-center text-blue-400">
              <span className="mr-2">Start Practicing</span>
              <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        <Link to="/catalog" className="group">
          <div className="card-elite bg-gray-800 rounded-lg p-8 border border-gray-700 hover:border-purple-500">
            <div className="mb-4">
              <svg className="w-16 h-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
              GP Catalog
            </h2>
            <p className="text-gray-400 mb-4">
              Browse 70 Guitar Pro files covering scales, arpeggios, sweeps, and more.
              Filter by difficulty and tier to find the perfect practice material.
            </p>
            <div className="flex items-center text-purple-400">
              <span className="mr-2">Browse Catalog</span>
              <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        <Link to="/scales" className="group">
          <div className="card-elite bg-gray-800 rounded-lg p-8 border border-gray-700 hover:border-teal-500">
            <div className="mb-4">
              <svg className="w-16 h-16 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 group-hover:text-teal-400 transition-colors">
              Scale Trainer
            </h2>
            <p className="text-gray-400 mb-4">
              Practice scales with real-time pitch detection. Choose from ascending,
              descending, or random modes to master your scales.
            </p>
            <div className="flex items-center text-teal-500">
              <span className="mr-2">Train Scales</span>
              <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        <Link to="/backing" className="group">
          <div className="card-elite bg-gray-800 rounded-lg p-8 border border-gray-700 hover:border-orange-500">
            <div className="mb-4">
              <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 group-hover:text-orange-400 transition-colors">
              Backing Tracks
            </h2>
            <p className="text-gray-400 mb-4">
              Practice with chord progressions in any key. Rock, blues, jazz, pop -
              choose your style and jam along!
            </p>
            <div className="flex items-center text-orange-500">
              <span className="mr-2">Start Jamming</span>
              <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        <Link to="/ear-training" className="group">
          <div className="card-elite bg-gray-800 rounded-lg p-8 border border-gray-700 hover:border-pink-500">
            <div className="mb-4">
              <svg className="w-16 h-16 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 group-hover:text-pink-400 transition-colors">
              Ear Training
            </h2>
            <p className="text-gray-400 mb-4">
              Develop your musical ear! Identify intervals and chord qualities
              with progressive difficulty levels.
            </p>
            <div className="flex items-center text-pink-400">
              <span className="mr-2">Train Your Ear</span>
              <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
        </div>
      </section>

      <section aria-labelledby="features-heading" className="mt-16 max-w-4xl mx-auto">
        <h2 id="features-heading" className="text-2xl font-bold mb-6 text-center">Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Visual Learning</h3>
            <p className="text-sm text-gray-300">Interactive fretboard visualization for scales and chords</p>
          </div>
          <div className="text-center">
            <div className="bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Audio Playback</h3>
            <p className="text-sm text-gray-300">Hear tabs played back with realistic guitar synthesis</p>
          </div>
          <div className="text-center">
            <div className="bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Practice Tools</h3>
            <p className="text-sm text-gray-300">Tempo control, looping, and metronome for effective practice</p>
          </div>
        </div>
      </section>
    </div>
  );
}
