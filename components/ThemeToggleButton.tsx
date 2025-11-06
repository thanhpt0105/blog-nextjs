'use client';

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ColorModeContext } from './ThemeRegistry';

export function ThemeToggleButton() {
  const { toggleColorMode, mode } = React.useContext(ColorModeContext);

  return (
    <IconButton onClick={toggleColorMode} color="inherit" aria-label="Toggle theme">
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}
