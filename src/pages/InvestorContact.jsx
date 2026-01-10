import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Send, CheckCircle2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

export default function InvestorContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    investmentFocus: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await base44.entities.InvestorInquiry.create(formData);
      
      // Send email notification
      await base44.integrations.Core.SendEmail({
        to: 'drew@TreadAndTorque.com',
        subject: 'New Investor Inquiry',
        body: `
          New investor inquiry from ${formData.name}
          
          Email: ${formData.email}
          Company: ${formData.company || 'Not provided'}
          Investment Focus: ${formData.investmentFocus || 'Not provided'}
          
          Message:
          ${formData.message}
        `
      });
      
      setIsSuccess(true);
      setFormData({ name: '', email: '', company: '', investmentFocus: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" className="text-white/60 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-bold tracking-tight">C8Matrix</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-white/10 rounded-2xl mb-6">
                <Briefcase className="w-8 h-8 text-white/60" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                Investor Inquiries
              </h1>
              <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
                Interested in partnering or learning more about our projects? Submit your inquiry and we'll get back to you.
              </p>
            </div>

            {/* Success Message */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p>Thank you for your inquiry. We'll be in touch soon.</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-white/80 mb-2 block">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="John Doe"
                    className="bg-black/50 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-white/80 mb-2 block">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="john@example.com"
                    className="bg-black/50 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
                  />
                </div>

                {/* Company */}
                <div>
                  <Label htmlFor="company" className="text-white/80 mb-2 block">
                    Company / Fund Name
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="Acme Ventures"
                    className="bg-black/50 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
                  />
                </div>

                {/* Investment Focus */}
                <div>
                  <Label htmlFor="investmentFocus" className="text-white/80 mb-2 block">
                    Investment Focus / Interest Area
                  </Label>
                  <Input
                    id="investmentFocus"
                    value={formData.investmentFocus}
                    onChange={(e) => handleChange('investmentFocus', e.target.value)}
                    placeholder="AI, SaaS, Creative Tools, etc."
                    className="bg-black/50 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
                  />
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message" className="text-white/80 mb-2 block">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Tell us about your interest, questions, or how we might work together..."
                    className="bg-black/50 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 min-h-[150px]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-white/90 h-12 text-base font-medium"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    Send Inquiry
                    <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}