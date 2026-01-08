import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ResumeSection({ experiences = [], resumePdfUrl }) {
  const sortedExperiences = [...experiences].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <section id="resume" className="py-32 bg-black">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-white/40 text-sm font-medium tracking-[0.3em] uppercase mb-4">
            Experience
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
            Professional Resume
          </h2>
          {resumePdfUrl && (
            <a href={resumePdfUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-full px-6"
              >
                <Download size={18} className="mr-2" />
                Download PDF
              </Button>
            </a>
          )}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/10 transform md:-translate-x-1/2" />

          <div className="space-y-12">
            {sortedExperiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 w-3 h-3 bg-white rounded-full transform -translate-x-1/2 mt-2 z-10" />

                {/* Date on opposite side */}
                <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} hidden md:block`}>
                  <p className="text-white/40 text-sm font-medium">
                    {exp.startDate} — {exp.endDate || 'Present'}
                  </p>
                </div>

                {/* Card */}
                <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pl-12' : 'md:pr-12'} pl-8 md:pl-12`}>
                  <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-white/5 rounded-xl">
                        <Briefcase size={24} className="text-white/60" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white">
                          {exp.roleTitle}
                        </h3>
                        <p className="text-white/60 font-medium">
                          {exp.companyOrBrand}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-white/40">
                          <span className="md:hidden">
                            {exp.startDate} — {exp.endDate || 'Present'}
                          </span>
                          {exp.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {exp.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {exp.bullets?.length > 0 && (
                      <ul className="space-y-2 mt-4">
                        {exp.bullets.map((bullet, j) => (
                          <li key={j} className="flex items-start gap-3 text-white/60 text-sm">
                            <span className="w-1.5 h-1.5 bg-white/30 rounded-full mt-2 flex-shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {experiences.length === 0 && (
          <div className="text-center py-16 text-white/40">
            <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
            <p>Experience entries will appear here once added in the admin panel.</p>
          </div>
        )}
      </div>
    </section>
  );
}