import { useState, useEffect } from 'react';

/**
 * Hook to check premium status
 * Currently uses localStorage - will be replaced with Stripe/Supabase auth
 *
 * Premium tiers:
 * - free: Tab export only
 * - premium: Tab + MIDI export
 * - pro: Tab + MIDI + GP5 export
 */
export function usePremiumStatus() {
  const [tier, setTier] = useState('free');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for premium status
    // In production, this would call Stripe/Supabase
    const storedTier = localStorage.getItem('guitar-premium-tier');
    if (storedTier && ['free', 'premium', 'pro'].includes(storedTier)) {
      setTier(storedTier);
    }
    setIsLoading(false);
  }, []);

  const isPremium = tier === 'premium' || tier === 'pro';
  const isPro = tier === 'pro';

  // Feature access checks
  const canExportTab = true; // Always available
  const canExportMidi = isPremium || isPro;
  const canExportGP5 = isPro;

  return {
    tier,
    isLoading,
    isPremium,
    isPro,
    canExportTab,
    canExportMidi,
    canExportGP5,
  };
}

export default usePremiumStatus;
