import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Download, FileText, Image as ImageIcon, Video, File, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Footer from '@/components/home/Footer';

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  const { data: portfolioItems } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => base44.entities.Portfolio.list(),
  });

  const siteSettings = settings?.[0] || {};
  const sortedItems = [...(portfolioItems || [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  // Get unique categories
  const categories = ['all', ...new Set(sortedItems.map(item => item.category).filter(Boolean))];

  // Filter items
  const filteredItems = selectedCategory === 'all' 
    ? sortedItems 
    : sortedItems.filter(item => item.category === selectedCategory);

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
      case 'document':
        return FileText;
      case 'image':
        return ImageIcon;
      case 'video':
        return Video;
      default:
        return File;
    }
  };

  const renderPreview = (item) => {
    if (item.fileType === 'image') {
      return (
        <img 
          src={item.thumbnailUrl || item.fileUrl} 
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full bg-zinc-900"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white/40"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>';
          }}
        />
      );
    }

    if (item.fileType === 'video') {
      return (
        <div className="relative w-full h-full bg-zinc-900">
          {item.thumbnailUrl ? (
            <img 
              src={item.thumbnailUrl} 
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.querySelector('.fallback-icon').style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`${item.thumbnailUrl ? 'hidden' : 'flex'} fallback-icon items-center justify-center h-full absolute inset-0`}>
            <Video size={48} className="text-white/40" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
            </div>
          </div>
        </div>
      );
    }

    // PDF or document preview
    const Icon = getFileIcon(item.fileType);
    return (
      <div className="flex items-center justify-center h-full bg-zinc-900 relative">
        {item.thumbnailUrl ? (
          <img 
            src={item.thumbnailUrl} 
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.querySelector('.fallback-icon').style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`${item.thumbnailUrl ? 'hidden' : 'flex'} fallback-icon items-center justify-center absolute inset-0`}>
          <Icon size={48} className="text-white/40" />
        </div>
      </div>
    );
  };

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
        {/* Hero Section */}
        <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-zinc-950 to-black">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-white/40 text-sm font-medium tracking-[0.3em] uppercase mb-4">
                Portfolio
              </p>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Resources & Files
              </h1>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                Browse and download portfolio files, documents, and media
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        {categories.length > 1 && (
          <section className="py-8 px-6 lg:px-8 bg-black border-b border-white/5">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                <Filter size={20} className="text-white/40 flex-shrink-0" />
                {categories.map(category => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    className={
                      selectedCategory === category
                        ? 'bg-white text-black hover:bg-white/90 rounded-full'
                        : 'border-white/20 text-white hover:bg-white/5 rounded-full'
                    }
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Portfolio Grid */}
        <section className="py-20 px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto">
            {filteredItems.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="group"
                  >
                    <div className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                      {/* Preview */}
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative aspect-video overflow-hidden"
                      >
                        {renderPreview(item)}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>

                      {/* Info */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-semibold text-white group-hover:text-white/80 transition-colors">
                            {item.title}
                          </h3>
                          <a
                            href={item.fileUrl}
                            download
                            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download size={18} className="text-white/60" />
                          </a>
                        </div>

                        {item.description && (
                          <p className="text-white/60 text-sm mb-4 line-clamp-2">
                            {item.description}
                          </p>
                        )}

                        {item.category && (
                          <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-xs text-white/60">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <File size={64} className="mx-auto mb-4 text-white/20" />
                <p className="text-white/40 text-lg">
                  {selectedCategory === 'all' 
                    ? 'No portfolio items yet'
                    : `No items in "${selectedCategory}" category`}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer brandName={siteSettings.brandName} />
    </div>
  );
}