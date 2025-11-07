'use client';

import { useState, useMemo } from 'react';
import { Box, Chip, Typography, Button, TextField, InputAdornment, Pagination } from '@mui/material';
import { Label, Close, Search } from '@mui/icons-material';
import PostListClient from './PostListClient';
import { useRouter, useSearchParams } from 'next/navigation';

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
    image: string | null;
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
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  initialSearch: string;
  initialTagIds: string[];
}

export default function HomePageClient({ posts, tags, pagination, initialSearch, initialTagIds }: HomePageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialTagIds);

  // Update filters and trigger server-side filtering
  const updateFilters = (newTagIds: string[], newSearch: string) => {
    const params = new URLSearchParams();
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    // Add tag filters
    if (newTagIds.length > 0) {
      newTagIds.forEach(tagId => params.append('tags', tagId));
    }
    
    // Add search query
    if (newSearch.trim()) {
      params.set('search', newSearch.trim());
    }
    
    router.push(`?${params.toString()}`);
  };

  // No need for client-side filtering anymore - data is already filtered from server
  const displayPosts = posts;
  const hasActiveFilters = selectedTagIds.length > 0 || searchQuery.trim().length > 0;

  // Get tags that have published posts
  const tagsWithPosts = useMemo(() => {
    return tags.filter(tag => tag.posts.length > 0);
  }, [tags]);

  const toggleTag = (tagId: string) => {
    const newTagIds = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter(id => id !== tagId)
      : [...selectedTagIds, tagId];
    
    setSelectedTagIds(newTagIds);
    updateFilters(newTagIds, searchQuery);
  };

  const clearAllFilters = () => {
    setSelectedTagIds([]);
    setSearchQuery('');
    router.push('/');
  };

  const clearSearch = () => {
    setSearchQuery('');
    updateFilters(selectedTagIds, '');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(selectedTagIds, searchQuery);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    // Update URL with new page, preserving existing filters
    const params = new URLSearchParams();
    params.set('page', value.toString());
    
    // Preserve tag filters
    if (selectedTagIds.length > 0) {
      selectedTagIds.forEach(tagId => params.append('tags', tagId));
    }
    
    // Preserve search query
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    
    router.push(`?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedTags = tagsWithPosts.filter(tag => selectedTagIds.includes(tag.id));

  // All data comes from server already filtered
  const showingTotal = pagination.total;
  const currentTotalPages = pagination.totalPages;
  const currentPage = pagination.page;

  return (
    <>
      {/* Search Box */}
      <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search posts by title, content, or excerpt..."
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchSubmit(e as any);
            }
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
              label={`All Posts (${pagination.total})`}
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
                  } ({showingTotal} {showingTotal === 1 ? 'post' : 'posts'} found):
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
      {displayPosts.length > 0 ? (
        <>
          <PostListClient posts={displayPosts} />
          
          {/* Pagination - now works with filters */}
          {currentTotalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
              <Pagination
                count={currentTotalPages}
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
              {currentTotalPages > 1 
                ? `Showing page ${currentPage} of ${currentTotalPages} (${pagination.total} total posts)`
                : `Showing ${pagination.total} ${pagination.total === 1 ? 'post' : 'posts'}`
              }
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
