#!/bin/bash
set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎸 Guitar Platform Deployment Script${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"
command -v gh >/dev/null 2>&1 || { echo -e "${RED}❌ gh CLI not found. Install: brew install gh${NC}"; exit 1; }
command -v vercel >/dev/null 2>&1 || { echo -e "${RED}❌ vercel CLI not found. Install: npm i -g vercel${NC}"; exit 1; }

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "services" ]; then
    echo -e "${RED}❌ Run this from projectlavos-monorepo root${NC}"
    exit 1
fi

# Check for Supabase credentials file
CREDS_FILE=".env.supabase"
if [ ! -f "$CREDS_FILE" ]; then
    echo -e "${RED}❌ Missing $CREDS_FILE${NC}"
    echo ""
    echo "Create it with your Supabase credentials:"
    echo ""
    echo "  SUPABASE_URL=https://xxxxx.supabase.co"
    echo "  SUPABASE_ANON_KEY=eyJhbGc..."
    echo ""
    echo "Get these from: https://supabase.com/dashboard → Your Project → Settings → API"
    echo ""
    read -p "Do you want to create it now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        read -p "Supabase URL: " SUPABASE_URL
        read -p "Supabase Anon Key: " SUPABASE_ANON_KEY
        echo "SUPABASE_URL=$SUPABASE_URL" > $CREDS_FILE
        echo "SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY" >> $CREDS_FILE
        echo -e "${GREEN}✅ Created $CREDS_FILE${NC}"
    else
        exit 1
    fi
fi

# Load credentials
source $CREDS_FILE
echo -e "${GREEN}✅ Loaded Supabase credentials${NC}"

# Step 1: Push cleanup commit (if pending)
echo ""
echo -e "${YELLOW}📦 Step 1/5: Pushing cleanup changes...${NC}"
if git status --short | grep -q .; then
    echo "Uncommitted changes detected. Commit them first."
    git status --short
    exit 1
fi

if git log origin/main..HEAD | grep -q .; then
    echo "Pushing to origin/main..."
    git push origin main || { echo -e "${RED}❌ Git push failed. Check network connection.${NC}"; exit 1; }
    echo -e "${GREEN}✅ Changes pushed${NC}"
else
    echo "No changes to push."
fi

# Step 2: Merge all guitar PRs
echo ""
echo -e "${YELLOW}📦 Step 2/5: Merging 4 guitar platform PRs...${NC}"
echo "PR #2: Guitar Platform (5,041 lines)"
echo "PR #3: Content Catalog (1,094 lines)"
echo "PR #4: Video Workflow (2,708 lines)"
echo "PR #5: Authentication (2,699 lines)"
echo ""
read -p "Merge all 4 PRs? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    for PR in 2 3 4 5; do
        echo "Merging PR #$PR..."
        gh pr merge $PR --squash --delete-branch --auto || {
            echo -e "${RED}❌ PR #$PR merge failed. Check conflicts.${NC}"
            exit 1
        }
    done
    echo -e "${GREEN}✅ All 4 PRs merged${NC}"

    # Pull merged changes
    git pull origin main
else
    echo "Skipping PR merge. Merge manually with: gh pr merge 2 3 4 5 --squash --delete-branch"
fi

# Step 3: Create local .env for services
echo ""
echo -e "${YELLOW}🔐 Step 3/5: Creating services/.env...${NC}"
cd services
if [ ! -f ".env" ]; then
    cat > .env << EOF
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
EOF
    echo -e "${GREEN}✅ Created services/.env${NC}"
else
    echo "services/.env already exists. Skipping."
fi
cd ..

# Step 4: Add Vercel environment variables
echo ""
echo -e "${YELLOW}☁️  Step 4/5: Adding Vercel environment variables...${NC}"
cd services

# Check if already added
EXISTING_VARS=$(vercel env ls 2>/dev/null | grep -c "VITE_SUPABASE" || true)
if [ "$EXISTING_VARS" -ge 2 ]; then
    echo "Vercel env vars already exist. Skipping."
else
    echo "Adding VITE_SUPABASE_URL..."
    echo "$SUPABASE_URL" | vercel env add VITE_SUPABASE_URL production preview development 2>/dev/null || echo "Already exists"

    echo "Adding VITE_SUPABASE_ANON_KEY..."
    echo "$SUPABASE_ANON_KEY" | vercel env add VITE_SUPABASE_ANON_KEY production preview development 2>/dev/null || echo "Already exists"

    echo -e "${GREEN}✅ Vercel env vars configured${NC}"
fi

cd ..

# Step 5: Test build locally
echo ""
echo -e "${YELLOW}🔨 Step 5/5: Testing build...${NC}"
cd services/guitar
npm install --silent
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

cd ../..

# Summary
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Guitar Platform Deployment Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📊 What was deployed:"
echo "  • Guitar Platform (FretVision + Tab Player)"
echo "  • Content Catalog (70 GP files)"
echo "  • Video Recording Workflow"
echo "  • Supabase Authentication (Free/Premium/Pro tiers)"
echo ""
echo "🌐 Next steps:"
echo "  1. Deployment will auto-trigger from git push"
echo "  2. Check: https://services.projectlavos.com/guitar"
echo "  3. Test signup/login"
echo "  4. Verify tier-gated content"
echo ""
echo "📝 Manual Supabase setup still needed:"
echo "  1. Go to: https://supabase.com/dashboard"
echo "  2. Navigate to your project → SQL Editor"
echo "  3. Run: services/supabase-setup.sql"
echo "  4. This creates user_profiles table + RLS policies"
echo ""
echo -e "${BLUE}🎸 Happy guitar teaching!${NC}"
