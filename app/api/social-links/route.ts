import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Invalid URL'),
  icon: z.string().optional(),
  visible: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    // Public endpoint - no auth required for reading
    const socialLinks = await prisma.socialLink.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(socialLinks);
  } catch (error) {
    console.error('Get social links error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = socialLinkSchema.parse(body);

    // Get max order
    const maxOrderLink = await prisma.socialLink.findFirst({
      orderBy: { order: 'desc' },
    });

    const link = await prisma.socialLink.create({
      data: {
        ...validatedData,
        order: (maxOrderLink?.order || 0) + 1,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Create social link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
