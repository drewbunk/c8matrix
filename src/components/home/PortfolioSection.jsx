import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, Video, File, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const getFileIcon = (fileType) => {
  switch (fileType) {
    case 'pdf':
    case 'document':
      return FileText;
    case 'image':
      return Image;
    case 'video':
    case 'youtube':
      return Video;
    default:
      return File;
  }
};

const extractYouTubeId = (url) => {
  if (!url) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const getYouTubeThumbnail = (videoId) => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

const getThumbnailUrl = (item) => {
  // If custom thumbnail is provided, use it
  if (item.thumbnailUrl) {
    return item.thumbnailUrl;
  }
  
  // For YouTube videos, generate thumbnail
  if (item.fileType === 'youtube') {
    const videoId = extractYouTubeId(item.fileUrl);
    if (videoId) {
      return getYouTubeThumbnail(videoId);
    }
  }
  
  // For image files, use the file URL as thumbnail
  if (item.fileType === 'image') {
    return item.fileUrl;
  }
  
  return null;
};

export default function PortfolioSection({ portfolioItems = [] }) {
  const sortedItems = [...portfolioItems]
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .slice(0, 6); // Show first 6 items

  if (sortedItems.length === 0) return null;

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
            Resources
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
            Portfolio Files
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Browse and download portfolio documents, media, and resources
          </p>
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sortedItems.map((item, i) => {
            const Icon = getFileIcon(item.fileType);
            const thumbnailUrl = getThumbnailUrl(item);
            const videoId = item.fileType === 'youtube' ? extractYouTubeId(item.fileUrl) : null;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <a
                  href={
                    item.fileType === 'youtube' && videoId
                      ? `https://www.youtube.com/watch?v=${videoId}`
                      : item.fileUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-zinc-950 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
                >
                  {/* Preview */}
                  <div className="relative aspect-video bg-zinc-900 flex items-center justify-center overflow-hidden">
                    {thumbnailUrl ? (
                      <>
                        <img
                          src={thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        {item.fileType === 'youtube' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center">
                              <div className="w-0 h-0 border-t-6 border-t-transparent border-l-10 border-l-white border-b-6 border-b-transparent ml-1" />
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <Icon size={48} className="text-white/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white line-clamp-1 group-hover:text-white/80 transition-colors">
                        {item.title}
                      </h3>
                      <ExternalLink size={16} className="text-white/40 flex-shrink-0 mt-1" />
                    </div>
                    {item.description && (
                      <p className="text-white/50 text-sm line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    )}
                    {item.category && (
                      <span className="inline-block px-2.5 py-1 bg-white/5 rounded-full text-xs text-white/60">
                        {item.category}
                      </span>
                    )}
                  </div>
                </a>
              </motion.div>
            );
          })}
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
              View All Files
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}