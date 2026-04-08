import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

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

export default function HeroSection({ settings }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const {
    brandName = 'C8Matrix',
    tagline = 'AI Creative • Automotive Storyteller • App Builder',
    heroVideoType = 'youtube',
    heroVideoUrl = '',
    heroPosterImageUrl,
    primaryCTAText = 'View Resume',
    primaryCTALink = '#resume',
    secondaryCTAText = 'Contact',
    secondaryCTALink = '#contact',
  } = settings || {};

  const scrollToSection = (href) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const renderVideo = () => {
    if (heroVideoType === 'youtube' && heroVideoUrl) {
      const videoId = getYouTubeId(heroVideoUrl);
      if (videoId) {
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
            className="absolute inset-0 w-full h-full object-cover scale-150"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Hero Video"
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
            className="absolute inset-0 w-full h-full object-cover scale-150"
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Hero Video"
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

    // Fallback gradient background
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-800" />
    );
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_37d211oH6Kq5XZ6sJ8QglkOOPRj/hf_20260116_014728_12249bc1-f006-4ac9-a9fc-b05e6707846b.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-8"
        >




          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              onClick={() => scrollToSection('#projects')}
              className="bg-white text-black hover:bg-white/90 px-8 py-6 text-base font-semibold tracking-wide rounded-full transition-all duration-300 hover:scale-105"
            >
              Projects
            </Button>
            <Link to={createPageUrl('Portfolio')}>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base font-medium tracking-wide rounded-full transition-all duration-300"
              >
                Portfolio
              </Button>
            </Link>
            <Button
              onClick={() => scrollToSection(secondaryCTALink)}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base font-medium tracking-wide rounded-full transition-all duration-300"
            >
              {secondaryCTAText}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Video Controls (for mp4) */}
      {heroVideoType === 'mp4_url' && heroVideoUrl && (
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            if (videoRef.current) videoRef.current.muted = !isMuted;
          }}
          className="absolute bottom-10 right-10 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}
    </section>
  );
}