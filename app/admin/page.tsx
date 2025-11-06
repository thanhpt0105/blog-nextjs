import { redirect } from 'next/navigation';
import { Container, Box, Typography, Paper, Button } from '@mui/material';
import Link from 'next/link';
import { auth } from '@/lib/auth-server';

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Welcome, {session.user.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Email: {session.user.email}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Role: {session.user.role}
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Coming Soon
          </Typography>
          <Typography variant="body1" paragraph>
            The admin panel is under construction. The following features will be available soon:
          </Typography>
          <ul>
            <li>📝 Blog Post Management (Create, Edit, Delete, Publish)</li>
            <li>👥 User Management</li>
            <li>⚙️ Site Settings</li>
            <li>🔗 Social Links Management</li>
            <li>📊 Analytics Dashboard</li>
            <li>📁 Media Library</li>
          </ul>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button
            component={Link}
            href="/"
            variant="outlined"
          >
            Back to Home
          </Button>
          <Button
            component={Link}
            href="/api/auth/signout"
            variant="contained"
            color="error"
          >
            Sign Out
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
