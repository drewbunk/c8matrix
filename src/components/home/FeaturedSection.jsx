import React from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle } from 'lucide-react';

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\n]+)/);
  return match ? match[1] : null;
}

function getVimeoId(url) {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

function VideoEmbed({ videoType, videoUrl, thumbnailUrl }) {
  const [showVideo, setShowVideo] = React.useState(false);

  if (videoType === 'youtube' && videoUrl) {
    const videoId = getYouTubeId(videoUrl);
    if (videoId) {
      return (
        <div className="relative aspect-video bg-zinc-900 rounded-xl overflow-hidden">
          {!showVideo ? (
            <button
              onClick={() => setShowVideo(true)}
              className="absolute inset-0 group"
            >
              <img
                src={thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="Video thumbnail"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover:bg-black/30">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                  <Play size={32} className="text-black ml-1" fill="currentColor" />
                </div>
              </div>
            </button>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Featured Video"
            />
          )}
        </div>
      );
    }
  }

  if (videoType === 'vimeo' && videoUrl) {
    const videoId = getVimeoId(videoUrl);
    if (videoId) {
      return (
        <div className="relative aspect-video bg-zinc-900 rounded-xl overflow-hidden">
          <iframe
            src={`https://player.vimeo.com/video/${videoId}`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Featured Video"
          />
        </div>
      );
    }
  }

  if (videoType === 'mp4_url' && videoUrl) {
    return (
      <div className="relative aspect-video bg-zinc-900 rounded-xl overflow-hidden">
        <video controls className="w-full h-full object-cover" poster={thumbnailUrl}>
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>
    );
  }

  return (
    <div className="aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl flex items-center justify-center">
      <Play size={48} className="text-white/20" />
    </div>
  );
}

export default function FeaturedSection({ featuredContent = [] }) {
  const pinnedContent = featuredContent.find(f => f.isPinned) || featuredContent[0];
  const otherContent = featuredContent.filter(f => f.id !== pinnedContent?.id).slice(0, 2);

  if (!pinnedContent && featuredContent.length === 0) {
    return null;
  }

  return (
    <section id="featured" className="py-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-white/40 text-sm font-medium tracking-[0.3em] uppercase mb-4">
            Featured Work
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Latest Projects
          </h2>
        </motion.div>

        {/* Pinned Content */}
        {pinnedContent && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <VideoEmbed
                videoType={pinnedContent.videoType}
                videoUrl={pinnedContent.videoUrl}
                thumbnailUrl={pinnedContent.thumbnailUrl}
              />
              <div className="space-y-6">
                <h3 className="text-3xl lg:text-4xl font-bold text-white">
                  {pinnedContent.title}
                </h3>
                <p className="text-lg text-white/60 leading-relaxed">
                  {pinnedContent.description}
                </p>
                {pinnedContent.highlightBullets?.length > 0 && (
                  <ul className="space-y-3 pt-4">
                    {pinnedContent.highlightBullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/70">
                        <CheckCircle size={20} className="text-white/40 mt-0.5 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Other Featured Content */}
        {otherContent.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8">
            {otherContent.map((content, i) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="space-y-4">
                  <VideoEmbed
                    videoType={content.videoType}
                    videoUrl={content.videoUrl}
                    thumbnailUrl={content.thumbnailUrl}
                  />
                  <h4 className="text-xl font-semibold text-white group-hover:text-white/80 transition-colors">
                    {content.title}
                  </h4>
                  {content.description && (
                    <p className="text-white/50 line-clamp-2">
                      {content.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}