import { Container, Typography, Box, Chip, Divider, Avatar } from '@mui/material';
import { CalendarMonth, Person } from '@mui/icons-material';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PostRepository } from '@/lib/repositories';
import PostContent from '@/components/PostContent';
import CoverImage from '@/components/CoverImage';

// Enable ISR with 60 second revalidation for blog posts
export const revalidate = 60;

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = await PostRepository.getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.title,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await PostRepository.getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            {post.title}
          </Typography>

          {post.excerpt && (
            <Typography variant="h6" color="text.secondary" paragraph>
              {post.excerpt}
            </Typography>
          )}

          {/* Meta info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, my: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar 
                sx={{ width: 40, height: 40 }}
                src={post.author.image || undefined}
                alt={post.author.name || post.author.email}
              >
                {!post.author.image && (post.author.name || post.author.email).charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {post.author.name || post.author.email}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                  <CalendarMonth fontSize="small" />
                  <Typography variant="caption">
                    {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {post.tags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {post.tags.map((postTag: { tag: { id: string; name: string; slug: string } }) => (
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
                  />
                ))}
              </Box>
            )}
          </Box>

          <Divider />
        </Box>

        {/* Cover Image */}
        {post.coverImage && (
          <CoverImage src={post.coverImage} alt={post.title} />
        )}

        {/* Content */}
        <PostContent content={post.content} />
      </Box>
    </Container>
  );
}
