import { auth } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  AdminPanelSettings,
  Person,
} from '@mui/icons-material';
import Link from 'next/link';

async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  return users;
}

export default async function UsersPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const users = await getUsers();

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Users</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          href="/admin/users/new"
        >
          Add User
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Posts</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {user.role === 'ADMIN' ? (
                        <AdminPanelSettings fontSize="small" color="error" />
                      ) : (
                        <Person fontSize="small" color="action" />
                      )}
                      {user.name || 'No name'}
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      color={user.role === 'ADMIN' ? 'error' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{user._count.posts}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      component={Link}
                      href={`/admin/users/${user.id}`}
                      color="primary"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      disabled={user.id === session.user.id}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
