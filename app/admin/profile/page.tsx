'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    image: '',
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image || '',
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update profile');
        setLoading(false);
        return;
      }

      // Update session with new data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          image: formData.image,
        },
      });

      setSuccess('Profile updated successfully!');
      setLoading(false);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">My Profile</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          component={Link}
          href="/admin"
        >
          Back to Dashboard
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Profile Picture
          </Typography>
          <Box sx={{ mb: 4 }}>
            <ImageUpload
              type="profile"
              variant="avatar"
              currentImage={formData.image}
              onUploadComplete={(url) => setFormData({ ...formData, image: url })}
              onDelete={() => setFormData({ ...formData, image: '' })}
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>

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
            disabled
            helperText="Email cannot be changed"
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.push('/admin')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
