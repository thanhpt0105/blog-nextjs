import { Container, Box, Skeleton, Grid } from '@mui/material';

export default function Loading() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Skeleton 
          variant="text" 
          width="40%" 
          height={60} 
          sx={{ mx: 'auto', mb: 2 }} 
        />
        <Skeleton 
          variant="text" 
          width="60%" 
          height={30} 
          sx={{ mx: 'auto' }} 
        />
      </Box>

      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Skeleton 
                variant="circular" 
                width={80} 
                height={80} 
                sx={{ mx: 'auto', mb: 2 }} 
              />
              <Skeleton variant="text" width="70%" height={40} sx={{ mx: 'auto', mb: 1 }} />
              <Skeleton variant="rounded" width={100} height={24} sx={{ mx: 'auto' }} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
