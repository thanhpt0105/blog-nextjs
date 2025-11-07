#!/bin/bash

# Vercel Deployment Setup Helper Script
# This script helps you gather the credentials needed for GitHub Actions deployment

echo "=============================================="
echo "🚀 Vercel GitHub Actions Setup Helper"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI is not installed.${NC}"
    echo ""
    echo "Installing Vercel CLI..."
    npm install -g vercel
    echo ""
fi

echo -e "${BLUE}Step 1: Login to Vercel${NC}"
echo "========================================"
vercel login
echo ""

echo -e "${BLUE}Step 2: Link to Your Project${NC}"
echo "========================================"
echo "This will connect your local project to Vercel."
echo "Select your existing project from the list."
echo ""
vercel link
echo ""

# Check if .vercel directory exists
if [ ! -d ".vercel" ]; then
    echo -e "${RED}❌ Error: Could not link to Vercel project${NC}"
    echo "Please run 'vercel link' manually and try again."
    exit 1
fi

echo -e "${GREEN}✅ Successfully linked to Vercel project!${NC}"
echo ""

# Extract credentials from .vercel/project.json
if [ -f ".vercel/project.json" ]; then
    echo -e "${BLUE}Step 3: Extract Credentials${NC}"
    echo "========================================"
    
    ORG_ID=$(cat .vercel/project.json | grep -o '"orgId": *"[^"]*"' | sed 's/"orgId": *"\(.*\)"/\1/')
    PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId": *"[^"]*"' | sed 's/"projectId": *"\(.*\)"/\1/')
    
    echo ""
    echo -e "${GREEN}📋 Your Vercel Credentials:${NC}"
    echo "========================================"
    echo ""
    echo -e "${YELLOW}VERCEL_ORG_ID:${NC}"
    echo "$ORG_ID"
    echo ""
    echo -e "${YELLOW}VERCEL_PROJECT_ID:${NC}"
    echo "$PROJECT_ID"
    echo ""
else
    echo -e "${RED}❌ Error: .vercel/project.json not found${NC}"
    exit 1
fi

echo -e "${BLUE}Step 4: Get Vercel Token${NC}"
echo "========================================"
echo ""
echo "To get your Vercel Token:"
echo "1. Go to: https://vercel.com/account/tokens"
echo "2. Click 'Create Token'"
echo "3. Name it: 'GitHub Actions Deploy'"
echo "4. Copy the token (starts with 'v1_...')"
echo ""
echo -e "${YELLOW}Opening Vercel tokens page...${NC}"
sleep 2

# Try to open the browser
if command -v open &> /dev/null; then
    # macOS
    open "https://vercel.com/account/tokens"
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open "https://vercel.com/account/tokens"
elif command -v start &> /dev/null; then
    # Windows
    start "https://vercel.com/account/tokens"
else
    echo "Please manually open: https://vercel.com/account/tokens"
fi

echo ""
echo -e "${BLUE}Step 5: Add to GitHub Secrets${NC}"
echo "========================================"
echo ""
echo "Now add these three secrets to your GitHub repository:"
echo ""
echo "Go to: https://github.com/thanhpt0105/blog-nextjs/settings/secrets/actions"
echo ""
echo -e "${GREEN}Add these three secrets:${NC}"
echo ""
echo -e "${YELLOW}1. VERCEL_TOKEN${NC}"
echo "   Value: (paste the token you just created)"
echo ""
echo -e "${YELLOW}2. VERCEL_ORG_ID${NC}"
echo "   Value: $ORG_ID"
echo ""
echo -e "${YELLOW}3. VERCEL_PROJECT_ID${NC}"
echo "   Value: $PROJECT_ID"
echo ""

# Save to a file for reference
cat > .vercel-credentials.txt << EOF
VERCEL Credentials for GitHub Actions
======================================

VERCEL_ORG_ID: $ORG_ID
VERCEL_PROJECT_ID: $PROJECT_ID

VERCEL_TOKEN: (get from https://vercel.com/account/tokens)

Add these to GitHub Secrets:
https://github.com/thanhpt0105/blog-nextjs/settings/secrets/actions

======================================
Generated: $(date)
EOF

echo -e "${GREEN}✅ Credentials saved to: .vercel-credentials.txt${NC}"
echo ""

echo -e "${BLUE}Step 6: Pull Environment Variables${NC}"
echo "========================================"
echo "Pulling environment variables from Vercel..."
echo ""
vercel env pull .env.production
echo ""

if [ -f ".env.production" ]; then
    echo -e "${GREEN}✅ Environment variables saved to: .env.production${NC}"
    echo ""
    echo "You can use these for local production testing:"
    echo "  NODE_ENV=production npm run build"
    echo ""
else
    echo -e "${YELLOW}⚠️  Could not pull environment variables${NC}"
    echo "You may need to add them manually in Vercel dashboard"
    echo ""
fi

echo "=============================================="
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "=============================================="
echo ""
echo "Next steps:"
echo "1. Add the three secrets to GitHub (see above)"
echo "2. Verify environment variables in Vercel dashboard"
echo "3. Push to main branch to trigger deployment:"
echo "   git push origin main"
echo ""
echo "For detailed instructions, see:"
echo "  - VERCEL-GITHUB-DEPLOYMENT.md (full guide)"
echo "  - DEPLOYMENT-CHECKLIST.md (quick checklist)"
echo ""
echo "Happy deploying! 🚀"
echo ""
