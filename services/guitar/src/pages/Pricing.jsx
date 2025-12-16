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

  const getCtaClass = (tier) => {
    if (tier.stripeLink) {
      return tier.highlight ? 'pricing-cta primary' : 'pricing-cta secondary';
    }
    return tier.name === 'Free' ? 'pricing-cta current' : 'pricing-cta disabled';
  };

  const getFeatureIconClass = (included) => {
    if (included === true) return 'pricing-feature-icon included';
    if (included === 'limited') return 'pricing-feature-icon limited';
    return 'pricing-feature-icon excluded';
  };

  return (
    <div className="pricing-page">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="pricing-header">
          <h1 className="pricing-title">Choose Your Plan</h1>
          <p className="pricing-subtitle">
            Start free and upgrade when you're ready. All plans include access to our core practice tools.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-grid">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`pricing-card ${tier.highlight ? 'highlight' : ''}`}
            >
              {/* Popular Badge */}
              {tier.highlight && (
                <span className="pricing-badge">
                  <Star size={14} fill="currentColor" /> Most Popular
                </span>
              )}

              {/* Tier Name */}
              <h2 className="pricing-tier-name">{tier.name}</h2>

              {/* Price */}
              <div className="pricing-price">
                <span className="pricing-amount">{tier.price}</span>
                <span className="pricing-period">{tier.period}</span>
              </div>

              {/* Description */}
              <p className="pricing-description">{tier.description}</p>

              {/* CTA Button */}
              {tier.stripeLink ? (
                <a
                  href={tier.stripeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={getCtaClass(tier)}
                >
                  {tier.cta}
                </a>
              ) : (
                <button className={getCtaClass(tier)} disabled>
                  {tier.cta}
                </button>
              )}

              {/* Features */}
              <ul className="pricing-features">
                {tier.features.map((feature) => (
                  <li key={feature.name} className="pricing-feature">
                    {feature.included === true ? (
                      <Check size={18} className={getFeatureIconClass(feature.included)} />
                    ) : feature.included === 'limited' ? (
                      <Check size={18} className={getFeatureIconClass(feature.included)} />
                    ) : (
                      <X size={18} className={getFeatureIconClass(feature.included)} />
                    )}
                    <span className={`pricing-feature-text ${!feature.included ? 'excluded' : ''}`}>
                      {feature.name}
                      {feature.value && (
                        <span className="pricing-feature-value">({feature.value})</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="pricing-footer">
          <p>Premium plans coming soon. Get notified when they launch.</p>
          <a href="https://projectlavos.com" className="pricing-footer-link">
            Contact us for updates
          </a>
        </div>
      </div>
    </div>
  );
}
