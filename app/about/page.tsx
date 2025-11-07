import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Metadata } from 'next';

// Static page - can be cached indefinitely
export const revalidate = 86400; // 24 hours

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
            Hi there! Welcome to this demonstration blog platform.
          </Typography>
          <Typography variant="body1" paragraph>
            This entire blog application was <strong>generated with the assistance of AI</strong> - 
            from the codebase architecture to the UI components, API routes, database schema, 
            and even the sample blog content you see here.
          </Typography>
          <Typography variant="body1" paragraph>
            It showcases what&apos;s possible when combining modern web technologies with AI-assisted 
            development, demonstrating a fully functional blog platform with features like:
          </Typography>
          <Typography variant="body1" component="div">
            <ul>
              <li>Rich text editing with image uploads</li>
              <li>Role-based access control (Admin, Editor, User)</li>
              <li>Responsive design for mobile and desktop</li>
              <li>Tag management and categorization</li>
              <li>Dark/Light theme support</li>
              <li>Full authentication system</li>
            </ul>
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            About This Project
          </Typography>
          <Typography variant="body1" paragraph>
            This blog serves as a proof of concept for AI-assisted full-stack development. 
            All the code, from frontend components to backend APIs, database migrations, 
            and deployment configuration, was created through an iterative conversation 
            with an AI assistant.
          </Typography>
          <Typography variant="body1" paragraph>
            The sample blog posts you see are also AI-generated, featuring HTML content 
            with proper formatting, images, code blocks, tables, and more - all designed 
            to demonstrate the capabilities of a modern content management system.
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Tech Stack
          </Typography>
          <Typography variant="body1" paragraph>
            This blog is built with modern web technologies:
          </Typography>
          <Typography variant="body1" component="div">
            <ul>
              <li><strong>Next.js 14</strong> with App Router for server-side rendering</li>
              <li><strong>React 18</strong> with TypeScript for type safety</li>
              <li><strong>Material-UI (MUI) v5</strong> for beautiful, responsive components</li>
              <li><strong>Prisma ORM</strong> with PostgreSQL for database management</li>
              <li><strong>NextAuth.js</strong> for secure authentication</li>
              <li><strong>TipTap Editor</strong> for rich text editing</li>
              <li><strong>Cloudinary</strong> for optimized image hosting</li>
              <li><strong>Docker</strong> for containerized database setup</li>
            </ul>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
