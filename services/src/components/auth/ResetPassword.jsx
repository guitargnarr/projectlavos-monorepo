import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ResetPassword({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) throw updateError

      setSuccess(true)

      // Clear the URL hash after successful reset
      window.history.replaceState(null, '', window.location.pathname)

      // Call success callback after delay
      if (onSuccess) {
        setTimeout(onSuccess, 2000)
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white border-3 border-lavos-black shadow-brutal p-8 max-w-md mx-auto">
        <h2 className="text-3xl font-black mb-6 text-gray-900">Password Reset</h2>

        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
          <p className="text-green-700 text-sm">
            Your password has been successfully reset!
          </p>
        </div>

        <p className="text-gray-600">
          Redirecting you to login...
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border-3 border-lavos-black shadow-brutal p-8 max-w-md mx-auto">
      <h2 className="text-3xl font-black mb-6 text-gray-900">Set New Password</h2>

      <p className="text-gray-600 mb-6">
        Enter your new password below.
      </p>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="new-password" className="block text-gray-900 font-bold mb-2">
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-lavos-blue focus:outline-none"
            placeholder="••••••••"
          />
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
          disabled={loading}
          className="w-full bg-lavos-blue text-white px-6 py-3 border-2 border-lavos-black shadow-brutal-sm font-bold hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-brutal-sm"
        >
          {loading ? (
            <>
              <svg className="inline w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Resetting...
            </>
          ) : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}
