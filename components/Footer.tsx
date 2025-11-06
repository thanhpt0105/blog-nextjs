'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import IconButton from '@mui/material/IconButton';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[900],
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} My Blog. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              aria-label="GitHub"
              color="inherit"
              href="https://github.com"
              target="_blank"
              rel="noopener"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              aria-label="Twitter"
              color="inherit"
              href="https://twitter.com"
              target="_blank"
              rel="noopener"
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              aria-label="LinkedIn"
              color="inherit"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener"
            >
              <LinkedInIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
