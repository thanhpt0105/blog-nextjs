import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env file
const envPath = join(__dirname, '../.env');
const envContent = readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    const value = valueParts.join('=').replace(/^["']|["']$/g, '');
    process.env[key.trim()] = value.trim();
  }
});

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.postTag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminEmail = 'admin@example.com';
  const adminPassword = await hashPassword('admin123');

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // Create editor user
  const editorEmail = 'editor@example.com';
  const editorPassword = await hashPassword('editor123');

  const editor = await prisma.user.create({
    data: {
      email: editorEmail,
      name: 'John Editor',
      password: editorPassword,
      role: 'EDITOR',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor',
    },
  });

  console.log(`✅ Editor user created: ${editor.email}`);

  // Remove regular user creation
  
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
    const tag = await prisma.tag.create({
      data: tagData,
    });
    tags.push(tag);
  }

  console.log(`✅ Created ${tags.length} tags`);

  // Create sample posts with HTML content
  const postsData = [
    {
      title: 'Getting Started with Next.js 14',
      slug: 'getting-started-nextjs-14',
      excerpt: 'Learn how to build modern web applications with Next.js 14, featuring the App Router, Server Components, and more.',
      content: `<h2>Introduction to Next.js 14</h2>
<p>Next.js 14 brings exciting new features that make building web applications faster and more efficient. In this guide, we'll explore the key features and how to get started.</p>

<img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop" alt="Next.js Development" />

<h3>Key Features</h3>
<ul>
  <li><strong>App Router</strong>: A new file-system based router built on React Server Components</li>
  <li><strong>Server Actions</strong>: Seamlessly call server-side functions from client components</li>
  <li><strong>Improved Performance</strong>: Faster builds and optimized rendering</li>
  <li><strong>Turbopack</strong>: Next-generation bundler for faster development</li>
</ul>

<h3>Installation</h3>
<p>Getting started is easy. Simply run the following command:</p>
<pre><code>npx create-next-app@latest my-app</code></pre>

<blockquote>
  <p>Next.js provides the best developer experience with all the features you need for production.</p>
</blockquote>

<h3>Project Structure</h3>
<p>The App Router introduces a new folder structure that makes organizing your code intuitive:</p>

<img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop" alt="Code Editor" />

<table>
  <thead>
    <tr>
      <th>Folder</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>app/</code></td>
      <td>Main application directory</td>
    </tr>
    <tr>
      <td><code>components/</code></td>
      <td>Reusable React components</td>
    </tr>
    <tr>
      <td><code>lib/</code></td>
      <td>Utility functions and helpers</td>
    </tr>
  </tbody>
</table>

<h3>Conclusion</h3>
<p>Next.js 14 is a powerful framework that simplifies building modern web applications. Start exploring today and take your projects to the next level!</p>`,
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
      published: true,
      authorId: admin.id,
      publishedAt: new Date('2024-01-15'),
      tagSlugs: ['nextjs', 'react', 'tutorial', 'web-development'],
    },
    {
      title: 'TypeScript Best Practices for 2024',
      slug: 'typescript-best-practices-2024',
      excerpt: 'Discover the best practices and patterns for writing clean TypeScript code.',
      content: `<h2>TypeScript Best Practices for 2024</h2>
<p>TypeScript has become the de facto standard for building scalable JavaScript applications. In this guide, we'll explore essential best practices that will help you write cleaner, more maintainable code.</p>

<img src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop" alt="TypeScript Code" />

<h3>Type Safety First</h3>
<p>Always prefer strict type checking to catch errors early in development:</p>
<pre><code>// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}</code></pre>

<h3>Avoid Using Any</h3>
<p>The <code>any</code> type defeats the purpose of TypeScript. Instead, use <code>unknown</code> for values whose type you don't know yet:</p>
<ul>
  <li><strong>Bad</strong>: <code>let data: any;</code></li>
  <li><strong>Good</strong>: <code>let data: unknown;</code></li>
  <li><strong>Better</strong>: Define proper interfaces and types</li>
</ul>

<h3>Leverage Union Types</h3>
<p>Union types are powerful for representing values that can be one of several types:</p>
<pre><code>type Status = 'pending' | 'success' | 'error';
type Result = string | number | null;</code></pre>

<blockquote>
  <p>TypeScript's type system is one of its greatest strengths. Use it to your advantage!</p>
</blockquote>

<h3>Interface vs Type</h3>
<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Interface</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Extensibility</td>
      <td>Can be extended</td>
      <td>Cannot be extended</td>
    </tr>
    <tr>
      <td>Declaration Merging</td>
      <td>Yes</td>
      <td>No</td>
    </tr>
    <tr>
      <td>Union Types</td>
      <td>No</td>
      <td>Yes</td>
    </tr>
  </tbody>
</table>

<img src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=400&fit=crop" alt="Programming" />

<h3>Conclusion</h3>
<p>Following these best practices will help you build more robust and maintainable TypeScript applications. Keep learning and stay updated with the latest features!</p>

\`\`\`typescript
type Status = 'pending' | 'success' | 'error';
\`\`\`

## Leverage Utility Types

TypeScript provides many built-in utility types like \`Partial\`, \`Pick\`, \`Omit\`, and more.

## Conclusion

Following these best practices will help you write more maintainable TypeScript code.`,
      coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=630&fit=crop',
      published: true,
      authorId: editor.id,
      publishedAt: new Date('2024-02-01'),
      tagSlugs: ['typescript', 'tutorial', 'web-development'],
    },
    {
      title: 'Building a REST API with Node.js',
      slug: 'building-rest-api-nodejs',
      excerpt: 'Step-by-step guide to creating a RESTful API using Node.js and Express.',
      content: `<h2>Building a REST API with Node.js</h2>
<p>Learn how to build a robust REST API using Node.js, Express, and modern JavaScript patterns. This comprehensive guide will walk you through the entire process.</p>

<img src="https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop" alt="Node.js Development" />

<h3>Prerequisites</h3>
<ul>
  <li><strong>Node.js</strong>: Latest LTS version installed</li>
  <li><strong>JavaScript Knowledge</strong>: Understanding of ES6+ features</li>
  <li><strong>HTTP Basics</strong>: Familiarity with REST principles</li>
</ul>

<h3>Setting Up Express</h3>
<p>First, let's set up a basic Express server:</p>
<pre><code>const express = require('express');
const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log('Server running on port 3000');
});</code></pre>

<h3>Creating Routes</h3>
<p>Define your API endpoints with proper HTTP methods:</p>
<pre><code>// GET - Fetch all users
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

// POST - Create a new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ 
    message: 'User created',
    user: { name, email }
  });
});</code></pre>

<blockquote>
  <p>Always use appropriate HTTP status codes to indicate the result of API operations.</p>
</blockquote>

<h3>Best Practices</h3>
<table>
  <thead>
    <tr>
      <th>Practice</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Status Codes</td>
      <td>Use proper HTTP status codes (200, 201, 404, 500)</td>
    </tr>
    <tr>
      <td>Error Handling</td>
      <td>Implement centralized error handling middleware</td>
    </tr>
    <tr>
      <td>Validation</td>
      <td>Validate all input data before processing</td>
    </tr>
    <tr>
      <td>Middleware</td>
      <td>Use middleware for authentication, logging, etc.</td>
    </tr>
  </tbody>
</table>

<img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop" alt="API Development" />

<h3>Conclusion</h3>
<p>Building REST APIs with Node.js is straightforward yet powerful. Follow these patterns to create maintainable and scalable APIs.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=630&fit=crop',
      published: true,
      authorId: admin.id,
      publishedAt: new Date('2024-02-15'),
      tagSlugs: ['nodejs', 'tutorial', 'web-development'],
    },
    {
      title: 'React Performance Optimization Techniques',
      slug: 'react-performance-optimization',
      excerpt: 'Learn how to optimize your React applications for better performance.',
      content: `<h2>React Performance Optimization Techniques</h2>
<p>Performance is crucial for user experience. In this guide, we'll explore essential techniques to optimize your React applications and deliver lightning-fast experiences to your users.</p>

<img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop" alt="React Development" />

<h3>Use React.memo</h3>
<p>Prevent unnecessary re-renders by wrapping your components with React.memo:</p>
<pre><code>const MyComponent = React.memo(({ data }) => {
  return (
    &lt;div&gt;
      &lt;h3&gt;{data.title}&lt;/h3&gt;
      &lt;p&gt;{data.content}&lt;/p&gt;
    &lt;/div&gt;
  );
});</code></pre>

<h3>useMemo and useCallback</h3>
<p>Memoize expensive computations and callback functions:</p>
<ul>
  <li><strong>useMemo</strong>: Cache expensive calculation results</li>
  <li><strong>useCallback</strong>: Memoize callback functions to prevent re-creation</li>
  <li><strong>When to use</strong>: Only when there's a measurable performance issue</li>
</ul>

<pre><code>const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);</code></pre>

<blockquote>
  <p>Don't optimize prematurely. Measure performance first, then optimize where needed.</p>
</blockquote>

<h3>Optimization Strategies</h3>
<table>
  <thead>
    <tr>
      <th>Technique</th>
      <th>Use Case</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Code Splitting</td>
      <td>Load components on demand</td>
    </tr>
    <tr>
      <td>Lazy Loading</td>
      <td>Defer loading of non-critical resources</td>
    </tr>
    <tr>
      <td>Virtual Lists</td>
      <td>Render large lists efficiently</td>
    </tr>
    <tr>
      <td>Debouncing</td>
      <td>Limit frequent function calls</td>
    </tr>
  </tbody>
</table>

<img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop" alt="Performance Metrics" />

<h3>Conclusion</h3>
<p>By applying these optimization techniques strategically, you can significantly improve your React application's performance and user experience.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
      published: true,
      authorId: editor.id,
      publishedAt: new Date('2024-03-01'),
      tagSlugs: ['react', 'performance', 'web-development'],
    },
    {
      title: 'Introduction to Database Design',
      slug: 'introduction-database-design',
      excerpt: 'Learn the fundamentals of designing efficient and scalable databases.',
      content: `<h2>Introduction to Database Design</h2>
<p>Database design is a critical skill for building scalable applications. This guide covers the fundamentals of designing efficient, normalized databases that will serve your application well.</p>

<img src="https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop" alt="Database Design" />

<h3>Normalization</h3>
<p>Normalization is the process of organizing data to reduce redundancy:</p>
<ul>
  <li><strong>First Normal Form (1NF)</strong>: Eliminate repeating groups</li>
  <li><strong>Second Normal Form (2NF)</strong>: Remove partial dependencies</li>
  <li><strong>Third Normal Form (3NF)</strong>: Eliminate transitive dependencies</li>
</ul>

<h3>Entity Relationships</h3>
<p>Understanding relationships between entities is crucial:</p>
<pre><code>// One-to-Many Example
User (1) ----&lt; (*) Posts

// Many-to-Many Example
Posts (*) &gt;----&lt; (*) Tags</code></pre>

<blockquote>
  <p>Good database design is the foundation of a scalable application.</p>
</blockquote>

<h3>Primary vs Foreign Keys</h3>
<table>
  <thead>
    <tr>
      <th>Key Type</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Primary Key</td>
      <td>Uniquely identifies each record</td>
    </tr>
    <tr>
      <td>Foreign Key</td>
      <td>Links to primary key in another table</td>
    </tr>
    <tr>
      <td>Composite Key</td>
      <td>Combination of multiple columns</td>
    </tr>
  </tbody>
</table>

<h3>Indexing Strategy</h3>
<p>Proper indexing dramatically improves query performance:</p>
<ul>
  <li>Index frequently queried columns</li>
  <li>Avoid over-indexing (impacts write performance)</li>
  <li>Use composite indexes for multi-column queries</li>
</ul>

<img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop" alt="Data Analytics" />

<h3>Conclusion</h3>
<p>Mastering database design principles will help you build robust, scalable applications that can grow with your needs.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&h=630&fit=crop',
      published: true,
      authorId: admin.id,
      publishedAt: new Date('2024-03-15'),
      tagSlugs: ['database', 'tutorial'],
    },
    {
      title: 'Advanced TypeScript Patterns',
      slug: 'advanced-typescript-patterns',
      excerpt: 'Explore advanced TypeScript patterns and techniques for complex applications.',
      content: `<h2>Advanced TypeScript Patterns</h2>
<p>Take your TypeScript skills to the next level with these advanced patterns and techniques. Perfect for building complex, type-safe applications.</p>

<img src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=400&fit=crop" alt="Advanced Programming" />

<h3>Generics and Constraints</h3>
<p>Generics allow you to write flexible, reusable code while maintaining type safety:</p>
<pre><code>function getData&lt;T extends { id: string }&gt;(
  items: T[], 
  id: string
): T | undefined {
  return items.find(item =&gt; item.id === id);
}</code></pre>

<h3>Utility Types</h3>
<p>TypeScript provides powerful built-in utility types:</p>
<ul>
  <li><strong>Partial&lt;T&gt;</strong>: Make all properties optional</li>
  <li><strong>Required&lt;T&gt;</strong>: Make all properties required</li>
  <li><strong>Pick&lt;T, K&gt;</strong>: Select specific properties</li>
  <li><strong>Omit&lt;T, K&gt;</strong>: Exclude specific properties</li>
  <li><strong>Record&lt;K, T&gt;</strong>: Create an object type with specific keys</li>
</ul>

<blockquote>
  <p>Master utility types to write more concise and maintainable code.</p>
</blockquote>

<h3>Conditional Types</h3>
<p>Create types that depend on conditions:</p>
<pre><code>type IsString&lt;T&gt; = T extends string ? true : false;
type Result1 = IsString&lt;'hello'&gt;; // true
type Result2 = IsString&lt;42&gt;; // false</code></pre>

<h3>Pattern Comparison</h3>
<table>
  <thead>
    <tr>
      <th>Pattern</th>
      <th>Use Case</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Generics</td>
      <td>Reusable type-safe functions</td>
    </tr>
    <tr>
      <td>Mapped Types</td>
      <td>Transform existing types</td>
    </tr>
    <tr>
      <td>Template Literals</td>
      <td>String manipulation at type level</td>
    </tr>
  </tbody>
</table>

<img src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop" alt="TypeScript Code" />

<h3>Conclusion</h3>
<p>These advanced patterns unlock TypeScript's full potential, enabling you to build robust, type-safe applications with confidence.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&h=630&fit=crop',
      published: true,
      authorId: editor.id,
      publishedAt: new Date('2024-04-01'),
      tagSlugs: ['typescript', 'tutorial'],
    },
    {
      title: 'Web Performance Best Practices',
      slug: 'web-performance-best-practices',
      excerpt: 'Learn how to make your websites load faster and perform better.',
      content: `<h2>Web Performance Best Practices</h2>
<p>Web performance directly impacts user experience and business metrics. This comprehensive guide covers essential techniques to make your websites blazingly fast.</p>

<img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop" alt="Performance Optimization" />

<h3>Core Web Vitals</h3>
<p>Focus on these key metrics:</p>
<ul>
  <li><strong>LCP (Largest Contentful Paint)</strong>: Loading performance (&lt; 2.5s)</li>
  <li><strong>FID (First Input Delay)</strong>: Interactivity (&lt; 100ms)</li>
  <li><strong>CLS (Cumulative Layout Shift)</strong>: Visual stability (&lt; 0.1)</li>
</ul>

<h3>Optimization Techniques</h3>
<pre><code>// Image optimization
&lt;img 
  src="image.jpg" 
  alt="Description"
  loading="lazy"
  width="800"
  height="400"
/&gt;

// Resource hints
&lt;link rel="preconnect" href="https://api.example.com"&gt;
&lt;link rel="dns-prefetch" href="https://cdn.example.com"&gt;</code></pre>

<blockquote>
  <p>Every 100ms delay in load time can decrease conversion by 7%.</p>
</blockquote>

<h3>Performance Budget</h3>
<table>
  <thead>
    <tr>
      <th>Resource</th>
      <th>Budget</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>JavaScript</td>
      <td>&lt; 200KB (gzipped)</td>
    </tr>
    <tr>
      <td>CSS</td>
      <td>&lt; 50KB (gzipped)</td>
    </tr>
    <tr>
      <td>Images</td>
      <td>&lt; 500KB total</td>
    </tr>
    <tr>
      <td>Fonts</td>
      <td>&lt; 100KB</td>
    </tr>
  </tbody>
</table>

<h3>Critical Rendering Path</h3>
<p>Optimize the critical rendering path to improve perceived performance:</p>
<ul>
  <li>Minimize critical resources</li>
  <li>Minimize critical bytes</li>
  <li>Minimize critical path length</li>
  <li>Use async/defer for non-critical scripts</li>
</ul>

<img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop" alt="Website Analytics" />

<h3>Conclusion</h3>
<p>Implementing these performance best practices will result in faster websites, happier users, and better business outcomes.</p>

Fast websites provide better user experience and rank higher in search results.

## Optimization Techniques

### Image Optimization

- Use modern formats (WebP, AVIF)
- Implement lazy loading
<h3>Conclusion</h3>
<p>Implementing these performance best practices will result in faster websites, happier users, and better business outcomes.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop',
      published: true,
      authorId: admin.id,
      publishedAt: new Date('2024-04-15'),
      tagSlugs: ['web-development', 'performance'],
    },
    {
      title: 'Building Full-Stack Apps with Next.js',
      slug: 'fullstack-apps-nextjs',
      excerpt: 'Complete guide to building full-stack applications with Next.js.',
      content: `<h2>Building Full-Stack Apps with Next.js</h2>
<p>Next.js makes it incredibly easy to build full-stack applications with React. Learn how to create complete web applications with frontend, backend, and database—all in one framework.</p>

<img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop" alt="Full Stack Development" />

<h3>API Routes</h3>
<p>Create backend endpoints directly in your Next.js app using the App Router:</p>
<pre><code>// app/api/users/route.ts
export async function GET() {
  const users = await db.user.findMany();
  return Response.json({ users });
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await db.user.create({ data: body });
  return Response.json({ user }, { status: 201 });
}</code></pre>

<h3>Database Integration</h3>
<p>Use Prisma for type-safe database access with excellent TypeScript support:</p>
<ul>
  <li><strong>Type Safety</strong>: Auto-generated types from your schema</li>
  <li><strong>Migrations</strong>: Version control for your database</li>
  <li><strong>Prisma Studio</strong>: Visual database browser</li>
</ul>

<blockquote>
  <p>Next.js provides everything you need for full-stack development in a single framework.</p>
</blockquote>

<h3>Full-Stack Features</h3>
<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Benefit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>API Routes</td>
      <td>Backend endpoints without separate server</td>
    </tr>
    <tr>
      <td>Server Actions</td>
      <td>Direct server-side functions from components</td>
    </tr>
    <tr>
      <td>Middleware</td>
      <td>Authentication, logging, redirects</td>
    </tr>
    <tr>
      <td>Edge Runtime</td>
      <td>Deploy globally for low latency</td>
    </tr>
  </tbody>
</table>

<img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop" alt="Web Development" />

<h3>Authentication</h3>
<p>Implement secure authentication with NextAuth.js (Auth.js) for seamless user management and multiple providers support.</p>

<h3>Conclusion</h3>
<p>With Next.js, you can build complete full-stack applications using a single framework, reducing complexity and improving developer experience.</p>`,
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
      published: true,
      authorId: editor.id,
      publishedAt: new Date('2024-05-01'),
      tagSlugs: ['nextjs', 'react', 'typescript', 'web-development'],
    },
    {
      title: 'Draft: Upcoming React Features',
      slug: 'upcoming-react-features',
      excerpt: 'A preview of exciting new features coming to React.',
      content: `<h2>Upcoming React Features</h2>
<p>React continues to evolve with exciting new features on the horizon. This article explores what's coming next in the React ecosystem.</p>

<img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop" alt="React Future" />

<h3>React Server Components</h3>
<p>Server Components are revolutionizing how we think about React applications:</p>
<ul>
  <li><strong>Zero Bundle Size</strong>: Server components don't ship to the client</li>
  <li><strong>Direct Backend Access</strong>: Query databases directly from components</li>
  <li><strong>Automatic Code Splitting</strong>: Only load what's needed</li>
</ul>

<h3>Suspense Improvements</h3>
<p>Enhanced Suspense boundaries for better loading states and data fetching:</p>
<pre><code>&lt;Suspense fallback={&lt;Loading /&gt;}&gt;
  &lt;AsyncComponent /&gt;
&lt;/Suspense&gt;</code></pre>

<blockquote>
  <p>The future of React is about making the right thing the easy thing.</p>
</blockquote>

<h3>New Hooks</h3>
<p>Exciting new hooks coming to React:</p>
<ul>
  <li><code>use()</code>: Consume promises and context directly</li>
  <li><code>useOptimistic()</code>: Optimistic UI updates</li>
  <li><code>useFormStatus()</code>: Form submission state</li>
</ul>

<img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop" alt="React Development" />

<h3>Conclusion</h3>
<p>React's future is bright with features that make building performant, user-friendly applications easier than ever. Stay tuned for more updates!</p>`,
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
      published: false,
      authorId: admin.id,
      publishedAt: null,
      tagSlugs: ['react', 'nextjs'],
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
