'use client';

import { useState, useMemo } from 'react';
import { Box, Autocomplete, TextField, Chip, Paper, Pagination, Typography } from '@mui/material';
import { FilterList } from '@mui/icons-material';
import PostsTable from './PostsTable';

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
  postsPerPage?: number;
}

export default function AdminPostsClient({ posts, tags, postsPerPage = 10 }: AdminPostsClientProps) {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter posts based on selected tag
  const filteredPosts = useMemo(() => {
    if (!selectedTag) {
      return posts;
    }

    return posts.filter(post =>
      post.tags.some(postTag => postTag.tag.id === selectedTag.id)
    );
  }, [posts, selectedTag]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleTagChange = (_event: any, newValue: Tag | null) => {
    setSelectedTag(newValue);
    setCurrentPage(1); // Reset to first page when filter changes
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
              label={`Showing ${filteredPosts.length} of ${posts.length} posts`}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      </Paper>

      {/* Posts Table */}
      <PostsTable posts={paginatedPosts as any} />

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} of {filteredPosts.length} posts
          </Typography>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </>
  );
}
