# 🚀 Quick Deployment Guide

## Prerequisites
- [ ] GitHub repository with your code
- [ ] Vercel account ([sign up](https://vercel.com))
- [ ] Database choice (see options below)
- [ ] Cloudinary account for images

---

## 3-Minute Deployment

### 1. Deploy to Vercel (2 minutes)
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel

# Or use Vercel Dashboard
# https://vercel.com/new → Import from GitHub
```

### 2. Add Environment Variables (1 minute)
In Vercel Dashboard → Settings → Environment Variables:

```bash
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud"
CLOUDINARY_API_KEY="your_key"
CLOUDINARY_API_SECRET="your_secret"
```

### 3. Run Database Migration
```bash
vercel env pull
npx prisma migrate deploy
npx tsx prisma/seed.ts  # Optional: seed data
```

### 4. Deploy to Production
```bash
vercel --prod
```

✅ **Done!** Your blog is live!

---

## Database Options (Choose One)

### 🟢 Vercel Postgres (Recommended for Beginners)
- **Setup Time**: 1 minute
- **Free Tier**: 256MB, 60hrs compute/month
- **Setup**: Vercel Dashboard → Storage → Create Database
- **Auto-configures** `DATABASE_URL` for you!

### 🟢 Supabase (Best Free Tier)
- **Setup Time**: 3 minutes
- **Free Tier**: 500MB database, unlimited API requests
- **Setup**: [supabase.com](https://supabase.com) → New Project
- **Bonus**: Built-in auth, storage, real-time features

### 🟢 Railway (Developer Friendly)
- **Setup Time**: 2 minutes
- **Free Tier**: $5 credit (no card required)
- **Setup**: [railway.app](https://railway.app) → New Project → PostgreSQL
- **Bonus**: One-click Redis, MongoDB, etc.

### 🟢 Neon (Serverless)
- **Setup Time**: 2 minutes
- **Free Tier**: 0.5GB, auto-scales to zero
- **Setup**: [neon.tech](https://neon.tech) → New Project
- **Bonus**: Branching databases, instant snapshots

---

## GitHub Secrets (for CI/CD)

If using GitHub Actions, add these secrets:

Go to: GitHub Repo → Settings → Secrets → Actions

```
VERCEL_TOKEN        # Get from vercel.com/account/tokens
VERCEL_ORG_ID       # From .vercel/project.json
VERCEL_PROJECT_ID   # From .vercel/project.json
```

Get org/project IDs:
```bash
vercel link
cat .vercel/project.json
```

---

## Environment Variables Checklist

### Required
- [x] `DATABASE_URL` - PostgreSQL connection string
- [x] `NEXTAUTH_URL` - Your production URL
- [x] `NEXTAUTH_SECRET` - Generated secret (32+ chars)
- [x] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary name
- [x] `CLOUDINARY_API_KEY` - Cloudinary key
- [x] `CLOUDINARY_API_SECRET` - Cloudinary secret

### Optional
- [ ] `GOOGLE_CLIENT_ID` - For Google OAuth
- [ ] `GOOGLE_CLIENT_SECRET` - For Google OAuth
- [ ] `NEXT_PUBLIC_SITE_NAME` - Custom site name

---

## Common Issues & Solutions

### ❌ Build Fails: "Cannot find module '@prisma/client'"
**Fix**: Add to `package.json`:
```json
"scripts": {
  "postinstall": "prisma generate",
  "vercel-build": "prisma generate && next build"
}
```

### ❌ Database Connection Error
**Fix**: Ensure connection string has `?schema=public` and SSL if required:
```
postgresql://user:pass@host:5432/db?schema=public&sslmode=require
```

### ❌ NextAuth Error: "NEXTAUTH_URL not configured"
**Fix**: Set in Vercel environment variables:
```
NEXTAUTH_URL=https://your-domain.vercel.app
```

### ❌ Images Not Uploading
**Fix**: 
1. Check Cloudinary credentials
2. Create unsigned upload preset in Cloudinary dashboard
3. Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set

### ❌ "Session user not found" after reseeding
**Fix**: Log out and log back in (user IDs changed)

---

## Post-Deployment Checklist

- [ ] Test login/register
- [ ] Test creating a post
- [ ] Test image upload
- [ ] Test admin panel
- [ ] Check mobile responsiveness
- [ ] Verify all pages load
- [ ] Test tag filtering
- [ ] Check search functionality
- [ ] Test theme toggle (light/dark)
- [ ] Verify social links work

---

## Useful Commands

```bash
# Deploy preview
vercel

# Deploy production
vercel --prod

# Check logs
vercel logs

# Pull env variables
vercel env pull

# Run migrations
npx prisma migrate deploy

# Seed database
npx tsx prisma/seed.ts

# Open Prisma Studio (remote)
npx prisma studio

# Check deployment status
vercel ls
```

---

## Cost Breakdown

### Free Tier (Hobby Projects)
- **Vercel**: Free
- **Vercel Postgres**: Free (256MB)
- **Cloudinary**: Free (25GB/month)
- **Total**: $0/month

### Production (Small Business)
- **Vercel Pro**: $20/month
- **Supabase Pro**: $25/month  
- **Cloudinary**: Free-$99/month
- **Total**: $45-144/month

---

## Next Steps After Deployment

1. **Set up custom domain** (optional)
   - Vercel Dashboard → Settings → Domains
   - Add your domain and update DNS

2. **Enable Analytics**
   - Vercel Dashboard → Analytics (free on Pro plan)

3. **Set up monitoring**
   - [Sentry](https://sentry.io) for error tracking
   - [LogRocket](https://logrocket.com) for session replay

4. **Configure backups**
   - Enable in your database provider settings
   - Export data weekly: `pg_dump`

5. **Security hardening**
   - Enable rate limiting (Vercel Edge Config)
   - Set up CORS properly
   - Review security headers

---

## Support

- 📖 **Full Guide**: See `DEPLOYMENT.md`
- 🔧 **Setup Script**: Run `bash scripts/setup-vercel.sh`
- 📚 **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- 💬 **Community**: [GitHub Discussions](https://github.com/vercel/next.js/discussions)

---

**Need help?** Check `DEPLOYMENT.md` for detailed instructions!
