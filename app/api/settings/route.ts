import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Update each setting
    await Promise.all(
      Object.entries(body).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: value as string },
          create: {
            key,
            value: value as string,
            description: `Setting for ${key}`,
          },
        })
      )
    );

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
