import { getCache, setCache, deleteCache, deleteCachePattern } from './redis';

// Cache key patterns
export const CACHE_KEYS = {
  POSTS_LIST: 'posts:list',
  POSTS_PUBLISHED: 'posts:published',
  POST_BY_ID: (id: string) => `post:${id}`,
  POST_BY_SLUG: (slug: string) => `post:slug:${slug}`,
  TAGS_LIST: 'tags:list',
  TAG_BY_ID: (id: string) => `tag:${id}`,
  TAG_BY_SLUG: (slug: string) => `tag:slug:${slug}`,
  SITE_SETTINGS: 'site:settings',
  PUBLIC_POSTS: (page: number, limit: number, search: string, tags: string) => 
    `public:posts:page:${page}:limit:${limit}:search:${search}:tags:${tags}`,
};

// Cache TTL (in seconds)
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 600, // 10 minutes
};

// Posts caching
export async function getCachedPosts(cacheKey: string): Promise<any | null> {
  return await getCache(cacheKey);
}

export async function setCachedPosts(cacheKey: string, posts: any, ttl: number = CACHE_TTL.MEDIUM) {
  return await setCache(cacheKey, posts, ttl);
}

export async function invalidatePostsCache() {
  await Promise.all([
    deleteCache(CACHE_KEYS.POSTS_LIST),
    deleteCache(CACHE_KEYS.POSTS_PUBLISHED),
    deleteCachePattern('post:*'),
  ]);
}

export async function invalidatePostCache(postId: string, slug?: string) {
  const deletions = [
    deleteCache(CACHE_KEYS.POST_BY_ID(postId)),
    deleteCache(CACHE_KEYS.POSTS_LIST),
    deleteCache(CACHE_KEYS.POSTS_PUBLISHED),
  ];

  if (slug) {
    deletions.push(deleteCache(CACHE_KEYS.POST_BY_SLUG(slug)));
  }

  await Promise.all(deletions);
}

// Tags caching
export async function getCachedTags(): Promise<any | null> {
  return await getCache(CACHE_KEYS.TAGS_LIST);
}

export async function setCachedTags(tags: any, ttl: number = CACHE_TTL.LONG) {
  return await setCache(CACHE_KEYS.TAGS_LIST, tags, ttl);
}

export async function invalidateTagsCache() {
  await Promise.all([
    deleteCache(CACHE_KEYS.TAGS_LIST),
    deleteCachePattern('tag:*'),
  ]);
}

export async function invalidateTagCache(tagId: string, slug?: string) {
  const deletions = [
    deleteCache(CACHE_KEYS.TAG_BY_ID(tagId)),
    deleteCache(CACHE_KEYS.TAGS_LIST),
  ];

  if (slug) {
    deletions.push(deleteCache(CACHE_KEYS.TAG_BY_SLUG(slug)));
  }

  await Promise.all(deletions);
}
