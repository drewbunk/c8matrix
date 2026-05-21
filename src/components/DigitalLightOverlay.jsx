import React, { useEffect, useRef } from 'react';

export default function DigitalLightOverlay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particles
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.5 ? '0, 255, 180' : '0, 200, 255',
    }));

    // Light beams
    const beams = Array.from({ length: 5 }, (_, i) => ({
      x: (canvas.width / 6) * (i + 1),
      width: Math.random() * 2 + 1,
      speed: Math.random() * 0.3 + 0.1,
      offset: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.12 + 0.04,
    }));

    // Matrix glyphs floating up
    const glyphs = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      char: String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96)),
      alpha: Math.random() * 0.3 + 0.05,
      speed: Math.random() * 0.4 + 0.1,
      size: Math.floor(Math.random() * 10 + 10),
    }));

    let frame = 0;
    let animId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      // Draw beams
      beams.forEach((beam) => {
        const sway = Math.sin(frame * beam.speed * 0.02 + beam.offset) * 40;
        const x = beam.x + sway;
        const grad = ctx.createLinearGradient(x, 0, x, canvas.height);
        grad.addColorStop(0, `rgba(0,255,180,0)`);
        grad.addColorStop(0.3, `rgba(0,255,180,${beam.alpha})`);
        grad.addColorStop(0.7, `rgba(0,200,255,${beam.alpha})`);
        grad.addColorStop(1, `rgba(0,200,255,0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(x - beam.width, 0, beam.width * 2, canvas.height);
      });

      // Draw glyphs
      glyphs.forEach((g) => {
        g.y -= g.speed;
        if (g.y < -20) {
          g.y = canvas.height + 10;
          g.x = Math.random() * canvas.width;
          g.char = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
        }
        ctx.font = `${g.size}px monospace`;
        ctx.fillStyle = `rgba(0, 255, 160, ${g.alpha})`;
        ctx.fillText(g.char, g.x, g.y);
      });

      // Draw particles + connections
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
      });

      // Draw connections between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 255, 180, ${0.12 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1, opacity: 0.85 }}
    />
  );
}