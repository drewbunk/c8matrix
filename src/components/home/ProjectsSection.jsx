import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

const typeColors = {
  App: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Service: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Content: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Partnership: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

export default function ProjectsSection({ projects = [] }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const types = ['All', 'App', 'Service', 'Content', 'Partnership'];

  const sortedProjects = [...projects].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  
  const filteredProjects = activeFilter === 'All' 
    ? sortedProjects 
    : sortedProjects.filter(p => p.type === activeFilter);

  return (
    <section id="projects" className="py-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-white/40 text-sm font-medium tracking-[0.3em] uppercase mb-4">
            Projects & Offerings
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
            What I Build & Offer
          </h2>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {types.map((type) => (
            <Button
              key={type}
              variant={activeFilter === type ? 'default' : 'outline'}
              onClick={() => setActiveFilter(type)}
              className={`rounded-full px-6 ${
                activeFilter === type
                  ? 'bg-white text-black hover:bg-white/90'
                  : 'border-white/20 text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <div className="h-full bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300">
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
                      <Layers size={48} className="text-white/10" />
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    {/* Type Badge */}
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${typeColors[project.type] || typeColors.App}`}>
                      {project.type}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-white">
                      {project.name}
                    </h3>

                    {/* Description */}
                    <p className="text-white/50 text-sm line-clamp-2">
                      {project.shortDescription}
                    </p>

                    {/* Tags */}
                    {project.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag, j) => (
                          <span
                            key={j}
                            className="px-2 py-1 text-xs text-white/40 bg-white/5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Link */}
                    {project.linkUrl && (
                      <a
                        href={project.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors pt-2"
                      >
                        View Project
                        <ArrowUpRight size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {projects.length === 0 && (
          <div className="text-center py-16 text-white/40">
            <Layers size={48} className="mx-auto mb-4 opacity-50" />
            <p>Projects will appear here once added in the admin panel.</p>
          </div>
        )}
      </div>
    </section>
  );
}