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

export default function HeroSection({ settings, featuredContent, projects }) {
   const {
     brandName = 'C8Matrix',
     tagline = 'AI Creative • Automotive Storyteller • App Builder',
     secondaryCTAText = 'Contact',
     secondaryCTALink = '#contact',
   } = settings || {};

   const scrollToSection = (href) => {
     const id = href.replace('#', '');
     const el = document.getElementById(id);
     if (el) el.scrollIntoView({ behavior: 'smooth' });
   };

   // Combine featured content and projects for the grid
   const items = [
     ...((featuredContent || []).map(item => ({ ...item, type: 'featured' })).slice(0, 3)),
     ...((projects || []).filter(p => p.isFeatured).slice(0, 3))
   ];

   return (
     <section id="home" className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden bg-black py-20 px-4">
       {/* Content */}
       <div className="relative z-10 text-center flex-1 flex flex-col justify-center">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
         >
           <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
             {brandName}
           </h1>
           <p className="text-lg md:text-xl text-gray-300 mb-8">
             {tagline}
           </p>
         </motion.div>

         {/* Featured Items Grid */}
         <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-5xl mx-auto"
         >
           {items.map((item, idx) => (
             <motion.div
               key={idx}
               whileHover={{ scale: 1.05 }}
               className="group relative h-48 rounded-lg overflow-hidden bg-gradient-to-br from-zinc-800 to-black border border-zinc-700 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer"
             >
               {item.thumbnailUrl || item.imageUrl ? (
                 <img
                   src={item.thumbnailUrl || item.imageUrl}
                   alt={item.title || item.name}
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 opacity-70 group-hover:opacity-90"
                 />
               ) : (
                 <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                 <div>
                   <h3 className="text-white font-semibold text-sm md:text-base">{item.title || item.name}</h3>
                   {item.shortDescription && <p className="text-gray-300 text-xs mt-1">{item.shortDescription}</p>}
                 </div>
               </div>
             </motion.div>
           ))}
         </motion.div>

         {/* CTA */}
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.8, delay: 0.4 }}
           className="mt-12"
         >
           <Button
             onClick={() => scrollToSection(secondaryCTALink)}
             className="bg-cyan-500 hover:bg-cyan-600 text-black px-8 py-3 font-semibold rounded-full transition-all duration-300 hover:scale-105"
           >
             {secondaryCTAText}
           </Button>
         </motion.div>
       </div>
     </section>
   );
 }