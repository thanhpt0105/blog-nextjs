'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';
import XIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkIcon from '@mui/icons-material/Link';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  visible: boolean;
}

const getPlatformIcon = (platform: string) => {
  const platformLower = platform.toLowerCase();
  switch (platformLower) {
    case 'github':
      return <GitHubIcon />;
    case 'x':
      return <XIcon />;
    case 'linkedin':
      return <LinkedInIcon />;
    case 'facebook':
      return <FacebookIcon />;
    case 'instagram':
      return <InstagramIcon />;
    case 'youtube':
      return <YouTubeIcon />;
    default:
      return <LinkIcon />;
  }
};

export function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch('/api/social-links');
        if (response.ok) {
          const data = await response.json();
          setSocialLinks(data.filter((link: SocialLink) => link.visible));
        }
      } catch (error) {
        console.error('Failed to fetch social links:', error);
      }
    };

    fetchSocialLinks();
  }, []);

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
          
          {socialLinks.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((link) => (
                <IconButton
                  key={link.id}
                  aria-label={link.platform}
                  color="inherit"
                  href={link.url}
                  target="_blank"
                  rel="noopener"
                  title={link.platform}
                >
                  {getPlatformIcon(link.platform)}
                </IconButton>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
