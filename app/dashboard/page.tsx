'use client';

import { Calendar, Clock, Link as LinkIcon, CheckCircle2, XCircle, Copy, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/hosts');
        const data = await res.json();
        if (data.length > 0) {
          const userRes = await fetch(`/api/availability?slug=${data[0].slug}`);
          const userData = await userRes.json();
          setUser({ ...data[0], ...userData });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Redirect to main page after loading
  useEffect(() => {
    if (!loading && user) {
      window.location.href = '/';
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h1 className="text-3xl font-black text-slate-900 mb-4">No user found</h1>
          <p className="text-slate-600 mb-8 font-medium">Please run the seed script or sign up to create your account.</p>
          <Link href="/signup" className="inline-flex px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  const bookingLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/${user.slug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-slate-900 mb-2"
          >
            Welcome back, {user.name.split(' ')[0]}! 👋
          </motion.h1>
          <p className="text-slate-500 font-medium">Here's what's happening with your bookings today.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-1.5 flex items-center gap-2 shadow-sm">
            <div className="px-4 py-2 text-sm font-bold text-slate-600 truncate max-w-[200px]">
              {user.slug}
            </div>
            <button 
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                copied ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
          <Link 
            href={`/${user.slug}`}
            target="_blank"
            className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Total Bookings', value: user.bookings?.length || 0, icon: Calendar, color: 'bg-blue-500' },
          { label: 'Upcoming Today', value: user.bookings?.filter((b: any) => format(new Date(b.startTime), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')).length || 0, icon: Clock, color: 'bg-indigo-500' },
          { label: 'Active Links', value: '1', icon: LinkIcon, color: 'bg-purple-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">Upcoming Bookings</h2>
          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">View all</button>
        </div>
        
        <div className="divide-y divide-slate-50">
          {user.bookings && user.bookings.length > 0 ? (
            user.bookings.map((booking: any, i: number) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <span className="text-xs font-black uppercase">{format(new Date(booking.startTime), 'MMM')}</span>
                    <span className="text-lg font-black leading-none">{format(new Date(booking.startTime), 'dd')}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{booking.attendeeName}</h3>
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {format(new Date(booking.startTime), 'h:mm a')}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>30 min meeting</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-200">
                    Reschedule
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No bookings yet</h3>
              <p className="text-slate-500 font-medium mb-8">Share your link to start receiving bookings.</p>
              <button 
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
              >
                <Copy className="w-4 h-4" />
                Copy Booking Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

