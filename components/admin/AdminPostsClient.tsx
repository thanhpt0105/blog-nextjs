'use client';

import { useState, useMemo } from 'react';
import { Box, Autocomplete, TextField, Chip, Paper } from '@mui/material';
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
}

export default function AdminPostsClient({ posts, tags }: AdminPostsClientProps) {
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
            onChange={(event, newValue) => {
              setSelectedTag(newValue);
            }}
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
      <PostsTable posts={filteredPosts as any} />
    </>
  );
}
