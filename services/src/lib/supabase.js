import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// User tier constants
export const TIERS = {
  FREE: 'free',
  PREMIUM: 'premium',
  PRO: 'pro'
}

// Tier features mapping
export const TIER_FEATURES = {
  [TIERS.FREE]: {
    name: 'Free',
    price: 0,
    features: [
      'Basic chord visualizer',
      'Limited song library'
    ]
  },
  [TIERS.PREMIUM]: {
    name: 'Premium',
    price: 9.99,
    features: [
      'All 100 GP files access',
      'Advanced chord visualizer',
      'Tab playback'
    ]
  },
  [TIERS.PRO]: {
    name: 'Pro',
    price: 19.99,
    features: [
      'All 100 GP files access',
      'Video lessons',
      'AI practice tools',
      'Personalized learning path'
    ]
  }
}
