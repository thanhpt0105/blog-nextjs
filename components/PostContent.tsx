'use client';

import { Box } from '@mui/material';

interface PostContentProps {
  content: string;
}

export default function PostContent({ content }: PostContentProps) {
  return (
    <Box
      sx={{
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          mt: 4,
          mb: 2,
          fontWeight: 600,
        },
        '& h1': { fontSize: '2rem' },
        '& h2': { fontSize: '1.75rem' },
        '& h3': { fontSize: '1.5rem' },
        '& p': {
          mb: 2,
          lineHeight: 1.8,
        },
        '& a': {
          color: 'primary.main',
          textDecoration: 'underline',
        },
        '& ul, & ol': {
          mb: 2,
          pl: 4,
        },
        '& li': {
          mb: 1,
        },
        '& code': {
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          padding: '0.2em 0.4em',
          borderRadius: '3px',
          fontSize: '0.9em',
          fontFamily: 'monospace',
        },
        '& pre': {
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          padding: 2,
          borderRadius: 1,
          overflow: 'auto',
          mb: 2,
          '& code': {
            backgroundColor: 'transparent',
            padding: 0,
          },
        },
        '& blockquote': {
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          pl: 2,
          py: 1,
          my: 2,
          fontStyle: 'italic',
          color: 'text.secondary',
        },
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: 1,
          my: 2,
          display: 'block',
        },
        '& hr': {
          my: 4,
          border: 'none',
          borderTop: '1px solid',
          borderColor: 'divider',
        },
        '& table': {
          width: '100%',
          borderCollapse: 'collapse',
          mb: 2,
        },
        '& th, & td': {
          border: '1px solid',
          borderColor: 'divider',
          padding: 1,
          textAlign: 'left',
        },
        '& th': {
          backgroundColor: 'action.hover',
          fontWeight: 600,
        },
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
