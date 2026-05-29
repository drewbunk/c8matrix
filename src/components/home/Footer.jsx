import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ brandName = 'C8Matrix' }) {
  return (
    <footer className="py-8 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="text-white/30 hover:text-white/60 text-sm transition-colors">Privacy Policy</Link>
            <span className="text-white/20">|</span>
            <Link to="/terms-of-service" className="text-white/30 hover:text-white/60 text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}