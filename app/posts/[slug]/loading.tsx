import { Container, Box, Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Title Skeleton */}
        <Skeleton variant="text" width="80%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 3 }} />
        
        {/* Meta Info Skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={100} height={16} />
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Box sx={{ height: 1, backgroundColor: 'divider', mb: 3 }} />

        {/* Cover Image Skeleton */}
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={400} 
          sx={{ mb: 4, borderRadius: 2 }} 
        />

        {/* Content Skeleton */}
        <Box>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton 
              key={i} 
              variant="text" 
              width={i % 3 === 0 ? '80%' : '100%'} 
              height={24} 
              sx={{ mb: 1 }} 
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
}
