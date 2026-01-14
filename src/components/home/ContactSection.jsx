import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Instagram, Youtube, Linkedin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

// TikTok icon component
const TikTokIcon = ({ size = 24, className }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export default function ContactSection({ settings }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({ name: '', email: '', phone: '' });
  const [isBooking, setIsBooking] = useState(false);

  const {
    contactEmail,
    socialInstagramUrl,
    socialYouTubeUrl,
    socialTikTokUrl,
    socialLinkedInUrl,
  } = settings || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await base44.entities.ContactSubmission.create(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookPaidCall = async (e) => {
    e.preventDefault();
    
    // Check if running in iframe
    if (window.self !== window.top) {
      toast.error('Checkout is only available from the published app, not in preview mode');
      return;
    }

    if (!bookingInfo.name || !bookingInfo.email) {
      toast.error('Please provide your name and email');
      return;
    }

    setIsBooking(true);

    try {
      const { data } = await base44.functions.invoke('createDiscoveryCheckout', {
        customerName: bookingInfo.name,
        customerEmail: bookingInfo.email,
        customerPhone: bookingInfo.phone,
      });

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Booking checkout error:', error);
      toast.error('Failed to start checkout');
      setIsBooking(false);
    }
  };

  const socialLinks = [
    { url: socialInstagramUrl, icon: Instagram, label: 'Instagram' },
    { url: socialYouTubeUrl, icon: Youtube, label: 'YouTube' },
    { url: socialTikTokUrl, icon: TikTokIcon, label: 'TikTok' },
    { url: socialLinkedInUrl, icon: Linkedin, label: 'LinkedIn' },
  ].filter(s => s.url);

  return (
    <section id="contact" className="py-32 bg-zinc-950">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-white/40 text-sm font-medium tracking-[0.3em] uppercase mb-4">
            Get In Touch
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Let's Connect
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Ready to collaborate?
              </h3>
              <p className="text-white/60 leading-relaxed">
                Whether you're looking for creative direction, AI content production, 
                or automotive storytelling – I'd love to hear from you.
              </p>
            </div>

            {/* Book Paid Discovery Call */}
            <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <CreditCard size={24} className="text-red-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Creator Nest Discovery</h4>
                  <p className="text-white/60 text-sm">30min strategy session - $97</p>
                </div>
              </div>
              <form onSubmit={handleBookPaidCall} className="space-y-3">
                <Input
                  placeholder="Your Name *"
                  value={bookingInfo.name}
                  onChange={(e) => setBookingInfo({ ...bookingInfo, name: e.target.value })}
                  required
                  className="bg-black/50 border-white/20 text-white h-11 rounded-xl"
                />
                <Input
                  type="email"
                  placeholder="Email Address *"
                  value={bookingInfo.email}
                  onChange={(e) => setBookingInfo({ ...bookingInfo, email: e.target.value })}
                  required
                  className="bg-black/50 border-white/20 text-white h-11 rounded-xl"
                />
                <Input
                  placeholder="Phone (optional)"
                  value={bookingInfo.phone}
                  onChange={(e) => setBookingInfo({ ...bookingInfo, phone: e.target.value })}
                  className="bg-black/50 border-white/20 text-white h-11 rounded-xl"
                />
                <Button
                  type="submit"
                  disabled={isBooking}
                  className="w-full bg-red-600 hover:bg-red-700 text-white h-11 rounded-xl font-semibold"
                >
                  {isBooking ? 'Processing...' : 'Pay $97 → Book 30min Call'}
                </Button>
              </form>
            </div>

            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-4 text-white hover:text-white/80 transition-colors group"
              >
                <div className="p-4 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-white/40">Email</p>
                  <p className="font-medium">{contactEmail}</p>
                </div>
              </a>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="pt-6">
                <p className="text-sm text-white/40 mb-4">Follow me</p>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-white/5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
                      aria-label={social.label}
                    >
                      <social.icon size={24} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {submitted ? (
              <div className="h-full flex items-center justify-center bg-zinc-900/50 border border-white/5 rounded-2xl p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={28} className="text-emerald-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">Message Sent!</h4>
                  <p className="text-white/60">Thanks for reaching out. I'll get back to you soon.</p>
                  <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                    className="mt-6 border-white/20 text-white hover:bg-white/5 rounded-full"
                  >
                    Send Another
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Name</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-zinc-900 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-12 rounded-xl"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Email</label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-zinc-900 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-12 rounded-xl"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Subject</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-zinc-900 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-12 rounded-xl"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Message</label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-zinc-900 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 min-h-[150px] rounded-xl resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-xl font-semibold tracking-wide"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}