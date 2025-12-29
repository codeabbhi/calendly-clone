'use client';

import { Clock, Plus, Trash2, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const res = await fetch('/api/hosts');
        const hosts = await res.json();
        if (hosts.length > 0) {
          const availRes = await fetch(`/api/availability?slug=${hosts[0].slug}`);
          const data = await availRes.json();
          setAvailability(data.availability || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Availability</h1>
          <p className="text-slate-500 font-medium">Set your weekly recurring schedule.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          onClick={() => {}}
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {DAYS.map((day, i) => {
            const dayAvail = availability.find(a => a.dayOfWeek === day);
            return (
              <motion.div 
                key={day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 font-bold">
                    {day.charAt(0)}
                  </div>
                  <span className="text-xl font-bold text-slate-900 w-32">{day}</span>
                </div>

                <div className="flex-1 flex items-center gap-4 justify-end">
                  {dayAvail ? (
                    <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
                      <input 
                        type="time" 
                        defaultValue={dayAvail.startTime}
                        className="px-3 py-2 rounded-xl bg-slate-50 border-none font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                      />
                      <span className="text-slate-400 font-bold">-</span>
                      <input 
                        type="time" 
                        defaultValue={dayAvail.endTime}
                        className="px-3 py-2 rounded-xl bg-slate-50 border-none font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                      />
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors">
                      <Plus className="w-5 h-5" />
                      Unavailable
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
