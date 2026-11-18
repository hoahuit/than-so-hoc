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
      'rgba(253, 164, 175, 0.72)', // sakura blush
      'rgba(251, 113, 133, 0.58)', // soft coral rose
      'rgba(254, 205, 211, 0.85)', // pale petal pink
      'rgba(244, 114, 182, 0.48)', // spring pink
      'rgba(255, 228, 230, 0.85)', // ivory sakura
    ];

    const petalCount = window.innerWidth < 768 ? 18 : 30;
    const petals: Petal[] = [];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 7 + 6,
        speedY: Math.random() * 0.9 + 0.55,
        speedX: Math.random() * 1.1 - 0.35,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.2,
        opacity: Math.random() * 0.45 + 0.4,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.007) * 0.9 + p.speedX * 0.3;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = width + 20;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        // Delicate notched sakura petal
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.45, p.size * 1.05, p.size * 0.1, p.size * 0.85, p.size * 0.85);
        ctx.bezierCurveTo(p.size * 0.55, p.size * 1.35, p.size * 0.15, p.size * 1.35, 0, p.size * 1.05);
        ctx.bezierCurveTo(-p.size * 0.15, p.size * 1.35, -p.size * 0.55, p.size * 1.35, -p.size * 0.85, p.size * 0.85);
        ctx.bezierCurveTo(-p.size * 1.05, p.size * 0.1, -p.size * 0.6, -p.size * 0.45, 0, 0);
        ctx.fill();

        ctx.restore();
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
