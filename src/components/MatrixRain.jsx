import React, { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 14;
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン';

    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    const draw = () => {
      // Fade effect - creates the trailing tail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Draw the green trail character
        ctx.fillStyle = `rgba(0, ${Math.floor(185 + Math.random() * 70)}, 65, ${0.7 + Math.random() * 0.3})`;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y);

        // Overdraw the lead (head) character in bright white
        ctx.fillStyle = '#ffffff';
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y);

        // Reset drop randomly after it passes the bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      // Recalculate columns on resize
      columns = Math.floor(canvas.width / fontSize);
      if (drops.length !== columns) {
        drops = Array(columns).fill(1);
      }
    };

    const interval = setInterval(draw, 45);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.18 }}
    />
  );
}