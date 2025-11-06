import { auth } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import {
  Add,
} from '@mui/icons-material';
import Link from 'next/link';
import PostsTable from '@/components/admin/PostsTable';

async function getPosts() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
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

export default async function PostsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const posts = await getPosts();

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

      <PostsTable posts={posts} />
    </Box>
  );
}
