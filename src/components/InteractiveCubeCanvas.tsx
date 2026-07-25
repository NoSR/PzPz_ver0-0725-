import React, { useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { SEASONAL_THEMES } from '../utils/themeUtils';

export const InteractiveCubeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { seasonalTheme, interactiveSettings } = useStore();
  const theme = SEASONAL_THEMES[seasonalTheme] || SEASONAL_THEMES['trendy-lavender'];

  useEffect(() => {
    if (!interactiveSettings.enableCubeParticles) return;

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

    // Speed multiplier
    const speedMult = interactiveSettings.particleSpeed === 'fast' ? 1.8 : interactiveSettings.particleSpeed === 'slow' ? 0.6 : 1.0;

    // Interactive Floating Puzzle Particle Interface
    interface Particle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      rotation: number;
      rotSpeed: number;
      color: string;
      shape: 'cube' | 'puzzle' | 'diamond';
      alpha: number;
    }

    const particleCount = Math.min(Math.floor(width / 35), 35);
    const particles: Particle[] = [];
    const colors = [theme.cubesColor1, theme.cubesColor2, '#ffffff', '#e879f9'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 18 + 12,
        vx: (Math.random() - 0.5) * 0.8 * speedMult,
        vy: (Math.random() - 0.5) * 0.8 * speedMult,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02 * speedMult,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: i % 3 === 0 ? 'cube' : i % 3 === 1 ? 'puzzle' : 'diamond',
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    // Mouse tracking for interactive drift
    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        // Mouse subtle interaction force
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.x -= (dx / dist) * 0.5;
          p.y -= (dy / dist) * 0.5;
        }

        // Screen boundary wrapping
        if (p.x < -40) p.x = width + 40;
        if (p.x > width + 40) p.x = -40;
        if (p.y < -40) p.y = height + 40;
        if (p.y > height + 40) p.y = -40;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;

        if (p.shape === 'cube') {
          // Draw Isometric Cube Outline
          const s = p.size;
          ctx.beginPath();
          ctx.rect(-s / 2, -s / 2, s, s);
          ctx.fill();
          ctx.strokeRect(-s / 2, -s / 2, s, s);
        } else if (p.shape === 'puzzle') {
          // Draw Puzzle Piece silhouette
          const s = p.size;
          ctx.beginPath();
          ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Diamond
          const s = p.size * 1.2;
          ctx.beginPath();
          ctx.moveTo(0, -s / 2);
          ctx.lineTo(s / 2, 0);
          ctx.lineTo(0, s / 2);
          ctx.lineTo(-s / 2, 0);
          ctx.closePath();
          ctx.stroke();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [seasonalTheme, interactiveSettings]);

  if (!interactiveSettings.enableCubeParticles) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60 transition-opacity duration-500"
    />
  );
};
