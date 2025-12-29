'use client';

import { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  slug: string;
  email: string;
  timezone: string;
}

export default function BookPage() {
  const [hosts, setHosts] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const res = await fetch('/api/hosts');
        const data = await res.json();
        setHosts(data.hosts || []);
      } catch (error) {
        console.error('Failed to fetch hosts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHosts();
  }, []);

  const filteredHosts = hosts.filter(host =>
    host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    host.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold tracking-tight">CalSync</span>
            </div>
            <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Find & Book Your Next Meeting
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse available hosts and schedule a time that works for everyone.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg"
            />
          </div>
        </div>

        {/* Hosts Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredHosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHosts.map((host) => (
              <div
                key={host.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all duration-200"
              >
                {/* Host Card Header */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">
                      {host.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{host.name}</h3>
                      <p className="text-sm text-gray-500">{host.email}</p>
                    </div>
                  </div>

                  {/* Host Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>30 min meetings</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{host.timezone}</span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Link
                    href={`/${host.slug}`}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                  >
                    Book Now
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No hosts found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchQuery ? 'Try adjusting your search' : 'No hosts available at the moment'}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2025 CalSync Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
