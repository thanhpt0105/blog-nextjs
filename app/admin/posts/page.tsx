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

  // Get paginated posts and all tags in parallel
  const [postsResult, tags] = await Promise.all([
    PostRepository.getPosts({
      page: currentPage,
      limit: postsPerPage,
    }),
    TagRepository.getAllTagsAdmin(),
  ]);

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Blog Posts</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          href="/admin/posts/new"
        >
          New Post
        </Button>
      </Box>

      <AdminPostsClient 
        posts={postsResult.data} 
        tags={tags}
        pagination={postsResult.pagination}
      />
    </Box>
  );
}
