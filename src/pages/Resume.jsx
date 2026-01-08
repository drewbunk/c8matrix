import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Resume() {
  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  const { data: experiences, isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => base44.entities.Experience.list(),
  });

  const siteSettings = settings?.[0] || {};
  const sortedExperiences = [...(experiences || [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link 
              to={createPageUrl('Home')}
              className="text-2xl font-bold tracking-tighter text-white hover:text-white/80 transition-colors"
            >
              {siteSettings.brandName || 'C8Matrix'}
            </Link>
            
            <Link to={createPageUrl('Home')}>
              <Button
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/5 rounded-full"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-zinc-900/50 to-black">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-white/40 text-sm font-medium tracking-[0.3em] uppercase mb-4">
              Experience & Background
            </p>
            <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6">
              Professional Resume
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              A comprehensive overview of my professional journey, skills, and accomplishments.
            </p>
            {siteSettings.resumePdfUrl && (
              <a href={siteSettings.resumePdfUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-base font-medium"
                >
                  <Download size={20} className="mr-2" />
                  Download Full Resume
                </Button>
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-black">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : sortedExperiences.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent transform md:-translate-x-1/2" />

              <div className="space-y-16">
                {sortedExperiences.map((exp, i) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className={`relative flex flex-col md:flex-row gap-8 ${
                      i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 mt-2 z-10 shadow-lg shadow-white/20" />
                    <div className="absolute left-0 md:left-1/2 w-8 h-8 bg-white/10 rounded-full transform -translate-x-1/2 -translate-y-1 mt-2 animate-ping" />

                    {/* Date on opposite side */}
                    <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'} hidden md:block`}>
                      <motion.p 
                        initial={{ opacity: 0, x: i % 2 === 0 ? 20 : -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + 0.2 }}
                        className="text-white/50 text-sm font-medium tracking-wide"
                      >
                        {exp.startDate} — {exp.endDate || 'Present'}
                      </motion.p>
                    </div>

                    {/* Card */}
                    <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pl-16' : 'md:pr-16'} pl-10 md:pl-16`}>
                      <div className="group bg-zinc-900/80 border border-white/5 rounded-3xl p-8 hover:border-white/20 hover:bg-zinc-900 transition-all duration-500">
                        <div className="flex items-start gap-5 mb-6">
                          <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                            <Briefcase size={28} className="text-white/70" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-1">
                              {exp.roleTitle}
                            </h3>
                            <p className="text-white/60 font-medium text-lg">
                              {exp.companyOrBrand}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-white/40">
                              <span className="md:hidden">
                                {exp.startDate} — {exp.endDate || 'Present'}
                              </span>
                              {exp.location && (
                                <span className="flex items-center gap-1.5">
                                  <MapPin size={14} />
                                  {exp.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {exp.bullets?.length > 0 && (
                          <ul className="space-y-3">
                            {exp.bullets.map((bullet, j) => (
                              <motion.li 
                                key={j}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 + j * 0.05 + 0.3 }}
                                className="flex items-start gap-4 text-white/60"
                              >
                                <span className="w-2 h-2 bg-white/30 rounded-full mt-2 flex-shrink-0" />
                                <span className="leading-relaxed">{bullet}</span>
                              </motion.li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-white/40">
              <Briefcase size={56} className="mx-auto mb-6 opacity-50" />
              <p className="text-lg">Experience entries will appear here once added in the admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-gradient-to-t from-zinc-900/50 to-black border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Want to work together?
            </h2>
            <p className="text-white/60 mb-8">
              I'm always open to discussing new opportunities and collaborations.
            </p>
            <Link to={createPageUrl('Home') + '#contact'}>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-6"
              >
                Get in Touch
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}