'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  _count: {
    posts: number;
  };
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER',
    password: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const user: User = await response.json();
        setFormData({
          name: user.name || '',
          email: user.email,
          role: user.role,
          password: '',
        });
      } catch (err) {
        setError('Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Only send password if it's filled
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`/api/users/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update user');
        setSaving(false);
        return;
      }

      router.push('/admin/users');
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Edit User</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          component={Link}
          href="/admin/users"
        >
          Back to Users
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4, maxWidth: 600 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Role"
            select
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            sx={{ mb: 3 }}
            helperText="Select user role"
          >
            <MenuItem value="USER">User</MenuItem>
            <MenuItem value="EDITOR">Editor</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            sx={{ mb: 3 }}
            helperText="Leave blank to keep current password"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<Save />}
            disabled={saving}
            fullWidth
          >
            {saving ? 'Saving...' : 'Update User'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
