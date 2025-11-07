import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';

export default function Loading() {
  return (
    <Container maxWidth="lg">
      {/* Header Skeleton */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Skeleton 
          variant="text" 
          width="60%" 
          height={60} 
          sx={{ mx: 'auto', mb: 2 }} 
        />
        <Skeleton 
          variant="text" 
          width="40%" 
          height={30} 
          sx={{ mx: 'auto' }} 
        />
      </Box>

      {/* Search Box Skeleton */}
      <Skeleton 
        variant="rounded" 
        height={56} 
        sx={{ mb: 4 }} 
      />

      {/* Tags Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton 
              key={i} 
              variant="rounded" 
              width={100} 
              height={32} 
            />
          ))}
        </Box>
      </Box>

      {/* Post Cards Skeleton */}
      <Grid container spacing={4}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid item xs={12} md={6} key={i}>
            <Box>
              <Skeleton 
                variant="rectangular" 
                height={200} 
                sx={{ borderRadius: 1, mb: 2 }} 
              />
              <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" height={60} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="rounded" width={60} height={24} />
                <Skeleton variant="rounded" width={80} height={24} />
                <Skeleton variant="rounded" width={70} height={24} />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
