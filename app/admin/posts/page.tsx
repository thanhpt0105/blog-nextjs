import { auth } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import {
  Add,
} from '@mui/icons-material';
import Link from 'next/link';
import AdminPostsClient from '@/components/admin/AdminPostsClient';
import { getSiteSettings } from '@/lib/settings';
import { PostRepository, TagRepository } from '@/lib/repositories';

interface AdminPostsPageProps {
  searchParams: {
    page?: string;
    tag?: string; // Single tag filter for admin
  };
}

export default async function PostsPage({ searchParams }: AdminPostsPageProps) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const settings = await getSiteSettings();
  const postsPerPage = parseInt(settings.posts_per_page) || 10;
  const currentPage = parseInt(searchParams.page || '1');
  const tagFilter = searchParams.tag || '';

  // Get paginated posts and all tags in parallel
  const [postsResult, tags] = await Promise.all([
    PostRepository.getPosts({
      page: currentPage,
      limit: postsPerPage,
      tagId: tagFilter || undefined,
    }),
    TagRepository.getAllTagsAdmin(),
  ]);

  return (
    <Box>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
      }}>
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Blog Posts
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          href="/admin/posts/new"
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          New Post
        </Button>
      </Box>

      <AdminPostsClient 
        posts={postsResult.data} 
        tags={tags}
        pagination={postsResult.pagination}
        initialTagId={tagFilter}
      />
    </Box>
  );
}
