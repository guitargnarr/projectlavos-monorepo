import { useAuth } from '../../contexts/AuthContext'
import { TIER_FEATURES } from '../../lib/supabase'

export default function ProtectedContent({ requiredTier, children, fallback }) {
  const { user, profile, loading, hasTierAccess } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lavos-blue"></div>
      </div>
    )
  }

  if (!user) {
    return fallback || (
      <div className="bg-yellow-50 border-3 border-lavos-black shadow-brutal p-8 text-center">
        <h3 className="text-2xl font-bold mb-4 text-gray-900">Sign in Required</h3>
        <p className="text-gray-700 mb-6">
          Please sign in to access this content.
        </p>
        <button
          onClick={() => window.location.hash = '#login'}
          className="bg-lavos-blue text-white px-6 py-3 border-2 border-lavos-black shadow-brutal-sm font-bold hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200"
        >
          Sign In
        </button>
      </div>
    )
  }

  if (!hasTierAccess(requiredTier)) {
    const requiredTierInfo = TIER_FEATURES[requiredTier]
    return fallback || (
      <div className="bg-orange-50 border-3 border-lavos-black shadow-brutal p-8 text-center">
        <h3 className="text-2xl font-bold mb-4 text-gray-900">Upgrade Required</h3>
        <p className="text-gray-700 mb-4">
          This content requires a <span className="font-bold text-lavos-orange">{requiredTierInfo.name}</span> subscription.
        </p>
        <div className="mb-6">
          <div className="text-3xl font-black text-lavos-orange mb-2">
            ${requiredTierInfo.price}/month
          </div>
          <ul className="text-left inline-block space-y-2">
            {requiredTierInfo.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-lavos-green font-bold">✓</span>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => window.location.hash = '#upgrade'}
          className="bg-lavos-orange text-white px-8 py-3 border-2 border-lavos-black shadow-brutal-sm font-bold hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200"
        >
          Upgrade to {requiredTierInfo.name}
        </button>
      </div>
    )
  }

  return <>{children}</>
}
