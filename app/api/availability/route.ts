import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAvailableSlots } from '@/lib/availability';
import { addDays } from 'date-fns';

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const dateStr = searchParams.get('date');
    const viewerTz = searchParams.get('viewerTimezone') || 'UTC';
    const duration = parseInt(searchParams.get('duration') || '30');

    if (!userId || !dateStr) {
      return NextResponse.json({ error: 'Missing userId or date' }, { status: 400 });
    }

    // Fetch user and working hours
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { workingHours: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse the date
    const checkDate = new Date(dateStr);
    
    // Get existing bookings for this user on this date
    // We search for bookings that overlap with the entire day in the user's timezone
    const startOfDay = new Date(checkDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(checkDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
        status: 'confirmed',
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    // Generate available slots
    const slots = generateAvailableSlots(
      checkDate,
      user.workingHours,
      bookings,
      duration,
      user.timezone,
      viewerTz
    );

    return NextResponse.json({
      success: true,
      slots,
    });

  } catch (error) {
    console.error('Availability error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get availability',
    }, { status: 500 });
  }
}