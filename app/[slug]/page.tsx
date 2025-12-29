import { prisma } from '@/lib/prisma';
import BookingInterface from '@/components/BookingInterface';
import { notFound } from 'next/navigation';
import { Calendar } from 'lucide-react';

export default async function BookingPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  const user = await prisma.user.findUnique({
    where: { slug: slug },
    select: {
      id: true,
      name: true,
      slug: true,
      timezone: true,
    }
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="md:flex">
            {/* Left Side: User Info */}
            <div className="md:w-1/3 bg-white p-8 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="flex items-center gap-2 mb-8">
                <Calendar className="w-6 h-6 text-indigo-600" />
                <span className="text-lg font-bold tracking-tight">CalSync</span>
              </div>
              
              <div className="mb-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold mb-4">
                  {user.name.charAt(0)}
                </div>
                <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500">30 Minute Meeting</p>
              </div>

              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>30 min</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.065M15 20.288E" />
                    </svg>
                  </div>
                  <span>{user.timezone}</span>
                </div>
              </div>
            </div>

            {/* Right Side: Booking Interface */}
            <div className="md:w-2/3 p-8">
              <BookingInterface user={user} />
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by <span className="font-bold text-gray-700">CalSync</span>
          </p>
        </div>
      </div>
    </div>
  );
}