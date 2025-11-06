-- Initialize database schema
-- This script runs automatically when the PostgreSQL container starts

-- Create a table for blog analytics (optional)
CREATE TABLE IF NOT EXISTS post_views (
    id SERIAL PRIMARY KEY,
    post_slug VARCHAR(255) NOT NULL,
    view_count INTEGER DEFAULT 0,
    last_viewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_slug)
);

-- Create a table for comments (optional feature)
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_slug VARCHAR(255) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_post_views_slug ON post_views(post_slug);
CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Insert some sample data
INSERT INTO post_views (post_slug, view_count) VALUES
    ('getting-started-nextjs-typescript', 0),
    ('building-uis-material-ui', 0),
    ('typescript-tips-react-developers', 0)
ON CONFLICT (post_slug) DO NOTHING;
