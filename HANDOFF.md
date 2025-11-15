# Guitar Platform - Handoff Document

**Status:** 90% Complete - Final deployment steps needed
**Date:** 2025-11-15

## Completed (11,542 lines)
- 4 PRs merged (Guitar Platform, Content, Video, Auth)
- Supabase configured (user_profiles table + RLS)
- GitHub Actions updated for guitar deployment
- All env vars set

## Remaining (15 min + DNS wait)

1. Get Vercel Project ID: https://vercel.com/matthew-scotts-projects-1dc9743e/guitar-platform/settings/general
2. Save to GitHub: `gh secret set VERCEL_PROJECT_ID_GUITAR`
3. Add Supabase env vars to guitar project (2 commands in services/guitar/)
4. Configure domain: guitar.projectlavos.com → cname.vercel-dns.com
5. Deploy: Commit change to services/guitar/**, push, watch deploy
6. Test: https://guitar.projectlavos.com

## Credentials
- Supabase: See `.env.supabase` file
- Password: KMdpJWddQEj7pOfW
- URL: https://bofydmjelyqbgmzljzzo.supabase.co

## Quick Deploy
```bash
# After getting project ID and configuring domain:
cd ~/Projects/projectlavos-monorepo
echo "# Live" >> services/guitar/README.md
git add . && git commit -m "chore: Deploy guitar" && git push
gh run watch
```
