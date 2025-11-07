'use client';

import { useState, useRef, ChangeEvent } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Alert,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';

interface ImageUploadProps {
  type: 'profile' | 'cover' | 'content';
  variant?: 'avatar' | 'cover' | 'button';
  currentImage?: string;
  onUploadComplete: (url: string, publicId?: string) => void;
  onDelete?: () => void;
}

export default function ImageUpload({
  type,
  variant = 'button',
  currentImage,
  onUploadComplete,
  onDelete,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.';
    }

    // Check file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'File size exceeds 5MB limit.';
    }

    return null;
  };

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Upload to server
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      setPreview(data.url);
      onUploadComplete(data.url, data.publicId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = () => {
    setPreview(null);
    setError(null);
    if (onDelete) {
      onDelete();
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Avatar variant (circular, for profile pictures)
  if (variant === 'avatar') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={preview || undefined}
            sx={{
              width: 150,
              height: 150,
              fontSize: '3rem',
            }}
          >
            {!preview && <PhotoCameraIcon sx={{ fontSize: '3rem' }} />}
          </Avatar>
          
          {uploading && (
            <CircularProgress
              size={150}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={handleButtonClick}
            disabled={uploading}
            startIcon={<CloudUploadIcon />}
          >
            {preview ? 'Change Photo' : 'Upload Photo'}
          </Button>
          
          {preview && onDelete && (
            <IconButton
              onClick={handleDelete}
              disabled={uploading}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        )}
      </Box>
    );
  }

  // Cover variant (wide, for cover images)
  if (variant === 'cover') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {preview ? (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 300,
              borderRadius: 1,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <img
              src={preview}
              alt="Cover preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            
            {uploading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                }}
              >
                <CircularProgress />
              </Box>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              width: '100%',
              height: 300,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
            onClick={handleButtonClick}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Click to upload cover image
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Max 5MB • JPEG, PNG, GIF, WebP
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1 }}>
          {preview && (
            <>
              <Button
                variant="outlined"
                onClick={handleButtonClick}
                disabled={uploading}
                startIcon={<CloudUploadIcon />}
              >
                Change Image
              </Button>
              
              {onDelete && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDelete}
                  disabled={uploading}
                  startIcon={<DeleteIcon />}
                >
                  Remove
                </Button>
              )}
            </>
          )}
        </Box>

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}
      </Box>
    );
  }

  // Button variant (simple button, for inline content)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <Button
        variant="contained"
        onClick={handleButtonClick}
        disabled={uploading}
        startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </Button>

      {preview && (
        <Box
          sx={{
            position: 'relative',
            maxWidth: 400,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <img
            src={preview}
            alt="Preview"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
          
          {onDelete && (
            <IconButton
              onClick={handleDelete}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: 'background.paper',
                },
              }}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      )}

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}
    </Box>
  );
}
