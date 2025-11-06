import { ThemeRegistry } from '@/components/ThemeRegistry';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Box from '@mui/material/Box';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'My Blog - Personal Thoughts & Technical Articles',
    template: '%s | My Blog',
  },
  description: 'A personal blog featuring technical articles, tutorials, and thoughts on software development.',
  keywords: ['blog', 'programming', 'web development', 'technology'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourblog.com',
    siteName: 'My Blog',
    title: 'My Blog - Personal Thoughts & Technical Articles',
    description: 'A personal blog featuring technical articles, tutorials, and thoughts on software development.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Blog',
    description: 'A personal blog featuring technical articles, tutorials, and thoughts on software development.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ThemeRegistry>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
              {children}
            </Box>
            <Footer />
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
