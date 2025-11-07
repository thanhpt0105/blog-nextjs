# Personal Blog - Next.js with Material-UI

A modern, responsive personal blog built with Next.js 14 (App Router), TypeScript, and Material-UI (MUI) v5. Features dark/light theme toggle, MDX blog posts, and a clean, professional design.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)
![Material-UI](https://img.shields.io/badge/Material--UI-5.15-007FFF?style=flat-square&logo=mui)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## ✨ Features

- 🎨 **Material-UI Design**: Beautiful, responsive UI with customizable theming
- 🌓 **Dark/Light Mode**: Theme toggle with localStorage persistence
- 📝 **MDX Blog Posts**: Write posts in Markdown with React components
- 🎯 **SEO Optimized**: Dynamic meta tags, Open Graph, and Twitter cards
- 📱 **Fully Responsive**: Mobile-first design that works on all devices
- 🏷️ **Tag System**: Categorize posts with tags
- ⚡ **Fast & Modern**: Built with Next.js 14 App Router
- 🔒 **Type-Safe**: Full TypeScript support
- 🐳 **Docker Ready**: Development environment with Docker Compose
- 🚀 **CI/CD Pipeline**: GitHub Actions for automated testing and deployment

## 📋 Table of Contents

- [Demo](#demo)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Docker Setup](#docker-setup)
- [Adding New Posts](#adding-new-posts)
- [Customization](#customization)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎬 Demo

Visit the live demo: [Your Blog URL](#)

## 📁 Project Structure

```
blog-nextjs/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Home page with post list
│   ├── about/                   # About page
│   │   └── page.tsx
│   └── blog/                    # Blog posts
│       └── [slug]/
│           └── page.tsx         # Dynamic blog post page
├── components/                   # Reusable React components
│   ├── ThemeRegistry.tsx        # MUI theme provider & dark mode
│   ├── Navbar.tsx               # Navigation bar
│   ├── Footer.tsx               # Footer component
│   ├── ThemeToggleButton.tsx    # Theme switcher
│   ├── PostList.tsx             # Blog post list
│   └── PostCard.tsx             # Individual post card
├── content/                      # Blog content
│   └── posts/                   # MDX blog posts
│       ├── getting-started-nextjs-typescript.mdx
│       ├── building-uis-material-ui.mdx
│       └── typescript-tips-react-developers.mdx
├── lib/                         # Utility functions
│   └── posts.ts                 # Post loading utilities
├── types/                       # TypeScript type definitions
│   └── post.ts                  # Post interface
├── db/                          # Database scripts
│   └── init.sql                 # PostgreSQL initialization
├── .github/                     # GitHub configuration
│   └── workflows/
│       └── ci-cd.yml            # CI/CD pipeline
├── docker-compose.yml           # Docker Compose configuration
├── Dockerfile                   # Production Dockerfile
├── Dockerfile.dev               # Development Dockerfile
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Docker & Docker Compose** (optional, for containerized development)

### Local Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/blog-nextjs.git
cd blog-nextjs
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration (defaults should work for local development).

4. **Choose your setup** (see detailed guide in [DATABASE_SETUP.md](DATABASE_SETUP.md))

**Option A: Next.js only (fastest, no database)** ⚡
```bash
npm run dev
# Open http://localhost:3000
```

**Option B: With database (recommended)** ⭐
```bash
# Start database in Docker
npm run db:start

# Start Next.js locally
npm run dev
# Open http://localhost:3000
```

**Option C: Full Docker setup**
```bash
# Start everything in Docker
npm run docker:dev
# Open http://localhost:3000
```

> **Note:** The blog works without a database (posts are loaded from MDX files). The database is ready for future features like comments, analytics, etc.

### Available Scripts

#### Next.js Development
```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

#### Database Management
```bash
npm run db:start     # Start PostgreSQL in Docker
npm run db:stop      # Stop PostgreSQL
npm run db:restart   # Restart PostgreSQL
npm run db:logs      # View database logs
npm run db:reset     # Reset database (deletes all data)
```

#### Database UI (pgAdmin)
```bash
npm run pgadmin:start  # Start pgAdmin on http://localhost:5050
npm run pgadmin:stop   # Stop pgAdmin
```

#### Full Docker Environment
```bash
npm run docker:dev   # Start Next.js + PostgreSQL + pgAdmin
npm run docker:down  # Stop all Docker services
```

> **See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed database usage guide.**

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

The project includes a complete Docker Compose setup with PostgreSQL database and pgAdmin for database management.

1. **Start all services**

```bash
docker-compose up -d
```

This will start:
- **Next.js app** on [http://localhost:3000](http://localhost:3000)
- **PostgreSQL** on port 5432
- **pgAdmin** on [http://localhost:5050](http://localhost:5050)

2. **View logs**

```bash
docker-compose logs -f nextjs-app
```

3. **Stop all services**

```bash
docker-compose down
```

4. **Rebuild after changes**

```bash
docker-compose up -d --build
```

### Access pgAdmin

1. Open [http://localhost:5050](http://localhost:5050)
2. Login with credentials from `.env.local`:
   - Email: `admin@blog.com`
   - Password: `admin`
3. Add a new server:
   - Host: `postgres`
   - Port: `5432`
   - Database: `blogdb`
   - Username: `bloguser`
   - Password: `blogpassword`

## 🎨 Customization

### Changing Theme Colors

Edit `components/ThemeRegistry.tsx`:

```typescript
const theme = React.useMemo(
  () =>
    createTheme({
      palette: {
        mode,
        primary: {
          main: '#1976d2', // Change this to your primary color
        },
        secondary: {
          main: '#dc004e', // Change this to your secondary color
        },
      },
      // ... other theme options
    }),
  [mode]
);
```

### Updating Site Information

1. **Site Title & Name**: Edit `components/Navbar.tsx` and `app/layout.tsx`
2. **About Page**: Edit `app/about/page.tsx`
3. **Social Links**: Edit `components/Footer.tsx`
4. **Metadata**: Edit `app/layout.tsx` for default SEO settings

### Customizing Typography

Edit the typography settings in `components/ThemeRegistry.tsx`:

```typescript
typography: {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    // Add your custom fonts here
  ].join(','),
  h1: {
    fontWeight: 700,
    fontSize: '3rem',
  },
  // ... customize other typography variants
},
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Deploy**

```bash
vercel
```

Follow the prompts to deploy your blog.

### Deploy to Netlify

1. **Build the project**

```bash
npm run build
```

2. **Deploy the `.next` folder** through Netlify's web interface or CLI

### Deploy with Docker

1. **Build the production image**

```bash
docker build -t blog-nextjs .
```

2. **Run the container**

```bash
docker run -p 3000:3000 blog-nextjs
```

### Environment Variables for Production

Make sure to set these environment variables in your hosting platform:

```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Your Blog Name
```

## 🔧 CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/ci-cd.yml`) that:

- ✅ Runs linting and type checking
- 🏗️ Builds the application
- 🔒 Performs security audits
- 🐳 Builds Docker images
- 🚀 Can be configured for automatic deployment

### Setting up CI/CD

1. **Push your code to GitHub**
2. **The workflow runs automatically** on push and pull requests
3. **For deployment**, uncomment the deployment section in `.github/workflows/ci-cd.yml`
4. **Add secrets** to your GitHub repository:
   - `VERCEL_TOKEN` (for Vercel deployment)
   - `DOCKER_USERNAME` (for Docker Hub)
   - `DOCKER_PASSWORD` (for Docker Hub)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit: `git commit -m 'Add some feature'`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Material-UI](https://mui.com/) - React UI Library
- [MDX](https://mdxjs.com/) - Markdown for the component era
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types

## 📞 Contact

- **Author**: Thanh
- **Email**: thanhpt0105@gmail.com

---

Made with ❤️ using Next.js and Material-UI
