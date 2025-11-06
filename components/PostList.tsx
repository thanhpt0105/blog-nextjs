'use client';

import * as React from 'react';
import Grid from '@mui/material/Grid';
import { Post } from '@/types/post';
import { PostCard } from './PostCard';

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <Grid container spacing={4}>
      {posts.map((post) => (
        <Grid item key={post.slug} xs={12} sm={6} md={4}>
          <PostCard post={post} />
        </Grid>
      ))}
    </Grid>
  );
}
