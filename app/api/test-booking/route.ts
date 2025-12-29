import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addDays, addMinutes } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';

export async function GET() {
  try {
    // Get the first mentor
    const mentor = await prisma.mentor.findFirst();
    if (!mentor) {
      return NextResponse.json({
        success: false,
        error: 'No mentors available for booking'
      });
    }

    // Create a test booking for tomorrow at 10:00 AM NY time
    const tomorrow = addDays(new Date(), 1);
    tomorrow.setHours(10, 0, 0, 0); // 10:00 AM local

    // Convert to UTC
    const startTime = fromZonedTime(tomorrow, 'America/New_York');
    const endTime = addMinutes(startTime, 30);

    const booking = await prisma.booking.create({
      data: {
        userId: 'cmjphlfnx00003wbgqrdpmyds', // John's ID
        mentorId: mentor.id,
        attendeeName: 'Test User',
        attendeeEmail: 'test@example.com',
        startTime,
        endTime,
        timezone: 'America/New_York',
        status: 'confirmed',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Test booking created',
      booking: {
        id: booking.id,
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
        displayTime: '10:00 AM - 10:30 AM (NY time)',
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create test booking',
    }, { status: 500 });
  }
}
