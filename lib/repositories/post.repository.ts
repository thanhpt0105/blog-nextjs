import { prisma } from '@/lib/prisma';

export interface GetPostsParams {
  page?: number;
  limit?: number;
  published?: boolean;
  authorId?: string;
  tagId?: string;
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class PostRepository {
  /**
   * Get paginated posts with filters
   */
  static async getPosts(params: GetPostsParams = {}) {
    const {
      page = 1,
      limit = 10,
      published,
      authorId,
      tagId,
      search,
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (published !== undefined) {
      where.published = published;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (tagId) {
      where.tags = {
        some: {
          tagId: tagId,
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute queries in parallel
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get all published posts (for client-side filtering)
   * Use with caution - only for small datasets
   */
  static async getAllPublishedPosts() {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return posts;
  }

  /**
   * Get a single post by slug
   */
  static async getPostBySlug(slug: string, publishedOnly = true) {
    const where: any = { slug };
    if (publishedOnly) {
      where.published = true;
    }

    const post = await prisma.post.findUnique({
      where,
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return post;
  }

  /**
   * Get a single post by ID
   */
  static async getPostById(id: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return post;
  }

  /**
   * Get posts count
   */
  static async getPostsCount(published?: boolean) {
    const where: any = {};
    if (published !== undefined) {
      where.published = published;
    }

    return prisma.post.count({ where });
  }

  /**
   * Get recent posts
   */
  static async getRecentPosts(limit = 5, publishedOnly = true) {
    const where: any = {};
    if (publishedOnly) {
      where.published = true;
    }

    const posts = await prisma.post.findMany({
      where,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return posts;
  }
}
