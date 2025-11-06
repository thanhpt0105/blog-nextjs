'use client';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        typography: 'body1',
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          mt: 4,
          mb: 2,
          fontWeight: 600,
        },
        '& h1': { fontSize: '2.5rem' },
        '& h2': { fontSize: '2rem' },
        '& h3': { fontSize: '1.75rem' },
        '& p': {
          mb: 2,
          lineHeight: 1.8,
        },
        '& pre': {
          backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#2d2d2d',
          p: 2,
          borderRadius: 2,
          overflow: 'auto',
          mb: 2,
        },
        '& code': {
          backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#2d2d2d',
          px: 1,
          py: 0.5,
          borderRadius: 1,
          fontSize: '0.9em',
          fontFamily: 'monospace',
        },
        '& pre code': {
          backgroundColor: 'transparent',
          p: 0,
        },
        '& a': {
          color: 'primary.main',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
        '& ul, & ol': {
          mb: 2,
          pl: 4,
        },
        '& li': {
          mb: 1,
        },
        '& blockquote': {
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          pl: 2,
          ml: 0,
          fontStyle: 'italic',
          color: 'text.secondary',
        },
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: 2,
          my: 2,
        },
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </Box>
  );
}
