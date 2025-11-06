# Database Setup Guide

## 🎯 Quick Answer

**For local development with `npm run dev`, you have 3 options:**

## Option 1: Just Database in Docker (Recommended ⭐)

Start only PostgreSQL in Docker, run Next.js locally for fast development:

```bash
# Start database
npm run db:start

# In another terminal, start Next.js
npm run dev

# Open http://localhost:3000
```

**Benefits:**
- ✅ Fast Next.js hot reload
- ✅ Database in Docker (isolated, easy to reset)
- ✅ Best of both worlds

## Option 2: Everything in Docker

Run both Next.js and database in Docker:

```bash
# Start everything
npm run docker:dev

# Open http://localhost:3000
```

**Benefits:**
- ✅ Consistent environment
- ✅ Good for team development
- ⚠️ Slower hot reload

## Option 3: No Database (Current Setup)

Just run Next.js without database:

```bash
npm run dev
```

**Benefits:**
- ✅ Fastest startup
- ⚠️ No database features available

---

## 📚 Available Scripts

### Database Commands

```bash
npm run db:start       # Start PostgreSQL in Docker
npm run db:stop        # Stop PostgreSQL
npm run db:restart     # Restart PostgreSQL
npm run db:logs        # View database logs
npm run db:reset       # Delete all data and restart fresh
```

### pgAdmin (Database UI)

```bash
npm run pgadmin:start  # Start pgAdmin on http://localhost:5050
npm run pgadmin:stop   # Stop pgAdmin
```

Login to pgAdmin:
- Email: `admin@blog.com`
- Password: `admin`

### Full Docker Commands

```bash
npm run docker:dev     # Start Next.js + PostgreSQL + pgAdmin
npm run docker:down    # Stop all Docker services
```

### Next.js Commands

```bash
npm run dev            # Start Next.js dev server
npm run build          # Build for production
npm run start          # Start production server
npm run lint           # Run ESLint
npm run type-check     # TypeScript checking
```

---

## 🚀 Recommended Workflow

### Daily Development

```bash
# Morning: Start database
npm run db:start

# Start coding
npm run dev

# Evening: Stop database (optional)
npm run db:stop
```

### When You Need pgAdmin

```bash
npm run pgadmin:start
# Open http://localhost:5050
```

### Full Reset

```bash
# Reset everything (deletes all data!)
npm run db:reset
npm run dev
```

---

## 🔧 Database Configuration

The database is configured via environment variables in `.env.local`:

```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=blogdb
POSTGRES_USER=bloguser
POSTGRES_PASSWORD=blogpassword
```

---

## 🎯 When Do You Need the Database?

**Current blog setup: Database is OPTIONAL**

The blog currently loads posts from MDX files, so you don't need a database for basic functionality.

**Future features that would use the database:**
- 📊 Post view counts/analytics
- 💬 Comments system
- ❤️ Likes/reactions
- 🔐 User authentication
- 📧 Newsletter subscriptions

---

## 🐛 Troubleshooting

### Port 5432 already in use

```bash
# Check what's using port 5432
lsof -ti:5432

# Kill the process
lsof -ti:5432 | xargs kill -9

# Or change port in docker-compose.yml
ports:
  - "5433:5432"  # Use 5433 instead
```

### Database won't start

```bash
# View logs
npm run db:logs

# Complete reset
docker-compose down -v
npm run db:start
```

### Can't connect to database

```bash
# Check if database is running
docker ps

# Should see: blog-postgres

# Check connection
docker exec blog-postgres pg_isready -U bloguser
```

---

## 📝 Quick Reference

| What You Want | Command |
|---------------|---------|
| Fast local dev | `npm run db:start` + `npm run dev` |
| Full Docker dev | `npm run docker:dev` |
| Just Next.js | `npm run dev` |
| View database | `npm run pgadmin:start` |
| Reset database | `npm run db:reset` |
| Stop everything | `npm run docker:down` |

---

## 💡 Pro Tips

1. **Keep database running** - Once started with `npm run db:start`, you can leave it running across sessions

2. **Use pgAdmin for queries** - Easier than command line for viewing data

3. **Database persists** - Data is saved even when you stop the container (until you run `db:reset`)

4. **Check what's running**:
   ```bash
   docker ps
   ```

5. **Quick database access**:
   ```bash
   docker exec -it blog-postgres psql -U bloguser -d blogdb
   ```

---

## 🎓 Next Steps

1. **Start database**: `npm run db:start`
2. **Start Next.js**: `npm run dev`
3. **Open browser**: http://localhost:3000
4. **Start building!** 🚀

The database is ready for future features like comments or analytics, but your blog works perfectly without it for now!
