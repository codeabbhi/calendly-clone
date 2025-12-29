'use client';

import { motion } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function PageFooter() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-12 text-center"
    >
      <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-white to-indigo-50 rounded-full border border-slate-100 shadow-sm backdrop-blur-sm hover:shadow-md transition-shadow">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Powered by</span>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-md flex items-center justify-center">
            <CalendarIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">CalSync</span>
        </div>
      </div>
    </motion.div>
  );
}
