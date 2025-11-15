# Guitar Platform - Supabase Authentication Setup Guide

## Overview

This guitar learning platform uses Supabase for authentication and tier-based content access control.

**Tiers:**
- **Free**: Basic chord visualizer
- **Premium** ($9.99/mo): All 100 GP files access
- **Pro** ($19.99/mo): Video lessons + AI tools

---

## Setup Instructions

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in/create account
2. Click "New Project"
3. Fill in:
   - Project name: `guitar-platform` (or your choice)
   - Database password: (save this securely)
   - Region: Choose closest to your users
   - Pricing: **Free** tier is perfect for this
4. Click "Create new project" and wait ~2 minutes for provisioning

### Step 2: Get API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public** key (long string starting with `eyJ...`)

### Step 3: Create Environment File

1. In the `services/` directory, create a `.env` file:
   ```bash
   cd services
   cp .env.example .env
   ```

2. Edit `.env` and paste your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **IMPORTANT**: Never commit `.env` to git (already in `.gitignore`)

### Step 4: Run Database Setup

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `services/supabase-setup.sql`
4. Paste into the SQL editor
5. Click "Run" (bottom right)
6. You should see "Success. No rows returned" - this is correct!

**What this does:**
- Creates `user_profiles` table to store user tier info
- Sets up Row Level Security (RLS) policies
- Creates trigger to auto-create profile on signup
- Links profiles to Supabase auth users

### Step 5: Configure Email Auth (Optional)

By default, Supabase requires email confirmation. For development:

1. Go to **Authentication** → **Providers** → **Email**
2. Scroll to "Confirm email"
3. **Toggle OFF** for testing (or leave on for production)
4. Click "Save"

**For production**: Leave email confirmation ON and configure SMTP settings

### Step 6: Install Dependencies & Run

```bash
cd services
npm install
npm run dev
```

Visit `http://localhost:5173` - you should see the Guitar Master platform!

---

## Testing the Authentication Flow

### Test Signup

1. Click "Sign In" button in header
2. Click "Sign up" link at bottom
3. Enter email and password (min 6 chars)
4. Click "Create Account"
5. If email confirmation is OFF: You're logged in immediately
6. If email confirmation is ON: Check email for confirmation link

### Test Login

1. Click "Sign In" button
2. Enter your credentials
3. Click "Sign In"
4. You should be logged in with **FREE** tier

### Test Tier Gating

**Free Tier (default):**
- ✅ Can see Basic Chord Visualizer
- ❌ Cannot access 100 GP Files (shows upgrade prompt)
- ❌ Cannot access Video Lessons (shows upgrade prompt)

**Upgrade to Premium:**
1. Click "Profile" button in header
2. Scroll to "Upgrade Your Plan"
3. Click "Upgrade to Premium"
4. Go back to home (← Back to Home)
5. ✅ Now you can access 100 GP Files section
6. ❌ Still cannot access Video Lessons (Pro only)

**Upgrade to Pro:**
1. Go to Profile
2. Click "Upgrade to Pro"
3. Go back to home
4. ✅ Now you can access ALL content (Free + Premium + Pro)

### Test Session Persistence

1. Log in
2. Refresh the page
3. You should still be logged in (session persisted)
4. Close browser, reopen
5. Session should still be active (uses localStorage)

---

## File Structure

```
services/
├── .env.example              # Template for environment variables
├── supabase-setup.sql        # Database schema and RLS policies
├── src/
│   ├── lib/
│   │   └── supabase.js       # Supabase client config + tier constants
│   ├── contexts/
│   │   └── AuthContext.jsx   # Auth state management + session handling
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx     # Login form component
│   │   │   ├── Signup.jsx    # Signup form component
│   │   │   ├── AuthModal.jsx # Modal wrapper for auth forms
│   │   │   └── ProtectedContent.jsx  # Tier-based content gating
│   │   └── UserProfile.jsx   # User dashboard + tier management
│   └── App.jsx               # Main guitar platform app
```

---

## How Tier Gating Works

### 1. Protected Content Component

Wrap any content that requires a specific tier:

```jsx
import ProtectedContent from './components/auth/ProtectedContent'
import { TIERS } from './lib/supabase'

<ProtectedContent requiredTier={TIERS.PREMIUM}>
  <YourPremiumContent />
</ProtectedContent>
```

**What happens:**
- User not logged in → Shows "Sign in Required" message
- User has lower tier → Shows upgrade prompt with pricing
- User has required tier → Shows content

### 2. Tier Hierarchy

```javascript
FREE (0) < PREMIUM (1) < PRO (2)
```

- Premium users can access Free + Premium content
- Pro users can access Free + Premium + Pro content

### 3. Manual Tier Check

In any component:

```jsx
import { useAuth } from './contexts/AuthContext'

function MyComponent() {
  const { hasTierAccess, tier } = useAuth()

  if (hasTierAccess(TIERS.PRO)) {
    // User has Pro access
  }

  console.log(tier) // 'free', 'premium', or 'pro'
}
```

---

## Customization

### Change Tier Prices

Edit `src/lib/supabase.js`:

```javascript
export const TIER_FEATURES = {
  [TIERS.PREMIUM]: {
    name: 'Premium',
    price: 14.99,  // Change this
    features: [...]
  }
}
```

### Add New Tier

1. Add to `TIERS` constant in `supabase.js`
2. Add to `TIER_FEATURES` with pricing/features
3. Update `tierHierarchy` in `AuthContext.jsx`
4. Update database schema to allow new tier value

### Integrate Payment Processing

To actually charge users:

1. Add Stripe/Paddle integration
2. On successful payment, call:
   ```javascript
   const { updateTier } = useAuth()
   await updateTier(TIERS.PREMIUM)
   ```
3. Set up webhooks to downgrade on cancellation

---

## Troubleshooting

### "Missing Supabase environment variables"

- Check `.env` file exists in `services/` directory
- Verify variable names: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after creating `.env`

### Signup doesn't work

- Check SQL setup ran successfully (Step 4)
- Verify `user_profiles` table exists in Supabase dashboard
- Check browser console for errors
- Try with email confirmation disabled (Step 5)

### Session doesn't persist

- Check browser localStorage is enabled
- Verify `auth.persistSession: true` in `supabase.js`
- Try incognito/different browser

### RLS errors ("new row violates policy")

- Verify SQL setup completed successfully
- Check policies in Supabase dashboard → Authentication → Policies
- Ensure trigger is active (creates profile on signup)

### Tier not updating

- Check browser console for errors
- Verify RLS policies allow UPDATE for authenticated users
- Check Supabase logs in dashboard

---

## Security Notes

### What's Protected

✅ `.env` file is gitignored (never committed)
✅ Row Level Security (RLS) enabled on `user_profiles`
✅ Users can only read/update their own profile
✅ Session tokens stored securely in localStorage
✅ Anon key is safe to expose (read-only public key)

### What's NOT Implemented (Production TODO)

⚠️ Payment processing (Stripe/Paddle)
⚠️ Email verification flow
⚠️ Password reset functionality
⚠️ Rate limiting on auth endpoints
⚠️ Admin dashboard to manage users
⚠️ Webhook to sync payment status → tier

---

## Next Steps

1. **Add Real Content**: Replace placeholder components with actual guitar content
2. **Payment Integration**: Add Stripe for real subscriptions
3. **Email Templates**: Customize Supabase email templates (Settings → Auth → Email Templates)
4. **Analytics**: Track signups, upgrades, churn
5. **Admin Tools**: Build dashboard to manage users (view tiers, manually upgrade, etc.)

---

## Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

**Authentication Implementation Complete!** ✅

All acceptance criteria met:
- ✅ Supabase client configured
- ✅ Auth components created (Login/Signup)
- ✅ Tier-based route protection working
- ✅ Session persists across refreshes
- ✅ No secrets in git (.env.example only)
