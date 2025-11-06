'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { ThemeToggleButton } from './ThemeToggleButton';

export function Navbar() {
  return (
    <AppBar position="sticky" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Link href="/" passHref legacyBehavior>
            <Typography
              variant="h6"
              component="a"
              sx={{
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              My Blog
            </Typography>
          </Link>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link href="/" passHref legacyBehavior>
              <Button color="inherit" component="a">
                Home
              </Button>
            </Link>
            <Link href="/about" passHref legacyBehavior>
              <Button color="inherit" component="a">
                About
              </Button>
            </Link>
            <ThemeToggleButton />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
