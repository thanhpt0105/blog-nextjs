# Quick Implementation Guide
## Admin Panel Features - Getting Started

This is a condensed guide for developers ready to start implementing the admin panel features.

---

## 🚀 Quick Start Checklist

### Day 1: Environment Setup
```bash
# 1. Install new dependencies
npm install @prisma/client prisma next-auth jose bcryptjs zod react-hook-form @hookform/resolvers

# 2. Install dev dependencies
npm install -D @types/bcryptjs

# 3. Initialize Prisma
npx prisma init

# 4. Set up environment variables (see below)
```

### Day 2-3: Database Setup
```bash
# 1. Update prisma/schema.prisma (see schema in FEATURE_PROPOSAL.md)
# 2. Run migration
npx prisma migrate dev --name init_admin_tables

# 3. Generate Prisma client
npx prisma generate

# 4. Create seed file
npx prisma db seed
```

### Day 4-7: Authentication Implementation
```bash
# Create these files in order:
1. lib/auth/jwt.ts          # JWT utilities
2. lib/auth/password.ts     # Password hashing
3. app/api/auth/register/route.ts
4. app/api/auth/login/route.ts
5. middleware.ts            # Protected routes
6. app/(auth)/login/page.tsx
```

---

## 📋 Implementation Order (Recommended)

### Sprint 1: Foundation (Week 1)
- [ ] Set up Prisma
- [ ] Create database schema
- [ ] Implement JWT utilities
- [ ] Build registration API
- [ ] Build login API
- [ ] Create login/register pages
- [ ] Add auth middleware

### Sprint 2: OAuth & Sessions (Week 2)
- [ ] Set up NextAuth.js
- [ ] Configure Google OAuth
- [ ] Configure Facebook OAuth
- [ ] Add session management
- [ ] Add refresh token flow
- [ ] Test all auth flows

### Sprint 3: Admin Layout (Week 3)
- [ ] Create admin layout
- [ ] Build admin sidebar
- [ ] Build admin header
- [ ] Create dashboard page
- [ ] Add protected route wrapper
- [ ] Style admin UI

### Sprint 4: Post Management (Week 4)
- [ ] Migrate MDX to database
- [ ] Build posts list page
- [ ] Create post editor
- [ ] Implement rich text editor
- [ ] Add media upload
- [ ] Add tag management
- [ ] Test CRUD operations

### Sprint 5: User Management (Week 5)
- [ ] Build users list page
- [ ] Create user edit page
- [ ] Implement role management
- [ ] Add activity logs
- [ ] Add user filtering/search

### Sprint 6: Settings & Social (Week 5)
- [ ] Build settings pages
- [ ] Create social links manager
- [ ] Implement settings API
- [ ] Test all features

### Sprint 7: Testing & Polish (Week 6)
- [ ] Integration tests
- [ ] Security audit
- [ ] Performance optimization
- [ ] Documentation
- [ ] Production deployment

---

## 🔧 Key Files to Create

### 1. Environment Variables (.env.local)
```bash
# Add these to your existing .env.local
DATABASE_URL="postgresql://bloguser:blogpassword@localhost:5432/blogdb"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-refresh-token-secret-change-this-too"
NEXTAUTH_SECRET="your-nextauth-secret-generate-with-openssl"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="get-from-google-cloud-console"
GOOGLE_CLIENT_SECRET="get-from-google-cloud-console"
FACEBOOK_CLIENT_ID="get-from-facebook-developers"
FACEBOOK_CLIENT_SECRET="get-from-facebook-developers"
```

### 2. Prisma Schema (prisma/schema.prisma)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String?   @map("password_hash")
  name          String
  avatarUrl     String?   @map("avatar_url")
  role          String    @default("user")
  provider      String?
  providerId    String?   @map("provider_id")
  emailVerified Boolean   @default(false) @map("email_verified")
  isActive      Boolean   @default(true) @map("is_active")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  lastLoginAt   DateTime? @map("last_login_at")

  posts         Post[]
  sessions      Session[]
  activityLogs  ActivityLog[]

  @@map("users")
}

model Session {
  id           String   @id @default(uuid())
  userId       String   @map("user_id")
  token        String   @unique
  refreshToken String   @unique @map("refresh_token")
  expiresAt    DateTime @map("expires_at")
  createdAt    DateTime @default(now()) @map("created_at")
  userAgent    String?  @map("user_agent")
  ipAddress    String?  @map("ip_address")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model Post {
  id             String    @id @default(uuid())
  slug           String    @unique
  title          String
  excerpt        String?
  content        String
  coverImageUrl  String?   @map("cover_image_url")
  authorId       String?   @map("author_id")
  status         String    @default("draft")
  publishedAt    DateTime? @map("published_at")
  scheduledAt    DateTime? @map("scheduled_at")
  viewCount      Int       @default(0) @map("view_count")
  readTime       String?   @map("read_time")
  seoTitle       String?   @map("seo_title")
  seoDescription String?   @map("seo_description")
  seoKeywords    String[]  @map("seo_keywords")
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")

  author   User?     @relation(fields: [authorId], references: [id])
  postTags PostTag[]

  @@map("posts")
}

model Tag {
  id        String   @id @default(uuid())
  name      String   @unique
  slug      String   @unique
  createdAt DateTime @default(now()) @map("created_at")

  postTags PostTag[]

  @@map("tags")
}

model PostTag {
  postId String @map("post_id")
  tagId  String @map("tag_id")

  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([postId, tagId])
  @@map("post_tags")
}

model SiteSetting {
  id          String   @id @default(uuid())
  key         String   @unique
  value       String?
  type        String   @default("string")
  groupName   String?  @map("group_name")
  description String?
  updatedAt   DateTime @updatedAt @map("updated_at")
  updatedBy   String?  @map("updated_by")

  @@map("site_settings")
}

model SocialLink {
  id           String   @id @default(uuid())
  platform     String
  url          String
  displayOrder Int      @default(0) @map("display_order")
  isActive     Boolean  @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("social_links")
}

model Media {
  id               String   @id @default(uuid())
  filename         String
  originalFilename String   @map("original_filename")
  fileUrl          String   @map("file_url")
  fileType         String?  @map("file_type")
  fileSize         Int?     @map("file_size")
  uploadedBy       String?  @map("uploaded_by")
  createdAt        DateTime @default(now()) @map("created_at")

  @@map("media")
}

model ActivityLog {
  id         String   @id @default(uuid())
  userId     String?  @map("user_id")
  action     String
  entityType String?  @map("entity_type")
  entityId   String?  @map("entity_id")
  details    Json?
  ipAddress  String?  @map("ip_address")
  userAgent  String?  @map("user_agent")
  createdAt  DateTime @default(now()) @map("created_at")

  user User? @relation(fields: [userId], references: [id])

  @@map("activity_logs")
}
```

### 3. Seed File (prisma/seed.ts)
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@blog.com' },
    update: {},
    create: {
      email: 'admin@blog.com',
      passwordHash: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      emailVerified: true,
      isActive: true,
    },
  });

  console.log('Created admin user:', admin);

  // Create default site settings
  const settings = [
    { key: 'site_title', value: 'My Blog', groupName: 'general' },
    { key: 'site_description', value: 'A personal blog', groupName: 'general' },
    { key: 'posts_per_page', value: '10', type: 'number', groupName: 'general' },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('Created default settings');

  // Create default social links
  const socialLinks = [
    { platform: 'github', url: 'https://github.com', displayOrder: 1 },
    { platform: 'twitter', url: 'https://twitter.com', displayOrder: 2 },
    { platform: 'linkedin', url: 'https://linkedin.com', displayOrder: 3 },
  ];

  for (const link of socialLinks) {
    await prisma.socialLink.create({ data: link });
  }

  console.log('Created default social links');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 4. JWT Utilities (lib/auth/jwt.ts)
```typescript
import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const JWT_REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!);

export async function generateAccessToken(payload: any) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(JWT_SECRET);
}

export async function generateRefreshToken(payload: any) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_REFRESH_SECRET);
}

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_REFRESH_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}
```

### 5. Password Utilities (lib/auth/password.ts)
```typescript
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
```

### 6. Middleware (middleware.ts)
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  
  // Check if route requires authentication
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    const payload = await verifyAccessToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Check admin role
    if (payload.role !== 'admin' && payload.role !== 'editor') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

---

## 📦 NPM Scripts to Add

Add to package.json:
```json
{
  "scripts": {
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate",
    "db:push": "prisma db push"
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

---

## 🎯 Testing Checklist

### Authentication Tests
- [ ] Register new user
- [ ] Login with email/password
- [ ] Login with Google
- [ ] Login with Facebook
- [ ] Access protected route
- [ ] Token expiration
- [ ] Token refresh
- [ ] Logout

### Admin Panel Tests
- [ ] Access admin dashboard
- [ ] Create new post
- [ ] Edit existing post
- [ ] Delete post
- [ ] Upload media
- [ ] Manage users
- [ ] Update settings
- [ ] Manage social links

---

## 🚨 Common Issues & Solutions

### Issue: Prisma Client not generated
```bash
npx prisma generate
```

### Issue: Database connection error
```bash
# Check your DATABASE_URL in .env.local
# Make sure PostgreSQL is running
npm run db:start
```

### Issue: JWT secret not set
```bash
# Generate secure secrets:
openssl rand -base64 32
# Add to .env.local
```

### Issue: OAuth not working
```bash
# Check redirect URIs in OAuth app settings
# Must match: http://localhost:3000/api/auth/callback/google
```

---

## 📚 Helpful Commands

```bash
# Database
npm run db:start          # Start PostgreSQL
npm run db:migrate        # Run migrations
npm run db:seed           # Seed database
npm run db:studio         # Open Prisma Studio

# Development
npm run dev               # Start dev server
npm run build             # Build for production
npm run type-check        # Check TypeScript
npm run lint              # Run ESLint

# Testing
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","name":"Test User"}'
```

---

## 🔗 Useful Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Jose JWT Library](https://github.com/panva/jose)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)
- [Material-UI DataGrid](https://mui.com/x/react-data-grid/)

---

**Ready to start? Begin with Sprint 1 and work through each task systematically!**
