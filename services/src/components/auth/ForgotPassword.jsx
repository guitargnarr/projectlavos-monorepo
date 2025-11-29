import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (resetError) throw resetError

      setSent(true)
    } catch (err) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="bg-white border-3 border-lavos-black shadow-brutal p-8 max-w-md mx-auto">
        <h2 className="text-3xl font-black mb-6 text-gray-900">Check Your Email</h2>

        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
          <p className="text-green-700 text-sm">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
        </div>

        <p className="text-gray-600 mb-6">
          Click the link in the email to reset your password. The link will expire in 24 hours.
        </p>

        <button
          onClick={onBack}
          className="w-full bg-gray-100 text-gray-900 px-6 py-3 border-2 border-lavos-black shadow-brutal-sm font-bold hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200"
        >
          Back to Login
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white border-3 border-lavos-black shadow-brutal p-8 max-w-md mx-auto">
      <h2 className="text-3xl font-black mb-6 text-gray-900">Reset Password</h2>

      <p className="text-gray-600 mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reset-email" className="block text-gray-900 font-bold mb-2">
            Email
          </label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-lavos-blue focus:outline-none"
            placeholder="you@example.com"
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
              Sending...
            </>
          ) : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onBack}
          className="text-lavos-blue font-bold hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  )
}
