import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

import Navigation from '@/components/home/Navigation';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import VideoReelSection from '@/components/home/VideoReelSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import ProjectsSection from '@/components/home/ProjectsSection';

import PortfolioSection from '@/components/home/PortfolioSection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/home/Footer';
import ChatWidget from '@/components/ChatWidget';

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



  const { data: portfolioItems } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => base44.entities.Portfolio.list(),
  });

  // Get first settings record or use defaults
  const siteSettings = settings?.[0] || {};

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation brandName={siteSettings.brandName} />
      
      <HeroSection settings={siteSettings} />
      
      <AboutSection settings={siteSettings} />
      
      <VideoReelSection settings={siteSettings} />
      
      <FeaturedSection featuredContent={featuredContent || []} />
      
      <ProjectsSection projects={projects || []} />
      


      <PortfolioSection portfolioItems={portfolioItems || []} />

      <ContactSection settings={siteSettings} />
      
      <Footer brandName={siteSettings.brandName} />
      
      <ChatWidget />
    </div>
  );
}