import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function Signup({ onToggleMode, onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await signUp(email, password)

      if (signUpError) throw signUpError

      // Success - show confirmation message
      setSuccess(true)
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000)
      }
    } catch (err) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border-3 border-lavos-black shadow-brutal p-8 max-w-md mx-auto">
      <h2 className="text-3xl font-black mb-6 text-gray-900">Sign Up</h2>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
          <p className="text-green-700 text-sm font-bold">
            Account created! Check your email to verify your account.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="signup-email" className="block text-gray-900 font-bold mb-2">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-lavos-blue focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="block text-gray-900 font-bold mb-2">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-lavos-blue focus:outline-none"
            placeholder="••••••••"
          />
          <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-gray-900 font-bold mb-2">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-lavos-blue focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full bg-lavos-orange text-white px-6 py-3 border-2 border-lavos-black shadow-brutal-sm font-bold hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-brutal-sm"
        >
          {loading ? (
            <>
              <svg className="inline w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Creating account...
            </>
          ) : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Already have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-lavos-blue font-bold hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>

      <div className="mt-6 pt-6 border-t-2 border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          By signing up, you start with a <span className="font-bold">Free</span> tier account.
          Upgrade anytime to access premium features.
        </p>
      </div>
    </div>
  )
}
