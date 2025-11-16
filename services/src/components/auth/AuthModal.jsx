import { useState } from 'react'
import Login from './Login'
import Signup from './Signup'

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login') // 'login' or 'signup'

  const handleSuccess = () => {
    if (onClose) {
      setTimeout(() => onClose(), 500)
    }
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

        {mode === 'login' ? (
          <Login
            onToggleMode={() => setMode('signup')}
            onSuccess={handleSuccess}
          />
        ) : (
          <Signup
            onToggleMode={() => setMode('login')}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  )
}
