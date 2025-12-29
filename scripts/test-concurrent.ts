import { createBooking } from '@/app/api/actions/booking';
import { addDays } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { prisma } from '../lib/prisma.js'

async function testConcurrentBookings() {
  console.log('🧪 Testing concurrent booking protection...\n');
  
  // Get the first mentor
  const mentor = await prisma.mentor.findFirst();
  if (!mentor) {
    console.error('❌ No mentors available');
    process.exit(1);
  }
  
  // Same time slot for both requests
  const tomorrow = addDays(new Date(), 1);
  tomorrow.setHours(15, 0, 0, 0); // 3:00 PM
  const startTime = fromZonedTime(tomorrow, 'America/New_York');
  
  // Fire both requests at the EXACT same time
  const [result1, result2] = await Promise.all([
    createBooking({
      userId: 'cmjphlfnx00003wbgqrdpmyds',
      mentorId: mentor.id,
      attendeeName: 'Alice',
      attendeeEmail: 'alice@example.com',
      startTime,
      slotDuration: 30,
      attendeeTimezone: 'America/New_York'
    }),
    createBooking({
      userId: 'cmjphlfnx00003wbgqrdpmyds',
      mentorId: mentor.id,
      attendeeName: 'Bob',
      attendeeEmail: 'bob@example.com',
      startTime,
      slotDuration: 30,
      attendeeTimezone: 'America/New_York'
    })
  ]);
  
  console.log('👤 Alice:', result1.success ? '✅ BOOKED' : '❌ FAILED');
  console.log('   ', result1.success ? `ID: ${result1.bookingId}` : `Error: ${result1.error}`);
  
  console.log('\n👤 Bob:', result2.success ? '✅ BOOKED' : '❌ FAILED');
  console.log('   ', result2.success ? `ID: ${result2.bookingId}` : `Error: ${result2.error}`);
  
  // Check results
  const successCount = [result1, result2].filter(r => r.success).length;
  
  console.log('\n' + '='.repeat(50));
  if (successCount === 1) {
    console.log('✅ TEST PASSED: Exactly ONE booking succeeded');
    console.log('   Double-booking prevention is working!');
  } else if (successCount === 2) {
    console.log('❌ TEST FAILED: BOTH bookings succeeded!');
    console.log('   This is a double-booking bug!');
  } else {
    console.log('⚠️  TEST INCONCLUSIVE: Both bookings failed');
  }
  console.log('='.repeat(50));
}

testConcurrentBookings()
  .catch(console.error)
  .finally(() => process.exit(0));
