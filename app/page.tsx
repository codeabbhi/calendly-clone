import Link from "next/link";
import { Calendar, Clock, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="px-6 py-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Calendar className="w-8 h-8 text-indigo-600" />
          <span className="text-xl font-bold tracking-tight">CalSync</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
        </nav>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            Get started
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="px-6 py-24 md:py-32 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Scheduling <span className="text-indigo-600">simplified</span>.
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            CalSync helps you schedule meetings without the back-and-forth emails. 
            Share your link and let people book a time that works for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              Browse Hosts & Book
            </Link>
            <Link href="#demo" className="px-8 py-4 text-lg font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">
              View demo
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">No credit card required.</p>
        </section>

        {/* Features */}
        <section id="features" className="bg-gray-50 py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to book more meetings</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Powerful features to help you manage your time and grow your business.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Booking</h3>
                <p className="text-gray-600">Let clients book appointments instantly from your personalized booking page.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <Clock className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Availability Sync</h3>
                <p className="text-gray-600">Sync with your existing calendars to ensure you're never double-booked.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
                <p className="text-gray-600">Your data is encrypted and we never share your calendar details with anyone.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <span className="text-lg font-bold tracking-tight">CalSync</span>
          </div>
          <p className="text-gray-500 text-sm">© 2025 CalSync Inc. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
