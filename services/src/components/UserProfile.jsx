import { useAuth } from '../contexts/AuthContext'
import { TIER_FEATURES, TIERS } from '../lib/supabase'

export default function UserProfile() {
  const { user, profile, signOut, updateTier } = useAuth()

  const handleUpgrade = async (newTier) => {
    const { error } = await updateTier(newTier)
    if (error) {
      alert('Failed to upgrade tier: ' + error.message)
    } else {
      alert(`Successfully upgraded to ${TIER_FEATURES[newTier].name}!`)
    }
  }

  if (!user || !profile) {
    return null
  }

  const currentTierInfo = TIER_FEATURES[profile.tier]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white border-3 border-lavos-black shadow-brutal p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-black mb-2 text-gray-900">Your Profile</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <button
            onClick={signOut}
            className="bg-red-500 text-white px-4 py-2 border-2 border-lavos-black shadow-brutal-sm font-bold hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-lavos-blue/10 border-l-4 border-lavos-blue p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-900">
            Current Tier: {currentTierInfo.name}
          </h3>
          <p className="text-2xl font-black text-lavos-blue mb-4">
            ${currentTierInfo.price}/month
          </p>
          <ul className="space-y-2">
            {currentTierInfo.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-lavos-green font-bold">✓</span>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {profile.tier !== TIERS.PRO && (
        <div className="bg-white border-3 border-lavos-black shadow-brutal p-8">
          <h3 className="text-2xl font-black mb-6 text-gray-900">Upgrade Your Plan</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {profile.tier === TIERS.FREE && (
              <div className="border-3 border-lavos-orange p-6">
                <h4 className="text-xl font-bold mb-2 text-gray-900">
                  {TIER_FEATURES[TIERS.PREMIUM].name}
                </h4>
                <p className="text-3xl font-black text-lavos-orange mb-4">
                  ${TIER_FEATURES[TIERS.PREMIUM].price}/month
                </p>
                <ul className="space-y-2 mb-6">
                  {TIER_FEATURES[TIERS.PREMIUM].features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-lavos-green font-bold">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgrade(TIERS.PREMIUM)}
                  className="w-full bg-lavos-orange text-white px-6 py-3 border-2 border-lavos-black shadow-brutal-sm font-bold hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200"
                >
                  Upgrade to Premium
                </button>
              </div>
            )}

            <div className="border-3 border-lavos-blue p-6">
              <h4 className="text-xl font-bold mb-2 text-gray-900">
                {TIER_FEATURES[TIERS.PRO].name}
              </h4>
              <p className="text-3xl font-black text-lavos-blue mb-4">
                ${TIER_FEATURES[TIERS.PRO].price}/month
              </p>
              <ul className="space-y-2 mb-6">
                {TIER_FEATURES[TIERS.PRO].features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-lavos-green font-bold">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(TIERS.PRO)}
                className="w-full bg-lavos-blue text-white px-6 py-3 border-2 border-lavos-black shadow-brutal-sm font-bold hover:-translate-y-0.5 hover:shadow-brutal transition-all duration-200"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-6 text-center">
            Note: This is a demo. No actual payment processing is implemented.
          </p>
        </div>
      )}
    </div>
  )
}
