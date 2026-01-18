import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, ChevronDown, Briefcase, MapPin, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/home/Footer';

export default function About() {
  const [resumeOpen, setResumeOpen] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  const { data: photos } = useQuery({
    queryKey: ['aboutPhotos'],
    queryFn: () => base44.entities.AboutPhoto.list(),
  });

  const { data: experiences } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => base44.entities.Experience.list(),
  });

  const siteSettings = settings?.[0] || {};
  const sortedPhotos = [...(photos || [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const sortedExperiences = [...(experiences || [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

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
            {sortedPhotos.length > 0 ? (
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
            ) : (
              <div className="text-center py-20 text-white/40">
                <p>No photos added yet</p>
              </div>
            )}
            
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
            animation: scroll 20s linear infinite;
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

        {/* Collapsible Resume Section */}
        <section className="bg-black border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <button
              onClick={() => setResumeOpen(!resumeOpen)}
              className="w-full py-8 flex items-center justify-between group hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                  <Briefcase size={24} className="text-white/60" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-white">Professional Resume</h3>
                  <p className="text-white/40 text-sm mt-1">View work experience and career history</p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: resumeOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={24} className="text-white/40" />
              </motion.div>
            </button>

            <AnimatePresence>
              {resumeOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pb-16">
                    {siteSettings.resumePdfUrl && (
                      <div className="mb-8 flex justify-center">
                        <a href={siteSettings.resumePdfUrl} target="_blank" rel="noopener noreferrer">
                          <Button
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 rounded-full px-6"
                          >
                            <Download size={18} className="mr-2" />
                            Download PDF
                          </Button>
                        </a>
                      </div>
                    )}

                    {/* Timeline */}
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />

                      <div className="space-y-8">
                        {sortedExperiences.map((exp, i) => (
                          <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            className="relative pl-12"
                          >
                            <div className="absolute left-0 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-white rounded-full" />
                            </div>

                            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                              <div className="mb-4">
                                <h4 className="text-xl font-semibold text-white mb-1">
                                  {exp.roleTitle}
                                </h4>
                                <p className="text-white/60 font-medium mb-2">
                                  {exp.companyOrBrand}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
                                  <span>{exp.startDate} — {exp.endDate || 'Present'}</span>
                                  {exp.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin size={14} />
                                      {exp.location}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {exp.bullets?.length > 0 && (
                                <ul className="space-y-2">
                                  {exp.bullets.map((bullet, j) => (
                                    <li key={j} className="flex items-start gap-3 text-white/60 text-sm">
                                      <span className="w-1.5 h-1.5 bg-white/30 rounded-full mt-2 flex-shrink-0" />
                                      <span>{bullet}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {sortedExperiences.length === 0 && (
                        <div className="text-center py-12 text-white/40">
                          <Briefcase size={40} className="mx-auto mb-3 opacity-50" />
                          <p>Experience entries will appear here once added.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      <Footer brandName={siteSettings.brandName} />
    </div>
  );
}