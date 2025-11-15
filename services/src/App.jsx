import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { TIERS } from './lib/supabase'
import AuthModal from './components/auth/AuthModal'
import ProtectedContent from './components/auth/ProtectedContent'
import UserProfile from './components/UserProfile'
import './App.css'

function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [currentView, setCurrentView] = useState('home') // 'home', 'profile'
  const { user, profile, loading } = useAuth()

  if (currentView === 'profile' && user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <button
          onClick={() => setCurrentView('home')}
          className="mb-6 mx-6 bg-lavos-blue text-white px-4 py-2 border-2 border-lavos-black shadow-brutal-sm font-bold hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200"
        >
          ← Back to Home
        </button>
        <UserProfile />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-lavos-blue text-white py-6 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-black">Guitar Master</h1>
          <div className="flex gap-4">
            {user ? (
              <>
                <span className="text-white/90 self-center">
                  {profile?.tier?.toUpperCase() || 'FREE'} Tier
                </span>
                <button
                  onClick={() => setCurrentView('profile')}
                  className="bg-white text-lavos-blue px-4 py-2 border-2 border-lavos-black shadow-brutal-sm font-bold hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200"
                >
                  Profile
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-lavos-orange text-white px-6 py-2 border-2 border-lavos-black shadow-brutal-sm font-bold hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Free Tier Content */}
        <section className="bg-white border-3 border-lavos-black shadow-brutal p-8">
          <h2 className="text-2xl font-black mb-4 text-gray-900">
            🎸 Basic Chord Visualizer (Free)
          </h2>
          <p className="text-gray-700 mb-4">
            Learn basic guitar chords with our interactive visualizer. Available to all users!
          </p>
          <div className="bg-gray-100 border-2 border-gray-300 p-8 text-center">
            <p className="text-gray-600">[Chord Visualizer Component Would Go Here]</p>
            <p className="text-sm text-gray-500 mt-2">Shows basic chord diagrams and finger positions</p>
          </div>
        </section>

        {/* Premium Tier Content */}
        <section className="bg-white border-3 border-lavos-black shadow-brutal p-8">
          <h2 className="text-2xl font-black mb-4 text-gray-900">
            🎵 100 Guitar Pro Files (Premium)
          </h2>
          <ProtectedContent requiredTier={TIERS.PREMIUM}>
            <p className="text-gray-700 mb-4">
              Access our complete library of 100 professionally transcribed Guitar Pro files!
            </p>
            <div className="bg-gray-100 border-2 border-gray-300 p-8">
              <p className="text-gray-600 mb-4">[GP Files Library Would Go Here]</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Song 1', 'Song 2', 'Song 3', 'Song 4', 'Song 5', 'Song 6', 'Song 7', 'Song 8'].map((song, i) => (
                  <div key={i} className="bg-white border-2 border-gray-400 p-4 text-center">
                    <p className="font-bold text-sm">{song}</p>
                  </div>
                ))}
              </div>
            </div>
          </ProtectedContent>
        </section>

        {/* Pro Tier Content */}
        <section className="bg-white border-3 border-lavos-black shadow-brutal p-8">
          <h2 className="text-2xl font-black mb-4 text-gray-900">
            🎓 Video Lessons + AI Tools (Pro)
          </h2>
          <ProtectedContent requiredTier={TIERS.PRO}>
            <p className="text-gray-700 mb-4">
              Master guitar with expert video lessons and AI-powered practice tools!
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-100 border-2 border-gray-300 p-6">
                <h3 className="font-bold mb-2">Video Lessons</h3>
                <div className="bg-black/80 aspect-video flex items-center justify-center text-white">
                  [Video Player]
                </div>
                <p className="text-sm text-gray-600 mt-2">50+ HD video lessons from pros</p>
              </div>
              <div className="bg-gray-100 border-2 border-gray-300 p-6">
                <h3 className="font-bold mb-2">AI Practice Assistant</h3>
                <div className="space-y-3">
                  <div className="bg-lavos-blue/10 border-l-4 border-lavos-blue p-3">
                    <p className="text-sm">✓ Personalized practice routines</p>
                  </div>
                  <div className="bg-lavos-blue/10 border-l-4 border-lavos-blue p-3">
                    <p className="text-sm">✓ Progress tracking & analytics</p>
                  </div>
                  <div className="bg-lavos-blue/10 border-l-4 border-lavos-blue p-3">
                    <p className="text-sm">✓ AI-generated backing tracks</p>
                  </div>
                </div>
              </div>
            </div>
          </ProtectedContent>
        </section>

        {/* Tier Comparison */}
        {!user && (
          <section className="bg-lavos-orange/10 border-3 border-lavos-orange shadow-brutal p-8 text-center">
            <h2 className="text-3xl font-black mb-4 text-gray-900">
              Start Your Guitar Journey Today
            </h2>
            <p className="text-gray-700 mb-6">
              Sign up for free and upgrade anytime to unlock premium features!
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-lavos-orange text-white px-8 py-3 border-2 border-lavos-black shadow-brutal-sm font-bold text-lg hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200"
            >
              Get Started Free
            </button>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-3 border-lavos-black py-8 px-6 mt-12">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p className="font-bold">Guitar Master - Learn Guitar Online</p>
          <p className="text-sm mt-2">Built with Supabase Authentication & Tier-Based Access Control</p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
