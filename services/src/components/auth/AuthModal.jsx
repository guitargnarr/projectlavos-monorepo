import { useState, useEffect } from 'react'
import Login from './Login'
import Signup from './Signup'
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'

export default function AuthModal({ onClose, initialMode }) {
  const [mode, setMode] = useState(initialMode || 'login') // 'login', 'signup', 'forgot', 'reset'

  // Check for password reset token in URL on mount
  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('type=recovery')) {
      setMode('reset')
    }
  }, [])

  const handleSuccess = () => {
    if (onClose) {
      setTimeout(() => onClose(), 500)
    }
  }

  const handleResetSuccess = () => {
    setMode('login')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="relative max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white border-2 border-lavos-black shadow-brutal-sm w-10 h-10 flex items-center justify-center font-bold text-xl hover:bg-red-500 hover:text-white transition-colors"
        >
          ×
        </button>

        {mode === 'login' && (
          <Login
            onToggleMode={() => setMode('signup')}
            onForgotPassword={() => setMode('forgot')}
            onSuccess={handleSuccess}
          />
        )}

        {mode === 'signup' && (
          <Signup
            onToggleMode={() => setMode('login')}
            onSuccess={handleSuccess}
          />
        )}

        {mode === 'forgot' && (
          <ForgotPassword
            onBack={() => setMode('login')}
          />
        )}

        {mode === 'reset' && (
          <ResetPassword
            onSuccess={handleResetSuccess}
          />
        )}
      </div>
    </div>
  )
}
