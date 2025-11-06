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
import AdminPostsClient from '@/components/admin/AdminPostsClient';
import { getSiteSettings } from '@/lib/settings';

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

async function getAllTags() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: {
      posts: true,
    },
  });

  return tags;
}

export default async function PostsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const posts = await getPosts();
  const tags = await getAllTags();
  const settings = await getSiteSettings();
  const postsPerPage = parseInt(settings.posts_per_page) || 10;

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

      <AdminPostsClient posts={posts} tags={tags} postsPerPage={postsPerPage} />
    </Box>
  );
}
