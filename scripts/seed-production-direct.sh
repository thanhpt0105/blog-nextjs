#!/bin/bash

# Quick Seed Production Database
# Seeds production database using direct DATABASE_URL

echo "🌱 Production Database Seed (Direct)"
echo "====================================="
echo ""

# Check if .env.production.local exists
if [ ! -f .env.production.local ]; then
    echo "❌ .env.production.local not found"
    echo ""
    echo "Please create it with your production DATABASE_URL:"
    echo "  DATABASE_URL=\"postgresql://...\""
    echo ""
    echo "You can get it from Vercel Dashboard → Storage → Postgres → .env.local tab"
    exit 1
fi

# Check if DATABASE_URL is set in the file
if ! grep -q "DATABASE_URL" .env.production.local; then
    echo "❌ DATABASE_URL not found in .env.production.local"
    exit 1
fi

echo "✅ Found .env.production.local"
echo "🌱 Running seed script..."
echo ""

# Run seed with production environment
npx prisma db seed

echo ""
echo "🎉 Seed completed successfully!"
echo ""
echo "📊 Login credentials:"
echo "   Admin: admin@example.com / admin123"
echo "   Editor: editor@example.com / editor123"
echo ""
