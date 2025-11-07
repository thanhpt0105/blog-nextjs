-- Add indexes for better query performance

-- Index on posts.published for filtering published posts
CREATE INDEX IF NOT EXISTS "posts_published_idx" ON "posts"("published");

-- Index on posts.publishedAt for sorting
CREATE INDEX IF NOT EXISTS "posts_publishedAt_idx" ON "posts"("publishedAt" DESC);

-- Index on posts.authorId for author filtering
CREATE INDEX IF NOT EXISTS "posts_authorId_idx" ON "posts"("authorId");

-- Index on posts.slug for lookups
CREATE INDEX IF NOT EXISTS "posts_slug_idx" ON "posts"("slug");

-- Composite index for published posts ordered by date (most common query)
CREATE INDEX IF NOT EXISTS "posts_published_publishedAt_idx" ON "posts"("published", "publishedAt" DESC);

-- Index on post_tags for efficient tag filtering
CREATE INDEX IF NOT EXISTS "post_tags_postId_idx" ON "post_tags"("postId");
CREATE INDEX IF NOT EXISTS "post_tags_tagId_idx" ON "post_tags"("tagId");

-- Index on tags.slug for lookups
CREATE INDEX IF NOT EXISTS "tags_slug_idx" ON "tags"("slug");

-- Index for text search (if using PostgreSQL full-text search in the future)
-- This can be enhanced later with tsvector for better performance
CREATE INDEX IF NOT EXISTS "posts_title_idx" ON "posts" USING gin (to_tsvector('english', "title"));
