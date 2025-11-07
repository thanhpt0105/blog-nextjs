'use client';

import { Box } from '@mui/material';
import { useState } from 'react';

interface CoverImageProps {
  src: string;
  alt: string;
}

export default function CoverImage({ src, alt }: CoverImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) return null;

  return (
    <Box
      sx={{
        mb: 4,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        height: 'auto',
      }}
    >
      <img 
        src={src} 
        alt={alt}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
        }}
        onError={() => setHasError(true)}
      />
    </Box>
  );
}
