import { NextResponse } from 'next/server';
import { testEmailConfig, sendBookingConfirmation } from '@/lib/email';
import { addDays } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testEmail = searchParams.get('email');

  try {
    // Test 1: Check email configuration
    console.log('🧪 Testing email configuration...');
    const configOk = await testEmailConfig();
    
    if (!configOk) {
      return NextResponse.json({
        success: false,
        error: 'Email configuration is invalid. Check your .env file.'
      }, { status: 500 });
    }

    // Test 2: Send test email
    if (testEmail) {
      console.log('📧 Sending test email to:', testEmail);
      
      const tomorrow = addDays(new Date(), 1);
      tomorrow.setHours(14, 0, 0, 0);
      const endTime = addDays(tomorrow, 0);
      endTime.setHours(14, 30, 0, 0);

      await sendBookingConfirmation({
        id: 'test-booking-123',
        attendeeName: 'Test User',
        attendeeEmail: testEmail,
        startTime: tomorrow,
        endTime: endTime,
        timezone: 'America/New_York',
        user: {
          name: 'John Doe',
          email: process.env.SMTP_USER || 'noreply@example.com'
        }
      });

      return NextResponse.json({
        success: true,
        message: `Test email sent to ${testEmail}. Check your inbox!`
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Email configuration is valid',
      info: 'Add ?email=your@email.com to send a test email'
    });

  } catch (error) {
    console.error('Email test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Email test failed'
    }, { status: 500 });
  }
}
