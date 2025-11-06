import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const tagSchema = z.object({
  name: z.string().min(1, 'Tag name is required'),
  slug: z.string().min(1, 'Slug is required'),
});

export async function GET(request: NextRequest) {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        posts: {
          select: {
            postId: true,
          },
        },
      },
    });

    // Add post count to each tag
    const tagsWithCount = tags.map((tag: typeof tags[0]) => ({
      ...tag,
      postCount: tag.posts.length,
    }));

    return NextResponse.json(tagsWithCount);
  } catch (error) {
    console.error('Get tags error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = tagSchema.parse(body);

    // Check if tag already exists
    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [
          { name: validatedData.name },
          { slug: validatedData.slug },
        ],
      },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: 'A tag with this name or slug already exists' },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.create({
      data: validatedData,
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Create tag error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
