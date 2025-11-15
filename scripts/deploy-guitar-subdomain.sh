#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🎸 Guitar Platform Subdomain Deployment${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"
command -v gh >/dev/null 2>&1 || { echo -e "${RED}❌ gh CLI not found${NC}"; exit 1; }
command -v vercel >/dev/null 2>&1 || { echo -e "${RED}❌ vercel CLI not found${NC}"; exit 1; }
echo -e "${GREEN}✅ Prerequisites OK${NC}"

# Navigate to guitar directory
cd ~/Projects/projectlavos-monorepo/services/guitar
echo ""
echo -e "${YELLOW}📦 Step 1/5: Creating Vercel project for guitar platform...${NC}"

# Deploy to create project (non-interactive)
echo ""
echo "Running: vercel deploy --prod --yes"
echo ""

# Create .vercel directory with project settings
mkdir -p .vercel
cat > .vercel/project.json << EOF
{
  "orgId": "$(gh secret list -R guitargnarr/projectlavos-monorepo | grep VERCEL_ORG_ID | awk '{print "from-secret"}')",
  "projectId": "guitar-platform-new"
}
EOF

# Deploy non-interactively
VERCEL_ORG_ID=$(vercel teams ls | grep "matthew-scotts-projects" | awk '{print $1}')
export VERCEL_ORG_ID

vercel deploy --prod --yes --name guitar-platform

echo ""
echo -e "${GREEN}✅ Guitar project deployed to Vercel${NC}"
echo ""
echo -e "${YELLOW}Copy the Project ID from the output above.${NC}"
echo "It looks like: ${BLUE}prj_xxxxxxxxxxxxx${NC}"
echo ""
read -p "Paste the Project ID here: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Project ID required${NC}"
    exit 1
fi

# Save as GitHub secret
echo ""
echo -e "${YELLOW}📦 Step 2/5: Saving Project ID to GitHub secrets...${NC}"
echo "$PROJECT_ID" | gh secret set VERCEL_PROJECT_ID_GUITAR -R guitargnarr/projectlavos-monorepo
echo -e "${GREEN}✅ VERCEL_PROJECT_ID_GUITAR saved${NC}"

# Add Supabase env vars
echo ""
echo -e "${YELLOW}🔐 Step 3/5: Adding Supabase credentials to guitar project...${NC}"

# Check for credentials file
if [ ! -f "../../.env.supabase" ]; then
    echo -e "${RED}❌ Missing .env.supabase${NC}"
    echo "Run this first: cd ~/Projects/projectlavos-monorepo && cat .env.supabase"
    exit 1
fi

source ../../.env.supabase

echo "Adding VITE_SUPABASE_URL..."
echo "$SUPABASE_URL" | vercel env add VITE_SUPABASE_URL production preview development 2>/dev/null || echo "Already exists"

echo "Adding VITE_SUPABASE_ANON_KEY..."
echo "$SUPABASE_ANON_KEY" | vercel env add VITE_SUPABASE_ANON_KEY production preview development 2>/dev/null || echo "Already exists"

echo -e "${GREEN}✅ Supabase env vars added${NC}"

# Commit GitHub Actions update
echo ""
echo -e "${YELLOW}📦 Step 4/5: Committing GitHub Actions workflow...${NC}"
cd ~/Projects/projectlavos-monorepo

git add .github/workflows/deploy-all.yml scripts/deploy-guitar-subdomain.sh

git commit -m "feat(ci): Add guitar platform deployment to GitHub Actions

- Add guitar filter for services/guitar/** changes
- Exclude services/guitar/** from services filter
- Add deploy-guitar job with VERCEL_PROJECT_ID_GUITAR
- Add automated deployment script

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main

echo -e "${GREEN}✅ GitHub Actions updated${NC}"

# Configure custom domain
echo ""
echo -e "${YELLOW}🌐 Step 5/5: Configure custom domain...${NC}"
echo ""
echo "Next steps (manual):"
echo ""
echo "1. Go to: https://vercel.com/matthew-scotts-projects-1dc9743e/guitar-platform/settings/domains"
echo "2. Click 'Add Domain'"
echo "3. Enter: guitar.projectlavos.com"
echo "4. Click 'Add'"
echo ""
echo "5. Add DNS CNAME record (where projectlavos.com is hosted):"
echo "   - Type: CNAME"
echo "   - Name: guitar"
echo "   - Value: cname.vercel-dns.com"
echo "   - TTL: 3600"
echo ""
echo "6. Wait for DNS propagation (5-30 minutes)"
echo ""
echo "7. Test: open https://guitar.projectlavos.com"
echo ""
read -p "Press Enter to open Vercel domains page..."
open "https://vercel.com/matthew-scotts-projects-1dc9743e/guitar-platform/settings/domains"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Guitar Platform Setup Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📊 What was configured:"
echo "  • Vercel project created (guitar-platform)"
echo "  • GitHub secret saved (VERCEL_PROJECT_ID_GUITAR)"
echo "  • Supabase env vars added"
echo "  • GitHub Actions workflow updated"
echo ""
echo "🌐 Next: Configure custom domain"
echo "  1. Add guitar.projectlavos.com in Vercel"
echo "  2. Add CNAME record: guitar → cname.vercel-dns.com"
echo "  3. Wait for DNS propagation"
echo ""
echo "🎸 After DNS propagates, access at:"
echo "  https://guitar.projectlavos.com"
echo ""
