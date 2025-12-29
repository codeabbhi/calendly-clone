'use server';

import { prisma } from '@/lib/prisma';
import { addMinutes } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { sendBookingConfirmation } from '@/lib/email';

// Types for our booking data
interface BookingData {
  userId: string;
  mentorId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone?: string;
  attendeeCompany?: string;
  additionalGuests?: string[];
  meetingType?: string;
  meetingLocation?: string;
  meetingTitle?: string;
  notes?: string;
  startTime: Date;
  slotDuration: number;
  attendeeTimezone: string;
}

interface BookingResult {
  success: boolean;
  bookingId?: string;
  error?: string;
  details?: string;
}

/**
 * Creates a new booking with concurrency protection
 * This function prevents double-bookings using database transactions
 */
export async function createBooking(data: BookingData): Promise<BookingResult> {
  try {
    console.log('📝 Attempting to create booking...');
    console.log('   User:', data.userId);
    console.log('   Time:', data.startTime.toISOString());
    console.log('   Duration:', data.slotDuration, 'minutes');

    // Calculate end time
    const endTime = addMinutes(data.startTime, data.slotDuration);

    // Use Prisma transaction with Serializable isolation
    // This is the KEY to preventing double bookings
    const booking = await prisma.$transaction(async (tx) => {
      
      // STEP 1: Check for conflicts with a database lock
      // This query locks the rows, preventing other transactions from reading them
      const conflicts = await tx.booking.findFirst({
        where: {
          userId: data.userId,
          status: 'confirmed',
          OR: [
            // Case 1: New booking starts during an existing booking
            {
              AND: [
                { startTime: { lte: data.startTime } },
                { endTime: { gt: data.startTime } }
              ]
            },
            // Case 2: New booking ends during an existing booking
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } }
              ]
            },
            // Case 3: New booking completely contains an existing booking
            {
              AND: [
                { startTime: { gte: data.startTime } },
                { endTime: { lte: endTime } }
              ]
            }
          ]
        }
      });

      // If conflict found, abort the transaction
      if (conflicts) {
        console.log('❌ Conflict detected with booking:', conflicts.id);
        throw new Error('SLOT_TAKEN');
      }

      console.log('✅ No conflicts found, creating booking...');

      // STEP 2: Create the booking
      // This only happens if no conflicts were found
      const newBooking = await tx.booking.create({
        data: {
          userId: data.userId,
          mentorId: data.mentorId,
          attendeeName: data.attendeeName,
          attendeeEmail: data.attendeeEmail,
          attendeePhone: data.attendeePhone,
          attendeeCompany: data.attendeeCompany,
          additionalGuests: data.additionalGuests ? JSON.stringify(data.additionalGuests) : null,
          meetingType: data.meetingType || 'video',
          meetingLocation: data.meetingLocation,
          meetingTitle: data.meetingTitle,
          notes: data.notes,
          startTime: data.startTime,
          endTime: endTime,
          timezone: data.attendeeTimezone,
          status: 'confirmed'
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          mentor: {
            select: {
              name: true,
              title: true
            }
          }
        }
      });

      return newBooking;
      
    }, {
      isolationLevel: 'Serializable', // Strongest isolation level
      maxWait: 5000,  // Wait up to 5 seconds for a lock
      timeout: 10000  // Transaction timeout: 10 seconds
    });

    console.log('✅ Booking created successfully:', booking.id);

    // STEP 3: Send confirmation email (outside transaction)
    // We'll implement this in the next step
    await sendBookingConfirmation(booking);

    return {
      success: true,
      bookingId: booking.id,
      details: `Booked ${data.attendeeName} for ${booking.startTime.toLocaleString()}`
    };

  } catch (error: any) {
    console.error('❌ Booking failed:', error.message);

    // Handle specific errors
    if (error.message === 'SLOT_TAKEN') {
      return {
        success: false,
        error: 'This time slot was just booked by someone else. Please choose another time.'
      };
    }

    if (error.code === 'P2034') {
      // Prisma transaction conflict error
      return {
        success: false,
        error: 'This slot is no longer available. Please refresh and try again.'
      };
    }

    // Generic error
    return {
      success: false,
      error: 'Failed to create booking. Please try again.',
      details: error.message
    };
  }
}