import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const typeColors = {
  App: 'bg-blue-500/10 text-blue-400',
  Service: 'bg-purple-500/10 text-purple-400',
  Content: 'bg-amber-500/10 text-amber-400',
  Partnership: 'bg-emerald-500/10 text-emerald-400',
};

export default function PortfolioSection({ projects = [] }) {
  const sortedProjects = [...projects]
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .slice(0, 6);

  if (sortedProjects.length === 0) return null;

  return (
    <section id="portfolio" className="py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-white/40 text-sm font-medium tracking-[0.3em] uppercase mb-4">
            Portfolio
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
            Projects & Apps
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            A selection of what I've built — visit the portfolio for the full picture.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sortedProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <Link to={createPageUrl('Portfolio')} className="block h-full">
                <div className="h-full bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                  {/* Thumbnail */}
                  {project.thumbnailImageUrl ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={project.thumbnailImageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                      <Layers size={40} className="text-white/10" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-white/80 transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      <ArrowUpRight size={16} className="text-white/40 flex-shrink-0 mt-1 group-hover:text-white/70 transition-colors" />
                    </div>
                    {project.shortDescription && (
                      <p className="text-white/50 text-sm line-clamp-2 mb-3">
                        {project.shortDescription}
                      </p>
                    )}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${typeColors[project.type] || 'bg-white/5 text-white/50'}`}>
                      {project.type}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to={createPageUrl('Portfolio')}>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/5 px-8 py-6 text-base rounded-full"
            >
              View Full Portfolio
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}