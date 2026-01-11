import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Calendar, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Bookings() {
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    serviceType: '',
    startDateTime: '',
    endDateTime: '',
    notes: '',
    status: 'pending',
  });

  const queryClient = useQueryClient();

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => base44.entities.Booking.list('-startDateTime'),
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const booking = await base44.entities.Booking.create(data);
      // Sync to Google Calendar
      await base44.functions.invoke('syncBookingToCalendar', { 
        bookingId: booking.id, 
        action: 'create' 
      });
      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking created and synced to calendar');
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to create booking');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      await base44.entities.Booking.update(id, data);
      // Sync to Google Calendar
      await base44.functions.invoke('syncBookingToCalendar', { 
        bookingId: id, 
        action: 'update' 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking updated and synced to calendar');
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to update booking');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      // Delete from Google Calendar first
      await base44.functions.invoke('syncBookingToCalendar', { 
        bookingId: id, 
        action: 'delete' 
      });
      await base44.entities.Booking.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking deleted from calendar and database');
    },
    onError: (error) => {
      toast.error('Failed to delete booking');
    },
  });

  const resetForm = () => {
    setFormData({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      serviceType: '',
      startDateTime: '',
      endDateTime: '',
      notes: '',
      status: 'pending',
    });
    setShowForm(false);
    setEditingBooking(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBooking) {
      updateMutation.mutate({ id: editingBooking.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setFormData({
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      clientPhone: booking.clientPhone || '',
      serviceType: booking.serviceType || '',
      startDateTime: booking.startDateTime.slice(0, 16),
      endDateTime: booking.endDateTime.slice(0, 16),
      notes: booking.notes || '',
      status: booking.status,
    });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Bookings</h1>
            <p className="text-white/60">Manage client bookings synced with Google Calendar</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-black hover:bg-white/90 rounded-full"
          >
            <Plus size={18} className="mr-2" />
            New Booking
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-zinc-900 border border-white/10 rounded-2xl p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingBooking ? 'Edit Booking' : 'New Booking'}
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="Client Name *"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
                className="bg-black border-white/20 text-white"
              />
              <Input
                type="email"
                placeholder="Client Email *"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                required
                className="bg-black border-white/20 text-white"
              />
              <Input
                placeholder="Client Phone"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                className="bg-black border-white/20 text-white"
              />
              <Input
                placeholder="Service Type"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="bg-black border-white/20 text-white"
              />
              <Input
                type="datetime-local"
                placeholder="Start Date & Time *"
                value={formData.startDateTime}
                onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                required
                className="bg-black border-white/20 text-white"
              />
              <Input
                type="datetime-local"
                placeholder="End Date & Time *"
                value={formData.endDateTime}
                onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                required
                className="bg-black border-white/20 text-white"
              />
            </div>
            <Textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-black border-white/20 text-white mb-4"
            />
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-black border-white/20 text-white mb-4">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-3">
              <Button type="submit" className="bg-white text-black hover:bg-white/90">
                {editingBooking ? 'Update' : 'Create'} Booking
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} className="border-white/20 text-white hover:bg-white/5">
                Cancel
              </Button>
            </div>
          </motion.form>
        )}

        {/* Bookings List */}
        <div className="space-y-4">
          {bookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{booking.clientName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                      booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                      booking.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {booking.status}
                    </span>
                    {booking.googleCalendarEventId && (
                      <Calendar size={16} className="text-green-400" title="Synced to Google Calendar" />
                    )}
                  </div>
                  <p className="text-white/60 mb-2">{booking.clientEmail}</p>
                  {booking.serviceType && (
                    <p className="text-white/80 mb-2">Service: {booking.serviceType}</p>
                  )}
                  <p className="text-white/60 text-sm">
                    {new Date(booking.startDateTime).toLocaleString()} - {new Date(booking.endDateTime).toLocaleString()}
                  </p>
                  {booking.notes && (
                    <p className="text-white/60 text-sm mt-2">{booking.notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleEdit(booking)}
                    className="border-white/20 text-white hover:bg-white/5"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => deleteMutation.mutate(booking.id)}
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}

          {bookings.length === 0 && (
            <div className="text-center py-20">
              <Calendar size={64} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/40">No bookings yet. Create your first booking to sync with Google Calendar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}