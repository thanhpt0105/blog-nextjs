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
} from '@mui/material';
import { Save } from '@mui/icons-material';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({
    site_name: '',
    site_description: '',
    posts_per_page: '10',
  });

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
              />
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
