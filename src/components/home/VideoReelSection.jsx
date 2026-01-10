import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

function getYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\n]+)/);
  return match ? match[1] : null;
}

function getVimeoId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export default function VideoReelSection({ settings }) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const {
    heroVideoType = 'youtube',
    heroVideoUrl = '',
    heroPosterImageUrl,
  } = settings || {};

  const renderVideo = () => {
    if (heroVideoType === 'youtube' && heroVideoUrl) {
      const videoId = getYouTubeId(heroVideoUrl);
      if (videoId) {
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
            className="absolute inset-0 w-full h-full object-cover"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video Reel"
          />
        );
      }
    }
    
    if (heroVideoType === 'vimeo' && heroVideoUrl) {
      const videoId = getVimeoId(heroVideoUrl);
      if (videoId) {
        return (
          <iframe
            src={`https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&background=1`}
            className="absolute inset-0 w-full h-full object-cover"
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Video Reel"
          />
        );
      }
    }
    
    if (heroVideoType === 'mp4_url' && heroVideoUrl) {
      return (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster={heroPosterImageUrl}
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>
      );
    }

    return null;
  };

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-white/40 text-sm font-medium tracking-[0.3em] uppercase mb-4">
            Video Reel
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Watch My Work
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900"
        >
          {renderVideo()}
          
          {/* Video Controls (for mp4) */}
          {heroVideoType === 'mp4_url' && heroVideoUrl && (
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (videoRef.current) videoRef.current.muted = !isMuted;
              }}
              className="absolute bottom-6 right-6 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors z-10"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}