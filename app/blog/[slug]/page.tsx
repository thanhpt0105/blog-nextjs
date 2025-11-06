import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getAllPostSlugs } from '@/lib/posts';
import { Metadata } from 'next';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          {post.title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
          {post.readTime && (
            <>
              <Typography variant="body2" color="text.secondary">
                •
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {post.readTime}
              </Typography>
            </>
          )}
          {post.author && (
            <>
              <Typography variant="body2" color="text.secondary">
                •
              </Typography>
              <Typography variant="body2" color="text.secondary">
                By {post.author}
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {post.tags.map((tag) => (
            <Chip key={tag} label={tag} color="primary" size="small" />
          ))}
        </Box>

        <Divider sx={{ mb: 4 }} />
      </Box>

      <Box
        sx={{
          typography: 'body1',
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            mt: 4,
            mb: 2,
            fontWeight: 600,
          },
          '& h1': { fontSize: '2.5rem' },
          '& h2': { fontSize: '2rem' },
          '& h3': { fontSize: '1.75rem' },
          '& p': {
            mb: 2,
            lineHeight: 1.8,
          },
          '& pre': {
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? '#f5f5f5' : '#2d2d2d',
            p: 2,
            borderRadius: 2,
            overflow: 'auto',
            mb: 2,
          },
          '& code': {
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? '#f5f5f5' : '#2d2d2d',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.9em',
            fontFamily: 'monospace',
          },
          '& pre code': {
            backgroundColor: 'transparent',
            p: 0,
          },
          '& a': {
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
          '& ul, & ol': {
            mb: 2,
            pl: 4,
          },
          '& li': {
            mb: 1,
          },
          '& blockquote': {
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            pl: 2,
            ml: 0,
            fontStyle: 'italic',
            color: 'text.secondary',
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 2,
            my: 2,
          },
        }}
      >
        <MDXRemote source={post.content} />
      </Box>
    </Container>
  );
}
