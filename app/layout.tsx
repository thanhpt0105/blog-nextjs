import { ThemeRegistry } from '@/components/ThemeRegistry';
import { AuthProvider } from '@/components/AuthProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Box from '@mui/material/Box';
import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings';
import { unstable_cache } from 'next/cache';

// Cache the settings with a 5 minute revalidation
const getCachedSettings = unstable_cache(
  async () => getSiteSettings(),
  ['site-settings'],
  { 
    revalidate: 300, // 5 minutes
    tags: ['settings']
  }
);

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSettings();

  const metadata: Metadata = {
    title: {
      default: `${settings.site_name} - Personal Thoughts & Technical Articles`,
      template: `%s | ${settings.site_name}`,
    },
    description: settings.site_description,
    keywords: ['blog', 'programming', 'web development', 'technology'],
    authors: [{ name: settings.site_name }],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourblog.com',
      siteName: settings.site_name,
      title: `${settings.site_name} - Personal Thoughts & Technical Articles`,
      description: settings.site_description,
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.site_name,
      description: settings.site_description,
    },
  };

  // Add site icon if configured
  if (settings.site_icon) {
    metadata.icons = {
      icon: settings.site_icon,
      apple: settings.site_icon,
    };
  }

  return metadata;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getCachedSettings();

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <AuthProvider>
          <ThemeRegistry>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
              }}
            >
              <Navbar siteName={settings.site_name} />
              <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
                {children}
              </Box>
              <Footer siteName={settings.site_name} />
            </Box>
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
