import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Calendar, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function BookCall() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');

  // Generate available time slots (9AM-5PM MST, 30min blocks, Mon-Fri only)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        slots.push({ value: timeStr, label: displayTime });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Generate next 30 business days
  const generateAvailableDates = () => {
    const dates = [];
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow

    while (dates.length < 30) {
      const dayOfWeek = currentDate.getDay();
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push({
          value: currentDate.toISOString().split('T')[0],
          label: currentDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          }),
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }

    setIsScheduling(true);

    try {
      // Combine date and time in MST
      const meetingDateTime = new Date(`${selectedDate}T${selectedTime}:00-07:00`).toISOString();

      const { data } = await base44.functions.invoke('scheduleDiscoveryCall', {
        sessionId,
        meetingDateTime,
      });

      if (data.success) {
        setIsComplete(true);
        toast.success('Meeting scheduled successfully!');
      } else {
        toast.error('Failed to schedule meeting');
      }
    } catch (error) {
      console.error('Scheduling error:', error);
      toast.error('Failed to schedule meeting');
    } finally {
      setIsScheduling(false);
    }
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Invalid Session</h1>
          <p className="text-white/60 mb-6">No payment session found.</p>
          <Link to={createPageUrl('Home')}>
            <Button className="bg-white text-black hover:bg-white/90 rounded-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <CheckCircle size={80} className="mx-auto mb-6 text-green-400" />
          <h1 className="text-4xl font-bold mb-4">All Set! 🎉</h1>
          <p className="text-white/60 mb-8">
            Your discovery call is confirmed. Calendar invites have been sent to both parties.
            Check your email for details.
          </p>
          <Link to={createPageUrl('Home')}>
            <Button className="bg-white text-black hover:bg-white/90 rounded-full">
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <CheckCircle size={64} className="mx-auto mb-4 text-green-400" />
          <h1 className="text-4xl font-bold mb-4">Payment Complete!</h1>
          <p className="text-white/60 text-lg">
            Now pick your 30-minute discovery call time
          </p>
        </motion.div>

        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Calendar size={18} />
                Select Date (Mon-Fri)
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-white/40 focus:outline-none"
              >
                <option value="">Choose a date...</option>
                {availableDates.map((date) => (
                  <option key={date.value} value={date.value}>
                    {date.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Clock size={18} />
                Select Time (9AM-5PM MST)
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-white/40 focus:outline-none"
                disabled={!selectedDate}
              >
                <option value="">Choose a time...</option>
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Schedule Button */}
            <Button
              onClick={handleSchedule}
              disabled={!selectedDate || !selectedTime || isScheduling}
              className="w-full bg-white text-black hover:bg-white/90 rounded-full py-6 text-lg font-semibold"
            >
              {isScheduling ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                'Confirm Meeting Time'
              )}
            </Button>

            <p className="text-white/40 text-sm text-center">
              You'll receive a calendar invite at the email address you provided.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}