import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';

export default function AboutSection({ settings }) {
  const {
    fullName = 'Drew Bunkley',
  } = settings || {};

  return (
    <section id="about" className="py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Link to={createPageUrl('About')}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group cursor-pointer"
          >
            <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-zinc-900">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695f1f19128f966dc5681717/799bc47ad_bc1c2479-b4fa-40c3-b0ad-cad4394b0a9b.png"
                alt={fullName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <p className="text-white/60 text-sm font-medium tracking-[0.3em] uppercase">
                    About
                  </p>
                  <h2 className="text-4xl lg:text-6xl font-bold text-white tracking-tight">
                    {fullName}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-white/60 group-hover:text-white transition-colors">
                    <span className="text-sm font-medium">Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}