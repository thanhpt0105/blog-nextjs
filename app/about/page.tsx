import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about me and this blog',
  openGraph: {
    title: 'About | My Blog',
    description: 'Learn more about me and this blog',
  },
};

export default function AboutPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          About Me
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Welcome! 👋
          </Typography>
          <Typography variant="body1" paragraph>
            Hi, I'm a software developer passionate about building modern web applications
            and sharing knowledge with the community.
          </Typography>
          <Typography variant="body1" paragraph>
            This blog is where I share my thoughts, tutorials, and experiences in software
            development. Topics include web development, React, Next.js, TypeScript, and more.
          </Typography>
          <Typography variant="body1" paragraph>
            When I'm not coding, you can find me exploring new technologies, contributing to
            open-source projects, or enjoying a good cup of coffee ☕.
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Tech Stack
          </Typography>
          <Typography variant="body1" component="div">
            This blog is built with:
            <ul>
              <li>Next.js 14 (App Router)</li>
              <li>React 18</li>
              <li>TypeScript</li>
              <li>Material-UI (MUI) v5</li>
              <li>MDX for blog posts</li>
            </ul>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
