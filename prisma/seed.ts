import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminEmail = 'admin@example.com';
  const adminPassword = await hashPassword('admin123');

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // Create editor user
  const editorEmail = 'editor@example.com';
  const editorPassword = await hashPassword('editor123');

  const editor = await prisma.user.upsert({
    where: { email: editorEmail },
    update: {},
    create: {
      email: editorEmail,
      name: 'Editor User',
      password: editorPassword,
      role: 'EDITOR',
    },
  });

  console.log(`✅ Editor user created: ${editor.email}`);

  // Create regular user
  const userEmail = 'user@example.com';
  const userPassword = await hashPassword('user123');

  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log(`✅ Regular user created: ${user.email}`);

  // Create tags
  const tagsData = [
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'React', slug: 'react' },
    { name: 'Next.js', slug: 'nextjs' },
    { name: 'Node.js', slug: 'nodejs' },
    { name: 'Web Development', slug: 'web-development' },
    { name: 'Tutorial', slug: 'tutorial' },
    { name: 'Best Practices', slug: 'best-practices' },
    { name: 'Performance', slug: 'performance' },
    { name: 'Database', slug: 'database' },
  ];

  const tags = [];
  for (const tagData of tagsData) {
    const tag = await prisma.tag.upsert({
      where: { slug: tagData.slug },
      update: {},
      create: tagData,
    });
    tags.push(tag);
  }

  console.log(`✅ Created ${tags.length} tags`);

  // Create sample posts
  const postsData = [
    {
      title: 'Getting Started with Next.js 14',
      slug: 'getting-started-nextjs-14',
      excerpt: 'Learn the fundamentals of Next.js 14 and start building modern web applications.',
      content: `# Getting Started with Next.js 14

Next.js 14 brings exciting new features and improvements to the React framework. In this tutorial, we'll explore the App Router, Server Components, and more.

## What's New in Next.js 14

- Turbopack improvements
- Server Actions are stable
- Partial Prerendering (Preview)
- Enhanced metadata API

## Setting Up Your First Project

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Key Concepts

### Server Components

Server Components allow you to render components on the server, reducing the JavaScript bundle sent to the client.

### App Router

The App Router uses React Server Components and supports layouts, nested routing, and more.

## Conclusion

Next.js 14 is a powerful framework that makes building React applications easier and more efficient.`,
      published: true,
      authorId: admin.id,
      publishedAt: new Date('2024-01-15'),
      tagSlugs: ['nextjs', 'react', 'tutorial', 'web-development'],
    },
    {
      title: 'TypeScript Best Practices for 2024',
      slug: 'typescript-best-practices-2024',
      excerpt: 'Discover the best practices and patterns for writing clean TypeScript code.',
      content: `# TypeScript Best Practices for 2024

TypeScript has become the de facto standard for building scalable JavaScript applications. Here are some best practices to follow.

## Type Safety

Always prefer strict type checking:

\`\`\`typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true
  }
}
\`\`\`

## Avoid Any

The \`any\` type defeats the purpose of TypeScript. Use \`unknown\` or proper types instead.

## Use Union Types

Union types are powerful for representing values that can be one of several types:

\`\`\`typescript
type Status = 'pending' | 'success' | 'error';
\`\`\`

## Leverage Utility Types

TypeScript provides many built-in utility types like \`Partial\`, \`Pick\`, \`Omit\`, and more.

## Conclusion

Following these best practices will help you write more maintainable TypeScript code.`,
      published: true,
      authorId: editor.id,
      publishedAt: new Date('2024-02-01'),
      tagSlugs: ['typescript', 'javascript', 'best-practices'],
    },
    {
      title: 'Building a REST API with Node.js',
      slug: 'building-rest-api-nodejs',
      excerpt: 'Step-by-step guide to creating a RESTful API using Node.js and Express.',
      content: `# Building a REST API with Node.js

Learn how to build a robust REST API using Node.js, Express, and modern JavaScript.

## Prerequisites

- Node.js installed
- Basic JavaScript knowledge
- Understanding of HTTP

## Setting Up Express

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

## Creating Routes

\`\`\`javascript
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.post('/api/users', (req, res) => {
  res.status(201).json({ message: 'User created' });
});
\`\`\`

## Best Practices

1. Use proper status codes
2. Implement error handling
3. Validate input data
4. Use middleware for common tasks

## Conclusion

Building REST APIs with Node.js is straightforward and powerful.`,
      published: true,
      authorId: admin.id,
      publishedAt: new Date('2024-02-15'),
      tagSlugs: ['nodejs', 'javascript', 'tutorial', 'web-development'],
    },
    {
      title: 'React Performance Optimization Techniques',
      slug: 'react-performance-optimization',
      excerpt: 'Learn how to optimize your React applications for better performance.',
      content: `# React Performance Optimization Techniques

Performance is crucial for user experience. Here's how to optimize your React applications.

## Use React.memo

Prevent unnecessary re-renders:

\`\`\`jsx
const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});
\`\`\`

## useMemo and useCallback

Memoize expensive calculations and functions:

\`\`\`jsx
const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
\`\`\`

## Code Splitting

Use dynamic imports to split your code:

\`\`\`jsx
const Component = lazy(() => import('./Component'));
\`\`\`

## Virtual Scrolling

For long lists, use libraries like react-window or react-virtualized.

## Conclusion

These techniques will help you build faster React applications.`,
      published: true,
      authorId: editor.id,
      publishedAt: new Date('2024-03-01'),
      tagSlugs: ['react', 'javascript', 'performance', 'best-practices'],
    },
    {
      title: 'Introduction to Database Design',
      slug: 'introduction-database-design',
      excerpt: 'Understanding the fundamentals of database design and normalization.',
      content: `# Introduction to Database Design

Good database design is essential for building scalable applications. Let's explore the basics.

## Key Concepts

### Primary Keys

Every table should have a primary key to uniquely identify rows.

### Foreign Keys

Foreign keys establish relationships between tables.

### Normalization

Normalization reduces data redundancy and improves data integrity.

## Normal Forms

- **1NF**: Eliminate repeating groups
- **2NF**: Remove partial dependencies
- **3NF**: Remove transitive dependencies

## Relationships

- One-to-One
- One-to-Many
- Many-to-Many

## Best Practices

1. Use meaningful table and column names
2. Choose appropriate data types
3. Create indexes for frequently queried columns
4. Document your schema

## Conclusion

Understanding database design principles is crucial for backend development.`,
      published: true,
      authorId: admin.id,
      publishedAt: new Date('2024-03-15'),
      tagSlugs: ['database', 'best-practices', 'tutorial'],
    },
    {
      title: 'Advanced TypeScript Patterns',
      slug: 'advanced-typescript-patterns',
      excerpt: 'Dive deep into advanced TypeScript patterns and techniques.',
      content: `# Advanced TypeScript Patterns

Take your TypeScript skills to the next level with these advanced patterns.

## Conditional Types

\`\`\`typescript
type IsString<T> = T extends string ? true : false;
\`\`\`

## Mapped Types

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
\`\`\`

## Template Literal Types

\`\`\`typescript
type EventName = \`on\${Capitalize<string>}\`;
\`\`\`

## Conclusion

These patterns will make your TypeScript code more flexible and type-safe.`,
      published: true,
      authorId: editor.id,
      publishedAt: new Date('2024-04-01'),
      tagSlugs: ['typescript', 'javascript', 'best-practices'],
    },
    {
      title: 'Web Performance Best Practices',
      slug: 'web-performance-best-practices',
      excerpt: 'Learn how to make your websites load faster and perform better.',
      content: `# Web Performance Best Practices

Fast websites provide better user experience and rank higher in search results.

## Optimization Techniques

### Image Optimization

- Use modern formats (WebP, AVIF)
- Implement lazy loading
- Serve responsive images

### Code Splitting

Split your JavaScript bundles to reduce initial load time.

### Caching

Implement proper caching strategies:

- Browser caching
- CDN caching
- Service workers

### Minification

Minify CSS, JavaScript, and HTML files.

## Measuring Performance

Use tools like:

- Lighthouse
- WebPageTest
- Chrome DevTools

## Conclusion

Performance optimization is an ongoing process.`,
      published: true,
      authorId: admin.id,
      publishedAt: new Date('2024-04-15'),
      tagSlugs: ['web-development', 'performance', 'best-practices'],
    },
    {
      title: 'Building Full-Stack Apps with Next.js',
      slug: 'fullstack-apps-nextjs',
      excerpt: 'Complete guide to building full-stack applications with Next.js.',
      content: `# Building Full-Stack Apps with Next.js

Next.js makes it easy to build full-stack applications with React.

## API Routes

Create backend endpoints directly in your Next.js app:

\`\`\`typescript
// app/api/users/route.ts
export async function GET() {
  return Response.json({ users: [] });
}
\`\`\`

## Database Integration

Use Prisma for type-safe database access:

\`\`\`typescript
const users = await prisma.user.findMany();
\`\`\`

## Authentication

Implement authentication with NextAuth.js.

## Deployment

Deploy to Vercel with zero configuration.

## Conclusion

Next.js provides everything you need for full-stack development.`,
      published: true,
      authorId: editor.id,
      publishedAt: new Date('2024-05-01'),
      tagSlugs: ['nextjs', 'react', 'typescript', 'web-development', 'database'],
    },
    {
      title: 'Draft: Upcoming React Features',
      slug: 'upcoming-react-features',
      excerpt: 'A preview of exciting new features coming to React.',
      content: `# Upcoming React Features

React continues to evolve. Here's what's coming next.

## React Server Components

A new way to render components on the server.

## Concurrent Features

Improved concurrent rendering capabilities.

## Conclusion

Stay tuned for these exciting updates!`,
      published: false,
      authorId: admin.id,
      publishedAt: null,
      tagSlugs: ['react', 'javascript'],
    },
  ];

  for (const postData of postsData) {
    const { tagSlugs, ...postInfo } = postData;
    
    const post = await prisma.post.upsert({
      where: { slug: postInfo.slug },
      update: {},
      create: {
        ...postInfo,
        tags: {
          create: tagSlugs.map(tagSlug => ({
            tag: {
              connect: { slug: tagSlug },
            },
          })),
        },
      },
    });
    console.log(`✅ Created post: ${post.title}`);
  }

  console.log(`✅ Created ${postsData.length} posts`);

  // Create some default site settings
  const settings = await prisma.siteSetting.createMany({
    data: [
      {
        key: 'site_name',
        value: 'My Blog',
        description: 'The name of the blog',
      },
      {
        key: 'site_description',
        value: 'A personal blog built with Next.js',
        description: 'Short description of the blog',
      },
      {
        key: 'posts_per_page',
        value: '10',
        description: 'Number of posts to display per page',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${settings.count} site settings`);

  // Create some default social links
  const socialLinks = await prisma.socialLink.createMany({
    data: [
      {
        platform: 'GitHub',
        url: 'https://github.com',
        icon: 'GitHubIcon',
        order: 1,
        visible: true,
      },
      {
        platform: 'X',
        url: 'https://x.com',
        icon: 'XIcon',
        order: 2,
        visible: true,
      },
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com',
        icon: 'LinkedInIcon',
        order: 3,
        visible: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${socialLinks.count} social links`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
