'use client';

import { useState, useMemo } from 'react';
import { Box, Chip, Typography, Button } from '@mui/material';
import { Label, Close } from '@mui/icons-material';
import PostListClient from './PostListClient';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | null;
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

interface HomePageClientProps {
  posts: Post[];
  tags: Tag[];
}

export default function HomePageClient({ posts, tags }: HomePageClientProps) {
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // Filter posts based on selected tags
  const filteredPosts = useMemo(() => {
    if (selectedTagIds.length === 0) {
      return posts;
    }

    // Post must have ALL selected tags (AND logic)
    return posts.filter(post =>
      selectedTagIds.every(selectedTagId =>
        post.tags.some(postTag => postTag.tag.id === selectedTagId)
      )
    );
  }, [posts, selectedTagIds]);

  // Get tags that have published posts
  const tagsWithPosts = useMemo(() => {
    return tags.filter(tag => tag.posts.length > 0);
  }, [tags]);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedTagIds([]);
  };

  const selectedTags = tagsWithPosts.filter(tag => selectedTagIds.includes(tag.id));

  return (
    <>
      {/* Tag Filter Section */}
      {tagsWithPosts.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Label color="action" />
            <Typography variant="h6">Filter by Tags:</Typography>
            {selectedTagIds.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                (Select multiple tags to filter)
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip
              label={`All Posts (${posts.length})`}
              onClick={clearAllFilters}
              color={selectedTagIds.length === 0 ? 'primary' : 'default'}
              variant={selectedTagIds.length === 0 ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer' }}
            />
            {tagsWithPosts.map((tag) => (
              <Chip
                key={tag.id}
                label={`${tag.name} (${tag.posts.length})`}
                onClick={() => toggleTag(tag.id)}
                color={selectedTagIds.includes(tag.id) ? 'primary' : 'default'}
                variant={selectedTagIds.includes(tag.id) ? 'filled' : 'outlined'}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>

          {/* Active Filters Display */}
          {selectedTagIds.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  Active filters ({filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}):
                </Typography>
                {selectedTags.map((tag) => (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    onDelete={() => toggleTag(tag.id)}
                    color="primary"
                    size="small"
                    deleteIcon={<Close />}
                  />
                ))}
                <Button
                  size="small"
                  onClick={clearAllFilters}
                  sx={{ ml: 1 }}
                >
                  Clear All
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* Posts List */}
      {filteredPosts.length > 0 ? (
        <PostListClient posts={filteredPosts} />
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {selectedTagIds.length > 0
              ? `No posts found with ${selectedTagIds.length === 1 ? 'this tag' : 'these tags'}`
              : 'No posts yet. Check back soon!'}
          </Typography>
          {selectedTagIds.length > 0 && (
            <Button
              variant="outlined"
              onClick={clearAllFilters}
              sx={{ mt: 2 }}
            >
              View All Posts
            </Button>
          )}
        </Box>
      )}
    </>
  );
}
