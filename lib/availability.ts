import { addMinutes, format, startOfDay } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

// Types for our function parameters
interface WorkingHours {
  dayOfWeek: number;    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: string;    // "09:00"
  endTime: string;      // "17:00"
  timezone: string;     // "America/New_York"
}

interface Booking {
  startTime: Date;      // UTC timestamp
  endTime: Date;        // UTC timestamp
}

interface TimeSlot {
  start: Date;          // UTC timestamp (for storing in DB)
  end: Date;            // UTC timestamp
  displayTime: string;  // "9:00 AM" (in viewer's timezone)
  displayDate: string;  // "Jan 5, 2025" (for reference)
}

/**
 * Generates available time slots for a given date
 * 
 * @param date - The date to check (e.g., new Date('2025-01-05'))
 * @param workingHours - Array of working hours for all days
 * @param existingBookings - Array of existing bookings (in UTC)
 * @param slotDuration - Duration of each slot in minutes (default: 30)
 * @param userTimezone - Timezone of the person offering appointments
 * @param viewerTimezone - Timezone of the person viewing/booking
 * @returns Array of available time slots
 */
export function generateAvailableSlots(
  date: Date,
  workingHours: WorkingHours[],
  existingBookings: Booking[],
  slotDuration: number = 30,
  userTimezone: string,
  viewerTimezone: string
): TimeSlot[] {
  
  // STEP 1: Get day of week (0 = Sunday, 6 = Saturday)
  const dayOfWeek = date.getDay();
  
  // Find working hours configuration for this specific day
  const dayHours = workingHours.find(wh => wh.dayOfWeek === dayOfWeek);
  
  // If no working hours defined for this day, return empty array
  if (!dayHours) {
    return []; // Not a working day
  }

  console.log(`📅 Checking ${date.toDateString()} (Day ${dayOfWeek})`);
  console.log(`⏰ Working hours: ${dayHours.startTime} - ${dayHours.endTime}`);

  // STEP 2: Parse the time strings ("09:00" -> hour: 9, minute: 0)
  const [startHour, startMin] = dayHours.startTime.split(':').map(Number);
  const [endHour, endMin] = dayHours.endTime.split(':').map(Number);
  
  // Create Date objects for the start and end of the work day
  // We use the date provided and set the time
  const workStart = new Date(date);
  workStart.setHours(startHour, startMin, 0, 0); // 9:00:00.000
  
  const workEnd = new Date(date);
  workEnd.setHours(endHour, endMin, 0, 0);       // 17:00:00.000

  console.log(`🕐 Work start (local): ${workStart.toLocaleString()}`);
  console.log(`🕔 Work end (local): ${workEnd.toLocaleString()}`);

  // STEP 3: Convert to UTC for consistent comparison
  // This is CRITICAL for timezone handling
  // fromZonedTime converts "9 AM in New York" to UTC timestamp
  const workStartUTC = fromZonedTime(workStart, userTimezone);
  const workEndUTC = fromZonedTime(workEnd, userTimezone);

  console.log(`🌍 Work start (UTC): ${workStartUTC.toISOString()}`);
  console.log(`🌍 Work end (UTC): ${workEndUTC.toISOString()}`);

  // STEP 4: Generate all possible time slots
  const allSlots: TimeSlot[] = [];
  let currentSlotStart = workStartUTC;

  // Loop through work day, creating slots
  while (currentSlotStart < workEndUTC) {
    const slotEnd = addMinutes(currentSlotStart, slotDuration);
    
    // Only add slot if it fits completely within work hours
    if (slotEnd <= workEndUTC) {
      // Convert to viewer's timezone for display
      const displayStart = toZonedTime(currentSlotStart, viewerTimezone);
      
      allSlots.push({
        start: currentSlotStart,              // UTC for database
        end: slotEnd,                         // UTC for database
        displayTime: format(displayStart, 'h:mm a'),  // "9:00 AM"
        displayDate: format(displayStart, 'MMM d, yyyy') // "Jan 5, 2025"
      });
    }
    
    // Move to next slot
    currentSlotStart = slotEnd;
  }

  console.log(`📊 Generated ${allSlots.length} total slots`);

  // STEP 5: Filter out slots that overlap with existing bookings
  const availableSlots = allSlots.filter(slot => {
    // Check if this slot overlaps with any booking
    const isBooked = existingBookings.some(booking => {
      // A slot is booked if:
      // - Slot starts during a booking
      // - Slot ends during a booking
      // - Slot completely contains a booking
      return (
        (slot.start >= booking.startTime && slot.start < booking.endTime) ||
        (slot.end > booking.startTime && slot.end <= booking.endTime) ||
        (slot.start <= booking.startTime && slot.end >= booking.endTime)
      );
    });

    return !isBooked; // Keep slots that are NOT booked
  });

  console.log(`✅ Available slots: ${availableSlots.length}`);
  console.log(`❌ Booked slots: ${allSlots.length - availableSlots.length}`);

  return availableSlots;
}
