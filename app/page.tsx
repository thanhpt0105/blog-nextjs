import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HomePageClient from '@/components/HomePageClient';
import { getSiteSettings } from '@/lib/settings';
import { PostRepository, TagRepository } from '@/lib/repositories';

interface HomePageProps {
  searchParams: {
    page?: string;
    search?: string;
    tags?: string | string[]; // Can be single tag or array of tags
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const settings = await getSiteSettings();
  const postsPerPage = parseInt(settings.posts_per_page) || 10;
  const currentPage = parseInt(searchParams.page || '1');
  const searchQuery = searchParams.search || '';
  
  // Handle tags parameter (can be single string or array)
  const tagIdsParam = searchParams.tags;
  const tagIds = tagIdsParam 
    ? (Array.isArray(tagIdsParam) ? tagIdsParam : [tagIdsParam])
    : [];

  // Get paginated posts and all tags in parallel
  const [postsResult, tags] = await Promise.all([
    PostRepository.getPosts({
      page: currentPage,
      limit: postsPerPage,
      published: true,
      tagIds: tagIds.length > 0 ? tagIds : undefined,
      search: searchQuery || undefined,
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
        initialSearch={searchQuery}
        initialTagIds={tagIds}
      />
    </Container>
  );
}
