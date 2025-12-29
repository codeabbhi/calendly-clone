import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        workingHours: true,
      },
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
    }, { status: 500 });
  }
}