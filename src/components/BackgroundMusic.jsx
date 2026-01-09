import React, { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackgroundMusic({ musicUrl, enabled }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!enabled || !musicUrl) return;
    
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3; // Set default volume to 30%
    }
  }, [enabled, musicUrl]);

  if (!enabled || !musicUrl) return null;

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="auto"
      />

      {/* Floating Music Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="relative">
          {/* Main Button */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-lg"
          >
            <Music size={24} className={isPlaying ? 'animate-pulse' : ''} />
          </button>

          {/* Controls Popup */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute bottom-16 right-0 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl min-w-[200px]"
              >
                <div className="flex flex-col gap-3">
                  <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">
                    Background Music
                  </p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={togglePlay}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                    >
                      {isPlaying ? (
                        <>
                          <Pause size={16} />
                          <span className="text-sm font-medium">Pause</span>
                        </>
                      ) : (
                        <>
                          <Play size={16} />
                          <span className="text-sm font-medium">Play</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={toggleMute}
                      className="px-3 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  </div>

                  {isPlaying && (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Now Playing
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}