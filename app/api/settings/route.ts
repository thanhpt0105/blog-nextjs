import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { clearSettingsCache } from '@/lib/settings';
import { revalidatePath } from 'next/cache';

// Force Node.js runtime for this API route (not Edge)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

    // Clear the settings cache so new values are fetched
    clearSettingsCache();

    // Revalidate pages to pick up new settings
    try {
      revalidatePath('/');
      revalidatePath('/admin');
    } catch (revalidateError) {
      // Revalidation failure shouldn't break the update
      console.error('Revalidation error (non-critical):', revalidateError);
    }

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
