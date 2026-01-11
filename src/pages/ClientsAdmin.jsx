import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Calendar, DollarSign, Mail, Phone, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClientsAdmin() {
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list('-created_date'),
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'meeting_scheduled':
        return 'bg-green-500/20 text-green-400';
      case 'payment_completed':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatStatus = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Discovery Call Bookings</h1>
          <p className="text-white/60">Track paid discovery calls and scheduled meetings</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <p className="text-white/40 text-sm mb-2">Total Clients</p>
            <p className="text-3xl font-bold">{clients.length}</p>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <p className="text-white/40 text-sm mb-2">Scheduled</p>
            <p className="text-3xl font-bold">
              {clients.filter(c => c.status === 'meeting_scheduled').length}
            </p>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <p className="text-white/40 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold">
              ${((clients.reduce((sum, c) => sum + (c.amountPaid || 0), 0)) / 100).toFixed(0)}
            </p>
          </div>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <p className="text-white/40 text-sm mb-2">Awaiting Schedule</p>
            <p className="text-3xl font-bold">
              {clients.filter(c => c.status === 'payment_completed').length}
            </p>
          </div>
        </div>

        {/* Clients List */}
        <div className="space-y-4">
          {clients.map((client) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{client.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(client.status)}`}>
                      {formatStatus(client.status)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      {client.email}
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        {client.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} />
                      ${(client.amountPaid / 100).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {client.meetingDateTime && (
                <div className="flex items-center gap-2 text-white/80 bg-white/5 rounded-lg px-4 py-3">
                  <Calendar size={18} className="text-green-400" />
                  <span className="font-medium">
                    Scheduled: {new Date(client.meetingDateTime).toLocaleString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      timeZone: 'America/Phoenix',
                    })} MST
                  </span>
                  {client.googleCalendarEventId && (
                    <CheckCircle size={16} className="text-green-400 ml-2" title="Calendar invite sent" />
                  )}
                </div>
              )}

              {!client.meetingDateTime && client.status === 'payment_completed' && (
                <div className="flex items-center gap-2 text-yellow-400 bg-yellow-500/10 rounded-lg px-4 py-3">
                  <Clock size={18} />
                  <span>Awaiting client to schedule meeting time</span>
                </div>
              )}

              {client.notes && (
                <p className="text-white/60 text-sm mt-4 bg-white/5 rounded-lg p-3">
                  {client.notes}
                </p>
              )}

              <div className="text-white/40 text-xs mt-4">
                Payment ID: {client.stripePaymentId} • Created: {new Date(client.created_date).toLocaleDateString()}
              </div>
            </motion.div>
          ))}

          {clients.length === 0 && (
            <div className="text-center py-20">
              <Calendar size={64} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/40">No client bookings yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}