'use client';

import { useState, useEffect } from 'react';
import { format, addDays, startOfDay } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ChevronLeft, ChevronRight, Clock, Globe, Calendar as CalendarIcon, CheckCircle2, ArrowRight, User, Mail, MessageSquare, Phone, Building, Users, Video, Phone as PhoneIcon, MapPin, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeSlot {
  start: Date;
  end: Date;
  displayTime: string;
  displayDate: string;
}

interface Mentor {
  id: string;
  name: string;
  title: string;
  bio?: string;
}

interface BookingInterfaceProps {
  user: {
    id: string;
    name: string;
    slug: string;
    timezone: string;
  };
  mentors: Mentor[];
}

export default function BookingInterface({ user, mentors }: BookingInterfaceProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(mentors[0] || null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'mentor' | 'duration' | 'date' | 'form' | 'success'>('mentor');
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    company: '',
    additionalGuests: [] as string[],
    meetingType: 'video' as 'video' | 'phone' | 'in-person',
    meetingLocation: '',
    meetingTitle: '',
    notes: '' 
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch slots when date changes
  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setLoading(true);
    setSelectedSlot(null);
    
    try {
      const response = await fetch(`/api/availability?userId=${user.id}&date=${date.toISOString()}&viewerTimezone=${Intl.DateTimeFormat().resolvedOptions().timeZone}&duration=${selectedDuration}`);
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

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedMentor) return;
    
    setBookingLoading(true);
    try {
      const res = await fetch('/api/create-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          mentorId: selectedMentor.id,
          attendeeName: formData.name,
          attendeeEmail: formData.email,
          attendeePhone: formData.phone,
          attendeeCompany: formData.company,
          additionalGuests: formData.additionalGuests,
          meetingType: formData.meetingType,
          meetingLocation: formData.meetingLocation,
          meetingTitle: formData.meetingTitle,
          notes: formData.notes,
          startTime: selectedSlot.start,
          slotDuration: selectedDuration,
          attendeeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      if (res.ok) {
        setStep('success');
      } else {
        const error = await res.json();
        console.error('Booking failed:', error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 px-6"
      >
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4">You're all set!</h2>
        <p className="text-xl text-slate-500 mb-8 font-medium max-w-md mx-auto">
          A calendar invitation has been sent to <span className="text-indigo-600 font-bold">{formData.email}</span>
          {formData.additionalGuests.length > 0 && (
            <span> and {formData.additionalGuests.length} other guest{formData.additionalGuests.length > 1 ? 's' : ''}</span>
          )}
        </p>
        
        <div className="bg-white rounded-3xl p-6 mb-8 shadow-lg border border-slate-100 max-w-md mx-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-black text-slate-900">{selectedSlot ? format(selectedSlot.start, 'EEEE, MMM d') : ''}</p>
                <p className="text-slate-500 font-bold">{selectedSlot ? format(selectedSlot.start, 'h:mm a') : ''}</p>
              </div>
            </div>
            
            {selectedMentor && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-black text-slate-900">{selectedMentor.name}</p>
                  <p className="text-slate-500 font-bold">{selectedMentor.title}</p>
                </div>
              </div>
            )}
            
            {formData.meetingType && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  {formData.meetingType === 'video' && <Video className="w-5 h-5 text-indigo-600" />}
                  {formData.meetingType === 'phone' && <PhoneIcon className="w-5 h-5 text-indigo-600" />}
                  {formData.meetingType === 'in-person' && <MapPin className="w-5 h-5 text-indigo-600" />}
                </div>
                <div>
                  <p className="font-black text-slate-900 capitalize">{formData.meetingType} Meeting</p>
                  {formData.meetingLocation && (
                    <p className="text-slate-500 font-bold text-sm">{formData.meetingLocation}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
        >
          Book another appointment
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 overflow-hidden max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar: Info */}
        <div className="lg:w-80 p-10 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">CalSync</span>
          </div>
          
          <div className="space-y-8">
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Host</p>
              <h2 className="text-2xl font-black text-slate-900">{user.name}</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600 font-bold">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <span>{selectedDuration} Minute Meeting</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-bold">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                  <Globe className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-sm">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
              </div>
            </div>

            {selectedSlot && step === 'form' && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-100"
              >
                <p className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-2">Selected Time</p>
                <p className="text-lg font-black">{format(selectedSlot.start, 'EEEE, MMM d')}</p>
                <p className="text-2xl font-black">{format(selectedSlot.start, 'h:mm a')}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Content: Mentor/Date/Time or Form */}
        <div className="flex-1 p-10">
          <AnimatePresence mode="wait">
            {step === 'mentor' ? (
              <motion.div 
                key="mentor-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h3 className="text-3xl font-black text-slate-900 mb-8">Select a Mentor</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mentors.map((mentor, i) => (
                    <motion.button
                      key={mentor.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => {
                        setSelectedMentor(mentor);
                        setStep('duration');
                      }}
                      className={`p-6 rounded-3xl transition-all transform hover:scale-105 ${
                        selectedMentor?.id === mentor.id
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 border-2 border-indigo-600'
                          : 'bg-white border-2 border-slate-200 text-slate-900 hover:border-indigo-600'
                      }`}
                    >
                      <div className="flex items-center gap-4 justify-between">
                        <div className="text-left flex-1">
                          <h4 className="text-lg font-black mb-1">{mentor.name}</h4>
                          <p className={`text-sm font-bold mb-2 ${selectedMentor?.id === mentor.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                            {mentor.title}
                          </p>
                          {mentor.bio && (
                            <p className={`text-xs font-medium ${selectedMentor?.id === mentor.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                              {mentor.bio}
                            </p>
                          )}
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          selectedMentor?.id === mentor.id
                            ? 'bg-white text-indigo-600'
                            : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          <User className="w-6 h-6" />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : step === 'duration' ? (
              <motion.div 
                key="duration-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h3 className="text-3xl font-black text-slate-900 mb-8">Select Meeting Duration</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[15, 30, 45, 60].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setSelectedDuration(duration)}
                      className={`p-6 rounded-3xl transition-all transform hover:scale-105 ${
                        selectedDuration === duration
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                          : 'bg-white border-2 border-slate-200 text-slate-900 hover:border-indigo-600'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl font-black mb-1">{duration}</div>
                        <div className="text-sm font-bold opacity-80">minutes</div>
                      </div>
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => {
                    setStep('date');
                    setSelectedDate(new Date());
                  }}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  Continue to Scheduling
                </button>
              </motion.div>
            ) : step === 'date' ? (
              <motion.div 
                key="date-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col md:flex-row gap-10"
              >
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-slate-900 mb-8">Select a Date</h3>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={{ before: new Date() }}
                    className="mx-auto custom-daypicker"
                  />
                </div>

                <div className="w-full md:w-72">
                  <h3 className="text-2xl font-black text-slate-900 mb-8">
                    {selectedDate ? format(selectedDate, 'MMM d') : 'Select Date'}
                  </h3>
                  
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-400 font-bold text-sm">Finding slots...</p>
                      </div>
                    ) : slots.length > 0 ? (
                      slots.map((slot, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedSlot(slot)}
                          className={`w-full py-4 px-6 rounded-2xl font-black transition-all flex items-center justify-between group ${
                            selectedSlot === slot 
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                              : 'bg-white border-2 border-slate-100 text-slate-700 hover:border-indigo-600 hover:text-indigo-600'
                          }`}
                        >
                          {slot.displayTime}
                          {selectedSlot === slot ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setStep('form');
                              }}
                              className="bg-white text-indigo-600 px-4 py-1.5 rounded-xl text-sm font-black animate-in fade-in slide-in-from-right-2"
                            >
                              Next
                            </button>
                          ) : (
                            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-20">
                        <p className="text-slate-400 font-bold">No slots available</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : step === 'form' ? (
              <motion.div 
                key="form-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto"
              >
                <button 
                  onClick={() => setStep('date')}
                  className="flex items-center gap-2 text-slate-400 font-bold hover:text-indigo-600 transition-colors mb-8"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to Calendar
                </button>
                
                <h3 className="text-3xl font-black text-slate-900 mb-8">Enter Details</h3>
                
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none font-bold transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none font-bold transition-all"
                      />
                    </div>
                  <div className="space-y-2">                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Additional Guests (Optional)</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <textarea
                        rows={2}
                        value={formData.additionalGuests.join('\n')}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          additionalGuests: e.target.value.split('\n').filter(email => email.trim()) 
                        })}
                        placeholder="guest1@example.com&#10;guest2@example.com"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none font-bold transition-all resize-none"
                      />
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Enter one email per line</p>
                  </div>

                  <div className="space-y-2">                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Phone Number (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none font-bold transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Company/Organization (Optional)</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Acme Corp"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none font-bold transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Meeting Type</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { type: 'video', label: 'Video Call', icon: Video },
                        { type: 'phone', label: 'Phone Call', icon: PhoneIcon },
                        { type: 'in-person', label: 'In Person', icon: MapPin }
                      ].map(({ type, label, icon: Icon }) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, meetingType: type as any })}
                          className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                            formData.meetingType === type
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-600'
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-sm font-bold">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {(formData.meetingType === 'video' || formData.meetingType === 'in-person') && (
                    <div className="space-y-2">
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest">
                        {formData.meetingType === 'video' ? 'Video Call Link' : 'Location'}
                      </label>
                      <div className="relative">
                        {formData.meetingType === 'video' ? (
                          <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        ) : (
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        )}
                        <input
                          type="text"
                          value={formData.meetingLocation}
                          onChange={(e) => setFormData({ ...formData, meetingLocation: e.target.value })}
                          placeholder={formData.meetingType === 'video' ? 'https://zoom.us/j/...' : '123 Main St, City, State'}
                          className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none font-bold transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Meeting Title (Optional)</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.meetingTitle}
                        onChange={(e) => setFormData({ ...formData, meetingTitle: e.target.value })}
                        placeholder="Career Advice Session"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none font-bold transition-all"
                      />
                    </div>
                  </div>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Anything else you'd like to share?"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none font-bold transition-all resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:bg-slate-300"
                  >
                    {bookingLoading ? 'Confirming...' : 'Confirm Booking'}
                  </button>
                </form>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        .custom-daypicker {
          --rdp-cell-size: 48px;
          --rdp-accent-color: #4f46e5;
          --rdp-background-color: #eef2ff;
          margin: 0;
        }
        .rdp-day_selected {
          background-color: var(--rdp-accent-color) !important;
          border-radius: 16px !important;
          font-weight: 900 !important;
        }
        .rdp-day:hover:not(.rdp-day_selected) {
          background-color: var(--rdp-background-color) !important;
          border-radius: 16px !important;
          color: var(--rdp-accent-color) !important;
        }
        .rdp-head_cell {
          font-size: 0.75rem !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          color: #94a3b8 !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
