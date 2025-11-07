'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Chip, Typography, TextField, InputAdornment, CircularProgress, Button } from '@mui/material';
import { Label, Close, Search } from '@mui/icons-material';
import PostListClient from './PostListClient';
import { useRouter, useSearchParams } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
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

interface LazyLoadHomePageProps {
  initialPosts: Post[];
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

export default function LazyLoadHomePage({ 
  initialPosts, 
  tags, 
  pagination: initialPagination,
  initialSearch, 
  initialTagIds 
}: LazyLoadHomePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(initialPagination.page);
  const [hasMore, setHasMore] = useState(initialPagination.hasNext);
  const [loading, setLoading] = useState(false);
  const [totalPosts, setTotalPosts] = useState(initialPagination.total);
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialTagIds);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  // Reset posts when filters change
  useEffect(() => {
    setPosts(initialPosts);
    setCurrentPage(initialPagination.page);
    setHasMore(initialPagination.hasNext);
    setTotalPosts(initialPagination.total);
  }, [initialPosts, initialPagination]);

  // Fetch more posts
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', (currentPage + 1).toString());
      params.set('limit', initialPagination.limit.toString());
      
      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      }
      
      if (selectedTagIds.length > 0) {
        params.set('tags', selectedTagIds.join(','));
      }

      const response = await fetch(`/api/public/posts?${params.toString()}`);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        setPosts(prev => [...prev, ...data.data]);
        setCurrentPage(data.pagination.page);
        setHasMore(data.pagination.hasNext);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, currentPage, initialPagination.limit, searchQuery, selectedTagIds]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadMorePosts]);

  // Update filters and trigger server-side filtering
  const updateFilters = (newTagIds: string[], newSearch: string) => {
    const params = new URLSearchParams();
    
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

  const hasActiveFilters = selectedTagIds.length > 0 || searchQuery.trim().length > 0;

  const tagsWithPosts = tags.filter(tag => tag.posts.length > 0);

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

  const selectedTags = tagsWithPosts.filter(tag => selectedTagIds.includes(tag.id));

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
              label={`All Posts (${totalPosts})`}
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
                  } ({totalPosts} {totalPosts === 1 ? 'post' : 'posts'} found):
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
      {posts.length > 0 ? (
        <>
          <PostListClient posts={posts} />
          
          {/* Infinite Scroll Trigger */}
          <Box 
            ref={observerTarget}
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              mt: 4, 
              mb: 4,
              minHeight: '100px'
            }}
          >
            {loading && (
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Loading more posts...
                </Typography>
              </Box>
            )}
            {!loading && !hasMore && posts.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                You&apos;ve reached the end! ({posts.length} of {totalPosts} posts shown)
              </Typography>
            )}
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
