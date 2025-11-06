import { prisma } from '@/lib/prisma';

export class TagRepository {
  /**
   * Get all tags with published post counts
   */
  static async getAllTags() {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        posts: {
          where: {
            post: {
              published: true,
            },
          },
        },
      },
    });

    return tags;
  }

  /**
   * Get a tag by slug with posts
   */
  static async getTagBySlug(slug: string) {
    const tag = await prisma.tag.findUnique({
      where: { slug },
      include: {
        posts: {
          where: {
            post: {
              published: true,
            },
          },
          include: {
            post: {
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
            },
          },
        },
      },
    });

    return tag;
  }

  /**
   * Get all tags (admin - includes all posts)
   */
  static async getAllTagsAdmin() {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        posts: true,
      },
    });

    return tags;
  }

  /**
   * Get tags count
   */
  static async getTagsCount() {
    return prisma.tag.count();
  }
}
