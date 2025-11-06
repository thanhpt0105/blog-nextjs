import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { prisma } from '@/lib/prisma';
import HomePageClient from '@/components/HomePageClient';
import { getSiteSettings } from '@/lib/settings';

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
  });

  return posts;
}

async function getAllTags() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: {
      posts: {
        where: {
          post: {
            published: true,
          },
        },
      },
    },
  });

  return tags;
}

export default async function HomePage() {
  const posts = await getPublishedPosts();
  const tags = await getAllTags();
  const settings = await getSiteSettings();
  const postsPerPage = parseInt(settings.posts_per_page) || 10;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Welcome to {settings.site_name}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          {settings.site_description}
        </Typography>
      </Box>

      <HomePageClient posts={posts} tags={tags} postsPerPage={postsPerPage} />
    </Container>
  );
}
