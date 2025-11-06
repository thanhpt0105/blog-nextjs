# Feature Implementation Proposal
## Admin Panel with Authentication & Management System

**Project:** Personal Blog Next.js  
**Date:** November 6, 2025  
**Version:** 1.0  

---

## 📋 Executive Summary

This proposal outlines the implementation of a comprehensive admin panel system with authentication, user management, blog post management, and site configuration capabilities. The system will include JWT-based authentication, OAuth2 integration (Google & Facebook), and a modern admin dashboard.

**Estimated Timeline:** 4-6 weeks  
**Complexity:** High  
**Risk Level:** Medium

---

## 🎯 Feature Overview

### 1. Authentication System
- JWT-based authentication with refresh tokens
- Google OAuth2 integration
- Facebook OAuth2 integration
- Session management
- Role-based access control (Admin, Editor, User)

### 2. Admin Panel - Blog Post Management
- Create, read, update, delete (CRUD) blog posts
- Rich text editor (MDX support)
- Media upload and management
- Draft/Published status
- Post scheduling
- Tag management
- SEO metadata editor

### 3. Admin Panel - User Management
- View all users
- User roles management
- Activate/deactivate users
- User activity logs
- Permission management

### 4. Admin Panel - Site Settings
- Site title and description
- Logo and favicon upload
- SEO meta tags (global)
- Analytics integration settings
- Email configuration

### 5. Admin Panel - Social Links Management
- Dynamic social link configuration
- Support for: Facebook, Twitter/X, Instagram, LinkedIn, TikTok, YouTube, Threads, GitHub
- Show/hide individual links
- Custom link ordering
- Link validation

---

## 🏗️ Technical Architecture

### Technology Stack

#### Backend/API
- **Framework:** Next.js 14 API Routes
- **Database:** PostgreSQL (existing)
- **ORM:** Prisma (recommended for type safety)
- **Authentication:** NextAuth.js v5 (Auth.js)
- **JWT:** jose (lightweight JWT library)
- **File Upload:** uploadthing or AWS S3

#### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** Material-UI v5 (existing)
- **Forms:** React Hook Form + Zod validation
- **Rich Text Editor:** Tiptap or react-md-editor
- **State Management:** React Context + SWR/TanStack Query
- **Tables:** MUI DataGrid

#### Security
- **Password Hashing:** bcryptjs
- **CSRF Protection:** Built-in Next.js
- **Rate Limiting:** upstash/ratelimit
- **Input Validation:** Zod schemas

---

## 📊 Database Schema

### New Tables Required

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- nullable for OAuth users
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'user', -- admin, editor, user
  provider VARCHAR(50), -- local, google, facebook
  provider_id VARCHAR(255),
  email_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  refresh_token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT,
  ip_address VARCHAR(45)
);

-- Blog posts table (migrate from MDX files)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  author_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
  published_at TIMESTAMP,
  scheduled_at TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  read_time VARCHAR(50),
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Post tags junction table
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Site settings table
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
  group_name VARCHAR(100), -- general, seo, social, email, analytics
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID REFERENCES users(id)
);

-- Social links table
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(50) NOT NULL, -- facebook, twitter, instagram, etc.
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media/uploads table
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(500) NOT NULL,
  original_filename VARCHAR(500),
  file_url TEXT NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- login, logout, create_post, update_user, etc.
  entity_type VARCHAR(100), -- post, user, setting, etc.
  entity_id UUID,
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
```

---

## 🗂️ Project Structure

```
blog-nextjs/
├── app/
│   ├── (auth)/                       # Auth routes group
│   │   ├── login/
│   │   │   └── page.tsx             # Login page
│   │   ├── register/
│   │   │   └── page.tsx             # Registration page
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts         # OAuth callback
│   │
│   ├── (admin)/                      # Protected admin routes
│   │   ├── layout.tsx               # Admin layout with sidebar
│   │   ├── admin/
│   │   │   ├── page.tsx             # Dashboard
│   │   │   ├── posts/
│   │   │   │   ├── page.tsx         # Posts list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx     # Create post
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Edit post
│   │   │   ├── users/
│   │   │   │   ├── page.tsx         # Users list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Edit user
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx         # General settings
│   │   │   │   ├── social/
│   │   │   │   │   └── page.tsx     # Social links
│   │   │   │   └── seo/
│   │   │   │       └── page.tsx     # SEO settings
│   │   │   └── media/
│   │   │       └── page.tsx         # Media library
│   │
│   ├── api/                          # API routes
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   ├── logout/
│   │   │   │   └── route.ts
│   │   │   ├── register/
│   │   │   │   └── route.ts
│   │   │   ├── refresh/
│   │   │   │   └── route.ts
│   │   │   └── me/
│   │   │       └── route.ts
│   │   ├── posts/
│   │   │   ├── route.ts             # GET, POST
│   │   │   └── [id]/
│   │   │       └── route.ts         # GET, PUT, DELETE
│   │   ├── users/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── settings/
│   │   │   └── route.ts
│   │   ├── social-links/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   └── upload/
│   │       └── route.ts
│   │
│   ├── layout.tsx                    # Root layout (existing)
│   ├── page.tsx                      # Home page (existing)
│   ├── about/                        # (existing)
│   └── blog/                         # (existing)
│
├── components/
│   ├── admin/                        # Admin-specific components
│   │   ├── AdminLayout.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminHeader.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── PostEditor.tsx
│   │   ├── MediaUploader.tsx
│   │   ├── UserTable.tsx
│   │   ├── SettingsForm.tsx
│   │   └── SocialLinkManager.tsx
│   │
│   ├── auth/                         # Auth components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── OAuthButtons.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── (existing components...)
│
├── lib/
│   ├── auth/
│   │   ├── jwt.ts                   # JWT utilities
│   │   ├── session.ts               # Session management
│   │   ├── oauth.ts                 # OAuth providers
│   │   └── permissions.ts           # Role-based permissions
│   │
│   ├── api/
│   │   ├── client.ts                # API client
│   │   └── hooks.ts                 # SWR/React Query hooks
│   │
│   ├── db/
│   │   ├── prisma.ts                # Prisma client
│   │   └── migrations/              # Database migrations
│   │
│   ├── validations/
│   │   ├── auth.ts                  # Auth schemas
│   │   ├── post.ts                  # Post schemas
│   │   ├── user.ts                  # User schemas
│   │   └── settings.ts              # Settings schemas
│   │
│   └── utils/
│       ├── password.ts              # Password hashing
│       ├── upload.ts                # File upload utilities
│       └── logger.ts                # Logging utility
│
├── types/
│   ├── auth.ts
│   ├── admin.ts
│   └── api.ts
│
├── middleware.ts                     # Auth middleware
│
├── prisma/
│   ├── schema.prisma                # Prisma schema
│   └── seed.ts                      # Database seeding
│
└── (existing files...)
```

---

## 🔐 Authentication Flow

### JWT Authentication

```typescript
// Flow diagram
User Login
    ↓
Validate Credentials
    ↓
Generate JWT Access Token (15 min expiry)
Generate JWT Refresh Token (7 days expiry)
    ↓
Store tokens in HTTP-only cookies
Store session in database
    ↓
Return user data
    ↓
Protected Route Access
    ↓
Middleware verifies JWT
    ↓
If expired → Use Refresh Token
    ↓
Access Granted
```

### OAuth2 Flow (Google/Facebook)

```typescript
// Flow diagram
User clicks "Login with Google/Facebook"
    ↓
Redirect to OAuth provider
    ↓
User authorizes
    ↓
Redirect to callback URL
    ↓
Exchange code for tokens
    ↓
Fetch user profile
    ↓
Create/Update user in database
    ↓
Generate JWT tokens
    ↓
Store session
    ↓
Redirect to dashboard
```

---

## 📦 Required Dependencies

### Add to package.json

```json
{
  "dependencies": {
    // Authentication
    "next-auth": "^5.0.0-beta.4",
    "jose": "^5.2.0",
    "bcryptjs": "^2.4.3",
    
    // Database
    "@prisma/client": "^5.8.0",
    
    // Forms & Validation
    "react-hook-form": "^7.49.3",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4",
    
    // Rich Text Editor
    "@tiptap/react": "^2.1.16",
    "@tiptap/starter-kit": "^2.1.16",
    "@tiptap/extension-image": "^2.1.16",
    "@tiptap/extension-link": "^2.1.16",
    
    // Data Fetching
    "swr": "^2.2.4",
    // OR
    "@tanstack/react-query": "^5.17.15",
    
    // File Upload
    "uploadthing": "^6.3.3",
    // OR AWS SDK if using S3
    
    // Utilities
    "date-fns": "^3.0.6",
    "slugify": "^1.6.6",
    "nanoid": "^5.0.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "prisma": "^5.8.0"
  }
}
```

---

## 🎨 Admin UI Design

### Layout Components

#### 1. Admin Sidebar
- Logo/Brand
- Navigation menu (Dashboard, Posts, Users, Settings, Media)
- User profile dropdown
- Logout button
- Theme toggle

#### 2. Admin Header
- Breadcrumbs
- Search bar (global)
- Notifications
- User avatar menu

#### 3. Dashboard Cards
- Total Posts
- Total Users
- Total Views
- Recent Activity

#### 4. Tables (Posts, Users)
- Pagination
- Sorting
- Filtering
- Bulk actions
- Search

---

## 🔄 Migration Strategy

### Phase 1: Database & Authentication (Week 1-2)

**Tasks:**
1. Set up Prisma ORM
2. Create database schema
3. Write migration scripts
4. Implement JWT authentication
5. Set up NextAuth.js
6. Configure Google OAuth
7. Configure Facebook OAuth
8. Create auth API routes
9. Build login/register pages
10. Add auth middleware

**Deliverables:**
- Working authentication system
- Login with email/password
- Google OAuth login
- Facebook OAuth login
- Protected routes

### Phase 2: Admin Layout & Blog Management (Week 3-4)

**Tasks:**
1. Create admin layout components
2. Build admin dashboard
3. Migrate MDX posts to database
4. Build posts list page
5. Create post editor with rich text
6. Implement post CRUD operations
7. Add media upload functionality
8. Implement tag management
9. Add post scheduling
10. Build post preview

**Deliverables:**
- Functional admin panel
- Complete blog post management
- Media library
- Tag management

### Phase 3: User & Settings Management (Week 5)

**Tasks:**
1. Build user management interface
2. Implement user CRUD operations
3. Add role management
4. Create activity logs viewer
5. Build site settings page
6. Implement settings API
7. Create social links manager
8. Add validation for all forms

**Deliverables:**
- User management system
- Site settings configuration
- Social links management

### Phase 4: Testing & Polish (Week 6)

**Tasks:**
1. Write integration tests
2. Security audit
3. Performance optimization
4. UI/UX improvements
5. Documentation
6. Bug fixes
7. Production deployment

**Deliverables:**
- Production-ready system
- Complete documentation
- Deployment guide

---

## 🔒 Security Considerations

### Authentication Security
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ HTTP-only cookies for tokens
- ✅ CSRF protection
- ✅ Rate limiting on auth endpoints (5 attempts per 15 min)
- ✅ Account lockout after failed attempts
- ✅ Email verification
- ✅ Secure session management

### API Security
- ✅ JWT validation on all protected routes
- ✅ Role-based access control (RBAC)
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma)
- ✅ XSS prevention (React escaping)
- ✅ CORS configuration

### File Upload Security
- ✅ File type validation
- ✅ File size limits
- ✅ Virus scanning (optional)
- ✅ Secure file storage
- ✅ CDN integration

---

## 📈 Performance Considerations

### Optimization Strategies
1. **Database Indexing**: All foreign keys and frequently queried columns
2. **Caching**: Redis for sessions and frequently accessed data
3. **Pagination**: Server-side pagination for large datasets
4. **Image Optimization**: Next.js Image component + CDN
5. **Code Splitting**: Dynamic imports for admin components
6. **API Rate Limiting**: Prevent abuse

### Monitoring
- Add logging for all admin actions
- Track API response times
- Monitor authentication attempts
- Database query performance

---

## 💰 Cost Estimation

### Development Costs
- **Senior Developer**: 160 hours @ $100/hr = $16,000
- **UI/UX Design**: 40 hours @ $80/hr = $3,200
- **QA Testing**: 40 hours @ $60/hr = $2,400
- **Total**: $21,600

### Infrastructure Costs (Monthly)
- **Vercel/Hosting**: $20-50
- **PostgreSQL Database**: $25-100 (depending on provider)
- **File Storage (S3/uploadthing)**: $5-50
- **OAuth Apps**: Free
- **Total**: $50-200/month

---

## 🚨 Risks & Mitigation

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| OAuth integration issues | Medium | Medium | Use battle-tested library (NextAuth.js) |
| Database migration complexity | High | Low | Thorough testing, rollback plan |
| Security vulnerabilities | High | Medium | Security audit, penetration testing |
| Performance degradation | Medium | Low | Load testing, optimization |
| Third-party API downtime | Low | Low | Fallback mechanisms, error handling |

### Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Scope creep | High | Medium | Clear requirements, change management |
| Timeline delays | Medium | Medium | Buffer time, agile methodology |
| Budget overrun | Medium | Low | Regular cost tracking |

---

## 📋 Acceptance Criteria

### Authentication
- [ ] Users can register with email/password
- [ ] Users can login with email/password
- [ ] Users can login with Google OAuth
- [ ] Users can login with Facebook OAuth
- [ ] Users can logout
- [ ] Sessions expire after 7 days
- [ ] Access tokens refresh automatically
- [ ] Password reset functionality works

### Admin Panel - Posts
- [ ] Admin can view all posts
- [ ] Admin can create new posts with rich text editor
- [ ] Admin can edit existing posts
- [ ] Admin can delete posts
- [ ] Admin can publish/unpublish posts
- [ ] Admin can schedule posts
- [ ] Admin can add tags to posts
- [ ] Admin can upload images
- [ ] Posts display correctly on frontend

### Admin Panel - Users
- [ ] Admin can view all users
- [ ] Admin can change user roles
- [ ] Admin can activate/deactivate users
- [ ] Admin can view user activity logs
- [ ] Non-admin users cannot access user management

### Admin Panel - Settings
- [ ] Admin can update site title
- [ ] Admin can update site description
- [ ] Admin can update SEO settings
- [ ] Settings persist across sessions
- [ ] Settings reflect on frontend immediately

### Admin Panel - Social Links
- [ ] Admin can add social media links
- [ ] Admin can edit social media links
- [ ] Admin can delete social media links
- [ ] Admin can reorder social media links
- [ ] Admin can show/hide specific platforms
- [ ] Social links display correctly in footer

---

## 📚 Documentation Requirements

### Developer Documentation
1. **Setup Guide**: How to set up local development
2. **API Documentation**: All endpoints with examples
3. **Database Schema**: ERD and table descriptions
4. **Authentication Guide**: How auth system works
5. **Deployment Guide**: How to deploy to production

### User Documentation
1. **Admin User Guide**: How to use admin panel
2. **Content Creation Guide**: How to create blog posts
3. **User Management Guide**: How to manage users
4. **Settings Configuration Guide**: How to configure site

---

## 🎯 Success Metrics

### Technical Metrics
- API response time < 200ms (95th percentile)
- Page load time < 2 seconds
- Zero critical security vulnerabilities
- 95%+ test coverage for critical paths
- Uptime > 99.9%

### Business Metrics
- Admin can publish a post in < 5 minutes
- User onboarding time < 2 minutes
- Reduced manual content management time by 80%
- Support for 1000+ concurrent users

---

## 🚀 Deployment Plan

### Staging Environment
1. Deploy to staging server
2. Run integration tests
3. Security scan
4. Performance testing
5. Stakeholder review

### Production Rollout
1. Database backup
2. Run migrations
3. Deploy application
4. Smoke tests
5. Monitor for issues
6. Gradual rollout (if needed)

### Rollback Plan
1. Keep previous version ready
2. Database rollback scripts
3. Quick revert process
4. Communication plan

---

## 📞 Support & Maintenance

### Post-Launch Support (3 months)
- Bug fixes
- Performance optimization
- User training
- Documentation updates
- Feature tweaks

### Long-term Maintenance
- Security updates
- Dependency updates
- Feature enhancements
- Backup monitoring
- Performance monitoring

---

## ✅ Recommendation

### Recommended Approach
1. **Start with Phase 1**: Authentication is foundational
2. **Use Prisma**: Better TypeScript integration, migrations
3. **Use NextAuth.js**: Proven, maintained, great OAuth support
4. **Incremental Rollout**: Deploy features as they're completed
5. **Focus on Security**: Don't compromise on authentication

### Alternative Considerations
- **Headless CMS**: Consider Sanity/Contentful if scope increases
- **Managed Auth**: Consider Auth0/Clerk for faster implementation
- **Backend**: Consider separate backend API if scaling needs grow

---

## 📝 Next Steps

1. **Review & Approve Proposal**: Stakeholder sign-off
2. **Finalize Requirements**: Detailed specification document
3. **Set Up Infrastructure**: Database, hosting, OAuth apps
4. **Begin Development**: Start with Phase 1
5. **Regular Check-ins**: Weekly progress reviews

---

## 📄 Appendices

### Appendix A: Environment Variables Required

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/blogdb"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-token-secret-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"

# File Upload (if using AWS S3)
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# Redis (for rate limiting)
REDIS_URL="redis://localhost:6379"
```

### Appendix B: OAuth App Setup Guides

**Google OAuth Setup:**
1. Go to Google Cloud Console
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Copy client ID and secret

**Facebook OAuth Setup:**
1. Go to Facebook Developers
2. Create new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs
5. Get App ID and App Secret
6. Submit for review (for production)

### Appendix C: Recommended VS Code Extensions
- Prisma
- ESLint
- Prettier
- Thunder Client (API testing)
- GitLens

---

**Document Version:** 1.0  
**Last Updated:** November 6, 2025  
**Author:** Development Team  
**Status:** Pending Approval

---

## 💡 Questions or Concerns?

For questions about this proposal, please contact:
- Technical Lead: [Your Email]
- Project Manager: [PM Email]
- Security Review: [Security Email]
