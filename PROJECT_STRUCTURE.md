# 📊 Project Structure Overview

## Complete Folder Structure

```
blog-nextjs/
│
├── 📁 app/                              # Next.js 14 App Router
│   ├── layout.tsx                      # Root layout with ThemeRegistry
│   ├── page.tsx                        # Home page (post list)
│   ├── about/
│   │   └── page.tsx                   # About page
│   └── blog/
│       └── [slug]/
│           └── page.tsx               # Dynamic blog post page
│
├── 📁 components/                       # Reusable React components
│   ├── ThemeRegistry.tsx              # MUI theme + dark/light mode
│   ├── Navbar.tsx                     # Navigation with theme toggle
│   ├── Footer.tsx                     # Footer with social links
│   ├── ThemeToggleButton.tsx          # Theme switcher button
│   ├── PostList.tsx                   # Grid of blog posts
│   └── PostCard.tsx                   # Individual post card
│
├── 📁 content/                          # Blog content
│   └── posts/                         # MDX blog posts
│       ├── getting-started-nextjs-typescript.mdx
│       ├── building-uis-material-ui.mdx
│       └── typescript-tips-react-developers.mdx
│
├── 📁 lib/                             # Utility functions
│   └── posts.ts                       # Post loading utilities
│
├── 📁 types/                           # TypeScript types
│   └── post.ts                        # Post interface
│
├── 📁 db/                              # Database
│   └── init.sql                       # PostgreSQL init script
│
├── 📁 .github/                         # GitHub configuration
│   └── workflows/
│       └── ci-cd.yml                  # CI/CD pipeline
│
├── 📄 docker-compose.yml               # Docker Compose config
├── 📄 Dockerfile                       # Production Docker image
├── 📄 Dockerfile.dev                   # Development Docker image
├── 📄 .dockerignore                    # Docker ignore file
│
├── 📄 package.json                     # Dependencies & scripts
├── 📄 tsconfig.json                    # TypeScript config
├── 📄 next.config.js                   # Next.js config
├── 📄 .eslintrc.json                   # ESLint config
├── 📄 .gitignore                       # Git ignore file
│
├── 📄 .env.example                     # Environment template
├── 📄 .env.local                       # Local environment
│
├── 📄 README.md                        # Full documentation
├── 📄 QUICKSTART.md                    # Quick start guide
├── 📄 CONTRIBUTING.md                  # Contribution guide
└── 📄 LICENSE                          # MIT License
```

## 🔑 Key Files Explained

### Core Application Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with MUI theme provider, Navbar, Footer |
| `app/page.tsx` | Home page displaying all blog posts |
| `app/blog/[slug]/page.tsx` | Dynamic page for individual blog posts |
| `components/ThemeRegistry.tsx` | MUI theme configuration with dark/light mode |
| `lib/posts.ts` | Functions to load and parse MDX blog posts |

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and npm scripts |
| `tsconfig.json` | TypeScript compiler options |
| `next.config.js` | Next.js framework configuration |
| `.eslintrc.json` | Code linting rules |

### Docker Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Multi-container setup (Next.js + PostgreSQL + pgAdmin) |
| `Dockerfile` | Production Docker image |
| `Dockerfile.dev` | Development Docker image |
| `db/init.sql` | Database initialization script |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | Complete documentation |
| `QUICKSTART.md` | Fast setup instructions |
| `CONTRIBUTING.md` | Contribution guidelines |
| `LICENSE` | MIT License |

## 🎯 Component Architecture

```
┌─────────────────────────────────────────┐
│           Root Layout (layout.tsx)       │
│  ┌───────────────────────────────────┐  │
│  │      ThemeRegistry Provider       │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │         Navbar              │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │      Page Content           │  │  │
│  │  │  ┌─────────────────────┐    │  │  │
│  │  │  │   Home: PostList    │    │  │  │
│  │  │  │   ├─ PostCard       │    │  │  │
│  │  │  │   ├─ PostCard       │    │  │  │
│  │  │  │   └─ PostCard       │    │  │  │
│  │  │  └─────────────────────┘    │  │  │
│  │  │  ┌─────────────────────┐    │  │  │
│  │  │  │   Blog: Post Detail │    │  │  │
│  │  │  │   └─ MDX Content    │    │  │  │
│  │  │  └─────────────────────┘    │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │         Footer              │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## 🔄 Data Flow

```
1. User visits homepage
   ↓
2. app/page.tsx calls getAllPosts()
   ↓
3. lib/posts.ts reads content/posts/*.mdx
   ↓
4. Parses frontmatter with gray-matter
   ↓
5. Returns Post[] array
   ↓
6. PostList renders PostCards
   ↓
7. User clicks on a post
   ↓
8. Navigates to /blog/[slug]
   ↓
9. app/blog/[slug]/page.tsx calls getPostBySlug()
   ↓
10. MDXRemote renders the content
```

## 🎨 Theme System

```
ThemeRegistry (Client Component)
├── ColorModeContext
│   ├── mode: 'light' | 'dark'
│   └── toggleColorMode()
├── MUI ThemeProvider
│   ├── theme
│   │   ├── palette (colors)
│   │   ├── typography (fonts)
│   │   └── components (overrides)
│   └── CssBaseline
└── Children (App Content)
```

## 📦 Dependencies

### Production
- `next` - React framework
- `react` & `react-dom` - React library
- `@mui/material` - UI component library
- `@mui/icons-material` - Icon library
- `@emotion/react` & `@emotion/styled` - CSS-in-JS
- `gray-matter` - Parse frontmatter
- `next-mdx-remote` - Render MDX content

### Development
- `typescript` - Type checking
- `@types/*` - Type definitions
- `eslint` - Code linting

## 🚀 Available Scripts

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

## 🐳 Docker Services

```
docker-compose up -d starts:

┌──────────────────┐
│   nextjs-app     │  Port 3000 (Next.js)
├──────────────────┤
│   postgres       │  Port 5432 (Database)
├──────────────────┤
│   pgadmin        │  Port 5050 (DB Admin)
└──────────────────┘
```

## 🔐 Environment Variables

### Required for Basic Setup
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=My Blog
```

### Required for Docker
```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=blogdb
POSTGRES_USER=bloguser
POSTGRES_PASSWORD=blogpassword
PGADMIN_EMAIL=admin@blog.com
PGADMIN_PASSWORD=admin
```

## 📝 Blog Post Format

```yaml
---
title: "Post Title"               # Required
date: "2024-01-15"               # Required (YYYY-MM-DD)
excerpt: "Short description"      # Required
tags: ["Tag1", "Tag2"]           # Required (array)
author: "Author Name"            # Optional
readTime: "5 min read"           # Optional
---

# Your Markdown Content Here

Regular text, **bold**, *italic*, etc.
```

## 🎯 SEO Features

- ✅ Dynamic page titles
- ✅ Meta descriptions
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Structured data ready
- ✅ Semantic HTML
- ✅ Mobile responsive

## 🌟 Features Summary

| Feature | Status | Location |
|---------|--------|----------|
| Dark/Light Theme | ✅ | `components/ThemeRegistry.tsx` |
| Responsive Design | ✅ | All components (MUI) |
| Blog Post List | ✅ | `app/page.tsx` |
| Blog Post Detail | ✅ | `app/blog/[slug]/page.tsx` |
| MDX Support | ✅ | `lib/posts.ts` |
| Tag System | ✅ | `components/PostCard.tsx` |
| SEO Optimization | ✅ | All pages (metadata) |
| Docker Support | ✅ | `docker-compose.yml` |
| CI/CD Pipeline | ✅ | `.github/workflows/ci-cd.yml` |
| PostgreSQL DB | ✅ | `docker-compose.yml` |
| pgAdmin | ✅ | Port 5050 |

---

**Next Steps**: See [QUICKSTART.md](QUICKSTART.md) to get started!
