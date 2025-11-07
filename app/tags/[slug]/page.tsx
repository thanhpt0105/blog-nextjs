import { Container, Typography, Box, Chip, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PostListClient from '@/components/PostListClient';

async function getTagBySlug(slug: string) {
  const tag = await prisma.tag.findUnique({
    where: { slug },
  });

  return tag;
}

async function getPostsByTag(slug: string) {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      tags: {
        some: {
          tag: {
            slug,
          },
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
    include: {
      author: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return posts;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const tag = await getTagBySlug(params.slug);

  if (!tag) {
    return {
      title: 'Tag Not Found',
    };
  }

  return {
    title: `${tag.name} - My Blog`,
    description: `Browse all posts tagged with ${tag.name}`,
  };
}

export default async function TagPage({ params }: { params: { slug: string } }) {
  const tag = await getTagBySlug(params.slug);

  if (!tag) {
    notFound();
  }

  const posts = await getPostsByTag(params.slug);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          href="/tags"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          All Tags
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 700 }}
          >
            {tag.name}
          </Typography>
          <Chip
            label={`${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`}
            color="primary"
          />
        </Box>
        <Typography variant="body1" color="text.secondary">
          All posts tagged with {tag.name}
        </Typography>
      </Box>

      {posts.length > 0 ? (
        <PostListClient posts={posts} />
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary">
            No posts with this tag yet
          </Typography>
        </Box>
      )}
    </Container>
  );
}
