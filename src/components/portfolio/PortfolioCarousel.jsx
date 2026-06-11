import React from 'react';

const images = [
  'https://media.base44.com/images/public/695f1f19128f966dc5681717/bfa27f9ef_drewzr1.png',
  'https://media.base44.com/images/public/695f1f19128f966dc5681717/67d20494b_ChatGPTImageJun10202612_47_47PM.png',
  'https://media.base44.com/images/public/695f1f19128f966dc5681717/39c5c487f_D32A3764-6AAF-439F-BE8C-AF2CBF212F02.png',
  'https://media.base44.com/images/public/695f1f19128f966dc5681717/8bec21bbf_3837B597-250E-4E04-AB33-4968CC092FF2.png',
];

// Duplicate images so the loop is seamless
const track = [...images, ...images];

export default function PortfolioCarousel() {
  return (
    <div className="w-full overflow-hidden bg-black py-4">
      <style>{`
        @keyframes portfolioScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .portfolio-track {
          display: flex;
          width: max-content;
          animation: portfolioScroll 22s linear infinite;
        }
        .portfolio-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="portfolio-track">
        {track.map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[420px] h-[240px] mx-3 rounded-xl overflow-hidden border border-white/10"
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}