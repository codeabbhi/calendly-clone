
import { NextResponse } from 'next/server';
import { createBooking } from '@/app/api/actions/booking';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { 
      userId, 
      attendeeName, 
      attendeeEmail, 
      startTime, 
      slotDuration, 
      attendeeTimezone 
    } = body;

    if (!userId || !attendeeName || !attendeeEmail || !startTime) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }
    
    const result = await createBooking({
      userId,
      attendeeName,
      attendeeEmail,
      startTime: new Date(startTime),
      slotDuration: slotDuration || 30,
      attendeeTimezone: attendeeTimezone || 'UTC'
    });
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create booking'
    }, { status: 500 });
  }
}

