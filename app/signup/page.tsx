'use client';

import { useState } from 'react';
import { Calendar, Mail, User, Zap, ArrowRight, CheckCircle, Globe, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/dashboard?slug=${data.slug}`);
      } else {
        // If user already exists, redirect to login page
        if (data.userExists) {
          router.push('/login?existing=true');
        } else {
          setError(data.error || 'Failed to create account');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col lg:flex-row">
      {/* Left Side: Branding & Info */}
      <div className="lg:w-[45%] bg-slate-900 p-12 lg:p-24 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-500 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500 blur-[120px]" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-20">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-black tracking-tight text-white">CalSync</span>
          </Link>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-black text-white mb-8 leading-[1.1]"
          >
            Start your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
              journey today.
            </span>
          </motion.h1>
          <p className="text-xl text-slate-400 font-medium max-w-md leading-relaxed">
            Join 10,000+ professionals who have simplified their scheduling and reclaimed their time.
          </p>
        </div>

        <div className="relative z-10 space-y-8">
          {[
            { icon: <CheckCircle className="w-6 h-6 text-indigo-400" />, text: "Personalized booking page" },
            { icon: <Globe className="w-6 h-6 text-blue-400" />, text: "Automatic timezone detection" },
            { icon: <Shield className="w-6 h-6 text-purple-400" />, text: "Secure calendar integration" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="flex items-center gap-4 text-white font-bold"
            >
              {item.icon}
              <span>{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Create Account</h2>
            <p className="text-slate-500 font-bold">Enter your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none font-bold transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none font-bold transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Timezone</label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none font-bold transition-all shadow-sm appearance-none"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Asia/Dubai">Dubai</option>
                <option value="Australia/Sydney">Sydney</option>
              </select>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-2 border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:bg-slate-300 flex items-center justify-center gap-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-bold">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-600 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

