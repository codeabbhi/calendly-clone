'use client';

import { User, Mail, Globe, Shield, Bell, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-500 font-medium">Manage your account and preferences.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <User className="w-6 h-6 text-indigo-600" />
              Profile Information
            </h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Booking Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">calsync.com/</span>
                <input 
                  type="text" 
                  placeholder="johndoe"
                  className="flex-1 px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <Globe className="w-6 h-6 text-indigo-600" />
              Preferences
            </h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Bell className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Email Notifications</p>
                  <p className="text-sm text-slate-500 font-medium">Receive alerts for new bookings</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
