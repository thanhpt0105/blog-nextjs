import { Container, Typography, Box, Chip, Divider, Avatar } from '@mui/material';
import { CalendarMonth, Person } from '@mui/icons-material';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

interface PostPageProps {
  params: {
    slug: string;
  };
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return post;
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = await getPost(params.slug);

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
  const post = await getPost(params.slug);

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
              <Avatar sx={{ width: 40, height: 40 }}>
                {(post.author.name || post.author.email).charAt(0).toUpperCase()}
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
          <Box
            sx={{
              mb: 4,
              borderRadius: 2,
              overflow: 'hidden',
              '& img': {
                width: '100%',
                height: 'auto',
                display: 'block',
              },
            }}
          >
            <img src={post.coverImage} alt={post.title} />
          </Box>
        )}

        {/* Content */}
        <Box
          sx={{
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              mt: 4,
              mb: 2,
              fontWeight: 600,
            },
            '& h1': { fontSize: '2rem' },
            '& h2': { fontSize: '1.75rem' },
            '& h3': { fontSize: '1.5rem' },
            '& p': {
              mb: 2,
              lineHeight: 1.8,
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'underline',
            },
            '& ul, & ol': {
              mb: 2,
              pl: 4,
            },
            '& li': {
              mb: 1,
            },
            '& code': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              padding: '0.2em 0.4em',
              borderRadius: '3px',
              fontSize: '0.9em',
              fontFamily: 'monospace',
            },
            '& pre': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              padding: 2,
              borderRadius: 1,
              overflow: 'auto',
              mb: 2,
              '& code': {
                backgroundColor: 'transparent',
                padding: 0,
              },
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              pl: 2,
              py: 1,
              my: 2,
              fontStyle: 'italic',
              color: 'text.secondary',
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 1,
              my: 2,
            },
            '& hr': {
              my: 4,
              border: 'none',
              borderTop: '1px solid',
              borderColor: 'divider',
            },
            '& table': {
              width: '100%',
              borderCollapse: 'collapse',
              mb: 2,
            },
            '& th, & td': {
              border: '1px solid',
              borderColor: 'divider',
              padding: 1,
              textAlign: 'left',
            },
            '& th': {
              backgroundColor: 'action.hover',
              fontWeight: 600,
            },
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </Box>
      </Box>
    </Container>
  );
}
