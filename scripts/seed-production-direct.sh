#!/bin/bash

# Quick Seed Production Database
# Seeds production database using direct connection URL

echo "🌱 Production Database Seed (Direct)"
echo "====================================="
echo ""

# Check if .env.production.local exists
if [ ! -f .env.production.local ]; then
    echo "❌ .env.production.local not found"
    echo ""
    echo "Please create it with your production DATABASE URLs:"
    echo "  DATABASE_POSTGRES_PRISMA_URL=\"postgresql://...\""
    echo "  DATABASE_POSTGRES_URL_NON_POOLING=\"postgresql://...\""
    echo ""
    echo "You can get them from Vercel Dashboard → Storage → Postgres"
    exit 1
fi

# Check if DATABASE URLs are set in the file
if ! grep -q "DATABASE_POSTGRES" .env.production.local; then
    echo "❌ DATABASE_POSTGRES_* variables not found in .env.production.local"
    echo "Looking for: DATABASE_POSTGRES_PRISMA_URL or DATABASE_POSTGRES_URL_NON_POOLING"
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
