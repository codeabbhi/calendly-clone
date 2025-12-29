'use client';

import { useState, Suspense } from 'react';
import { Calendar, Mail, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const isExistingUser = searchParams.get('existing') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/');
      } else {
        setError(data.error || 'Failed to login');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col lg:flex-row">
      {/* Left Side: Branding */}
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
            Welcome <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
              back.
            </span>
          </motion.h1>
          <p className="text-xl text-slate-400 font-medium max-w-md leading-relaxed">
            Access your dashboard and manage your availability with ease.
          </p>
        </div>

        <div className="relative z-10">
          <div className="p-8 bg-white/5 backdrop-blur-lg rounded-[2.5rem] border border-white/10">
            <p className="text-white font-bold mb-4 italic">"CalSync has completely transformed how I handle my client meetings. It's seamless and professional."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700" />
              <div>
                <p className="text-white font-bold text-sm">Sarah Jenkins</p>
                <p className="text-slate-500 text-xs font-bold">Freelance Designer</p>
              </div>
            </div>
          </div>
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
            <h2 className="text-4xl font-black text-slate-900 mb-4">Login</h2>
            {isExistingUser ? (
              <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                <CheckCircle2 className="w-5 h-5" />
                <span>Account found! Please login.</span>
              </div>
            ) : (
              <p className="text-slate-500 font-bold">Enter your email to access your account</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none font-bold transition-all shadow-sm"
                />
              </div>
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
              {loading ? 'Logging in...' : 'Login'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-bold">
              Don't have an account?{' '}
              <Link href="/signup" className="text-indigo-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

