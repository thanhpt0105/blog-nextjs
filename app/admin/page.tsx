import { auth } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Article,
  People,
  Visibility,
  TrendingUp,
  Add,
} from '@mui/icons-material';
import Link from 'next/link';

async function getDashboardStats() {
  const [totalPosts, publishedPosts, totalUsers, recentPosts] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.user.count(),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    totalPosts,
    publishedPosts,
    draftPosts: totalPosts - publishedPosts,
    totalUsers,
    recentPosts,
  };
}

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const stats = await getDashboardStats();
  
  // Determine which stats to show based on role
  const isAdmin = session.user.role === 'ADMIN';

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: <Article sx={{ fontSize: 40 }} />,
      color: 'primary.main',
      bgColor: 'primary.light',
    },
    {
      title: 'Published',
      value: stats.publishedPosts,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: 'success.main',
      bgColor: 'success.light',
    },
    {
      title: 'Drafts',
      value: stats.draftPosts,
      icon: <Article sx={{ fontSize: 40 }} />,
      color: 'warning.main',
      bgColor: 'warning.light',
    },
    // Only show Users stat for admins
    ...(isAdmin ? [{
      title: 'Users',
      value: stats.totalUsers,
      icon: <People sx={{ fontSize: 40 }} />,
      color: 'info.main',
      bgColor: 'info.light',
    }] : []),
  ];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Welcome back, {session.user.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your blog today.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          href="/admin/posts/new"
          size="large"
        >
          New Post
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat) => (
          <Grid item xs={12} sm={6} md={isAdmin ? 3 : 4} key={stat.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: stat.bgColor,
                      borderRadius: 2,
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Posts */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Recent Posts</Typography>
          <Button component={Link} href="/admin/posts" size="small">
            View All
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.recentPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No posts yet. Create your first post to get started!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                stats.recentPosts.map((post: any) => (
                  <TableRow key={post.id} hover>
                    <TableCell>
                      <Link href={`/admin/posts/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant="body2" sx={{ '&:hover': { color: 'primary.main' } }}>
                          {post.title}
                        </Typography>
                      </Link>
                    </TableCell>
                    <TableCell>{post.author.name || post.author.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={post.published ? 'Published' : 'Draft'}
                        size="small"
                        color={post.published ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
