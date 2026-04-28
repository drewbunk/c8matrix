import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Instagram, Youtube, Linkedin, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const TikTokIcon = ({ size = 24, className }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const services = [
  {
    title: 'Web Design & Smart Websites',
    items: ['Custom business websites', 'Mobile-friendly responsive design', 'Landing pages for ads and lead generation', 'Booking / appointment integrations', 'E-commerce stores', 'SEO-ready structure', 'Fast loading modern layouts', 'Website refresh / redesigns'],
  },
  {
    title: 'AI Agent Integration',
    items: ['24/7 website chat agents', 'Customer service AI assistants', 'Lead capture bots', 'Appointment scheduling bots', 'FAQ automation', 'Sales inquiry responders', 'CRM integration support', 'Internal business workflow AI tools'],
  },
  {
    title: 'App Design & Development',
    items: ['Mobile app planning', 'MVP startup apps', 'iPhone / Android app concepts', 'Subscription app models', 'Customer loyalty apps', 'Booking / membership apps', 'Internal staff tools', 'UI / UX design'],
  },
  {
    title: 'Video Production & Content Creation',
    items: ['Promo videos', 'Social media reels', 'Product showcase videos', 'Brand story videos', 'AI-assisted video creation', 'Voiceover content', 'Ad creatives', 'Short-form content strategy'],
  },
  {
    title: 'Marketing & Growth',
    items: ['Social media strategy', 'Instagram growth support', 'Brand positioning', 'Paid ad landing pages', 'Lead generation systems', 'Email / SMS campaigns', 'Content calendars', 'Reputation management'],
  },
  {
    title: 'Consulting & Training',
    items: ['Business growth consulting', 'Startup launch guidance', 'AI implementation strategy', 'Sales process improvement', 'Team training', 'Customer service systems', 'Workflow efficiency audits', 'One-on-one coaching'],
  },
];

const whyChoose = [
  'Fast execution', 'Modern AI solutions', 'Affordable compared to agencies',
  'Real business experience', 'Hands-on support', 'Creative + strategic approach',
  'Focused on revenue and growth',
];

const quickOptions = [
  'Website', 'AI Chat Agent', 'App Idea', 'Video Content',
  'Marketing', 'Consulting', 'Training', 'Full Business Setup',
];

function ServiceAccordion({ service }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-white font-medium text-sm">{service.title}</span>
        {open ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
      </button>
      {open && (
        <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-1">
          {service.items.map((item) => (
            <p key={item} className="text-white/50 text-xs py-0.5">• {item}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ContactSection({ settings }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [selectedService, setSelectedService] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { contactEmail, socialInstagramUrl, socialYouTubeUrl, socialTikTokUrl, socialLinkedInUrl } = settings || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = { ...formData, subject: selectedService ? `${selectedService}${formData.subject ? ' — ' + formData.subject : ''}` : formData.subject };
    try {
      await base44.entities.ContactSubmission.create(payload);
      base44.functions.invoke('sendSMSAlert', {
        message: `New contact message from ${formData.name} (${formData.email}): ${formData.message.substring(0, 100)}...`,
        alertType: 'message'
      }).catch(err => console.error('SMS alert failed:', err));
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSelectedService('');
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
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
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-white/40 text-sm font-medium tracking-[0.3em] uppercase mb-4">Get In Touch</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">Let's Connect</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Need help growing your business, launching a project, or using AI the right way?<br />
            <span className="text-white font-medium">Message Tab today for a free consultation.</span>
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Services */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Core Services */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Core Services</h3>
              <div className="space-y-2">
                {services.map((s) => (
                  <ServiceAccordion key={s.title} service={s} />
                ))}
              </div>
            </div>

            {/* Why Choose */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="text-white font-semibold mb-3 text-sm tracking-wide uppercase">Why Businesses Choose Tab</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {whyChoose.map((reason) => (
                  <p key={reason} className="text-white/60 text-sm">✓ {reason}</p>
                ))}
              </div>
            </div>

            {/* Email & Social */}
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-4 text-white hover:text-white/80 transition-colors group">
                <div className="p-4 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-white/40">Email</p>
                  <p className="font-medium">{contactEmail}</p>
                </div>
              </a>
            )}
            {socialLinks.length > 0 && (
              <div>
                <p className="text-sm text-white/40 mb-3">Follow me</p>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer"
                      className="p-4 bg-white/5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all" aria-label={social.label}>
                      <social.icon size={24} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right: Contact Form */}
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
                  <p className="text-white/60">Thanks for reaching out. Tab will get back to you soon.</p>
                  <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-6 border-white/20 text-white hover:bg-white/5 rounded-full">
                    Send Another
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Quick Service Selector */}
                <div>
                  <label className="block text-sm text-white/60 mb-3">What do you need help with?</label>
                  <div className="flex flex-wrap gap-2">
                    {quickOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSelectedService(selectedService === option ? '' : option)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          selectedService === option
                            ? 'bg-white text-black border-white'
                            : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Name</label>
                    <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-zinc-900 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-12 rounded-xl" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Email</label>
                    <Input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-zinc-900 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-12 rounded-xl" placeholder="your@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Subject <span className="text-white/30">(optional)</span></label>
                  <Input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-zinc-900 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-12 rounded-xl" placeholder="Add more detail..." />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Message</label>
                  <Textarea required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-zinc-900 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 min-h-[140px] rounded-xl resize-none"
                    placeholder="Tell me about your project or what you're trying to accomplish..." />
                </div>

                <Button type="submit" disabled={isSubmitting}
                  className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-xl font-semibold tracking-wide">
                  {isSubmitting ? 'Sending...' : 'Send Message — Free Consultation'}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}