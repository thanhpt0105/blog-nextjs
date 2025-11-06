# Quick Reference - Authentication System

## 🚀 Quick Commands

```bash
# Database
npm run db:start              # Start PostgreSQL
npm run db:migrate            # Run migrations (first time: name it "init")
npm run db:seed               # Create admin user
npm run dev                   # Start Next.js

# Useful
npm run db:studio             # Open database GUI (localhost:5555)
npm run db:logs               # View PostgreSQL logs
npm run db:reset              # Reset everything (⚠️ deletes data)
```

## 🔐 Default Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`
- Role: ADMIN
- ⚠️ **Change password after first login!**

## 📍 Routes

| URL | Description | Access |
|-----|-------------|--------|
| `/` | Home page | Public |
| `/blog/[slug]` | Blog post | Public |
| `/about` | About page | Public |
| `/login` | Login form | Public |
| `/register` | Registration | Public |
| `/admin` | Admin dashboard | ADMIN only |
| `/api/auth/[...nextauth]` | NextAuth | API |
| `/api/register` | Register user | API |

## 🗄️ Database Schema (Key Models)

### User
```typescript
{
  id: string
  email: string (unique)
  password: string (hashed)
  name: string
  role: 'USER' | 'ADMIN'
  image: string
  createdAt: DateTime
}
```

### Post
```typescript
{
  id: string
  title: string
  slug: string (unique)
  content: string
  excerpt: string
  coverImage: string
  published: boolean
  authorId: string
  createdAt: DateTime
  publishedAt: DateTime
}
```

### SiteSetting
```typescript
{
  key: string (unique)
  value: string
  description: string
}
```

### SocialLink
```typescript
{
  platform: string
  url: string
  icon: string
  order: number
  visible: boolean
}
```

## 🔧 Environment Variables

```bash
# Required
DATABASE_URL="postgresql://bloguser:blogpassword@localhost:5432/blogdb"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Optional (for OAuth)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

Generate secret:
```bash
openssl rand -base64 32
```

## 💻 Code Examples

### Check if User is Authenticated (Server Component)
```typescript
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth-options';

export default async function Page() {
  const session = await getServerSession(authConfig);
  
  if (!session) {
    return <div>Please login</div>;
  }
  
  return <div>Hello {session.user.name}</div>;
}
```

### Check if User is Authenticated (Client Component)
```typescript
'use client';
import { useSession } from 'next-auth/react';

export default function Page() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <div>Please login</div>;
  
  return <div>Hello {session.user.name}</div>;
}
```

### Check if User is Admin
```typescript
const session = await getServerSession(authConfig);
const isAdmin = session?.user?.role === 'ADMIN';

if (!isAdmin) {
  redirect('/');
}
```

### Use Prisma in API Route
```typescript
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
  
  return Response.json(users);
}
```

### Hash Password
```typescript
import { hashPassword } from '@/lib/auth';

const hashedPassword = await hashPassword('user-password');
```

### Compare Password
```typescript
import { comparePassword } from '@/lib/auth';

const isValid = await comparePassword(
  'user-input',
  'stored-hash'
);
```

## 🐛 Troubleshooting

### Docker not running
```bash
# Check if Docker is running
docker ps

# If not, start Docker Desktop
```

### Database connection failed
```bash
# Check logs
npm run db:logs

# Restart database
npm run db:restart

# Reset database (⚠️ deletes data)
npm run db:reset
```

### Prisma Client not found
```bash
npm run db:generate
```

### Migration failed
```bash
# Reset and try again
npm run db:reset
npm run db:migrate
npm run db:seed
```

### Can't login
1. Check `.env.local` exists
2. Check `NEXTAUTH_SECRET` is set
3. Check database is running
4. Check user exists in database
5. Restart dev server

### Port 5432 already in use
```bash
# Check what's using port
lsof -i :5432

# Kill process
kill -9 PID

# Or change port in docker-compose.yml
```

## 📦 Dependencies Installed

```json
{
  "dependencies": {
    "@auth/prisma-adapter": "^2.11.1",
    "@hookform/resolvers": "^5.2.2",
    "@prisma/client": "^6.19.0",
    "bcryptjs": "^3.0.3",
    "next-auth": "^5.0.0-beta.30",
    "prisma": "^6.19.0",
    "react-hook-form": "^7.66.0",
    "zod": "^4.1.12"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "tsx": "^4.20.6"
  }
}
```

## 🎯 Next Steps

1. Start Docker Desktop
2. Run setup commands above
3. Test login at http://localhost:3000/login
4. Build admin panel (Phase 2)

---

**Need help?** Check `AUTH_SETUP.md` for detailed guide.
