# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Option 1: Standard Setup (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
open http://localhost:3000
```

### Option 2: Docker Setup (2 minutes)

```bash
# 1. Start all services (Next.js + PostgreSQL + pgAdmin)
docker-compose up -d

# 2. Open browser
open http://localhost:3000
```

## 📝 Add Your First Blog Post

1. Create a new file in `content/posts/`:
   ```bash
   touch content/posts/my-first-post.mdx
   ```

2. Add content:
   ```mdx
   ---
   title: "My First Post"
   date: "2024-03-15"
   excerpt: "This is my first blog post"
   tags: ["Blog", "First Post"]
   author: "Your Name"
   readTime: "3 min read"
   ---

   # My First Post

   Welcome to my blog!
   ```

3. View at: http://localhost:3000/blog/my-first-post

## 🎨 Customize Your Blog

### Change Colors
Edit `components/ThemeRegistry.tsx`:
```typescript
primary: { main: '#1976d2' }  // Your color here
```

### Update Site Name
Edit `components/Navbar.tsx`:
```typescript
<Typography>My Blog</Typography>  // Your name here
```

### Edit About Page
Edit `app/about/page.tsx` with your information

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after changes
docker-compose up -d --build

# Access PostgreSQL
docker-compose exec postgres psql -U bloguser -d blogdb
```

## 🚀 Deploy

### Vercel (Easiest)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the build output
```

## 💡 Tips

- Dark mode toggle is in the top-right corner
- Posts are automatically sorted by date (newest first)
- Images in posts: use standard Markdown syntax
- Code blocks: use triple backticks with language

## 🆘 Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Reset Docker
```bash
docker-compose down -v
docker-compose up -d --build
```

### Clear Next.js cache
```bash
rm -rf .next
npm run dev
```

## 📚 Learn More

- [Full README](README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com)
- [MDX Documentation](https://mdxjs.com)

---

Need help? Open an issue on GitHub!
