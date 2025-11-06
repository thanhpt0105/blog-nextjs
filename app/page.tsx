import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HomePageClient from '@/components/HomePageClient';
import { getSiteSettings } from '@/lib/settings';
import { PostRepository, TagRepository } from '@/lib/repositories';

interface HomePageProps {
  searchParams: {
    page?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const settings = await getSiteSettings();
  const postsPerPage = parseInt(settings.posts_per_page) || 10;
  const currentPage = parseInt(searchParams.page || '1');

  // Get paginated posts and all tags in parallel
  const [postsResult, tags] = await Promise.all([
    PostRepository.getPosts({
      page: currentPage,
      limit: postsPerPage,
      published: true,
    }),
    TagRepository.getAllTags(),
  ]);

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

      <HomePageClient 
        posts={postsResult.data} 
        tags={tags} 
        pagination={postsResult.pagination}
      />
    </Container>
  );
}
