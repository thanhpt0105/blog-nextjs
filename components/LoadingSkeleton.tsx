'use client';

import { Box, Skeleton, Container, Grid } from '@mui/material';

export function PostListSkeleton() {
  return (
    <Container maxWidth="lg">
      {/* Header Skeleton */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width="40%" height={30} sx={{ mx: 'auto' }} />
      </Box>

      {/* Search Box Skeleton */}
      <Skeleton variant="rounded" height={56} sx={{ mb: 4 }} />

      {/* Tags Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} variant="rounded" width={100} height={32} />
          ))}
        </Box>
      </Box>

      {/* Posts Grid Skeleton */}
      <Grid container spacing={4}>
        {[...Array(6)].map((_, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Box>
              <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="text" width="80%" height={32} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Skeleton variant="rounded" width={60} height={24} />
                <Skeleton variant="rounded" width={80} height={24} />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export function PostDetailSkeleton() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Title */}
        <Skeleton variant="text" width="90%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="70%" height={30} sx={{ mb: 3 }} />

        {/* Meta */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="text" width={100} />
          </Box>
          <Skeleton variant="text" width={120} />
        </Box>

        {/* Cover Image */}
        <Skeleton variant="rectangular" height={400} sx={{ mb: 4, borderRadius: 1 }} />

        {/* Content */}
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} variant="text" width={i % 3 === 0 ? '90%' : '100%'} height={24} sx={{ mb: 1 }} />
        ))}
      </Box>
    </Container>
  );
}

export function PageSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Skeleton variant="text" width={300} height={48} sx={{ mb: 3 }} />
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} variant="text" width="100%" height={24} sx={{ mb: 1 }} />
      ))}
    </Container>
  );
}
