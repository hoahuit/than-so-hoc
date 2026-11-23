import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  type: 'petal' | 'star' | 'firefly';
  phase: number;      // for firefly pulsing
  phaseSpeed: number;
}

export const PetalsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const PETAL_COLORS = [
      'rgba(253, 164, 175, 0.75)', // sakura blush
      'rgba(251, 113, 133, 0.60)', // soft coral rose
      'rgba(254, 205, 211, 0.88)', // pale petal pink
      'rgba(244, 114, 182, 0.50)', // spring pink
      'rgba(255, 228, 230, 0.88)', // ivory sakura
      'rgba(255, 182, 193, 0.65)', // light pink
    ];

    const isMobile = window.innerWidth < 768;
    const petalCount = isMobile ? 18 : 28;
    const starCount  = isMobile ? 10 : 18;
    const fireflyCount = isMobile ? 6 : 12;

    const particles: Petal[] = [];

    // Sakura petals
    for (let i = 0; i < petalCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 7 + 5,
        speedY: Math.random() * 0.9 + 0.45,
        speedX: Math.random() * 1.1 - 0.35,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.4,
        opacity: Math.random() * 0.45 + 0.4,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        type: 'petal',
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0,
      });
    }

    // Golden sparkle stars
    for (let i = 0; i < starCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1.5,
        speedY: Math.random() * 0.3 + 0.08,
        speedX: (Math.random() - 0.5) * 0.3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2.5,
        opacity: Math.random() * 0.5 + 0.3,
        color: Math.random() > 0.5
          ? 'rgba(253, 230, 138, 0.9)'
          : 'rgba(252, 211, 77, 0.75)',
        type: 'star',
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.04 + 0.02,
      });
    }

    // Fireflies (soft green-gold glow dots)
    for (let i = 0; i < fireflyCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.85 + height * 0.1,
        size: Math.random() * 3 + 1.5,
        speedY: (Math.random() - 0.5) * 0.2,
        speedX: (Math.random() - 0.5) * 0.4,
        rotation: 0,
        rotationSpeed: 0,
        opacity: 0.7,
        color: Math.random() > 0.4
          ? 'rgba(167, 243, 208, 0.85)'
          : 'rgba(253, 230, 138, 0.80)',
        type: 'firefly',
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.025 + 0.015,
      });
    }

    // Draw a 4-pointed star shape
    const drawStar4 = (cx: number, cy: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const radius = i % 2 === 0 ? r : r * 0.38;
        ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      }
      ctx.closePath();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.phase += p.phaseSpeed;

        if (p.type === 'petal') {
          // ---- Sakura petal ----
          p.y += p.speedY;
          p.x += Math.sin(p.y * 0.007) * 0.9 + p.speedX * 0.3;
          p.rotation += p.rotationSpeed;

          if (p.y > height + 20) { p.y = -20; p.x = Math.random() * width; }
          if (p.x > width + 20)  { p.x = -20; }
          else if (p.x < -20)    { p.x = width + 20; }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.45, p.size * 1.05, p.size * 0.1, p.size * 0.85, p.size * 0.85);
          ctx.bezierCurveTo(p.size * 0.55, p.size * 1.35, p.size * 0.15, p.size * 1.35, 0, p.size * 1.05);
          ctx.bezierCurveTo(-p.size * 0.15, p.size * 1.35, -p.size * 0.55, p.size * 1.35, -p.size * 0.85, p.size * 0.85);
          ctx.bezierCurveTo(-p.size * 1.05, p.size * 0.1, -p.size * 0.6, -p.size * 0.45, 0, 0);
          ctx.fill();
          ctx.restore();

        } else if (p.type === 'star') {
          // ---- Sparkle star ----
          p.y += p.speedY;
          p.x += p.speedX;
          p.rotation += p.rotationSpeed;
          const twinkle = 0.4 + Math.sin(p.phase) * 0.6;

          if (p.y > height + 20) { p.y = -20; p.x = Math.random() * width; }
          if (p.x > width + 20)  { p.x = -20; }
          else if (p.x < -20)    { p.x = width + 20; }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity * twinkle;

          // Soft glow around star
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2.5);
          grad.addColorStop(0, p.color);
          grad.addColorStop(1, 'rgba(253, 230, 138, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Star shape
          ctx.fillStyle = p.color;
          drawStar4(0, 0, p.size);
          ctx.fill();
          ctx.restore();

        } else if (p.type === 'firefly') {
          // ---- Firefly glow ----
          p.y += p.speedY + Math.sin(p.phase * 0.7) * 0.25;
          p.x += p.speedX + Math.cos(p.phase * 0.5) * 0.3;
          const pulse = 0.3 + Math.abs(Math.sin(p.phase)) * 0.7;

          if (p.y > height + 10) p.y = Math.random() * height * 0.5;
          if (p.y < -10)         p.y = height - 10;
          if (p.x > width + 10)  p.x = -10;
          else if (p.x < -10)    p.x = width + 10;

          ctx.save();
          ctx.globalAlpha = pulse * 0.75;

          // Outer soft glow
          const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
          glowGrad.addColorStop(0, p.color);
          glowGrad.addColorStop(0.4, p.color.replace('0.85', '0.25').replace('0.80', '0.20'));
          glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
          ctx.fill();

          // Core bright dot
          ctx.globalAlpha = pulse;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.55, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30 h-full w-full"
      aria-hidden="true"
    />
  );
};
