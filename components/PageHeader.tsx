'use client';

import { motion } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function PageHeader() {
  return (
    <div className="max-w-6xl mx-auto mb-16 text-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-200/50 shadow-sm backdrop-blur-sm mb-8"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center">
          <CalendarIcon className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-slate-900">Smart Scheduling Platform</span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight"
      >
        Book Your Perfect <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">Meeting</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-10"
      >
        Connect with expert mentors instantly. No more scheduling conflicts, just seamless meetings.
      </motion.p>
    </div>
  );
}
