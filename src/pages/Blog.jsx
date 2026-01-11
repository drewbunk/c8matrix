import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Footer from '@/components/home/Footer';

export default function Blog() {
  const [selectedTag, setSelectedTag] = useState('all');

  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.filter({ status: 'published' }, '-publishedDate'),
  });

  const siteSettings = settings?.[0] || {};

  // Get all unique tags
  const allTags = [...new Set(posts.flatMap(post => post.tags || []))];
  const filteredPosts = selectedTag === 'all' 
    ? posts 
    : posts.filter(post => post.tags?.includes(selectedTag));

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
                Blog
              </p>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Latest Insights
              </h1>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                Thoughts, stories, and ideas
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <section className="py-8 px-6 lg:px-8 bg-black border-b border-white/5">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                <Tag size={20} className="text-white/40 flex-shrink-0" />
                <Button
                  onClick={() => setSelectedTag('all')}
                  variant={selectedTag === 'all' ? 'default' : 'outline'}
                  className={
                    selectedTag === 'all'
                      ? 'bg-white text-black hover:bg-white/90 rounded-full'
                      : 'border-white/20 text-white hover:bg-white/5 rounded-full'
                  }
                >
                  All
                </Button>
                {allTags.map(tag => (
                  <Button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    variant={selectedTag === tag ? 'default' : 'outline'}
                    className={
                      selectedTag === tag
                        ? 'bg-white text-black hover:bg-white/90 rounded-full'
                        : 'border-white/20 text-white hover:bg-white/5 rounded-full'
                    }
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="py-20 px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto">
            {filteredPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <Link to={createPageUrl('BlogPost') + `?id=${post.id}`}>
                      <div className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group">
                        {post.featuredImageUrl && (
                          <div className="aspect-video overflow-hidden">
                            <img 
                              src={post.featuredImageUrl} 
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center gap-4 mb-3 text-white/40 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar size={16} />
                              {new Date(post.publishedDate || post.created_date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={16} />
                              {post.readTimeMinutes} min
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-white/80 transition-colors">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-white/60 text-sm mb-4 line-clamp-3">
                              {post.excerpt}
                            </p>
                          )}
                          {post.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {post.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="px-2 py-1 bg-white/5 rounded text-xs text-white/60">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-white/40 text-lg">
                  {selectedTag === 'all' ? 'No blog posts yet' : `No posts with tag "${selectedTag}"`}
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