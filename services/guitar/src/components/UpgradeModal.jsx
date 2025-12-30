import PropTypes from 'prop-types';

/**
 * Modal prompting user to upgrade for premium features
 */
export default function UpgradeModal({ isOpen, onClose, feature, requiredTier }) {
  if (!isOpen) return null;

  // Stripe Payment Links - replace with actual links from Stripe Dashboard
  const STRIPE_LINKS = {
    premium: import.meta.env.VITE_STRIPE_PREMIUM_LINK || null,
    pro: import.meta.env.VITE_STRIPE_PRO_LINK || null,
  };

  const tierInfo = {
    premium: {
      name: 'Premium',
      price: '$9.99/mo',
      features: ['MIDI Export', '70 Lessons', 'All Backing Tracks'],
    },
    pro: {
      name: 'Pro',
      price: '$19.99/mo',
      features: ['GP5 Export', 'MIDI Export', 'All 77 Lessons', 'Priority Support'],
    },
  };

  const info = tierInfo[requiredTier] || tierInfo.pro;
  const stripeLink = STRIPE_LINKS[requiredTier];

  const handleUpgrade = () => {
    if (stripeLink) {
      window.open(stripeLink, '_blank');
    } else {
      // Fallback to pricing page if no Stripe link configured
      window.location.href = '/pricing';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Upgrade Required</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-slate-300 mb-4">
            <span className="text-orange-400 font-semibold">{feature}</span> is a {info.name} feature.
          </p>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-lg font-bold text-teal-400">{info.name}</span>
              <span className="text-2xl font-bold text-white">{info.price}</span>
            </div>
            <ul className="space-y-2">
              {info.features.map((feat, i) => (
                <li key={i} className="flex items-center text-slate-300 text-sm">
                  <svg className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            Maybe Later
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-white font-bold rounded-lg transition-all"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}

UpgradeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  feature: PropTypes.string.isRequired,
  requiredTier: PropTypes.oneOf(['premium', 'pro']).isRequired,
};
