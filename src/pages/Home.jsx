import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

import Navigation from '@/components/home/Navigation';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import ResumeSection from '@/components/home/ResumeSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import ShopSection from '@/components/home/ShopSection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/home/Footer';

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

  const { data: experiences } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => base44.entities.Experience.list(),
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list(),
  });

  // Get first settings record or use defaults
  const siteSettings = settings?.[0] || {};

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation brandName={siteSettings.brandName} />
      
      <HeroSection settings={siteSettings} />
      
      <AboutSection settings={siteSettings} />
      
      <FeaturedSection featuredContent={featuredContent || []} />
      
      <ResumeSection 
        experiences={experiences || []} 
        resumePdfUrl={siteSettings.resumePdfUrl}
      />
      
      <ProjectsSection projects={projects || []} />
      
      <ShopSection products={products || []} />
      
      <ContactSection settings={siteSettings} />
      
      <Footer brandName={siteSettings.brandName} />
    </div>
  );
}