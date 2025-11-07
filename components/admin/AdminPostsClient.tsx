'use client';

import { useState, useMemo } from 'react';
import { Box, Autocomplete, TextField, Chip, Paper, Pagination, Typography } from '@mui/material';
import { FilterList } from '@mui/icons-material';
import PostsTable from './PostsTable';
import { useRouter, useSearchParams } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string | Date;
  author: {
    name: string | null;
    email: string;
  };
  tags: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  posts: Array<{ postId: string }>;
}

interface AdminPostsClientProps {
  posts: Post[];
  tags: Tag[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  initialTagId: string;
}

export default function AdminPostsClient({ posts, tags, pagination, initialTagId }: AdminPostsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTag, setSelectedTag] = useState<Tag | null>(
    tags.find(tag => tag.id === initialTagId) || null
  );

  // Filter posts based on selected tag
  const filteredPosts = useMemo(() => {
    if (!selectedTag) {
      return posts;
    }

    return posts.filter(post =>
      post.tags.some(postTag => postTag.tag.id === selectedTag.id)
    );
  }, [posts, selectedTag]);

  // If tag filter is active, show filtered results, else use server pagination
  const hasClientFilter = selectedTag !== null;
  const displayPosts = hasClientFilter ? filteredPosts : posts;
  const displayTotal = hasClientFilter ? filteredPosts.length : pagination.total;

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    // Update URL with new page
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', value.toString());
    router.push(`?${params.toString()}`);
  };

  const handleTagChange = (_event: any, newValue: Tag | null) => {
    setSelectedTag(newValue);
  };

  return (
    <>
      {/* Tag Filter */}
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' }, 
          gap: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList color="action" />
            <Typography variant="body2" sx={{ display: { xs: 'inline', sm: 'none' } }}>
              Filter
            </Typography>
          </Box>
          <Autocomplete
            options={tags}
            getOptionLabel={(option) => `${option.name} (${option.posts.length} posts)`}
            value={selectedTag}
            onChange={handleTagChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter by Tag"
                placeholder="Select a tag to filter posts"
                size="small"
              />
            )}
            sx={{ flexGrow: 1 }}
            clearOnEscape
          />
          {selectedTag && (
            <Chip
              label={`Showing ${pagination.total} of ${tags.find(t => !selectedTag || t.id !== selectedTag.id) ? pagination.total : 'all'} posts`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            />
          )}
        </Box>
      </Paper>

      {/* Posts Table */}
      <PostsTable posts={displayPosts as any} />

      {/* Pagination - now works with tag filter */}
      {pagination.totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center', 
          alignItems: 'center', 
          mt: 4, 
          gap: 2 
        }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total posts{selectedTag ? ` with tag "${selectedTag.name}"` : ''})
          </Typography>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            size="small"
            sx={{ 
              '& .MuiPaginationItem-root': { 
                fontSize: { xs: '0.75rem', sm: '0.875rem' } 
              } 
            }}
          />
        </Box>
      )}

      {/* Show info when no pagination */}
      {pagination.totalPages <= 1 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Showing {pagination.total} post{pagination.total !== 1 ? 's' : ''}{selectedTag ? ` with tag "${selectedTag.name}"` : ''}
          </Typography>
        </Box>
      )}
    </>
  );
}
