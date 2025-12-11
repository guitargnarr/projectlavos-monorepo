import { Check, X, Star } from 'lucide-react';

/**
 * Pricing page for Guitar Learning Platform
 * Displays Free/Premium/Pro tier comparison
 *
 * To enable Stripe:
 * 1. Create products in Stripe Dashboard
 * 2. Create Payment Links for each product
 * 3. Set VITE_STRIPE_PREMIUM_LINK and VITE_STRIPE_PRO_LINK in .env
 */

// Stripe Payment Links (set in environment or replace with your URLs)
const STRIPE_LINKS = {
  premium: import.meta.env.VITE_STRIPE_PREMIUM_LINK || null,
  pro: import.meta.env.VITE_STRIPE_PRO_LINK || null,
};

export default function Pricing() {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Get started with guitar basics',
      features: [
        { name: 'Basic Lessons', included: true, value: '10' },
        { name: 'Metronome', included: true },
        { name: 'Tuner', included: true },
        { name: 'Chord Dictionary', included: true },
        { name: 'Tab Playback', included: 'limited', value: 'Limited' },
        { name: 'Tempo Control', included: false },
        { name: 'All 70 Lessons', included: false },
        { name: 'Video Lessons', included: false },
        { name: 'AI Practice Tools', included: false },
      ],
      cta: 'Current Plan',
      stripeLink: null,
      highlight: false,
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: '/month',
      description: 'Full access to all lessons',
      features: [
        { name: 'Basic Lessons', included: true, value: '70' },
        { name: 'Metronome', included: true },
        { name: 'Tuner', included: true },
        { name: 'Chord Dictionary', included: true },
        { name: 'Tab Playback', included: true, value: 'Full' },
        { name: 'Tempo Control', included: true },
        { name: 'All 70 Lessons', included: true },
        { name: 'Video Lessons', included: false },
        { name: 'AI Practice Tools', included: false },
      ],
      cta: STRIPE_LINKS.premium ? 'Subscribe' : 'Coming Soon',
      stripeLink: STRIPE_LINKS.premium,
      highlight: true,
    },
    {
      name: 'Pro',
      price: '$19.99',
      period: '/month',
      description: 'Everything plus advanced features',
      features: [
        { name: 'Basic Lessons', included: true, value: '70' },
        { name: 'Metronome', included: true },
        { name: 'Tuner', included: true },
        { name: 'Chord Dictionary', included: true },
        { name: 'Tab Playback', included: true, value: 'Full' },
        { name: 'Tempo Control', included: true },
        { name: 'All 70 Lessons', included: true },
        { name: 'Video Lessons', included: true },
        { name: 'AI Practice Tools', included: true },
      ],
      cta: STRIPE_LINKS.pro ? 'Subscribe' : 'Coming Soon',
      stripeLink: STRIPE_LINKS.pro,
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Start free and upgrade when you're ready. All plans include access to our core practice tools.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`
                rounded-2xl p-8 relative
                ${tier.highlight
                  ? 'bg-gradient-to-b from-teal-900/50 to-gray-800 border-2 border-teal-500'
                  : 'bg-gray-800 border border-gray-700'
                }
              `}
            >
              {/* Popular Badge */}
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-teal-500 to-orange-500 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star size={14} fill="currentColor" /> Most Popular
                  </span>
                </div>
              )}

              {/* Tier Name */}
              <h2 className={`text-2xl font-bold mb-2 ${tier.highlight ? 'text-teal-400' : 'text-gray-100'}`}>
                {tier.name}
              </h2>

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-100">{tier.price}</span>
                <span className="text-gray-400">{tier.period}</span>
              </div>

              {/* Description */}
              <p className="text-gray-400 mb-6">{tier.description}</p>

              {/* CTA Button */}
              {tier.stripeLink ? (
                <a
                  href={tier.stripeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    block w-full py-3 rounded-lg font-semibold transition-all mb-8 text-center
                    ${tier.highlight
                      ? 'bg-teal-500 hover:bg-teal-400 text-gray-900'
                      : 'bg-orange-500 hover:bg-orange-400 text-gray-900'
                    }
                  `}
                >
                  {tier.cta}
                </a>
              ) : (
                <button
                  className={`
                    w-full py-3 rounded-lg font-semibold transition-all mb-8
                    ${tier.name === 'Free'
                      ? 'bg-gray-700 text-gray-400 cursor-default'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }
                  `}
                  disabled
                >
                  {tier.cta}
                </button>
              )}

              {/* Features */}
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-3">
                    {feature.included === true ? (
                      <Check size={18} className="text-teal-400 flex-shrink-0" />
                    ) : feature.included === 'limited' ? (
                      <Check size={18} className="text-orange-400 flex-shrink-0" />
                    ) : (
                      <X size={18} className="text-gray-600 flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-gray-300' : 'text-gray-500'}>
                      {feature.name}
                      {feature.value && (
                        <span className="text-gray-500 ml-1">({feature.value})</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 text-gray-500">
          <p>Premium plans coming soon. Get notified when they launch.</p>
          <a
            href="https://projectlavos.com"
            className="text-teal-400 hover:text-teal-300 underline mt-2 inline-block"
          >
            Contact us for updates
          </a>
        </div>
      </div>
    </div>
  );
}
