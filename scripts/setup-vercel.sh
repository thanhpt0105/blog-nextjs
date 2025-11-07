#!/bin/bash

# Vercel Deployment Setup Script
# This script helps you set up your project for Vercel deployment

echo "🚀 Vercel Deployment Setup"
echo "=========================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI not found. Installing..."
    npm i -g vercel
else
    echo "✅ Vercel CLI is installed"
fi

echo ""
echo "Step 1: Login to Vercel"
echo "----------------------"
vercel login

echo ""
echo "Step 2: Link to Vercel Project"
echo "------------------------------"
vercel link

echo ""
echo "Step 3: Get Project Information"
echo "------------------------------"
if [ -f .vercel/project.json ]; then
    echo "✅ Project linked successfully!"
    echo ""
    echo "📋 Project Details:"
    cat .vercel/project.json | grep -E "orgId|projectId" | sed 's/[",]//g'
    
    VERCEL_ORG_ID=$(cat .vercel/project.json | grep "orgId" | sed 's/.*: "\(.*\)".*/\1/')
    VERCEL_PROJECT_ID=$(cat .vercel/project.json | grep "projectId" | sed 's/.*: "\(.*\)".*/\1/')
    
    echo ""
    echo "🔑 GitHub Secrets to Add:"
    echo "-------------------------"
    echo "VERCEL_ORG_ID=$VERCEL_ORG_ID"
    echo "VERCEL_PROJECT_ID=$VERCEL_PROJECT_ID"
    echo "VERCEL_TOKEN=<Get from https://vercel.com/account/tokens>"
    echo ""
fi

echo ""
echo "Step 4: Generate NextAuth Secret"
echo "--------------------------------"
if command -v openssl &> /dev/null; then
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
    echo ""
    echo "⚠️  Save this secret! Add it to Vercel environment variables."
else
    echo "⚠️  OpenSSL not found. Generate secret manually at:"
    echo "   https://generate-secret.vercel.app/32"
fi

echo ""
echo "Step 5: Set Environment Variables in Vercel"
echo "------------------------------------------"
echo "Go to: https://vercel.com/dashboard"
echo "Navigate to: Your Project → Settings → Environment Variables"
echo ""
echo "Required variables:"
echo "  DATABASE_URL=postgresql://..."
echo "  NEXTAUTH_URL=https://your-domain.vercel.app"
echo "  NEXTAUTH_SECRET=<generated above>"
echo "  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=..."
echo "  CLOUDINARY_API_KEY=..."
echo "  CLOUDINARY_API_SECRET=..."
echo ""

echo ""
echo "Step 6: Choose Database Option"
echo "-----------------------------"
echo "Option 1: Vercel Postgres (Easiest)"
echo "  → Go to: Vercel Dashboard → Storage → Create Database"
echo ""
echo "Option 2: Supabase (Free 500MB)"
echo "  → Go to: https://supabase.com"
echo ""
echo "Option 3: Railway (Free trial)"
echo "  → Go to: https://railway.app"
echo ""
echo "Option 4: Neon (Serverless)"
echo "  → Go to: https://neon.tech"
echo ""

echo ""
echo "Step 7: Deploy!"
echo "--------------"
echo "Run: vercel --prod"
echo ""

echo ""
echo "📚 For detailed instructions, see: DEPLOYMENT.md"
echo ""
echo "✅ Setup script complete!"
