import { prisma } from '@/lib/prisma';
import BookingInterface from '@/components/BookingInterface';
import { redirect } from 'next/navigation';
import { Calendar } from 'lucide-react';

// This is a server component that checks authentication
export default async function HomePage() {
  // For now, we'll assume the main host is the seeded user
  // In a real app, you'd check authentication here
  const user = await prisma.user.findFirst({
    include: {
      mentors: {
        select: {
          id: true,
          name: true,
          title: true,
          bio: true,
        }
      }
    }
  });

  if (!user) {
    // If no user exists, redirect to signup
    redirect('/signup');
  }

  // Transform mentors to handle null bio values
  const mentorsData = user.mentors.map(m => ({
    ...m,
    bio: m.bio || undefined
  }));

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto">
        <BookingInterface user={user} mentors={mentorsData} />

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Powered by</span>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-indigo-600 rounded-md flex items-center justify-center">
                <Calendar className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-bold text-slate-900">CalSync</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

