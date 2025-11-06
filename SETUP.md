# 🎯 Setup Instructions

Follow these steps to get your blog up and running!

## Prerequisites Check

Before you begin, make sure you have:

- [ ] Node.js 18.x or higher (`node --version`)
- [ ] npm or yarn (`npm --version`)
- [ ] Git (`git --version`)
- [ ] Docker & Docker Compose (optional) (`docker --version`)

## Method 1: Standard Setup (Recommended for Development)

### Step 1: Install Dependencies

```bash
cd /Users/thanhpt6/Documents/personal/blog-nextjs
npm install
```

**This will install:**
- Next.js 14.2.3
- React 18.3.1
- Material-UI 5.15.15
- TypeScript 5.4.5
- All other dependencies

### Step 2: Environment Setup

The `.env.local` file is already created. Review and update if needed:

```bash
cat .env.local
```

### Step 3: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
   ▲ Next.js 14.2.3
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.3s
```

### Step 4: Open Your Browser

Visit: **http://localhost:3000**

You should see:
- ✅ Your blog homepage with 3 sample posts
- ✅ Dark/light theme toggle in the header
- ✅ Responsive navigation
- ✅ Post cards with tags

### Step 5: Test Features

1. **Click on a blog post** - Should open the detail page
2. **Toggle dark mode** - Click the theme icon in the header
3. **Navigate to About page** - Click "About" in the header
4. **Check responsiveness** - Resize your browser window

## Method 2: Docker Setup (Full Stack with Database)

### Step 1: Start Docker Services

```bash
cd /Users/thanhpt6/Documents/personal/blog-nextjs
docker-compose up -d
```

**This starts:**
- Next.js app on port 3000
- PostgreSQL on port 5432
- pgAdmin on port 5050

### Step 2: Check Service Status

```bash
docker-compose ps
```

**Expected output:**
```
NAME                STATUS    PORTS
blog-nextjs-app     running   0.0.0.0:3000->3000/tcp
blog-postgres       running   0.0.0.0:5432->5432/tcp
blog-pgadmin        running   0.0.0.0:5050->80/tcp
```

### Step 3: View Logs

```bash
docker-compose logs -f nextjs-app
```

### Step 4: Access Services

- **Blog**: http://localhost:3000
- **pgAdmin**: http://localhost:5050
  - Email: `admin@blog.com`
  - Password: `admin`

## Verify Installation

### ✅ Checklist

Run through this checklist to verify everything works:

- [ ] Homepage loads at http://localhost:3000
- [ ] You see 3 sample blog posts
- [ ] Dark mode toggle works
- [ ] Clicking a post opens the detail page
- [ ] About page loads
- [ ] No console errors in browser DevTools
- [ ] Mobile view is responsive (resize window)

### 🔍 Common Issues

#### Port 3000 Already in Use

```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

#### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Docker Container Won't Start

```bash
# Stop and remove containers
docker-compose down

# Rebuild and start
docker-compose up -d --build
```

## Next Steps

### 1. Add Your First Blog Post

```bash
# Create a new post file
touch content/posts/my-first-post.mdx
```

Add this content:

```mdx
---
title: "My First Blog Post"
date: "2024-03-15"
excerpt: "This is my very first blog post on my new website!"
tags: ["Blog", "Personal"]
author: "Your Name"
readTime: "2 min read"
---

# My First Blog Post

Welcome to my blog! I'm excited to share my thoughts and experiences here.

## What I'll Write About

- Web development
- My coding journey
- Tech tutorials
- And more!

Stay tuned for more posts!
```

Refresh the homepage - your post should appear!

### 2. Customize Your Blog

#### Update Site Name

Edit `components/Navbar.tsx`:

```typescript
// Line 18-19
<Typography variant="h6" component="a">
  My Awesome Blog  {/* Change this */}
</Typography>
```

#### Change Theme Colors

Edit `components/ThemeRegistry.tsx`:

```typescript
// Line 44-51
primary: {
  main: '#1976d2',  // Your color here
},
secondary: {
  main: '#dc004e',  // Your color here
},
```

#### Update About Page

Edit `app/about/page.tsx` with your personal information.

### 3. Set Up Version Control

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Personal blog with Next.js and MUI"

# Connect to GitHub
git remote add origin https://github.com/yourusername/blog-nextjs.git
git branch -M main
git push -u origin main
```

### 4. Development Workflow

```bash
# Start development
npm run dev

# In another terminal, watch for errors
npm run type-check

# Before committing
npm run lint
npm run build
```

## Production Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
# ✓ Linked to your-username/blog-nextjs
# ✓ Production: https://blog-nextjs-xxx.vercel.app
```

### Environment Variables for Production

In your Vercel/Netlify dashboard, add:

```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Your Blog Name
```

## Troubleshooting

### Build Fails

```bash
# Clean build cache
rm -rf .next

# Rebuild
npm run build
```

### TypeScript Errors

```bash
# Run type check to see all errors
npm run type-check

# Most errors are just missing node_modules
# (they'll go away after npm install)
```

### Styling Issues

```bash
# Clear browser cache
# Or open in incognito mode
```

## Getting Help

1. **Check the docs**: See [README.md](README.md) for full documentation
2. **Review examples**: Look at the sample posts in `content/posts/`
3. **Open an issue**: If you find a bug, open a GitHub issue
4. **Community**: Join Next.js Discord or MUI Discord

## Success! 🎉

If you've made it here, your blog should be running successfully!

**Your blog is live at:** http://localhost:3000

**What's next?**
- Write your first post
- Customize the design
- Deploy to production
- Share with the world!

---

**Happy blogging!** 🚀📝✨
