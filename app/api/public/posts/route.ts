import { NextRequest, NextResponse } from 'next/server';
import { PostRepository } from '@/lib/repositories';
import { getCachedPosts, setCachedPosts, CACHE_TTL } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;
    const tagsParam = searchParams.get('tags');
    const tagIds = tagsParam ? tagsParam.split(',').filter(Boolean) : undefined;

    // Build cache key
    const cacheKey = `public:posts:page:${page}:limit:${limit}:search:${search || 'none'}:tags:${tagIds?.join(',') || 'none'}`;

    // Try to get from cache
    const cached = await getCachedPosts(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Fetch from database
    const result = await PostRepository.getPosts({
      page,
      limit,
      published: true,
      tagIds,
      search,
    });

    // Cache the result
    await setCachedPosts(cacheKey, result, CACHE_TTL.MEDIUM);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Get public posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
