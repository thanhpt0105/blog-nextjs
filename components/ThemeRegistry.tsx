'use client';

import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { PaletteMode } from '@mui/material';

// Color mode context
export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
  mode: 'light' as PaletteMode,
});

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<PaletteMode>('light');

  // Load saved theme preference on mount
  React.useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as PaletteMode;
    if (savedMode) {
      setMode(savedMode);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode);
          return newMode;
        });
      },
      mode,
    }),
    [mode]
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#1976d2' : '#90caf9',
            light: mode === 'light' ? '#42a5f5' : '#e3f2fd',
            dark: mode === 'light' ? '#1565c0' : '#42a5f5',
          },
          secondary: {
            main: mode === 'light' ? '#dc004e' : '#f48fb1',
            light: mode === 'light' ? '#e33371' : '#f8bbd0',
            dark: mode === 'light' ? '#9a0036' : '#c2185b',
          },
          background: {
            default: mode === 'light' ? '#fafafa' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        typography: {
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
          h1: {
            fontWeight: 700,
            fontSize: '3rem',
            lineHeight: 1.2,
          },
          h2: {
            fontWeight: 600,
            fontSize: '2.5rem',
            lineHeight: 1.3,
          },
          h3: {
            fontWeight: 600,
            fontSize: '2rem',
            lineHeight: 1.4,
          },
          h4: {
            fontWeight: 500,
            fontSize: '1.5rem',
            lineHeight: 1.4,
          },
          body1: {
            fontSize: '1rem',
            lineHeight: 1.7,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
