import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, ExternalLink, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const typeColors = {
  App: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Service: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Content: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Partnership: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

export default function ProjectDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  const project = projects?.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">Project not found</p>
          <Link to={createPageUrl('Home')}>
            <Button className="bg-white text-black hover:bg-white/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" className="text-white/60 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Type Badge */}
            <span className={`inline-block px-4 py-1.5 text-sm font-medium rounded-full border mb-6 ${typeColors[project.type] || typeColors.App}`}>
              {project.type}
            </span>

            {/* Title */}
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              {project.name}
            </h1>

            {/* Short Description */}
            {project.shortDescription && (
              <p className="text-xl text-white/60 mb-8 leading-relaxed">
                {project.shortDescription}
              </p>
            )}

            {/* Tags */}
            {project.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-12">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-sm text-white/50 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2"
                  >
                    <Tag size={14} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Thumbnail */}
            {project.thumbnailImageUrl && (
              <div className="mb-12 rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={project.thumbnailImageUrl}
                  alt={project.name}
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}

            {/* Long Description */}
            {project.longDescription && (
              <div className="prose prose-invert prose-lg max-w-none mb-12">
                <h2 className="text-2xl font-semibold text-white mb-4">About This Project</h2>
                <div className="text-white/70 leading-relaxed whitespace-pre-wrap">
                  {project.longDescription}
                </div>
              </div>
            )}

            {/* External Link */}
            {project.linkUrl && (
              <div className="pt-8 border-t border-white/10">
                <a
                  href={project.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button className="bg-white text-black hover:bg-white/90">
                    View Live Project
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}