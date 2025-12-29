'use client';

import { Calendar, Clock, Settings, User as UserIcon, Bell, Search, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Bookings', href: '/dashboard', icon: Calendar },
    { name: 'Availability', href: '/dashboard/availability', icon: Clock },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
            CalSync
          </span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all group ${
                  isActive 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`} />
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 font-bold text-indigo-600 shadow-sm">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">John Doe</p>
              <p className="text-xs font-medium text-slate-500 truncate">Pro Plan</p>
            </div>
            <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search bookings..." 
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              Create
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
