import { prisma } from '@/lib/prisma';
import BookingInterface from '@/components/BookingInterface';
import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';
import { redirect } from 'next/navigation';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute top-[50%] right-[-5%] w-[30%] h-[30%] rounded-full bg-purple-100/30 blur-[100px]" />
      </div>

      <PageHeader />

      <div className="max-w-6xl mx-auto">
        <BookingInterface user={user} mentors={mentorsData} />
        <PageFooter />
      </div>
    </div>
  );
}

