import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';

function ReelCard({ item, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group cursor-pointer"
      onClick={() => onClick(item)}
    >
      {/* 9:16 aspect ratio card */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-zinc-950 border border-white/10 group-hover:border-white/30 transition-all duration-300"
        style={{ aspectRatio: '9/16' }}
      >
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <video
            src={item.fileUrl}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all group-hover:scale-110">
            <Play size={22} className="text-white ml-1" fill="white" />
          </div>
        </div>

        {/* Title at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-semibold text-sm leading-tight line-clamp-2">{item.title}</p>
          {item.description && (
            <p className="text-white/60 text-xs mt-1 line-clamp-1">{item.description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ReelModal({ item, onClose, onPrev, onNext, hasPrev, hasNext }) {
  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
        >
          <X size={20} className="text-white" />
        </button>

        {hasPrev && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
        )}

        {hasNext && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        )}

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative flex flex-col items-center"
          style={{ maxHeight: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 9:16 video container */}
          <div
            className="rounded-2xl overflow-hidden bg-black"
            style={{ aspectRatio: '9/16', maxHeight: '80vh', width: 'auto' }}
          >
            <video
              src={item.fileUrl}
              className="w-full h-full object-contain"
              controls
              autoPlay
              playsInline
              style={{ maxHeight: '80vh' }}
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-white font-semibold text-lg">{item.title}</p>
            {item.description && (
              <p className="text-white/60 text-sm mt-1">{item.description}</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ReelsSection({ reels }) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!reels || reels.length === 0) return null;

  const activeReel = activeIndex !== null ? reels[activeIndex] : null;

  return (
    <section className="py-20 px-6 lg:px-8 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-white/40 text-sm font-medium tracking-[0.3em] uppercase mb-2">Reels</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white">Short Form Content</h2>
          <p className="text-white/50 mt-2 text-sm">Click any reel to watch</p>
        </motion.div>

        {/* Responsive reel grid — narrow cards, plenty of breathing room */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
          {reels.map((reel, i) => (
            <ReelCard
              key={reel.id}
              item={reel}
              index={i}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      </div>

      <ReelModal
        item={activeReel}
        onClose={() => setActiveIndex(null)}
        onPrev={() => setActiveIndex(idx => Math.max(0, idx - 1))}
        onNext={() => setActiveIndex(idx => Math.min(reels.length - 1, idx + 1))}
        hasPrev={activeIndex > 0}
        hasNext={activeIndex < reels.length - 1}
      />
    </section>
  );
}