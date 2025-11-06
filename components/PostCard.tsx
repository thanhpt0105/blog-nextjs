'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { Post } from '@/types/post';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'light'
              ? '0 8px 24px rgba(0,0,0,0.12)'
              : '0 8px 24px rgba(0,0,0,0.4)',
        },
      }}
    >
      <Link href={`/blog/${post.slug}`} passHref legacyBehavior>
        <CardActionArea
          component="a"
          sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              {post.title}
            </Typography>
            
            <Typography variant="caption" color="text.secondary" gutterBottom>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {post.readTime && ` • ${post.readTime}`}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
              {post.excerpt}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {post.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}
