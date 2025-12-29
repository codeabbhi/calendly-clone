import { prisma } from '@/lib/prisma';
import { Calendar, Clock, Link as LinkIcon, Settings, User as UserIcon, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function DashboardPage() {
  // For demo purposes, we'll just take the first user in the database
  // In a real app, this would be the logged-in user
  const user = await prisma.user.findFirst({
    include: {
      bookings: {
        orderBy: { startTime: 'asc' },
        where: { startTime: { gte: new Date() } }
      },
      workingHours: true
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No user found</h1>
          <p className="text-gray-600 mb-8">Please run the seed script to create a demo user.</p>
          <code className="bg-gray-100 p-2 rounded">npm run test:db</code>
        </div>
      </div>
    );
  }

  const bookingLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${user.slug}`;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2 border-b">
          <Calendar className="w-8 h-8 text-indigo-600" />
          <span className="text-xl font-bold tracking-tight">CalSync</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-indigo-600 bg-indigo-50 rounded-lg font-medium">
            <Calendar className="w-5 h-5" />
            Bookings
          </Link>
          <Link href="/dashboard/availability" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
            <Clock className="w-5 h-5" />
            Availability
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-500">Manage your upcoming appointments</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium text-gray-600">
                <LinkIcon className="w-4 h-4" />
                <span className="truncate max-w-[200px]">{bookingLink}</span>
              </div>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                Copy Link
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{user.bookings.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Upcoming Today</p>
              <p className="text-3xl font-bold text-gray-900">
                {user.bookings.filter(b => format(b.startTime, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')).length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Active Link</p>
              <div className="flex items-center gap-2 text-green-600 font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Live</span>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-bold text-gray-900">Upcoming Appointments</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {user.bookings.length > 0 ? (
                user.bookings.map((booking) => (
                  <div key={booking.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-600">
                        <span className="text-xs font-bold uppercase">{format(booking.startTime, 'MMM')}</span>
                        <span className="text-lg font-bold leading-none">{format(booking.startTime, 'd')}</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{booking.attendeeName}</p>
                        <p className="text-sm text-gray-500">{booking.attendeeEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{format(booking.startTime, 'h:mm a')}</p>
                        <p className="text-xs text-gray-500">30 mins</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500">No upcoming bookings found.</p>
                  <Link href={`/${user.slug}`} className="text-indigo-600 font-medium hover:underline mt-2 inline-block">
                    Share your booking link to get started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
