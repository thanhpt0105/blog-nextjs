# Deployment Guide for Vercel

This guide covers deploying your Next.js blog to Vercel with a PostgreSQL database.

## Table of Contents
1. [Database Setup Options](#database-setup-options)
2. [Vercel Deployment Steps](#vercel-deployment-steps)
3. [Environment Variables](#environment-variables)
4. [CI/CD Integration](#cicd-integration)
5. [Post-Deployment Tasks](#post-deployment-tasks)

---

## Database Setup Options

### Option 1: Vercel Postgres (Recommended)
**Pros**: Seamless integration, automatic scaling, no separate hosting needed
**Pricing**: Free tier includes 256MB storage, 60 hours compute

**Steps**:
1. Go to your Vercel project dashboard
2. Click on "Storage" tab
3. Click "Create Database" → "Postgres"
4. Vercel will automatically add `POSTGRES_*` environment variables
5. Update your `DATABASE_URL` to use Vercel's connection string

### Option 2: Supabase (Free Tier Available)
**Pros**: 500MB free database, built-in auth, real-time features
**Pricing**: Free tier, then $25/month

**Steps**:
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

### Option 3: Railway (Free Trial)
**Pros**: Easy setup, PostgreSQL + Redis available
**Pricing**: Free $5 credit, then pay-as-you-go

**Steps**:
1. Go to [railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy connection string from Variables tab

### Option 4: Neon (Serverless Postgres)
**Pros**: Free tier, serverless, auto-scaling
**Pricing**: Free tier 0.5GB, then $19/month

**Steps**:
1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string

---

## Vercel Deployment Steps

### Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already):
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

2. **Ensure `.gitignore` excludes sensitive files**:
```
.env
.env.local
.env*.local
```

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

#### Required Variables
```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"

# NextAuth.js
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# Cloudinary (Image Upload)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Optional: Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Site Configuration
NEXT_PUBLIC_SITE_URL="https://your-domain.vercel.app"
NEXT_PUBLIC_SITE_NAME="My Blog"
```

**Important**: Select environment for each variable:
- Production
- Preview (optional)
- Development (optional)

### Step 4: Run Database Migrations

After first deployment:

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy

# Or run migrations on Vercel (add to package.json)
# "vercel-build": "prisma generate && prisma migrate deploy && next build"
```

---

## CI/CD Integration

### Vercel's Built-in CI/CD

Vercel provides automatic CI/CD:
- **Automatic deployments** on every push to `main` branch
- **Preview deployments** for every pull request
- **Build logs** and error notifications
- **Rollbacks** with one click

**Configuration** (automatic, but customizable):

Create `vercel.json` in your project root:

```json
{
  "buildCommand": "prisma generate && next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database_url"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_SITE_URL": "https://your-domain.vercel.app"
    }
  }
}
```

### GitHub Actions + Vercel (Optional)

If you want custom CI/CD workflows, update `.github/workflows/ci-cd.yml`:

**Benefits**:
- Run tests before deployment
- Custom deployment rules
- Multiple environment deployments
- Slack/Discord notifications

**Setup**:

1. Get Vercel tokens from [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Get Vercel Org ID and Project ID:
```bash
vercel link
cat .vercel/project.json
```

3. Add GitHub Secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

4. Workflow will run automatically on push/PR

---

## Post-Deployment Tasks

### 1. Seed Database (First Time Only)

```bash
# Using Vercel CLI with remote database
vercel env pull .env.local
npx tsx prisma/seed.ts
```

**Or create a one-time deployment script**:
```bash
# Add to package.json
"seed:production": "NODE_ENV=production npx tsx prisma/seed.ts"
```

### 2. Set Up Custom Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update `NEXTAUTH_URL` environment variable

### 3. Configure Cloudinary

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get credentials from Dashboard → Settings → Access Keys
3. Add upload preset:
   - Settings → Upload → Upload Presets
   - Create preset (unsigned)
   - Note the preset name

### 4. Set Up Monitoring (Optional)

Vercel provides built-in:
- **Analytics**: View traffic and performance
- **Speed Insights**: Web Vitals monitoring
- **Log Drains**: Forward logs to external services

---

## Troubleshooting

### Build Fails

**Check Prisma Client Generation**:
```json
// package.json
"scripts": {
  "vercel-build": "prisma generate && next build"
}
```

**Database Connection Issues**:
- Verify `DATABASE_URL` format
- Check IP whitelist (if using managed database)
- Enable SSL: `?sslmode=require` at end of connection string

### Environment Variables Not Working

- Redeploy after changing env vars
- Check variable names (case-sensitive)
- Verify environment selection (Production/Preview/Development)

### Migrations Fail

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Deploy migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### Image Upload Not Working

- Verify Cloudinary credentials
- Check upload preset is "unsigned"
- Ensure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set

---

## Deployment Checklist

- [ ] Choose and set up database (Vercel Postgres, Supabase, Railway, or Neon)
- [ ] Push code to GitHub
- [ ] Deploy to Vercel (dashboard or CLI)
- [ ] Add all environment variables
- [ ] Run database migrations (`prisma migrate deploy`)
- [ ] Generate Prisma Client (`prisma generate`)
- [ ] Seed database with initial data (optional)
- [ ] Test authentication (login/register)
- [ ] Test image upload functionality
- [ ] Set up custom domain (optional)
- [ ] Enable Vercel Analytics (optional)
- [ ] Configure GitHub Actions (optional)

---

## Useful Commands

```bash
# Deploy to production
vercel --prod

# Check deployment logs
vercel logs

# Pull environment variables locally
vercel env pull

# Run Prisma Studio with remote database
npx prisma studio

# Check build locally
npm run build && npm start

# Type check
npm run type-check

# Lint
npm run lint
```

---

## Cost Estimation

### Free Tier Option
- **Vercel**: Free (Hobby plan)
- **Vercel Postgres**: Free tier (256MB)
- **Cloudinary**: Free tier (25GB storage, 25GB bandwidth)
- **Total**: $0/month

### Paid Option (Recommended for Production)
- **Vercel Pro**: $20/month
- **Supabase Pro**: $25/month
- **Cloudinary**: $0 (or $99/month for more)
- **Total**: ~$45-145/month

---

## Security Best Practices

1. **Never commit** `.env` files
2. **Use strong secrets**: Generate with `openssl rand -base64 32`
3. **Enable CORS** properly in production
4. **Set secure cookies**: `secure: true` in NextAuth config
5. **Rate limiting**: Consider Vercel Edge Config
6. **Database backups**: Enable on your database provider

---

## Next Steps

After successful deployment:

1. ✅ Test all features in production
2. ✅ Monitor performance with Vercel Analytics
3. ✅ Set up error tracking (Sentry, LogRocket)
4. ✅ Configure CDN for static assets
5. ✅ Set up database backups
6. ✅ Document API endpoints
7. ✅ Create user documentation

---

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production Guide](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)
