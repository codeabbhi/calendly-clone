'use client';

import { useState, useEffect } from 'react';
import { format, addDays, startOfDay } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ChevronLeft, ChevronRight, Clock, Globe } from 'lucide-react';

interface TimeSlot {
  start: Date;
  end: Date;
  displayTime: string;
  displayDate: string;
}

interface BookingInterfaceProps {
  user: {
    id: string;
    name: string;
    slug: string;
    timezone: string;
  };
}

export default function BookingInterface({ user }: BookingInterfaceProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'date' | 'form' | 'success'>('date');

  // Fetch slots when date changes
  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setLoading(true);
    
    try {
      const response = await fetch(`/api/availability?userId=${user.id}&date=${date.toISOString()}&viewerTimezone=${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
      const data = await response.json();
      setSlots(data.slots || []);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    handleDateSelect(selectedDate);
  }, []);

  if (step === 'success') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-8">A calendar invitation has been sent to your email.</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-indigo-600 font-medium hover:text-indigo-500"
        >
          Book another appointment
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Calendar Section */}
      <div className="flex-1">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={{ before: new Date() }}
          className="border rounded-lg p-4 shadow-sm mx-auto"
          modifiersClassNames={{
            selected: 'bg-indigo-600 text-white hover:bg-indigo-700',
            today: 'text-indigo-600 font-bold'
          }}
        />
      </div>

      {/* Time Slots Section */}
      <div className="w-full md:w-64">
        <h3 className="font-medium text-gray-900 mb-4">
          {selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'Select a date'}
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : slots.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2">
            {slots.map((slot, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedSlot(slot);
                  setStep('form');
                }}
                className="w-full py-3 px-4 border border-indigo-100 rounded-lg text-indigo-600 font-semibold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-center shadow-sm"
              >
                {slot.displayTime}
              </button>
            ))}
          </div>
        ) : selectedDate ? (
          <p className="text-gray-500 text-center py-8">No availability on this day.</p>
        ) : null}
      </div>

      {/* Booking Form Modal (Simplified for now) */}
      {step === 'form' && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Confirm Booking</h2>
              <button onClick={() => setStep('date')} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6 space-y-2">
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>30 min</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Globe className="w-4 h-4 mr-2" />
                <span>{selectedSlot.displayTime}, {selectedSlot.displayDate}</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              setLoading(true);
              
              try {
                const res = await fetch('/api/create-booking', {
                  method: 'POST',
                  body: JSON.stringify({
                    userId: user.id,
                    attendeeName: formData.get('name'),
                    attendeeEmail: formData.get('email'),
                    startTime: selectedSlot.start,
                    slotDuration: 30,
                    attendeeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                  })
                });
                
                const result = await res.json();
                if (result.success) {
                  setStep('success');
                } else {
                  alert(result.error || 'Booking failed');
                }
              } catch (err) {
                alert('An error occurred');
              } finally {
                setLoading(false);
              }
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input required name="name" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input required name="email" type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <button 
                disabled={loading}
                type="submit" 
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:bg-indigo-400 disabled:shadow-none"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
