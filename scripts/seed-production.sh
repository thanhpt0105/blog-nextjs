#!/bin/bash

# Seed Vercel Production Database Helper
# This script helps you seed your production database on Vercel

set -e

echo "🌱 Vercel Database Seed Helper"
echo "================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if project is linked
if [ ! -d .vercel ]; then
    echo "⚠️  Project not linked to Vercel"
    echo ""
    echo "Please run first:"
    echo "  vercel link"
    echo ""
    exit 1
fi

echo "📥 Pulling production environment variables..."
vercel env pull .env.production.local

if [ ! -f .env.production.local ]; then
    echo "❌ Failed to pull environment variables"
    exit 1
fi

echo "✅ Environment variables pulled successfully"
echo ""
echo "🌱 Running seed script with production database..."
echo ""

# Run seed with production environment explicitly
DATABASE_URL=$(grep "^DATABASE_URL=" .env.production.local | cut -d'=' -f2- | tr -d '"') npx prisma db seed

echo ""
echo "🎉 Seed completed successfully!"
echo ""
echo "📊 Login credentials:"
echo "   Admin: admin@example.com / admin123"
echo "   Editor: editor@example.com / editor123"
echo ""
echo "🔗 Visit your site to verify:"
echo "   Production: $(grep NEXTAUTH_URL .env.production.local | cut -d'=' -f2)"
