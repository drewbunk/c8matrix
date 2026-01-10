import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function Layout({ children, currentPageName }) {
  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  const siteSettings = settings?.[0] || {};

  return (
    <>
      <style>{`
        :root {
          --background: 0 0% 0%;
          --foreground: 0 0% 100%;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          background-color: #000;
          color: #fff;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
        
        /* Selection */
        ::selection {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }
      `}</style>
      {children}
    </>
  );
}