import { Container, Typography, Box, Grid, Card, CardContent, CardActionArea, Chip } from '@mui/material';
import { Label } from '@mui/icons-material';
import Link from 'next/link';
import { TagRepository } from '@/lib/repositories';

// Enable ISR with 5 minute revalidation for tags page
export const revalidate = 300;

async function getTagsWithPostCount() {
  const tags = await TagRepository.getAllTags();

  return tags.map((tag: any) => ({
    ...tag,
    postCount: tag.posts.length,
  }));
}

export const metadata = {
  title: 'Tags - My Blog',
  description: 'Browse all tags and topics',
};

export default async function TagsPage() {
  const tags = await getTagsWithPostCount();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Browse by Tags
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Explore articles organized by topics
        </Typography>
      </Box>

      {tags.length > 0 ? (
        <Grid container spacing={3}>
          {tags.map((tag: any) => (
            <Grid item xs={12} sm={6} md={4} key={tag.id}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea
                  component={Link}
                  href={`/tags/${tag.slug}`}
                  sx={{ height: '100%', p: 2 }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Label sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h5" component="h2" gutterBottom>
                      {tag.name}
                    </Typography>
                    <Chip
                      label={`${tag.postCount} ${tag.postCount === 1 ? 'post' : 'posts'}`}
                      color="primary"
                      size="small"
                    />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary">
            No tags yet
          </Typography>
        </Box>
      )}
    </Container>
  );
}
