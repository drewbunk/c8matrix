import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

import Navigation from '@/components/home/Navigation';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import VideoReelSection from '@/components/home/VideoReelSection';
import FeaturedSection from '@/components/home/FeaturedSection';

import PortfolioSection from '@/components/home/PortfolioSection';
import ShopSection from '@/components/home/ShopSection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/home/Footer';
import ChatWidget from '@/components/ChatWidget';
import SocialStatsBar from '@/components/SocialStatsBar';

export default function Home() {
  // Fetch all data
  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  const { data: featuredContent } = useQuery({
    queryKey: ['featuredContent'],
    queryFn: () => base44.entities.FeaturedContent.list(),
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list(),
  });

  const { data: portfolioItems } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => base44.entities.Portfolio.list(),
  });

  // Get first settings record or use defaults
  const siteSettings = settings?.[0] || {};

  const reels = [...(portfolioItems || [])]
    .filter(item => item.fileType === 'reel')
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation brandName={siteSettings.brandName} />
      
      <HeroSection settings={siteSettings} projects={projects || []} reels={reels} />
      
      <VideoReelSection settings={siteSettings} />
      
      <FeaturedSection featuredContent={featuredContent || []} />
      


      <PortfolioSection projects={projects || []} />

      <ShopSection products={products || []} />

      <div className="py-12 px-6 bg-black/50 border-y border-white/10">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-white/40 text-sm font-mono tracking-widest uppercase mb-2">Community</p>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-2">66K+</h2>
          <p className="text-white/60">Across all social platforms</p>
        </div>
      </div>

      <SocialStatsBar />

      <ContactSection settings={siteSettings} />
      
      <Footer brandName={siteSettings.brandName} />
      
      <ChatWidget />
    </div>
  );
}