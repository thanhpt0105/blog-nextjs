import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from '@/types/post';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getAllPosts(): Post[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPosts = fileNames
      .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.(mdx|md)$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title || 'Untitled',
          date: data.date || new Date().toISOString(),
          excerpt: data.excerpt || '',
          tags: data.tags || [],
          content,
          author: data.author,
          readTime: data.readTime,
        } as Post;
      });

    // Sort posts by date (newest first)
    return allPosts.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error('Error loading posts:', error);
    return [];
  }
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    let fileContents: string;
    
    try {
      fileContents = fs.readFileSync(fullPath, 'utf8');
    } catch {
      // Try .md extension if .mdx doesn't exist
      const mdPath = path.join(postsDirectory, `${slug}.md`);
      fileContents = fs.readFileSync(mdPath, 'utf8');
    }

    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      content,
      author: data.author,
      readTime: data.readTime,
    } as Post;
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}

export function getAllPostSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.(mdx|md)$/, ''));
  } catch (error) {
    console.error('Error loading post slugs:', error);
    return [];
  }
}
