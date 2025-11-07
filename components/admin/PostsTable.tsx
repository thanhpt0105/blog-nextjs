'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';
import { getAuthorName, getAuthorInitial, getAuthorImage } from '@/lib/utils/author';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  author: {
    name: string | null;
    email: string;
    image: string | null;
  } | null;
  tags: Array<{
    tag: {
      id: string;
      name: string;
    };
  }>;
}

interface PostsTableProps {
  posts: Post[];
}

export default function PostsTable({ posts }: PostsTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (post: Post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/posts/${postToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeleteDialogOpen(false);
        setPostToDelete(null);
        router.refresh();
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  return (
    <>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            placeholder="Search posts..."
            size="small"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Author</TableCell>
                <TableCell>Status</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {searchQuery ? 'No posts found' : 'No posts yet'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {post.title}
                      </Typography>
                      {post.tags.length > 0 && (
                        <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {post.tags.slice(0, 3).map((postTag) => (
                            <Chip
                              key={postTag.tag.id}
                              label={postTag.tag.name}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                            />
                          ))}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          sx={{ width: 28, height: 28 }}
                          src={getAuthorImage(post.author)}
                          alt={getAuthorName(post.author)}
                        >
                          {getAuthorInitial(post.author)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                          {getAuthorName(post.author)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={post.published ? 'Published' : 'Draft'}
                        size="small"
                        color={post.published ? 'success' : 'default'}
                        sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                      />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, justifyContent: 'flex-end' }}>
                        {post.published && (
                          <IconButton
                            size="small"
                            component={Link}
                            href={`/posts/${post.slug}`}
                            target="_blank"
                            title="View post"
                            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          component={Link}
                          href={`/admin/posts/${post.id}/edit`}
                          color="primary"
                          title="Edit post"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(post)}
                          title="Delete post"
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

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{postToDelete?.title}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
