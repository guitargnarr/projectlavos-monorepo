import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, TIERS } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setProfile(null)
    }
    return { error }
  }

  const resendVerificationEmail = async () => {
    if (!user?.email) return { error: new Error('No user email') }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email
    })
    return { error }
  }

  const updateTier = async (newTier) => {
    if (!user) return { error: new Error('No user logged in') }

    const { data, error } = await supabase
      .from('user_profiles')
      .update({ tier: newTier })
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
    }
    return { data, error }
  }

  const hasTierAccess = (requiredTier) => {
    if (!profile) return false

    const tierHierarchy = {
      [TIERS.FREE]: 0,
      [TIERS.PREMIUM]: 1,
      [TIERS.PRO]: 2
    }

    return tierHierarchy[profile.tier] >= tierHierarchy[requiredTier]
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateTier,
    hasTierAccess,
    resendVerificationEmail,
    tier: profile?.tier || TIERS.FREE,
    emailVerified: !!user?.email_confirmed_at
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
