'use client';

import { useState, useMemo } from 'react';
import { Box, Chip, Typography, Button, TextField, InputAdornment, Pagination } from '@mui/material';
import { Label, Close, Search } from '@mui/icons-material';
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
  postsPerPage?: number;
}

export default function HomePageClient({ posts, tags, postsPerPage = 10 }: HomePageClientProps) {
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter posts based on selected tags and search query
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by tags
    if (selectedTagIds.length > 0) {
      // Post must have ALL selected tags (AND logic)
      filtered = filtered.filter(post =>
        selectedTagIds.every(selectedTagId =>
          post.tags.some(postTag => postTag.tag.id === selectedTagId)
        )
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(query);
        const excerptMatch = post.excerpt?.toLowerCase().includes(query);
        const authorMatch = post.author.name?.toLowerCase().includes(query);
        const tagMatch = post.tags.some(postTag => 
          postTag.tag.name.toLowerCase().includes(query)
        );
        return titleMatch || excerptMatch || authorMatch || tagMatch;
      });
    }

    return filtered;
  }, [posts, selectedTagIds, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

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
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearAllFilters = () => {
    setSelectedTagIds([]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedTags = tagsWithPosts.filter(tag => selectedTagIds.includes(tag.id));
  const hasActiveFilters = selectedTagIds.length > 0 || searchQuery.trim().length > 0;

  return (
    <>
      {/* Search Box */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search posts by title, content, author, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <Button
                  size="small"
                  onClick={clearSearch}
                  sx={{ minWidth: 'auto' }}
                >
                  Clear
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>

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
              color={!hasActiveFilters ? 'primary' : 'default'}
              variant={!hasActiveFilters ? 'filled' : 'outlined'}
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
          {hasActiveFilters && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  {searchQuery && selectedTagIds.length > 0 
                    ? 'Search & tag filters'
                    : searchQuery 
                    ? 'Search results'
                    : 'Active filters'
                  } ({filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}):
                </Typography>
                {searchQuery && (
                  <Chip
                    label={`"${searchQuery}"`}
                    onDelete={clearSearch}
                    color="secondary"
                    size="small"
                    deleteIcon={<Close />}
                  />
                )}
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
        <>
          <PostListClient posts={paginatedPosts} />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}

          {/* Results Info */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} of {filteredPosts.length} posts
            </Typography>
          </Box>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {hasActiveFilters
              ? 'No posts found matching your search criteria'
              : 'No posts yet. Check back soon!'}
          </Typography>
          {hasActiveFilters && (
            <>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your search or filters
              </Typography>
              <Button
                variant="outlined"
                onClick={clearAllFilters}
                sx={{ mt: 2 }}
              >
                Clear All Filters
              </Button>
            </>
          )}
        </Box>
      )}
    </>
  );
}
