import { NextResponse } from 'next/server';
import { createBooking } from '@/app/api/actions/booking';
import { addDays } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const name = searchParams.get('name') || 'Test User';
  const time = searchParams.get('time') || '14:00';

  if (!email) {
    return NextResponse.json({
      error: 'Email parameter required. Use: ?email=your@email.com'
    }, { status: 400 });
  }

  try {
    // Get the user's first mentor
    const user = await prisma.user.findUnique({
      where: { id: 'cmjphlfnx00003wbgqrdpmyds' },
      include: { mentors: { take: 1 } }
    });

    if (!user?.mentors[0]) {
      return NextResponse.json({
        error: 'No mentors available for booking'
      }, { status: 400 });
    }

    const tomorrow = addDays(new Date(), 1);
    const [hour, minute] = time.split(':').map(Number);
    tomorrow.setHours(hour, minute, 0, 0);
    
    const startTime = fromZonedTime(tomorrow, 'America/New_York');
    
    const result = await createBooking({
      userId: 'cmjphlfnx00003wbgqrdpmyds',
      mentorId: user.mentors[0].id,
      attendeeName: name,
      attendeeEmail: email,
      startTime,
      slotDuration: 30,
      attendeeTimezone: 'America/New_York'
    });
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Booking created! Confirmation email sent to ${email}`,
        bookingId: result.bookingId,
        details: result.details
      });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Booking failed'
    }, { status: 500 });
  }
}
