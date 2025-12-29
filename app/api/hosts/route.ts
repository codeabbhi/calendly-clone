import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const hosts = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        timezone: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ hosts });
  } catch (error) {
    console.error('Failed to fetch hosts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hosts' },
      { status: 500 }
    );
  }
}
