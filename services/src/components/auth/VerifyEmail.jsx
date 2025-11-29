import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function VerifyEmail() {
  const { user, resendVerificationEmail, emailVerified } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const handleResend = async () => {
    setLoading(true)
    setError(null)

    const { error: resendError } = await resendVerificationEmail()

    if (resendError) {
      setError(resendError.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (emailVerified) {
    return (
      <div className="bg-green-50 border-l-4 border-green-500 p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-green-700 font-medium">Email verified</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-yellow-700 font-medium">Email not verified</span>
        </div>

        <p className="text-yellow-700 text-sm">
          Please check your inbox ({user?.email}) and click the verification link.
        </p>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        {sent ? (
          <p className="text-green-600 text-sm">
            Verification email sent! Check your inbox.
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-yellow-700 font-medium hover:underline text-sm disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Resend verification email'}
          </button>
        )}
      </div>
    </div>
  )
}
