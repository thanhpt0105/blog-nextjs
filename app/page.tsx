import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { prisma } from '@/lib/prisma';
import PostListClient from '@/components/PostListClient';

async function getPublishedPosts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
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
    take: 10, // Show latest 10 posts on homepage
  });

  return posts;
}

export default async function HomePage() {
  const posts = await getPublishedPosts();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Welcome to My Blog
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Explore articles on web development, software engineering, and technology
        </Typography>
      </Box>

      {posts.length > 0 ? (
        <PostListClient posts={posts} />
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary">
            No posts yet. Check back soon!
          </Typography>
        </Box>
      )}
    </Container>
  );
}
