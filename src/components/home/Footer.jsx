import React from 'react';

export default function Footer({ brandName = 'C8Matrix' }) {
  return (
    <footer className="py-8 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <p className="text-white/30 text-sm">
            Built with passion and AI
          </p>
        </div>
      </div>
    </footer>
  );
}