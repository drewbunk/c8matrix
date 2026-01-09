import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const navLinks = [
  { label: 'Home', href: '#home', type: 'anchor' },
  { label: 'About', href: 'About', type: 'page' },
  { label: 'Featured', href: '#featured', type: 'anchor' },
  { label: 'Resume', href: 'Resume', type: 'page' },
  { label: 'Portfolio', href: 'Portfolio', type: 'page' },
  { label: 'Projects', href: '#projects', type: 'anchor' },
  { label: 'Shop', href: '#shop', type: 'anchor' },
  { label: 'Contact', href: '#contact', type: 'anchor' },
];

export default function Navigation({ brandName = 'C8Matrix' }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = navLinks.map(link => link.href.replace('#', ''));
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && el.getBoundingClientRect().top <= 150) {
          setActiveSection(section);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a 
              href="#home" 
              onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
              className="text-2xl font-bold tracking-tighter text-white hover:text-white/80 transition-colors"
            >
              {brandName}
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                link.type === 'page' ? (
                  <Link
                    key={link.href}
                    to={createPageUrl(link.href)}
                    className="px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 rounded-full text-white/60 hover:text-white hover:bg-white/5"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                    className={`px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 rounded-full ${
                      activeSection === link.href.replace('#', '')
                        ? 'text-white bg-white/10'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </a>
                )
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/98 backdrop-blur-xl lg:hidden pt-24"
          >
            <div className="flex flex-col items-center gap-2 p-6">
              {navLinks.map((link, i) => (
                link.type === 'page' ? (
                  <Link
                    key={link.href}
                    to={createPageUrl(link.href)}
                    onClick={() => setIsMobileOpen(false)}
                    className="w-full text-center py-4 text-lg font-medium tracking-wide transition-colors rounded-xl text-white/60 hover:text-white hover:bg-white/5"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`w-full text-center py-4 text-lg font-medium tracking-wide transition-colors rounded-xl ${
                      activeSection === link.href.replace('#', '')
                        ? 'text-white bg-white/10'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </motion.a>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}