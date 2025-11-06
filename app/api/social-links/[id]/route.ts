import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const link = await prisma.socialLink.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error('Update social link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.socialLink.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Social link deleted' });
  } catch (error) {
    console.error('Delete social link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
