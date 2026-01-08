import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Footer from '@/components/home/Footer';

export default function About() {
  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  const { data: photos } = useQuery({
    queryKey: ['aboutPhotos'],
    queryFn: () => base44.entities.AboutPhoto.list(),
  });

  const siteSettings = settings?.[0] || {};
  const sortedPhotos = [...(photos || [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to={createPageUrl('Home')} className="text-2xl font-bold tracking-tighter text-white hover:text-white/80 transition-colors">
              {siteSettings.brandName || 'C8Matrix'}
            </Link>
            <Link to={createPageUrl('Home')}>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 rounded-full">
                <ArrowLeft size={18} className="mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-20">
        {/* Cinematic Photo Carousel */}
        <section className="py-20 overflow-hidden bg-black">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="flex gap-8 animate-scroll">
              {/* Double the photos for seamless loop */}
              {[...sortedPhotos, ...sortedPhotos].map((photo, i) => (
                <div
                  key={`${photo.id}-${i}`}
                  className="relative flex-shrink-0 w-[85vw] md:w-[70vw] lg:w-[60vw] aspect-[21/9] rounded-2xl overflow-hidden group"
                >
                  <img
                    src={photo.imageUrl}
                    alt={`Cinematic photo ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
                </div>
              ))}
            </div>
            
            {/* Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none" />
          </motion.div>
        </section>

        <style>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-100% / 2 - 1rem));
            }
          }
          
          .animate-scroll {
            animation: scroll 40s linear infinite;
          }
          
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>

        {/* About Section */}
        <section className="py-20 px-6 lg:px-8 bg-zinc-950">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <p className="text-white/40 text-sm font-medium tracking-[0.3em] uppercase mb-4">
                About
              </p>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                {siteSettings.fullName || 'Drew Bunkley'}
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="prose prose-lg prose-invert max-w-none"
            >
              <p className="text-white/70 text-lg leading-relaxed whitespace-pre-line">
                {siteSettings.aboutText || 'About text coming soon...'}
              </p>
            </motion.div>

            {siteSettings.stats?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/10"
              >
                {siteSettings.stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/50">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </div>

      <Footer brandName={siteSettings.brandName} />
    </div>
  );
}