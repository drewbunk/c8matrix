import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ExternalLink, ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import DigitalLightOverlay from '@/components/DigitalLightOverlay';

const tagColors = {
  App: { label: 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10', bar: 'bg-cyan-400' },
  Service: { label: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10', bar: 'bg-emerald-400' },
  Content: { label: 'text-violet-400 border-violet-400/40 bg-violet-400/10', bar: 'bg-violet-400' },
  Partnership: { label: 'text-amber-400 border-amber-400/40 bg-amber-400/10', bar: 'bg-amber-400' },
};

function ProjectCarousel({ items, label, color }) {
  const [index, setIndex] = useState(0);
  const visibleCount = 3;

  const prev = () => setIndex(i => Math.max(0, i - 1));
  const next = () => setIndex(i => Math.min(items.length - visibleCount, i + 1));

  const canPrev = index > 0;
  const canNext = index < items.length - visibleCount;

  if (!items.length) return null;

  return (
    <div className="mb-10">
      {/* Section label */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${color}`} />
          <span className="text-xs font-mono tracking-widest text-gray-400 uppercase">{label}</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={prev}
            disabled={!canPrev}
            className={`p-1 rounded border transition-all ${canPrev ? 'border-gray-600 text-gray-300 hover:border-emerald-400 hover:text-emerald-400' : 'border-gray-800 text-gray-700 cursor-default'}`}
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <button
            onClick={next}
            disabled={!canNext}
            className={`p-1 rounded border transition-all ${canNext ? 'border-gray-600 text-gray-300 hover:border-emerald-400 hover:text-emerald-400' : 'border-gray-800 text-gray-700 cursor-default'}`}
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-3"
          animate={{ x: `calc(-${index} * (100% / ${visibleCount} + 4px))` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {items.map((item, idx) => (
            <a
              key={item.id || idx}
              href={item.linkUrl || '#'}
              target={item.linkUrl ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="group flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
              style={{
                width: `calc((100% - 16px) / ${visibleCount})`,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.6) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(0,255,160,0.45)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,160,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Thumbnail */}
              <div className="relative h-32 overflow-hidden bg-black">
                {item.thumbnailImageUrl ? (
                  <img
                    src={item.thumbnailImageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(0,255,160,0.07), rgba(0,200,255,0.07))' }}>
                    <span className="text-3xl font-black text-emerald-500/20 font-mono select-none">
                      {item.name?.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />
                {item.linkUrl && (
                  <ExternalLink className="absolute top-2 right-2 w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>

              {/* Text */}
              <div className="p-3">
                <h3 className="text-white font-semibold text-xs md:text-sm leading-tight line-clamp-1 mb-1">{item.name}</h3>
                {item.shortDescription && (
                  <p className="text-gray-500 text-xs line-clamp-2">{item.shortDescription}</p>
                )}
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function MiniReelStrip({ reels }) {
  const [activeReel, setActiveReel] = useState(null);
  const preview = (reels || []).slice(0, 4);
  if (!preview.length) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="w-full mb-6"
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs tracking-[0.3em] text-white/40 font-mono uppercase">Short Form</span>
          <Link to="/Portfolio" className="text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {preview.map((reel, i) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.07 }}
              className="group cursor-pointer relative overflow-hidden rounded-xl"
              style={{ aspectRatio: '9/16', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}
              onClick={() => setActiveReel(reel)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,160,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              {reel.thumbnailUrl ? (
                <img src={reel.thumbnailUrl} alt={reel.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <video src={reel.fileUrl} className="w-full h-full object-cover" muted playsInline preload="metadata" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all group-hover:scale-110">
                  <Play size={12} className="text-white ml-0.5" fill="white" />
                </div>
              </div>
              <p className="absolute bottom-0 left-0 right-0 p-2 text-white text-[10px] font-medium leading-tight line-clamp-2">{reel.title}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {activeReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={() => setActiveReel(null)}
          >
            <button
              onClick={() => setActiveReel(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <X size={20} className="text-white" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '9/16', maxHeight: '80vh', width: 'auto' }}>
                <video src={activeReel.fileUrl} className="w-full h-full object-contain" controls autoPlay playsInline style={{ maxHeight: '80vh' }} />
              </div>
              <p className="text-white font-semibold text-lg mt-4 text-center">{activeReel.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function HeroSection({ settings, featuredContent, projects, reels }) {
  const {
    fullName = 'Drew Bunkley',
    tagline = 'AI Creative • Automotive Storyteller • App Builder',
    secondaryCTALink = '#contact',
    secondaryCTAText = 'Contact',
  } = settings || {};

  const scrollToSection = (href) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const apps = (projects || []).filter(p => p.type === 'App').sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const services = (projects || []).filter(p => p.type === 'Service').sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const websites = (projects || []).filter(p => p.type === 'Content' || p.type === 'Partnership').sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black py-24 px-4"
    >
      <DigitalLightOverlay />

      {/* Subtle center glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, background: 'radial-gradient(ellipse 60% 35% at 50% 38%, rgba(0,255,160,0.055) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">

        {/* Identity */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-center mb-3"
        >
          <span className="text-xs tracking-[0.35em] text-emerald-400 font-mono uppercase block mb-3">
            ◈ Digital Creator & Builder
          </span>
          <h1
            className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-4"
            style={{ textShadow: '0 0 40px rgba(0,255,160,0.25), 0 0 80px rgba(0,200,255,0.1)' }}
          >
            {fullName}
          </h1>
          <p className="text-base md:text-lg text-gray-400 font-mono tracking-wide">{tagline}</p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-32 h-px my-8"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,160,0.6), transparent)' }}
        />

        {/* Short Form Reels Strip */}
        <MiniReelStrip reels={reels} />

        {/* Carousels */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full"
        >
          <ProjectCarousel items={apps} label="Apps" color="bg-cyan-400" />
          <ProjectCarousel items={services} label="Services & Websites" color="bg-emerald-400" />
          {websites.length > 0 && <ProjectCarousel items={websites} label="Content & Partnerships" color="bg-violet-400" />}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 items-center mt-4"
        >
          <Link to="/Portfolio">
            <button
              className="font-mono tracking-wider px-8 py-3 rounded-full text-sm transition-all duration-300 flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, rgba(0,255,160,0.15), rgba(0,200,255,0.1))',
                border: '1px solid rgba(0,255,160,0.4)',
                color: '#00ffa0',
                boxShadow: '0 0 20px rgba(0,255,160,0.15)',
              }}
            >
              Explore All Projects <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <button
            onClick={() => scrollToSection(secondaryCTALink)}
            className="text-sm font-mono tracking-wider text-gray-400 hover:text-emerald-400 transition-colors duration-300 underline underline-offset-4 decoration-gray-700 hover:decoration-emerald-400"
          >
            {secondaryCTAText}
          </button>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))' }} />
    </section>
  );
}