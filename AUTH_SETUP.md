# Authentication Setup Guide

This guide will help you set up authentication for your Next.js blog.

## Prerequisites

- Docker Desktop installed and running
- Node.js 18+ installed
- PostgreSQL (via Docker)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="postgresql://bloguser:blogpassword@localhost:5432/blogdb?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"

# Google OAuth (Optional - for Google Sign-In)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth (Optional - for Facebook Sign-In)
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
```

### Generating NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

## Step-by-Step Setup

### 1. Start the Database

```bash
# Start PostgreSQL
npm run db:start

# Verify it's running
npm run db:logs
```

### 2. Run Database Migrations

```bash
# Create database tables
npm run db:migrate

# Generate Prisma Client
npm run db:generate
```

When prompted for a migration name, enter: `init`

### 3. Seed the Database

```bash
# Create admin user and default data
npm run db:seed
```

This creates:
- **Admin User**: 
  - Email: `admin@example.com`
  - Password: `admin123`
  - ⚠️ **Change this password after first login!**
- Default site settings
- Sample social links

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Test the Authentication

1. Go to http://localhost:3000/login
2. Login with:
   - Email: `admin@example.com`
   - Password: `admin123`
3. You'll be redirected to `/admin` (not created yet)

## Setting Up Google OAuth (Optional)

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Copy the **Client ID** and **Client Secret**
8. Add them to `.env.local`

### 2. Test Google Sign-In

1. Go to http://localhost:3000/login
2. Click "Continue with Google"
3. Sign in with your Google account

## Database Management Commands

```bash
# Start PostgreSQL
npm run db:start

# Stop PostgreSQL
npm run db:stop

# Restart PostgreSQL
npm run db:restart

# View logs
npm run db:logs

# Reset database (⚠️ Deletes all data!)
npm run db:reset

# Open Prisma Studio (GUI)
npm run db:studio

# Run migrations
npm run db:migrate

# Push schema changes without migration
npm run db:push

# Generate Prisma Client
npm run db:generate

# Seed database
npm run db:seed
```

## User Management

### Creating Additional Users

#### Via Registration Page

1. Go to http://localhost:3000/register
2. Fill in the form
3. Click "Sign Up"
4. New users are created with `USER` role by default

#### Via Prisma Studio

1. Run `npm run db:studio`
2. Open http://localhost:5555
3. Navigate to `User` model
4. Click "Add record"
5. Fill in the details:
   - `email`: user email
   - `name`: user name
   - `password`: use bcrypt hashed password
   - `role`: `USER` or `ADMIN`

### Promoting User to Admin

#### Option 1: Prisma Studio

1. Run `npm run db:studio`
2. Open http://localhost:5555
3. Find the user in `User` table
4. Edit the record
5. Change `role` from `USER` to `ADMIN`

#### Option 2: Database Query

```bash
# Access PostgreSQL
docker exec -it blog-postgres psql -U bloguser -d blogdb

# Promote user to admin
UPDATE users SET role = 'ADMIN' WHERE email = 'user@example.com';

# Exit
\q
```

## Password Reset (Manual)

If you forget a password, you can reset it manually:

### 1. Generate New Password Hash

Create a file `hash-password.ts`:

```typescript
import { hashPassword } from './lib/auth';

async function main() {
  const newPassword = 'your-new-password';
  const hashed = await hashPassword(newPassword);
  console.log('Hashed password:', hashed);
}

main();
```

Run it:

```bash
npx tsx hash-password.ts
```

### 2. Update in Database

```bash
# Access PostgreSQL
docker exec -it blog-postgres psql -U bloguser -d blogdb

# Update password
UPDATE users SET password = 'HASHED_PASSWORD_HERE' WHERE email = 'user@example.com';
```

## Troubleshooting

### Database Connection Error

**Error**: `Can't reach database server`

**Solution**:
1. Check if Docker is running
2. Check if PostgreSQL container is running: `docker ps`
3. Restart database: `npm run db:restart`
4. Check logs: `npm run db:logs`

### Prisma Client Not Generated

**Error**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
npm run db:generate
```

### Migration Failed

**Error**: Migration failed with errors

**Solution**:
```bash
# Reset database and try again
npm run db:reset
npm run db:migrate
npm run db:seed
```

### Port Already in Use

**Error**: `Port 5432 is already allocated`

**Solution**:
```bash
# Stop existing PostgreSQL
npm run db:stop

# Or use different port in docker-compose.yml
ports:
  - "5433:5432"  # Change first number

# Update DATABASE_URL in .env.local
DATABASE_URL="postgresql://bloguser:blogpassword@localhost:5433/blogdb"
```

### NextAuth Session Error

**Error**: `[next-auth][error][CLIENT_FETCH_ERROR]`

**Solution**:
1. Check `NEXTAUTH_URL` in `.env.local`
2. Check `NEXTAUTH_SECRET` is set
3. Restart dev server

## Security Best Practices

### Production Checklist

- [ ] Change default admin password
- [ ] Use strong `NEXTAUTH_SECRET` (at least 32 characters)
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS in production
- [ ] Set secure cookie settings
- [ ] Implement rate limiting for login attempts
- [ ] Add CSRF protection
- [ ] Enable 2FA for admin accounts (future feature)
- [ ] Regular security audits
- [ ] Keep dependencies updated

### Password Requirements

Current implementation requires:
- Minimum 8 characters
- No special character requirements (consider adding in production)

To add stronger requirements, update `app/api/register/route.ts`:

```typescript
const registerSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
});
```

## Next Steps

After setting up authentication, you can:

1. **Create Admin Dashboard** - Build the `/admin` page
2. **Blog Post Management** - CRUD operations for posts
3. **User Management** - Admin interface for managing users
4. **Settings Management** - UI for site settings
5. **Social Links Management** - Edit social media links

See `IMPLEMENTATION_GUIDE.md` for detailed implementation steps.

## References

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
