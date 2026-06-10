import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Smartphone, TrendingUp, FileText, Rocket, Clapperboard, ChevronRight } from 'lucide-react';
import Navigation from '@/components/home/Navigation';
import Footer from '@/components/home/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
};

const platforms = [
  {
    name: 'INSTAGRAM REELS',
    color: '#ff2d78',
    handle: '@c8matrix',
    description: 'Short-form Reels, Stories, and product content. Engaged audience in sustainability, lifestyle, and tech.',
    bullets: ['15–60 sec vertical Reels', 'Hook-first storytelling', 'Product reveals & tutorials', 'Trending audio + captions', 'CTA to brand link'],
  },
  {
    name: 'TIKTOK',
    color: '#00f2ea',
    handle: '@c8matrix',
    description: 'Native short-form video with high organic discovery. Fast-paced, trend-driven content reaching new audiences daily.',
    bullets: ['Native short-form content', 'Trend & sound integration', 'Duets & stitch potential', 'High organic discovery', 'Fast-turn creative formats'],
  },
  {
    name: 'YOUTUBE',
    color: '#ff0000',
    handle: 'C8Matrix',
    description: 'Long-form tutorials, app walkthroughs, and branded content series. Evergreen reach with growing subscriber base.',
    bullets: ['Long-form deep dives (8–15 min)', 'YouTube Shorts (< 60 sec)', 'Series episode formats', 'Brand integration slots', 'SEO titles & descriptions'],
  },
];

const steps = [
  { num: '01', icon: <FileText className="w-7 h-7" />, color: '#f5c842', label: 'Brief', desc: 'You share your product, talking points, and goals. We handle the creative strategy from there.' },
  { num: '02', icon: <Zap className="w-7 h-7" />, color: '#ff2d78', label: 'Hook', desc: 'We script a scroll-stopping opening — the first 2 seconds that decide if someone keeps watching.' },
  { num: '03', icon: <Clapperboard className="w-7 h-7" />, color: '#00f2ea', label: 'Produce', desc: 'Short-form Reel + TikTok version shot and edited. YouTube longform or Shorts cut from the same session.' },
  { num: '04', icon: <Rocket className="w-7 h-7" />, color: '#00e676', label: 'Deploy', desc: 'Posted across all three platforms with native captions, hashtags, and your brand CTA baked in.' },
];

const tiers = [
  {
    name: 'Product Feature',
    tag: 'STARTING POINT',
    tagColor: '#888',
    borderColor: '#555',
    bullets: ['Your product featured in a Reel, TikTok, or YouTube video', 'Authentic on-camera use / reveal', 'Link in bio + video description', 'Story reposts for 48 hrs'],
  },
  {
    name: 'Series Sponsor',
    tag: 'BEST FOR VISIBILITY',
    tagColor: '#f5c842',
    borderColor: '#f5c842',
    featured: true,
    bullets: ['Sponsor a full "Room by Room" episode', 'Opening + closing brand mention', 'Product featured as THE swap solution', 'Co-branded thumbnail + title card', 'Pinned comment with purchase link'],
  },
  {
    name: 'Brand Partner',
    tag: 'FULL INTEGRATION',
    tagColor: '#00e676',
    borderColor: '#00e676',
    bullets: ['Custom series built around your product line', 'Multi-platform: IG Reels + TikTok + YouTube', 'Monthly content calendar collaboration', 'Dedicated brand spotlight episode', 'Cross-platform CTA strategy included'],
  },
];

const whyUs = [
  { title: 'Solo Founder with a Track Record', desc: 'Every product is live and shipped — not a concept. friendsay, Lotto Lens AI, Tread & Torque, Couch Play Pro, and more.' },
  { title: 'AI-First Creator', desc: 'Uses Google AI Studio, Gemini, and Base44 to build faster, iterate in real time, and produce content assets that match platform algorithms.' },
  { title: 'Three-Platform Distribution', desc: 'Active on Instagram, TikTok, and YouTube — every piece of content gets maximum reach across all three simultaneously.' },
];

const stats = [
  { value: '5+', label: 'LIVE APPS SHIPPED' },
  { value: '3', label: 'ACTIVE PLATFORMS' },
  { value: 'AI', label: 'POWERED PRODUCTION' },
];

export default function Partnership() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation brandName="C8Matrix" />

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,230,118,0.06),transparent_60%)]" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="text-[#00e676] font-mono tracking-[0.3em] text-xs uppercase mb-6">
            Content Partnership Deck
          </motion.p>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-6 uppercase">
            We Make<br />Content<br />That<br /><span className="text-[#00e676]">Converts.</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-white/50 text-lg tracking-widest mb-10">
            Instagram Reels · YouTube · TikTok · Brand Storytelling
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="w-24 h-1 bg-[#ff2d78] mb-10" />
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="text-white/40 text-sm font-mono">
            Drew Bunkley / C8Matrix / drewbunkley.com
          </motion.p>
        </div>
      </section>

      {/* THE PITCH */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-[#00e676] font-mono tracking-[0.3em] text-xs uppercase mb-4">The Pitch</motion.p>
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="text-4xl md:text-6xl font-black mb-16 leading-tight">
            You have a great product.<br />Let's make people feel it.
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Smartphone className="w-8 h-8" />, title: 'Scroll-stopping content', desc: 'Short-form video that earns attention in the first 2 seconds — not ads that get skipped.' },
              { icon: <span className="text-3xl">🌿</span>, title: 'Brand-aligned storytelling', desc: 'Content that feels native to the platform and authentic to your brand values.' },
              { icon: <TrendingUp className="w-8 h-8" />, title: 'Real reach, real audience', desc: 'Active presence across Instagram, YouTube, and TikTok — three platforms, one consistent creative voice.' },
            ].map((card, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="bg-[#111] border-l-4 border-[#00e676] p-6 rounded-r-xl">
                <div className="text-[#00e676] mb-4">{card.icon}</div>
                <h3 className="font-bold text-white mb-3">{card.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT FORMATS / REACH */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-[#00e676] font-mono tracking-[0.3em] text-xs uppercase mb-4">Content Formats & Reach</motion.p>
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            Three Platforms.<br />One Creative Voice.
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
            className="text-white/40 text-sm italic mb-16">
            Active presence across all three channels with a cross-posting strategy for maximum content reach.
          </motion.p>
          <div className="grid md:grid-cols-3 gap-6">
            {platforms.map((p, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="bg-[#111] rounded-xl overflow-hidden">
                <div className="h-1" style={{ backgroundColor: p.color }} />
                <div className="p-6">
                  <p className="font-mono text-xs tracking-widest mb-2" style={{ color: p.color }}>{p.name}</p>
                  <p className="text-2xl font-black text-white mb-4">{p.handle}</p>
                  <p className="text-white/50 text-sm mb-6 leading-relaxed">{p.description}</p>
                  <ul className="space-y-2">
                    {p.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2 text-white/60 text-sm">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: p.color }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-[#00e676] font-mono tracking-[0.3em] text-xs uppercase mb-4">How It Works</motion.p>
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            One Brief.<br />Every Platform.
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
            className="text-white/40 text-sm italic mb-16">
            Every campaign is fully cross-posted. One production run covers all three platforms.
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="bg-[#111] rounded-xl p-6 border-t-4" style={{ borderColor: s.color }}>
                <p className="font-mono text-sm mb-4" style={{ color: s.color }}>{s.num}</p>
                <div className="mb-4" style={{ color: s.color }}>{s.icon}</div>
                <h3 className="text-xl font-black text-white mb-3">{s.label}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERSHIP TIERS */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-[#00e676] font-mono tracking-[0.3em] text-xs uppercase mb-4">How We Partner</motion.p>
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="text-4xl md:text-6xl font-black mb-16 leading-tight">
            Pick Your<br />Integration.
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((t, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className={`bg-[#111] rounded-xl p-6 border-t-4 relative ${t.featured ? 'ring-1 ring-white/10' : ''}`}
                style={{ borderColor: t.borderColor }}>
                {t.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f5c842] text-black text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-black text-white mb-1">{t.name}</h3>
                <p className="font-mono text-xs tracking-widest mb-6" style={{ color: t.tagColor }}>{t.tag}</p>
                <ul className="space-y-3">
                  {t.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-white/60 text-sm">
                      <span className="mt-1 w-1 h-1 rounded-full flex-shrink-0 bg-white/40" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-[#00e676] font-mono tracking-[0.3em] text-xs uppercase mb-4">Why Us</motion.p>
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="text-4xl md:text-6xl font-black mb-16 leading-tight">
            Built to Ship.<br />Built to Create.
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {whyUs.map((w, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                  className="bg-[#111] border-l-4 border-[#9b59b6] p-5 rounded-r-xl">
                  <h4 className="font-bold text-white mb-2">{w.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{w.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {stats.map((s, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                  className="bg-[#111] rounded-xl p-6 flex flex-col items-center justify-center text-center">
                  <p className="text-5xl font-black text-[#f5c842] mb-2">{s.value}</p>
                  <p className="font-mono text-xs tracking-widest text-white/40">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,230,118,0.07),transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Let's Make Something<br />People <span className="text-[#00e676]">Share.</span>
          </motion.h2>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="w-24 h-1 bg-[#00e676] mx-auto mb-10" />
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
            className="flex flex-wrap justify-center gap-8 text-sm text-white/40 font-mono mb-12">
            <span><span className="text-[#00e676]">WEB</span> &nbsp;drewbunkley.com</span>
            <span><span className="text-[#ff2d78]">IG</span> &nbsp;@c8matrix</span>
            <span><span className="text-[#00f2ea]">TT</span> &nbsp;@c8matrix</span>
            <span><span className="text-[#ff0000]">YT</span> &nbsp;C8Matrix</span>
          </motion.div>
          <motion.a variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}
            href="/#contact"
            className="inline-flex items-center gap-3 bg-[#00e676] text-black font-black px-10 py-4 rounded-full text-lg hover:bg-white transition-colors">
            Start a Partnership <ArrowRight className="w-5 h-5" />
          </motion.a>
        </div>
      </section>

      <Footer brandName="C8Matrix" />
    </div>
  );
}