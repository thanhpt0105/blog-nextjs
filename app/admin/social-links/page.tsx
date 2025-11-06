'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Link as LinkIcon,
  DragIndicator,
} from '@mui/icons-material';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  order: number;
  visible: boolean;
}

export default function SocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    icon: '',
    visible: true,
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/social-links');
      const data = await response.json();
      setLinks(data);
    } catch (err) {
      setError('Failed to fetch social links');
    }
  };

  const handleOpenDialog = (link?: SocialLink) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        platform: link.platform,
        url: link.url,
        icon: link.icon || '',
        visible: link.visible,
      });
    } else {
      setEditingLink(null);
      setFormData({
        platform: '',
        url: '',
        icon: '',
        visible: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingLink(null);
  };

  const handleSubmit = async () => {
    try {
      const url = editingLink
        ? `/api/social-links/${editingLink.id}`
        : '/api/social-links';
      const method = editingLink ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save social link');
      }

      setSuccess(true);
      handleCloseDialog();
      fetchLinks();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save social link');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social link?')) {
      return;
    }

    try {
      const response = await fetch(`/api/social-links/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete social link');
      }

      fetchLinks();
    } catch (err) {
      setError('Failed to delete social link');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Social Links</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Link
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
          Social link saved successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={50}></TableCell>
                <TableCell>Platform</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Visible</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {links.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No social links yet. Add your first link to get started!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                links.map((link) => (
                  <TableRow key={link.id} hover>
                    <TableCell>
                      <DragIndicator color="action" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinkIcon fontSize="small" />
                        {link.platform}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {link.url}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {link.visible ? '✓ Visible' : '✗ Hidden'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(link)}
                        color="primary"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(link.id)}
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingLink ? 'Edit Social Link' : 'Add Social Link'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Platform"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              placeholder="e.g., Twitter, GitHub, LinkedIn"
            />
            <TextField
              fullWidth
              label="URL"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
            />
            <TextField
              fullWidth
              label="Icon (optional)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="e.g., TwitterIcon, GitHubIcon"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.visible}
                  onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                />
              }
              label="Visible on site"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingLink ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
