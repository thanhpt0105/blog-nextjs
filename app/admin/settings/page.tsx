'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Divider,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { Save, Upload } from '@mui/icons-material';
import { compressSiteIcon, getCompressionInfo } from '@/lib/utils/image-compress';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({
    site_name: '',
    site_description: '',
    posts_per_page: '10',
    site_icon: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Fetch settings
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        const settingsObj: any = {};
        data.forEach((setting: any) => {
          settingsObj[setting.key] = setting.value;
        });
        setSettings((prevSettings) => ({ ...prevSettings, ...settingsObj }));
      });
  }, []);

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB before compression)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Compress the image
      const compressedBlob = await compressSiteIcon(file);
      
      // Show compression info (optional)
      const info = getCompressionInfo(file.size, compressedBlob.size);
      console.log('Image compressed:', info);

      // Create form data with compressed image
      const formData = new FormData();
      formData.append('file', compressedBlob, file.name);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setSettings({ ...settings, site_icon: data.url });
      setUploading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload icon');
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to save settings');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Site Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure your site&apos;s basic information. These settings appear in the site title, metadata, and footer.
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
          Settings saved successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                General
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <TextField
                fullWidth
                label="Site Name"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                helperText="Appears in the browser title, navigation bar, and footer"
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Site Description"
                multiline
                rows={3}
                value={settings.site_description}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                helperText="Used for SEO and social media previews"
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Posts Per Page"
                type="number"
                value={settings.posts_per_page}
                onChange={(e) => setSettings({ ...settings, posts_per_page: e.target.value })}
                inputProps={{ min: 1, max: 100 }}
                helperText="Number of posts to display per page on the homepage and admin panel"
                sx={{ mb: 3 }}
              />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Site Icon (Favicon)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Upload an icon for your site. Will be automatically compressed and resized to 512x512px. Supports PNG, JPG, SVG, ICO.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {uploading && (
                    <CircularProgress size={64} />
                  )}
                  {!uploading && settings.site_icon && (
                    <Avatar
                      src={settings.site_icon}
                      alt="Site Icon"
                      sx={{ width: 64, height: 64 }}
                      variant="rounded"
                    />
                  )}
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<Upload />}
                    disabled={uploading}
                  >
                    {uploading ? 'Compressing & Uploading...' : settings.site_icon ? 'Change Icon' : 'Upload Icon'}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleIconUpload}
                    />
                  </Button>
                  {settings.site_icon && !uploading && (
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => setSettings({ ...settings, site_icon: '' })}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<Save />}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
