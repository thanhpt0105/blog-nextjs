import { auth } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import {
  Add,
} from '@mui/icons-material';
import Link from 'next/link';
import UsersTable from '@/components/admin/UsersTable';

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

      <UsersTable users={users} currentUserId={session.user.id} />
    </Box>
  );
}
