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
}

export default function AdminPostsClient({ posts, tags, pagination }: AdminPostsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

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
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FilterList color="action" />
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
              />
            )}
            sx={{ flexGrow: 1 }}
            clearOnEscape
          />
          {selectedTag && (
            <Chip
              label={`Showing ${displayTotal} of ${pagination.total} posts`}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      </Paper>

      {/* Posts Table */}
      <PostsTable posts={displayPosts as any} />

      {/* Pagination - only show for server-side pagination (no tag filter) */}
      {!hasClientFilter && pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total posts)
          </Typography>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Show info when tag filter is active */}
      {hasClientFilter && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {displayTotal} post{displayTotal !== 1 ? 's' : ''} with tag "{selectedTag?.name}"
          </Typography>
        </Box>
      )}
    </>
  );
}
