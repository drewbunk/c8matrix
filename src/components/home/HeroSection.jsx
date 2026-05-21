import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import DigitalLightOverlay from '@/components/DigitalLightOverlay';

export default function HeroSection({ settings, featuredContent, projects }) {
  const {
    brandName = 'C8Matrix',
    tagline = 'AI Creative • Automotive Storyteller • App Builder',
    secondaryCTAText = 'Contact',
    secondaryCTALink = '#contact',
  } = settings || {};

  const scrollToSection = (href) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Combine featured content and projects for tiles
  const tiles = [
    ...((featuredContent || []).slice(0, 2).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.thumbnailUrl,
      tag: 'Featured',
      link: null,
    }))),
    ...((projects || []).filter(p => p.isFeatured).slice(0, 4).map(p => ({
      id: p.id,
      title: p.name,
      description: p.shortDescription,
      image: p.thumbnailImageUrl,
      tag: p.type,
      link: p.linkUrl,
    }))),
  ].slice(0, 6);

  const tagColors = {
    App: 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10',
    Service: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10',
    Content: 'text-violet-400 border-violet-400/40 bg-violet-400/10',
    Partnership: 'text-amber-400 border-amber-400/40 bg-amber-400/10',
    Featured: 'text-green-400 border-green-400/40 bg-green-400/10',
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black py-24 px-4"
    >
      {/* Digital light overlay */}
      <DigitalLightOverlay />

      {/* Subtle radial glow behind text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'radial-gradient(ellipse 60% 40% at 50% 40%, rgba(0,255,160,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center w-full max-w-6xl mx-auto flex flex-col items-center">

        {/* Brand identity */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="mb-3"
        >
          <span className="text-xs tracking-[0.35em] text-emerald-400 font-mono uppercase mb-3 block">
            ◈ Digital Creator & Builder
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-4"
            style={{ textShadow: '0 0 40px rgba(0,255,160,0.25), 0 0 80px rgba(0,200,255,0.1)' }}
          >
            {brandName}
          </h1>
          <p className="text-base md:text-lg text-gray-400 font-mono tracking-wide">
            {tagline}
          </p>
        </motion.div>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-32 h-px my-8"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,160,0.6), transparent)' }}
        />

        {/* Project tiles */}
        {tiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full mb-10"
          >
            {tiles.map((tile, idx) => {
              const inner = (
                <motion.div
                  key={tile.id || idx}
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group relative rounded-xl overflow-hidden cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.6) 100%)',
                    border: '1px solid rgba(0,255,160,0.15)',
                    boxShadow: '0 0 0 rgba(0,255,160,0)',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(0,255,160,0.5)';
                    e.currentTarget.style.boxShadow = '0 0 24px rgba(0,255,160,0.12), inset 0 0 24px rgba(0,255,160,0.04)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(0,255,160,0.15)';
                    e.currentTarget.style.boxShadow = '0 0 0 rgba(0,255,160,0)';
                  }}
                >
                  {/* Image */}
                  <div className="relative h-36 md:h-44 overflow-hidden">
                    {tile.image ? (
                      <img
                        src={tile.image}
                        alt={tile.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, rgba(0,255,160,0.08), rgba(0,200,255,0.08))' }}
                      >
                        <span className="text-4xl font-black text-emerald-500/20 font-mono select-none">
                          {tile.title?.charAt(0) || '◈'}
                        </span>
                      </div>
                    )}
                    {/* Scan line on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,255,160,0.15) 50%, transparent 60%)', animation: 'none' }}
                    />
                    <div className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}
                    />
                  </div>

                  {/* Text */}
                  <div className="p-3 md:p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-white font-semibold text-sm md:text-base leading-tight line-clamp-1">
                        {tile.title}
                      </h3>
                      {tile.link && (
                        <ExternalLink className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                    {tile.description && (
                      <p className="text-gray-500 text-xs line-clamp-2 mb-2">{tile.description}</p>
                    )}
                    {tile.tag && (
                      <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded border tracking-wider ${tagColors[tile.tag] || tagColors.Featured}`}>
                        {tile.tag}
                      </span>
                    )}
                  </div>
                </motion.div>
              );

              return tile.link ? (
                <a key={tile.id || idx} href={tile.link} target="_blank" rel="noopener noreferrer" className="block">
                  {inner}
                </a>
              ) : (
                <div key={tile.id || idx}>{inner}</div>
              );
            })}
          </motion.div>
        )}

        {/* Placeholder tiles when no data */}
        {tiles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full mb-10"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-44 rounded-xl"
                style={{ background: 'rgba(0,255,160,0.03)', border: '1px solid rgba(0,255,160,0.08)' }}
              />
            ))}
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link to="/Portfolio">
            <Button
              className="font-mono tracking-wider px-8 py-3 rounded-full border transition-all duration-300 text-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(0,255,160,0.15), rgba(0,200,255,0.1))',
                border: '1px solid rgba(0,255,160,0.4)',
                color: '#00ffa0',
                boxShadow: '0 0 20px rgba(0,255,160,0.15)',
              }}
            >
              Explore Projects <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
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
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))' }}
      />
    </section>
  );
}