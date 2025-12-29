import nodemailer from 'nodemailer';
import { createEvent } from 'ics';
import { format } from 'date-fns';

// Email configuration from environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Test email configuration
export async function testEmailConfig() {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return false;
  }
}

// Booking data type
interface BookingEmailData {
  id: string;
  attendeeName: string;
  attendeeEmail: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  user: {
    name: string;
    email: string;
  };
}

/**
 * Sends booking confirmation email with calendar invite
 */
export async function sendBookingConfirmation(booking: BookingEmailData) {
  try {
    console.log('📧 Preparing confirmation email...');
    console.log('   To:', booking.attendeeEmail);
    console.log('   Meeting:', booking.startTime.toLocaleString());

    // Create ICS calendar event
    const event = {
      start: [
        booking.startTime.getUTCFullYear(),
        booking.startTime.getUTCMonth() + 1,
        booking.startTime.getUTCDate(),
        booking.startTime.getUTCHours(),
        booking.startTime.getUTCMinutes(),
      ] as [number, number, number, number, number],
      end: [
        booking.endTime.getUTCFullYear(),
        booking.endTime.getUTCMonth() + 1,
        booking.endTime.getUTCDate(),
        booking.endTime.getUTCHours(),
        booking.endTime.getUTCMinutes(),
      ] as [number, number, number, number, number],
      title: `Meeting with ${booking.user.name}`,
      description: `You have a scheduled meeting with ${booking.user.name}`,
      location: 'Video Call',
      status: 'CONFIRMED' as const,
      busyStatus: 'BUSY' as const,
      organizer: { 
        name: booking.user.name, 
        email: booking.user.email 
      },
      attendees: [
        { 
          name: booking.attendeeName, 
          email: booking.attendeeEmail,
          rsvp: true
        }
      ],
    };

    // Generate ICS file
    const { error, value } = createEvent(event);
    
    if (error) {
      console.error('❌ ICS generation error:', error);
      throw new Error('Failed to create calendar invite');
    }

    // Format date and time for email
    const formattedDate = format(booking.startTime, 'EEEE, MMMM d, yyyy');
    const formattedTime = format(booking.startTime, 'h:mm a');
    const formattedEndTime = format(booking.endTime, 'h:mm a');

    // HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .card {
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #4CAF50;
              margin: 0;
            }
            .details {
              background: #f5f5f5;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .details p {
              margin: 10px 0;
            }
            .details strong {
              color: #555;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #777;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #4CAF50;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">
                <h1>✅ Booking Confirmed!</h1>
              </div>
              
              <p>Hi ${booking.attendeeName},</p>
              
              <p>Your appointment has been confirmed with <strong>${booking.user.name}</strong>.</p>
              
              <div class="details">
                <p><strong>📅 Date:</strong> ${formattedDate}</p>
                <p><strong>🕐 Time:</strong> ${formattedTime} - ${formattedEndTime} (${booking.timezone})</p>
                <p><strong>👤 With:</strong> ${booking.user.name}</p>
                <p><strong>📧 Email:</strong> ${booking.user.email}</p>
              </div>
              
              <p>A calendar invite has been attached to this email. Simply open the attachment to add this event to your calendar.</p>
              
              <div class="footer">
                <p>Booking ID: ${booking.id}</p>
                <p>If you need to reschedule or cancel, please contact ${booking.user.email}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Plain text version
    const textContent = `
Booking Confirmed!

Hi ${booking.attendeeName},

Your appointment has been confirmed with ${booking.user.name}.

Date: ${formattedDate}
Time: ${formattedTime} - ${formattedEndTime} (${booking.timezone})
With: ${booking.user.name}
Email: ${booking.user.email}

A calendar invite is attached to this email.

Booking ID: ${booking.id}
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Appointment System" <${process.env.SMTP_FROM}>`,
      to: booking.attendeeEmail,
      subject: `Booking Confirmed: ${formattedDate} at ${formattedTime}`,
      text: textContent,
      html: htmlContent,
      icalEvent: {
        method: 'REQUEST',
        content: value,
      },
    });

    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', info.messageId);
    
    return true;

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
}