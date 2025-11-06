import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { PostList } from '@/components/PostList';
import { getAllPosts } from '@/lib/posts';

export default function HomePage() {
  const posts = getAllPosts();

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
        <PostList posts={posts} />
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
