'use client';

import { Card, CardContent, CardMedia, Typography, Box, Chip, Grid } from '@mui/material';
import { CalendarMonth, Person } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | null;
  author: {
    name: string | null;
    email: string;
  };
  tags: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

interface PostListClientProps {
  posts: Post[];
}

export default function PostListClient({ posts }: PostListClientProps) {
  const router = useRouter();

  const handleCardClick = (slug: string) => {
    router.push(`/posts/${slug}`);
  };

  return (
    <Grid container spacing={4}>
      {posts.map((post) => (
        <Grid item xs={12} md={6} key={post.id}>
          <Card
            onClick={() => handleCardClick(post.slug)}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            {post.coverImage && (
              <CardMedia
                component="img"
                height="200"
                image={post.coverImage}
                alt={post.title}
                sx={{ objectFit: 'cover' }}
              />
            )}
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" component="h2" gutterBottom>
                {post.title}
              </Typography>

              {post.excerpt && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  paragraph
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {post.excerpt}
                </Typography>
              )}

              {post.tags.length > 0 && (
                <Box sx={{ mb: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {post.tags.map((postTag) => (
                    <Chip
                      key={postTag.tag.id}
                      label={postTag.tag.name}
                      size="small"
                      variant="outlined"
                      component={Link}
                      href={`/tags/${postTag.tag.slug}`}
                      clickable
                      sx={{
                        textDecoration: 'none',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                        },
                      }}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                      }}
                    />
                  ))}
                </Box>
              )}

              <Box
                sx={{
                  mt: 'auto',
                  pt: 2,
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Person fontSize="small" />
                  <span>{post.author.name || post.author.email}</span>
                </Box>
                {post.publishedAt && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarMonth fontSize="small" />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
