import { auth } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
  Box,
  Button,
  Paper,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';
import Link from 'next/link';

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

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            placeholder="Search posts..."
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box sx={{ py: 8 }}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No posts yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Create your first blog post to get started!
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        component={Link}
                        href="/admin/posts/new"
                      >
                        Create Post
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post: any) => (
                  <TableRow key={post.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {post.title}
                      </Typography>
                      {post.tags.length > 0 && (
                        <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5 }}>
                          {post.tags.slice(0, 3).map((postTag: any) => (
                            <Chip
                              key={postTag.tag.id}
                              label={postTag.tag.name}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {post.author.name || post.author.email}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={post.published ? 'Published' : 'Draft'}
                        size="small"
                        color={post.published ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        {post.published && (
                          <IconButton
                            size="small"
                            component={Link}
                            href={`/blog/${post.slug}`}
                            target="_blank"
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          component={Link}
                          href={`/admin/posts/${post.id}`}
                          color="primary"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
