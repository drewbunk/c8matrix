import React from 'react';
import { motion } from 'framer-motion';

export default function AboutSection({ settings }) {
  const {
    fullName = 'Drew Bunkley',
    aboutText = 'A visionary at the intersection of automotive culture and artificial intelligence. With over three decades of experience leading creative and technical teams, I transform ideas into immersive digital experiences that captivate audiences and drive innovation.',
    headshotImageUrl,
    stats = [
      { value: '30+', label: 'Years Automotive Leadership' },
      { value: '50K+', label: 'Social Community' },
      { value: 'AI-First', label: 'Production Workflows' },
    ],
  } = settings || {};

  return (
    <section id="about" className="py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <p className="text-white/40 text-sm font-medium tracking-[0.3em] uppercase">
                About
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                {fullName}
              </h2>
            </div>

            <p className="text-xl text-white/60 leading-relaxed font-light">
              {aboutText}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="text-center lg:text-left"
                >
                  <p className="text-2xl lg:text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs lg:text-sm text-white/40 mt-1 leading-tight">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695f1f19128f966dc5681717/799bc47ad_bc1c2479-b4fa-40c3-b0ad-cad4394b0a9b.png"
                alt={fullName}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-white/10 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/5 rounded-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}