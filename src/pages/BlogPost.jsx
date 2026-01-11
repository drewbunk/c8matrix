import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Clock, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Footer from '@/components/home/Footer';

export default function BlogPost() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.list(),
  });

  const siteSettings = settings?.[0] || {};
  const post = posts.find(p => p.id === postId);

  if (!postId || !post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to={createPageUrl('Blog')}>
            <Button className="bg-white text-black hover:bg-white/90 rounded-full">
              <ArrowLeft size={18} className="mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to={createPageUrl('Home')} className="text-2xl font-bold tracking-tighter text-white hover:text-white/80 transition-colors">
              {siteSettings.brandName || 'C8Matrix'}
            </Link>
            <Link to={createPageUrl('Blog')}>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 rounded-full">
                <ArrowLeft size={18} className="mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-20">
        <article className="py-20 px-6 lg:px-8 bg-black">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-white/40 text-sm">
                {post.author && (
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    {post.author}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(post.publishedDate || post.created_date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  {post.readTimeMinutes} min read
                </div>
              </div>

              {/* Title */}
              <h1 className="text-5xl lg:text-6xl font-bold mb-8">{post.title}</h1>

              {/* Featured Image */}
              {post.featuredImageUrl && (
                <div className="mb-12 rounded-2xl overflow-hidden">
                  <img 
                    src={post.featuredImageUrl} 
                    alt={post.title}
                    className="w-full"
                  />
                </div>
              )}

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-sm text-white/60 flex items-center gap-1">
                      <Tag size={14} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="prose prose-invert prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-3xl font-bold mt-6 mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-2xl font-semibold mt-4 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="text-white/80 leading-relaxed mb-4">{children}</p>,
                    a: ({ children, ...props }) => (
                      <a {...props} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                    code: ({ inline, children }) => 
                      inline ? (
                        <code className="px-1.5 py-0.5 bg-white/10 rounded text-sm text-white/90">{children}</code>
                      ) : (
                        <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto my-4">
                          <code className="text-sm text-white/90">{children}</code>
                        </pre>
                      ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          </div>
        </article>
      </div>

      <Footer brandName={siteSettings.brandName} />
    </div>
  );
}