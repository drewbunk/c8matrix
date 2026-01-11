import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CreditCard, Briefcase, Handshake, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const services = [
  {
    id: 'booking',
    name: 'Booking Service',
    description: 'Professional consultation and booking',
    price: '$150',
    priceId: 'price_1SoL3LEbxXzXBraIhZ2NMjft',
    features: ['1-hour session', 'Video call included', 'Follow-up support'],
    icon: Briefcase,
  },
  {
    id: 'collaboration',
    name: 'Collaboration Project',
    description: 'Custom partnership and collaboration',
    price: '$500',
    priceId: 'price_1SoL3LEbxXzXBraIXX8TpeXW',
    features: ['Custom project scope', 'Dedicated support', 'Delivery guarantee'],
    icon: Handshake,
  },
];

export default function PayForServices() {
  const [selectedService, setSelectedService] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async (service) => {
    // Check if running in iframe
    if (window.self !== window.top) {
      toast.error('Checkout is only available from the published app, not in preview mode');
      return;
    }

    if (!customerInfo.email) {
      toast.error('Please provide your email address');
      return;
    }

    setIsProcessing(true);

    try {
      const { data } = await base44.functions.invoke('createCheckout', {
        priceId: service.priceId,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        successUrl: `${window.location.origin}${createPageUrl('PaymentSuccess')}?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}${createPageUrl('PayForServices')}`,
      });

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to={createPageUrl('Home')} className="text-2xl font-bold tracking-tighter text-white">
              C8Matrix
            </Link>
            <Link to={createPageUrl('Home')}>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 rounded-full">
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-20">
        {/* Hero */}
        <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-zinc-950 to-black">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <CreditCard size={64} className="mx-auto mb-6 text-white/40" />
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Work With Me
              </h1>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                Choose a service below and let's collaborate on your next project
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto">
            {/* Customer Info Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-8 mb-12 max-w-2xl mx-auto"
            >
              <h2 className="text-2xl font-semibold mb-6">Your Information</h2>
              <div className="space-y-4">
                <Input
                  placeholder="Your Name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="bg-black border-white/20 text-white"
                />
                <Input
                  type="email"
                  placeholder="Email Address *"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  required
                  className="bg-black border-white/20 text-white"
                />
                <Textarea
                  placeholder="Tell me about your project (optional)"
                  value={customerInfo.message}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, message: e.target.value })}
                  className="bg-black border-white/20 text-white"
                  rows={4}
                />
              </div>
            </motion.div>

            {/* Service Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {services.map((service, i) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="bg-zinc-900 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all"
                  >
                    <Icon size={48} className="mb-6 text-white/60" />
                    <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                    <p className="text-white/60 mb-4">{service.description}</p>
                    
                    <div className="text-4xl font-bold mb-6">{service.price}</div>

                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-white/80">
                          <Check size={20} className="text-green-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleCheckout(service)}
                      disabled={isProcessing || !customerInfo.email}
                      className="w-full bg-white text-black hover:bg-white/90 rounded-full"
                    >
                      {isProcessing ? 'Processing...' : 'Pay Now'}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}